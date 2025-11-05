import { useState } from "react"
import { View, ScrollView, ActivityIndicator } from "react-native"
import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import { SafeAreaView } from "react-native-safe-area-context"
import { CommonActions } from '@react-navigation/native'
import * as Haptics from 'expo-haptics'

import { styles } from "./PaymentStyles"
import { usePaymentData } from "./hooks/usePaymentData"
import { usePaymentModals } from "./hooks/usePaymentModals"
import { usePaymentAnimation } from "./hooks/usePaymentAnimation"
import PaymentHeader from "./components/PaymentHeader"
import BookingSummary from "./components/BookingSummary"
import PaymentMethodSelector from "./components/PaymentMethodSelector"
import PaymentTimeline from "./components/PaymentTimeline"
import PaymentTerms from "./components/PaymentTerms"
import PaymentButton from "./components/PaymentButton"
import PaymentModals from "./components/PaymentModals"
import PaymentWebView from "./components/PaymentWebView"

export default function Payment({ navigation, route }) {
  const { bookingData: rawBookingData, facilityData } = route.params
  
  // Custom hooks
  const { bookingData, paymentMethods } = usePaymentData(rawBookingData, facilityData)
  const { 
    selectedPaymentMethod, 
    setSelectedPaymentMethod,
    processing,
    handlePayment,
    showWebView,
    paymentUrl,
    closeWebView,
    handleWebViewClose,
    checkPaymentStatus,
    createdReservationId,
  } = usePaymentModals(bookingData, navigation)
  const { 
    successScale, 
    successOpacity, 
    confettiAnims, 
    triggerSuccessAnimation 
  } = usePaymentAnimation()

  // Local state
  const [summaryCollapsed, setSummaryCollapsed] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showCashReceiptModal, setShowCashReceiptModal] = useState(false)
  const [showMethodInfo, setShowMethodInfo] = useState(null)

  // Don't render until booking data is processed
  if (!bookingData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2d1b2e" />
        </View>
      </SafeAreaView>
    )
  }

  const handleMethodSelect = (methodId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setSelectedPaymentMethod(methodId)
  }

  const handleMethodInfo = (methodId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setShowMethodInfo(methodId)
  }

  const handleConfirmPress = () => {
    if (!selectedPaymentMethod) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
      setShowMethodInfo("select")
      return
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setShowConfirmModal(true)
  }

  const handlePaymentConfirm = async () => {
    setShowConfirmModal(false)
    const result = await handlePayment(selectedPaymentMethod)
    
    // Handle different payment flows
    if (result === true) {
      // Cash payment - show cash receipt modal
      if (selectedPaymentMethod === 'cash') {
        setShowCashReceiptModal(true)
        triggerSuccessAnimation()
      } else {
        // Other instant confirmations
        setShowSuccessModal(true)
        triggerSuccessAnimation()
      }
    } else if (result === 'webview_opened') {
      // Online payment - WebView is now open, polling started
      // Wait for polling to detect payment or user to close WebView
    } else {
      // Payment failed
      setShowMethodInfo("error")
    }
  }

  const handleWebViewClosePress = async () => {
    const paymentSuccess = await handleWebViewClose()
    
    if (paymentSuccess) {
      // Payment was completed successfully
      setShowSuccessModal(true)
      triggerSuccessAnimation()
    } else {
      // Payment not completed - could show info modal
      setShowMethodInfo("incomplete")
    }
  }

  const handleSuccessComplete = () => {
    setShowSuccessModal(false)
    
    // Navigate to Schedule tab with reset
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'MainTabs',
              state: {
                routes: [
                  { name: 'Home' },
                  { name: 'Announcements' },
                  { name: 'Reserve' },
                  { name: 'Schedule', params: { refreshNeeded: true } },
                ],
                index: 3, // Schedule tab (index 3)
              }
            }
          ]
        })
      )
    }, 300)
  }

  const handleCashReceiptComplete = () => {
    setShowCashReceiptModal(false)
    
    // Navigate to Schedule tab with reset
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'MainTabs',
              state: {
                routes: [
                  { name: 'Home' },
                  { name: 'Announcements' },
                  { name: 'Reserve' },
                  { name: 'Schedule', params: { refreshNeeded: true } },
                ],
                index: 3, // Schedule tab (index 3)
              }
            }
          ]
        })
      )
    }, 300)
  }

  const handleCashReceiptClose = () => {
    setShowCashReceiptModal(false)
    
    // Navigate to Home tab with reset
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'MainTabs',
              state: {
                routes: [
                  { name: 'Home' },
                  { name: 'Announcements' },
                  { name: 'Reserve' },
                  { name: 'Schedule' },
                ],
                index: 0, // Home tab (index 0)
              }
            }
          ]
        })
      )
    }, 300)
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ExpoStatusBar style="dark" />
      
      <PaymentHeader 
        navigation={navigation}
        processing={processing}
      />

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BookingSummary
          bookingData={bookingData}
          collapsed={summaryCollapsed}
          onToggle={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            setSummaryCollapsed(!summaryCollapsed)
          }}
        />

        <PaymentMethodSelector
          methods={paymentMethods}
          selectedMethod={selectedPaymentMethod}
          onSelectMethod={handleMethodSelect}
          onMethodInfo={handleMethodInfo}
          processing={processing}
        />

        <PaymentTimeline />
        
        <PaymentTerms />
      </ScrollView>

      <PaymentButton
        bookingData={bookingData}
        processing={processing}
        onPress={handleConfirmPress}
      />

      {/* PayMongo WebView */}
      <PaymentWebView
        visible={showWebView}
        paymentUrl={paymentUrl}
        onClose={handleWebViewClosePress}
        onLoadStart={() => console.log('WebView loading...')}
        onLoadEnd={() => console.log('WebView loaded')}
      />

      <PaymentModals
        showMethodInfo={showMethodInfo}
        setShowMethodInfo={setShowMethodInfo}
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        showSuccessModal={showSuccessModal}
        showCashReceiptModal={showCashReceiptModal}
        setShowCashReceiptModal={setShowCashReceiptModal}
        bookingData={bookingData}
        paymentMethods={paymentMethods}
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentConfirm={handlePaymentConfirm}
        onSuccessComplete={handleSuccessComplete}
        onCashReceiptComplete={handleCashReceiptComplete}
        onCashReceiptClose={handleCashReceiptClose}
        successScale={successScale}
        successOpacity={successOpacity}
        confettiAnims={confettiAnims}
        reservationId={createdReservationId}
      />
    </SafeAreaView>
  )
}