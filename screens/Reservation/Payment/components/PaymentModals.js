// PaymentModals.js - Complete file ready to copy/paste
import { Modal, View, Text, TouchableOpacity, Animated, Alert } from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from "@expo/vector-icons"
import * as Haptics from 'expo-haptics'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system/legacy'
import { modalStyles } from "../styles/ModalStyles"
import { generateCashReceiptHTML } from "./ReceiptTemplate"

export default function PaymentModals({
  showMethodInfo,
  setShowMethodInfo,
  showConfirmModal,
  setShowConfirmModal,
  showSuccessModal,
  showCashReceiptModal,
  setShowCashReceiptModal,
  bookingData,
  paymentMethods,
  selectedPaymentMethod,
  onPaymentConfirm,
  onSuccessComplete,
  onCashReceiptComplete,
  onCashReceiptClose,
  successScale,
  successOpacity,
  confettiAnims,
  reservationId
}) {
  
const handleDownloadReceipt = async () => {
  try {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    // Generate HTML from your template
    const html = generateCashReceiptHTML(bookingData, reservationId)

    // Generate PDF (temporary UUID file)
    const { uri } = await Print.printToFileAsync({ html, base64: false })

    // Define clean filename and path
    const newFilename = `Receipt_${reservationId || 'Reservation'}.pdf`
    const newPath = FileSystem.cacheDirectory + newFilename

    // ✅ Rename/move PDF using legacy API (still works perfectly)
    await FileSystem.moveAsync({
      from: uri,
      to: newPath,
    })

    console.log('✅ PDF saved as:', newPath)

    // Share the file if possible
    const canShare = await Sharing.isAvailableAsync()
    if (canShare) {
      await Sharing.shareAsync(newPath, {
        mimeType: 'application/pdf',
        dialogTitle: 'Save Receipt',
        UTI: 'com.adobe.pdf',
      })
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } else {
      Alert.alert('Receipt Generated', 'Your receipt has been generated successfully.', [{ text: 'OK' }])
    }
  } catch (error) {
    console.error('❌ Error downloading receipt:', error)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    Alert.alert('Download Failed', 'Failed to generate receipt. Please try again or take a screenshot.', [{ text: 'OK' }])
  }
}

const handleCloseReceipt = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  onCashReceiptClose()
}

  return (
    <>
      {/* Payment Method Info Modal */}
      <Modal
        visible={showMethodInfo !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMethodInfo(null)}
        statusBarTranslucent={true}
      >
        <TouchableOpacity 
          style={modalStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMethodInfo(null)}
        >
          <View style={modalStyles.infoModal}>
            {showMethodInfo === "select" ? (
              <>
                <Ionicons name="alert-circle" size={48} color="#FF9500" />
                <Text style={modalStyles.infoModalTitle}>Payment Method Required</Text>
                <Text style={modalStyles.infoModalText}>
                  Please select a payment method to continue with your reservation.
                </Text>
              </>
            ) : showMethodInfo === "error" ? (
              <>
                <Ionicons name="close-circle" size={48} color="#FF3B30" />
                <Text style={modalStyles.infoModalTitle}>Payment Failed</Text>
                <Text style={modalStyles.infoModalText}>
                  We couldn't process your payment. Please try again or contact support.
                </Text>
              </>
            ) : showMethodInfo === "incomplete" ? (
              <>
                <Ionicons name="alert-circle" size={48} color="#FF9500" />
                <Text style={modalStyles.infoModalTitle}>Payment Not Completed</Text>
                <Text style={modalStyles.infoModalText}>
                  Your payment was not completed. Your reservation is saved and you can complete payment later from your reservations list.
                </Text>
              </>
            ) : showMethodInfo === "online" ? (
              <>
                <Ionicons name="card-outline" size={48} color="#007DFF" />
                <Text style={modalStyles.infoModalTitle}>Pay Online</Text>
                <Text style={modalStyles.infoModalText}>
                  Pay securely using GCash, PayMaya, Credit/Debit Cards, or Bank Transfer. Your reservation will be instantly confirmed upon successful payment.
                </Text>
              </>
            ) : showMethodInfo === "cash" ? (
              <>
                <Ionicons name="cash-outline" size={48} color="#00C853" />
                <Text style={modalStyles.infoModalTitle}>Cash Payment</Text>
                <Text style={modalStyles.infoModalText}>
                  Reserve your booking now and pay in cash at the HOA office. You must pay within 1 hour, or your reservation will be automatically voided. A digital receipt will be generated for you to present to the HOA admin.
                </Text>
              </>
            ) : (
              <>
                <Ionicons 
                  name={paymentMethods.find(m => m.id === showMethodInfo)?.icon} 
                  size={48} 
                  color={paymentMethods.find(m => m.id === showMethodInfo)?.color} 
                />
                <Text style={modalStyles.infoModalTitle}>
                  {paymentMethods.find(m => m.id === showMethodInfo)?.name}
                </Text>
                <Text style={modalStyles.infoModalText}>
                  {paymentMethods.find(m => m.id === showMethodInfo)?.info}
                </Text>
              </>
            )}
            <TouchableOpacity 
              style={modalStyles.infoModalButton}
              onPress={() => setShowMethodInfo(null)}
            >
              <Text style={modalStyles.infoModalButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConfirmModal(false)}
        statusBarTranslucent={true}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.confirmModal}>
            <View style={modalStyles.confirmHeader}>
              <Ionicons name="shield-checkmark" size={40} color="#2d1b2e" />
              <Text style={modalStyles.confirmTitle}>Confirm Payment</Text>
            </View>

            {selectedPaymentMethod === 'cash' && (
              <View style={modalStyles.warningBanner}>
                <Ionicons name="time-outline" size={20} color="#856404" />
                <Text style={modalStyles.warningText}>
                  You must pay in cash at the HOA office within 1 hour, or this reservation will be automatically voided.
                </Text>
              </View>
            )}

            <View style={modalStyles.confirmDetails}>
              <View style={modalStyles.confirmRow}>
                <Text style={modalStyles.confirmLabel}>Facility</Text>
                <Text style={modalStyles.confirmValue}>{bookingData.facility}</Text>
              </View>
              <View style={modalStyles.confirmRow}>
                <Text style={modalStyles.confirmLabel}>Date</Text>
                <Text style={modalStyles.confirmValue}>{bookingData.date}</Text>
              </View>
              <View style={modalStyles.confirmRow}>
                <Text style={modalStyles.confirmLabel}>Time</Text>
                <Text style={modalStyles.confirmValue}>{bookingData.time}</Text>
              </View>
              <View style={modalStyles.confirmRow}>
                <Text style={modalStyles.confirmLabel}>Payment Method</Text>
                <Text style={modalStyles.confirmValue}>
                  {paymentMethods.find(p => p.id === selectedPaymentMethod)?.name}
                </Text>
              </View>
              <View style={[modalStyles.confirmRow, modalStyles.confirmAmountRow]}>
                <Text style={modalStyles.confirmAmountLabel}>Total Amount</Text>
                <Text style={modalStyles.confirmAmountValue}>₱{bookingData.price}</Text>
              </View>
            </View>

            <View style={modalStyles.confirmActions}>
              <TouchableOpacity 
                style={modalStyles.confirmCancelButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  setShowConfirmModal(false)
                }}
              >
                <Text style={modalStyles.confirmCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={modalStyles.confirmPayButton}
                onPress={onPaymentConfirm}
              >
                <LinearGradient
                  colors={["#2d1b2e", "#5a4a5b"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={modalStyles.confirmPayGradient}
                >
                  <Text style={modalStyles.confirmPayText}>Confirm</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Cash Receipt Modal */}
      <Modal
        visible={showCashReceiptModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseReceipt}
        statusBarTranslucent={true}
      >
        <View style={modalStyles.modalOverlay}>
          <Animated.View 
            style={[
              modalStyles.cashReceiptModal,
              {
                opacity: successOpacity,
                transform: [{ scale: successScale }]
              }
            ]}
          >
            <View style={modalStyles.cashReceiptHeader}>
              <Ionicons name="document-text" size={48} color="#FF9500" />
              <Text style={modalStyles.cashReceiptTitle}>Receipt Generated</Text>
              <Text style={modalStyles.cashReceiptSubtitle}>
                Pending payment confirmation
              </Text>
            </View>

            <View style={modalStyles.warningBox}>
              <View style={modalStyles.warningBoxHeader}>
                <Ionicons name="alarm" size={20} color="#FF3B30" />
                <Text style={modalStyles.warningBoxTitle}>Payment Deadline</Text>
              </View>
              <Text style={modalStyles.warningBoxText}>
                Pay within <Text style={modalStyles.warningBoxHighlight}>1 HOUR</Text> at HOA office or reservation will be voided.
              </Text>
            </View>

            <View style={modalStyles.receiptDetails}>
              <View style={modalStyles.receiptDetailRow}>
                <Ionicons name="location" size={16} color="#666" />
                <Text style={modalStyles.receiptDetailText}>{bookingData.facility}</Text>
              </View>
              <View style={modalStyles.receiptDetailRow}>
                <Ionicons name="calendar" size={16} color="#666" />
                <Text style={modalStyles.receiptDetailText}>{bookingData.date}</Text>
              </View>
              <View style={modalStyles.receiptDetailRow}>
                <Ionicons name="time" size={16} color="#666" />
                <Text style={modalStyles.receiptDetailText}>{bookingData.time}</Text>
              </View>
              <View style={modalStyles.receiptDetailRow}>
                <Ionicons name="cash" size={16} color="#666" />
                <Text style={modalStyles.receiptDetailText}>
                  ₱{bookingData.price} • Cash Payment
                </Text>
              </View>
            </View>

            <View style={modalStyles.instructionsBox}>
              <Text style={modalStyles.instructionsTitle}>Next Steps:</Text>
              <Text style={modalStyles.instructionsText}>
                1. Download receipt below{'\n'}
                2. Visit HOA office{'\n'}
                3. Show receipt to admin{'\n'}
                4. Pay ₱{bookingData.price} cash
              </Text>
            </View>

           <View style={modalStyles.cashReceiptActions}>
              <View style={modalStyles.cashReceiptActionsRow}>
                <TouchableOpacity 
                  style={modalStyles.downloadButton}
                  onPress={handleDownloadReceipt}
                >
                  <LinearGradient
                    colors={["#007DFF", "#0051D5"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={modalStyles.downloadButtonGradient}
                  >
                    <Ionicons name="download" size={20} color="#fff" />
                    <Text style={modalStyles.downloadButtonText}>Save Receipt</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={modalStyles.doneButton}
                  onPress={onCashReceiptComplete}
                >
                  <Text style={modalStyles.doneButtonText}>View Schedule</Text>
                  <Ionicons name="arrow-forward" size={16} color="#2d1b2e" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={modalStyles.closeButton}
                onPress={handleCloseReceipt}
              >
                <Text style={modalStyles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Success Modal with Animation (for online payments) */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="none"
        onRequestClose={onSuccessComplete}
        statusBarTranslucent={true}
      >
        <View style={modalStyles.modalOverlay}>
          {/* Confetti */}
          {confettiAnims.map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                modalStyles.confetti,
                {
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCF7F'][index % 4],
                  transform: [
                    { translateX: anim.x },
                    { translateY: anim.y },
                    { rotate: anim.rotate.interpolate({
                      inputRange: [0, 720],
                      outputRange: ['0deg', '720deg']
                    })}
                  ]
                }
              ]}
            />
          ))}

          <Animated.View 
            style={[
              modalStyles.successModal,
              {
                opacity: successOpacity,
                transform: [{ scale: successScale }]
              }
            ]}
          >
            <View style={modalStyles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color="#00C853" />
            </View>
            
            <Text style={modalStyles.successTitle}>Payment Successful!</Text>
            <Text style={modalStyles.successSubtitle}>
              Your reservation has been confirmed
            </Text>

            <View style={modalStyles.successDetails}>
              <View style={modalStyles.successDetailRow}>
                <Ionicons name="location" size={18} color="#666" />
                <Text style={modalStyles.successDetailText}>{bookingData.facility}</Text>
              </View>
              <View style={modalStyles.successDetailRow}>
                <Ionicons name="calendar" size={18} color="#666" />
                <Text style={modalStyles.successDetailText}>{bookingData.date}</Text>
              </View>
              <View style={modalStyles.successDetailRow}>
                <Ionicons name="time" size={18} color="#666" />
                <Text style={modalStyles.successDetailText}>{bookingData.time}</Text>
              </View>
              <View style={modalStyles.successDetailRow}>
                <Ionicons name="wallet" size={18} color="#666" />
                <Text style={modalStyles.successDetailText}>
                  ₱{bookingData.price} • {paymentMethods.find(p => p.id === selectedPaymentMethod)?.name}
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={modalStyles.successButton}
              onPress={onSuccessComplete}
            >
              <LinearGradient
                colors={["#2d1b2e", "#5a4a5b"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={modalStyles.successButtonGradient}
              >
                <Text style={modalStyles.successButtonText}>View My Reservations</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  )
}