// screens/Home/sideMenuScreens/ReservationHistory/components/Header.js
import { View, Text, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import styles from "../styles"

export default function Header({ navigation, activeTab, insets }) {
  return (
    <LinearGradient
      colors={["#F9E6E6", "#F2D5D5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, { paddingTop: insets.top + 11 }]}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#2d1b2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {activeTab === 'current' ? 'My Reservations' : 'Reservation History'}
        </Text>
        <View style={{ width: 40 }} />
      </View>
    </LinearGradient>
  )
}