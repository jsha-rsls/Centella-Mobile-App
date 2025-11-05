// screens/Home/sideMenuScreens/ReservationHistory/components/CancelBottomSheet.js
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, Animated, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useRef } from "react"
import styles from "../styles"

const { height } = Dimensions.get('window')

export default function CancelBottomSheet({ 
  visible, 
  onClose, 
  onConfirm, 
  reservation,
  loading 
}) {
  const slideAnim = useRef(new Animated.Value(height)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      // Reset to starting position first
      slideAnim.setValue(height)
      fadeAnim.setValue(0)
      
      // Then slide up animation when opening
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 80,
          useNativeDriver: true,
        })
      ]).start()
    } else {
      // Slide down animation when closing
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start()
    }
  }, [visible, slideAnim, fadeAnim])

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <TouchableOpacity 
        style={styles.bottomSheetOverlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <Animated.View 
          style={[
            styles.bottomSheetOverlayBg,
            { opacity: fadeAnim }
          ]} 
        />
      </TouchableOpacity>

      <Animated.View 
        style={[
          styles.bottomSheetContent,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <View style={styles.bottomSheetHandle} />
        
        <View style={styles.bottomSheetHeader}>
          <View style={styles.warningIconLarge}>
            <Ionicons name="alert-circle" size={28} color="#f44336" />
          </View>
          <Text style={styles.bottomSheetTitle}>Cancel Reservation?</Text>
          <Text style={styles.bottomSheetSubtitle}>This action cannot be undone</Text>
        </View>

        {reservation && (
          <View style={styles.bottomSheetBody}>
            <View style={styles.reservationCard}>
              <View style={styles.cardRow}>
                <View style={styles.facilityIconLarge}>
                  <Ionicons name="business" size={20} color="#2d1b2e" />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardFacility}>{reservation.facility}</Text>
                  <View style={styles.cardDetails}>
                    <Ionicons name="calendar-outline" size={14} color="#666" />
                    <Text style={styles.cardDetailText}>{reservation.date}</Text>
                  </View>
                  <View style={styles.cardDetails}>
                    <Ionicons name="time-outline" size={14} color="#666" />
                    <Text style={styles.cardDetailText}>{reservation.time}</Text>
                  </View>
                </View>
                <Text style={styles.cardAmount}>₱{reservation.totalAmount.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.warningCard}>
              <Ionicons name="information-circle" size={18} color="#ff6f00" />
              <Text style={styles.warningCardText}>
                No refunds will be issued for cancelled reservations
              </Text>
            </View>
          </View>
        )}

        <View style={styles.bottomSheetActions}>
          <TouchableOpacity 
            style={styles.sheetButton}
            onPress={handleClose}
            disabled={loading}
          >
            <Text style={styles.sheetButtonText}>Keep Reservation</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.sheetButtonDanger}
            onPress={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="close-circle" size={18} color="#fff" />
                <Text style={styles.sheetButtonDangerText}>Cancel It</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  )
}