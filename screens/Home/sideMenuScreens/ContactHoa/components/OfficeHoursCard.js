import React from "react"
import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "../styles/styles"

export default function OfficeHoursCard({ schedules }) {
  const getCurrentStatus = () => {
    const now = new Date()
    const day = now.getDay()
    const hour = now.getHours()
    
    // Sunday (0) is closed
    if (day === 0) return { isOpen: false, text: "Closed Today" }
    
    // Saturday (6) - 9AM to 12PM
    if (day === 6) {
      return hour >= 9 && hour < 12 
        ? { isOpen: true, text: "Open Now" }
        : { isOpen: false, text: "Closed" }
    }
    
    // Monday-Friday (1-5) - 9AM to 5PM
    return hour >= 9 && hour < 17
      ? { isOpen: true, text: "Open Now" }
      : { isOpen: false, text: "Closed" }
  }

  const status = getCurrentStatus()

  return (
    <View style={styles.section}>
      <View style={[styles.sectionHeader, { alignItems: 'center' }]}>
        <Text style={styles.sectionTitle}>Office Hours</Text>
      </View>
      
      <View style={styles.card}>
        <View style={styles.statusBadge}>
          <View style={[
            styles.statusDot, 
            { backgroundColor: status.isOpen ? "#4caf50" : "#f44336" }
          ]} />
          <Text style={[
            styles.statusText,
            { color: status.isOpen ? "#4caf50" : "#f44336" }
          ]}>
            {status.text}
          </Text>
        </View>

        <View style={styles.divider} />

        {schedules.map((schedule, index) => (
          <View key={index}>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleDay}>{schedule.day}</Text>
              <Text style={styles.scheduleHours}>{schedule.hours}</Text>
            </View>
            {index < schedules.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </View>
  )
}