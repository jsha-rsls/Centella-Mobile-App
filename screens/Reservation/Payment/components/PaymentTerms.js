import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { termsStyles } from "../styles/TermsStyles"

export default function PaymentTerms() {
  return (
    <View style={termsStyles.termsCard}>
      <View style={termsStyles.termsHeader}>
        <Ionicons name="information-circle-outline" size={18} color="#2d1b2e" />
        <Text style={termsStyles.termsTitle}>Important Notes</Text>
      </View>
      <View style={termsStyles.termsContent}>
        <Text style={termsStyles.termsText}>• Payment confirms your booking</Text>
        <Text style={termsStyles.termsText}>• Cancel 24hrs prior for full refund</Text>
        <Text style={termsStyles.termsText}>• Follow facility rules & regulations</Text>
      </View>
    </View>
  )
}