import { Linking, Alert } from "react-native"

export const useContactActions = () => {
  const makePhoneCall = (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/[^0-9+]/g, "")
    Linking.openURL(`tel:${cleanNumber}`)
      .catch(() => Alert.alert("Error", "Unable to make phone call"))
  }

  const sendEmail = (email) => {
    Linking.openURL(`mailto:${email}`)
      .catch(() => Alert.alert("Error", "Unable to open email client"))
  }

  const openMaps = (address) => {
    const encodedAddress = encodeURIComponent(address)
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    Linking.openURL(url)
      .catch(() => Alert.alert("Error", "Unable to open maps"))
  }

  const handleContactPress = (method) => {
    switch (method.type) {
      case "phone":
        makePhoneCall(method.value)
        break
      case "email":
        sendEmail(method.value)
        break
      case "address":
        openMaps(method.value)
        break
      default:
        Alert.alert("Coming Soon", "This feature is not yet available")
    }
  }

  return { handleContactPress, makePhoneCall, sendEmail, openMaps }
}