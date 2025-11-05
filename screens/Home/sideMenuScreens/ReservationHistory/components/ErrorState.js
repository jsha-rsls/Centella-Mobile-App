// screens/Home/sideMenuScreens/ReservationHistory/components/ErrorState.js
import { View, Text, TouchableOpacity } from "react-native"
import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import Header from "./Header"
import styles from "../styles"

export default function ErrorState({ insets, navigation, error, onRetry, activeTab }) {
  return (
    <View style={styles.container}>
      <ExpoStatusBar style="dark" />
      <Header 
        navigation={navigation}
        activeTab={activeTab}
        insets={insets}
      />
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#f44336" />
        <Text style={styles.errorTitle}>Error Loading Reservations</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={onRetry}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}