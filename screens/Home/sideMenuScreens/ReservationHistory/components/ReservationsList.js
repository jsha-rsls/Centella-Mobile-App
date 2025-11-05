// screens/Home/sideMenuScreens/ReservationHistory/components/ReservationsList.js
import { View, Text, TouchableOpacity, Alert } from "react-native"
import ReservationItem from "./ReservationItem"
import CancelBottomSheet from "./CancelBottomSheet"
import styles from "../styles"
import { useState } from "react"
import { Ionicons } from '@expo/vector-icons'
import { cancelReservation } from "../../../../../services/reservationHistoryService"

const ITEMS_PER_PAGE = 5

export default function ReservationsList({ reservations, isCurrentTab, onReservationCancelled }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [showCancelSheet, setShowCancelSheet] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [cancelLoading, setCancelLoading] = useState(false)

  const totalPages = Math.ceil(reservations.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedReservations = reservations.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleCancelPress = (reservation) => {
    setSelectedReservation(reservation)
    setShowCancelSheet(true)
  }

  const handleConfirmCancel = async () => {
    if (!selectedReservation) return

    setCancelLoading(true)
    try {
      const result = await cancelReservation(selectedReservation.id)
      
      if (result.success) {
        Alert.alert(
          "✓ Cancelled",
          "Your reservation has been cancelled.",
          [{ text: "OK" }]
        )
        setShowCancelSheet(false)
        setSelectedReservation(null)
        
        if (onReservationCancelled) {
          onReservationCancelled()
        }
      } else {
        Alert.alert(
          "Unable to Cancel",
          result.error || "Please try again later.",
          [{ text: "OK" }]
        )
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An unexpected error occurred.",
        [{ text: "OK" }]
      )
    } finally {
      setCancelLoading(false)
    }
  }

  const handleCloseSheet = () => {
    if (!cancelLoading) {
      setShowCancelSheet(false)
      setSelectedReservation(null)
    }
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{isCurrentTab ? "Active Reservations" : "Past Reservations"}</Text>
        {isCurrentTab && (
          <View style={styles.doubleTapHint}>
            <Ionicons name="hand-left-outline" size={10} color="#999" />
            <Text style={styles.doubleTapHintText}>Double tap to cancel</Text>
          </View>
        )}
      </View>
      <View style={styles.listContainer}>
        {paginatedReservations.map((reservation, index) => (
          <ReservationItem 
            key={reservation.id} 
            reservation={reservation}
            isLast={index === paginatedReservations.length - 1}
            onCancelPress={handleCancelPress}
            isCurrentTab={isCurrentTab}
          />
        ))}
      </View>

      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[styles.paginationButton, currentPage === 1 && { opacity: 0.5 }]}
            onPress={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <Ionicons name="chevron-back" size={18} color="#2d1b2e" />
          </TouchableOpacity>

          <Text style={styles.paginationInfo}>
            Page {currentPage} of {totalPages}
          </Text>

          <TouchableOpacity
            style={[styles.paginationButton, currentPage === totalPages && { opacity: 0.5 }]}
            onPress={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <Ionicons name="chevron-forward" size={18} color="#2d1b2e" />
          </TouchableOpacity>
        </View>
      )}

      <CancelBottomSheet
        visible={showCancelSheet}
        onClose={handleCloseSheet}
        onConfirm={handleConfirmCancel}
        reservation={selectedReservation}
        loading={cancelLoading}
      />
    </View>
  )
}