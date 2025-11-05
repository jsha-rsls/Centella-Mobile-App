import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from "@expo/vector-icons"
import { buttonStyles } from "../styles/ButtonStyles"

export default function PaymentButton({ bookingData, processing, onPress }) {
  return (
    <View style={buttonStyles.bottomContainer}>
      <TouchableOpacity 
        style={[buttonStyles.payButton, processing && buttonStyles.payButtonDisabled]} 
        onPress={onPress}
        disabled={processing}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={processing ? ["#999", "#777"] : ["#2d1b2e", "#5a4a5b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={buttonStyles.payButtonGradient}
        >
          {processing ? (
            <View style={buttonStyles.payButtonContent}>
              <ActivityIndicator color="white" size="small" />
              <Text style={buttonStyles.payButtonText}>Processing...</Text>
            </View>
          ) : (
            <View style={buttonStyles.payButtonContent}>
              <Ionicons name="lock-closed" size={18} color="#fff" />
              <Text style={buttonStyles.payButtonText}>
                Confirm & Pay • ₱{bookingData.price}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )
}