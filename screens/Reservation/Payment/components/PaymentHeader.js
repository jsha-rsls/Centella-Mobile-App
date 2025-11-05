import { View, Text, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from "@expo/vector-icons"
import * as Haptics from 'expo-haptics'
import { headerStyles } from "../styles/HeaderStyles"

export default function PaymentHeader({ navigation, processing }) {
  const insets = useSafeAreaInsets()

  return (
    <LinearGradient
      colors={["#F9E6E6", "#F2D5D5", "#F9E6E6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[headerStyles.header, { paddingTop: insets.top + 8 }]}
    >
      <TouchableOpacity 
        style={headerStyles.backButton} 
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          navigation.goBack()
        }}
        disabled={processing}
      >
        <View style={headerStyles.backButtonCircle}>
          <Ionicons name="arrow-back" size={20} color="#2d1b2e" />
        </View>
      </TouchableOpacity>
      
      <View style={headerStyles.headerCenter}>
        <Text style={headerStyles.headerTitle}>Secure Payment</Text>
        <View style={headerStyles.securityBadge}>
          <Ionicons name="shield-checkmark" size={12} color="#00C853" />
          <Text style={headerStyles.securityText}>Encrypted</Text>
        </View>
      </View>
      
      <View style={headerStyles.headerSpacer} />
    </LinearGradient>
  )
}