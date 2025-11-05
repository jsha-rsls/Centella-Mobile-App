// screens/Home/sideMenuScreens/ReservationHistory/components/EmptyState.js
import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { CommonActions } from "@react-navigation/native"
import styles from "../styles"
import { getCurrentUser } from "../../../../../services/residentService"
import { getResidentVerificationStatus } from "../../../../../services/residentVerificationService"

export default function EmptyState({ isCurrentTab, navigation }) {
  const [isVerified, setIsVerified] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkVerificationStatus()
  }, [])

  const checkVerificationStatus = async () => {
    try {
      const user = await getCurrentUser()
      if (user) {
        const { isVerified: verified } = await getResidentVerificationStatus(user.id)
        setIsVerified(verified)
      }
    } catch (error) {
      console.error('Error checking verification status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookFacility = () => {
    // Reset navigation to MainTabs and select the appropriate tab
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'MainTabs',
            state: {
              routes: [
                { name: 'Home' },
                { name: 'Announcements' },
                { name: 'Reserve' },
                { name: 'Schedule' },
              ],
              index: isVerified ? 2 : 0, // Reserve tab (2) if verified, Home tab (0) if not
            },
          },
        ],
      })
    )
  }

  return (
    <View style={styles.emptyState}>
      <Ionicons 
        name={isCurrentTab ? "calendar-outline" : "time-outline"} 
        size={64} 
        color="#ccc" 
      />
      <Text style={styles.emptyTitle}>
        {isCurrentTab ? "No Active Reservations" : "No Past Reservations"}
      </Text>
      <Text style={styles.emptyText}>
        {isCurrentTab 
          ? "You don't have any upcoming reservations. Book a facility to get started!"
          : "Your completed and cancelled reservations will appear here."
        }
      </Text>
      {isCurrentTab && !loading && (
        <TouchableOpacity 
          style={styles.makeReservationButton}
          onPress={handleBookFacility}
        >
          <Text style={styles.makeReservationButtonText}>Book a Facility</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}