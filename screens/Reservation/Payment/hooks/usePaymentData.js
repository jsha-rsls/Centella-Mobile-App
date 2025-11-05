import { useState, useEffect } from "react"
import PaymentUtils from "../utils/PaymentUtils"

const PAYMENT_METHODS = [
  { 
    id: "online", 
    name: "Pay Online", 
    icon: "card-outline", 
    description: "GCash, PayMaya, Cards & more",
    color: "#007DFF",
    recommended: true,
    info: "Pay securely online using GCash, PayMaya, Credit/Debit Cards, or Bank Transfer. Instant confirmation upon successful payment."
  },
  { 
    id: "cash", 
    name: "Cash Payment", 
    icon: "cash-outline", 
    description: "Pay at facility counter",
    color: "#00C853",
    recommended: false,
    info: "Reserve now and pay in cash when you arrive at the facility. Your reservation will be confirmed once payment is verified by staff."
  },
]

export const usePaymentData = (rawBookingData, facilityData) => {
  const [bookingData, setBookingData] = useState(null)

  useEffect(() => {
    if (rawBookingData && facilityData) {
      const processed = PaymentUtils.processBookingData(rawBookingData, facilityData)
      setBookingData(processed)
    }
  }, [rawBookingData, facilityData])

  return {
    bookingData,
    paymentMethods: PAYMENT_METHODS
  }
}