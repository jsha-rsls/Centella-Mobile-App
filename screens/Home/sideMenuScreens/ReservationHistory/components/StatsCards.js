// screens/Home/sideMenuScreens/ReservationHistory/components/StatsCards.js
import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "../styles"

export default function StatsCards({ activeTab, stats }) {
  if (activeTab === 'current') {
    return (
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="time" size={24} color="#2196f3" />
          </View>
          <Text style={styles.statValue}>{stats.upcoming}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="calendar" size={24} color="#9c27b0" />
          </View>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <View style={styles.statIconContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#4caf50" />
        </View>
        <Text style={styles.statValue}>{stats.completed}</Text>
        <Text style={styles.statLabel}>Completed</Text>
      </View>
      
      <View style={styles.statCard}>
        <View style={styles.statIconContainer}>
          <Ionicons name="close-circle" size={24} color="#f44336" />
        </View>
        <Text style={styles.statValue}>{stats.cancelled}</Text>
        <Text style={styles.statLabel}>Cancelled</Text>
      </View>
    </View>
  )
}