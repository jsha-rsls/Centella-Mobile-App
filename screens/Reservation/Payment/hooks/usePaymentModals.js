import { useState, useRef, useEffect } from "react"
import * as Haptics from 'expo-haptics'
import { supabase } from "../../../../utils/supabase"
import ReservationService from "../../../../services/ReservationService"

export const usePaymentModals = (bookingData, navigation) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [processing, setProcessing] = useState(false)
  const [showWebView, setShowWebView] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState(null)
  const [createdReservationId, setCreatedReservationId] = useState(null)
  
  const pollingInterval = useRef(null)
  const pollingAttempts = useRef(0)
  const MAX_POLLING_ATTEMPTS = 60 // 60 attempts × 3 seconds = 3 minutes max

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }
    }
  }, [])

  // Function to create payment link via Edge Function
  const createPaymentLink = async (reservationId, amount, description) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Not authenticated')
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/create-payment-link`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            reservation_id: reservationId,
            amount: amount,
            description: description,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create payment link')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error creating payment link:', error)
      throw error
    }
  }

  // Function to check payment status
  const checkPaymentStatus = async (reservationId) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('payment_status, paymongo_payment_id, paymongo_payment_method')
        .eq('id', reservationId)
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error checking payment status:', error)
      return null
    }
  }

  // Function to check payment status with retries (for webhook delay)
  const checkPaymentStatusWithRetry = async (reservationId, maxRetries = 5, delayMs = 2000) => {
    for (let i = 0; i < maxRetries; i++) {
      const status = await checkPaymentStatus(reservationId)
      
      if (status && status.payment_status === 'paid') {
        return status
      }
      
      // Wait before next retry (except on last attempt)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
    
    // Final check after all retries
    return await checkPaymentStatus(reservationId)
  }

  // Function to start polling for payment status
  const startPolling = (reservationId) => {
    pollingAttempts.current = 0
    
    pollingInterval.current = setInterval(async () => {
      pollingAttempts.current += 1

      // Stop polling after max attempts
      if (pollingAttempts.current >= MAX_POLLING_ATTEMPTS) {
        clearInterval(pollingInterval.current)
        setShowWebView(false)
        setProcessing(false)
        return
      }

      const status = await checkPaymentStatus(reservationId)
      
      if (status && status.payment_status === 'paid') {
        // Payment successful!
        clearInterval(pollingInterval.current)
        setShowWebView(false)
        setProcessing(false)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        return true
      }
    }, 3000) // Poll every 3 seconds
  }

  // Function to stop polling
  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current)
      pollingInterval.current = null
    }
    pollingAttempts.current = 0
  }

  // Main payment handler
  const handlePayment = async (paymentMethod) => {
    setProcessing(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)

    try {
      // Step 1: Create reservation in database
      const reservationData = {
        facility_id: bookingData.facility_id,
        reservation_date: bookingData.reservation_date,
        start_time: bookingData.start_time,
        end_time: bookingData.end_time,
        purpose: bookingData.purpose,
        total_amount: bookingData.price,
        price_unit: bookingData.price_unit,
        status: "pending",
        payment_status: "pending",
        payment_type: paymentMethod,
      }

      const result = await ReservationService.createReservation(reservationData)

      if (!result.success) {
        throw new Error(result.error || 'Failed to create reservation')
      }

      const reservationId = result.data.id
      setCreatedReservationId(reservationId)

      // Step 2: If cash payment, no need for PayMongo
      if (paymentMethod === "cash") {
        setProcessing(false)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        return true
      }

      // Step 3: Create PayMongo payment link for online payments
      const paymentLinkData = await createPaymentLink(
        reservationId,
        bookingData.price,
        `${bookingData.facility} - ${bookingData.date}`
      )

      if (!paymentLinkData.success) {
        throw new Error('Failed to create payment link')
      }

      // Step 4: Open WebView with payment URL
      setPaymentUrl(paymentLinkData.payment_link_url)
      setShowWebView(true)

      // Step 5: Start polling for payment status
      startPolling(reservationId)

      return 'webview_opened'

    } catch (error) {
      console.error("Payment error:", error)
      setProcessing(false)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      return false
    }
  }

  // Function to close WebView manually
  const closeWebView = () => {
    stopPolling()
    setShowWebView(false)
    setPaymentUrl(null)
    setProcessing(false)
  }

  // Function to check if payment was successful when WebView closes
  const handleWebViewClose = async () => {
    if (createdReservationId) {
      // Show processing state
      setProcessing(true)
      
      // Wait a bit and retry checking payment status
      // This gives the webhook time to process
      const status = await checkPaymentStatusWithRetry(createdReservationId, 5, 2000)
      
      if (status && status.payment_status === 'paid') {
        // Payment successful
        stopPolling()
        setShowWebView(false)
        setProcessing(false)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        return true
      } else {
        // Payment not completed after retries
        stopPolling()
        setShowWebView(false)
        setProcessing(false)
        return false
      }
    }
    
    stopPolling()
    setShowWebView(false)
    setProcessing(false)
    return false
  }

  return {
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
  }
}