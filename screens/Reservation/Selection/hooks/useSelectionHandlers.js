import React, { useState } from "react"
import { View, Text, TouchableOpacity, Modal, StyleSheet, StatusBar, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import ReservationService from "../../../../services/ReservationService"

// Simple Modal Component with fixed overlay
const SimpleModal = ({ visible, title, message, onConfirm, onCancel, showCancel = false }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onConfirm}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.modalMessage}>{message}</Text>
          </View>
          <View style={styles.modalFooter}>
            {showCancel && (
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onCancel}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton, !showCancel && { flex: 1 }]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>
                {showCancel ? 'Confirm' : 'OK'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export function useSelectionHandlers({
  selectedFacility,
  selectedDate,
  selectedTimeSlot,
  selectedPurposes,
  customPurpose,
  facilities,
  selectedStartTime,
  selectedEndTime,
  timeSelectionStep,
  setSelectedFacility,
  setSelectedDate,
  setSelectedTimeSlot,
  setSelectedPurposes,
  setCustomPurpose,
  setFacilities,
  setLoading,
  setCreating,
  setDateSelected,
  setFacilitySelected,
  setShowDatePicker,
  setShowTimePicker,
  setShowFacilityPicker,
  setSelectedStartTime,
  setSelectedEndTime,
  setTimeSelectionStep,
  setTempDate,
  navigation,
}) {
  const [modal, setModal] = useState({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
    showCancel: false
  })

  const showModal = (title, message, onConfirm = () => hideModal(), onCancel = () => hideModal(), showCancel = false) => {
    setModal({
      visible: true,
      title,
      message,
      onConfirm,
      onCancel,
      showCancel
    })
  }

  const hideModal = () => {
    setModal(prev => ({ ...prev, visible: false }))
  }

  const loadFacilities = async () => {
    setLoading(true)
    const result = await ReservationService.getFacilities()
    if (result.success) {
      const transformedFacilities = result.data.map((facility) => ({
        id: facility.id,
        name: facility.name,
        price: facility.price,
        price_unit: facility.price_unit || 'per hour', // ✅ Include price_unit
        icon: facility.icon || "🏢",
      }))
      setFacilities(transformedFacilities)
    } else {
      showModal("Error", "Unable to load facilities. Please try again.")
    }
    setLoading(false)
  }

  const handleDateSelect = (date) => {
    if (date.isPastDate) return
    const year = date.fullDate.getFullYear()
    const month = String(date.fullDate.getMonth() + 1).padStart(2, "0")
    const day = String(date.fullDate.getDate()).padStart(2, "0")
    const localDateString = `${year}-${month}-${day}`
    setSelectedDate(localDateString)
    setTempDate(date.fullDate)
    setDateSelected(true)
    setShowDatePicker(false)
  }

  const handleFacilitySelect = (facility) => {
    setSelectedFacility(facility)
    setSelectedPurposes([])
    setCustomPurpose("")
    setFacilitySelected(true)
    setShowFacilityPicker(false)
  }

  const handleTimeConfirm = () => {
    if (!selectedStartTime || !selectedEndTime) {
      showModal("Invalid Time", "Please complete your time selection")
      return
    }
    const startMinutes = selectedStartTime.hour * 60 + selectedStartTime.minute
    const endMinutes = selectedEndTime.hour * 60 + selectedEndTime.minute
    if (endMinutes <= startMinutes) {
      showModal("Invalid Time", "Please select a valid time range")
      return
    }
    if (
      selectedStartTime.hour < 7 ||
      selectedEndTime.hour > 23 ||
      (selectedEndTime.hour === 23 && selectedEndTime.minute > 0)
    ) {
      showModal("Invalid Time", "Please select a time within operating hours")
      return
    }
    const startTime = `${selectedStartTime.hour.toString().padStart(2, "0")}:${selectedStartTime.minute.toString().padStart(2, "0")}`
    const endTime = `${selectedEndTime.hour.toString().padStart(2, "0")}:${selectedEndTime.minute.toString().padStart(2, "0")}`
    setSelectedTimeSlot(`${startTime} - ${endTime}`)
    setTimeSelectionStep("complete")
    setShowTimePicker(false)
  }

  const handleCustomTimeConfirm = (timeType) => {
    if (timeType === "start") {
      return
    } else if (timeType === "end") {
      const startMinutes = selectedStartTime.hour * 60 + selectedStartTime.minute
      const endMinutes = selectedEndTime.hour * 60 + selectedEndTime.minute
      if (endMinutes <= startMinutes) {
        showModal("Invalid Time", "Please select a valid time range")
        return
      }
      if (
        selectedStartTime.hour < 7 ||
        selectedEndTime.hour > 23 ||
        (selectedEndTime.hour === 23 && selectedEndTime.minute > 0)
      ) {
        showModal("Invalid Time", "Please select a time within operating hours")
        return
      }
      const startTime = `${selectedStartTime.hour.toString().padStart(2, "0")}:${selectedStartTime.minute.toString().padStart(2, "0")}`
      const endTime = `${selectedEndTime.hour.toString().padStart(2, "0")}:${selectedEndTime.minute.toString().padStart(2, "0")}`
      setSelectedTimeSlot(`${startTime} - ${endTime}`)
      setTimeSelectionStep("complete")
      setShowTimePicker(false)
    }
  }

  const handlePurposeToggle = (purpose) => {
    if (purpose === "Other") {
      if (selectedPurposes.includes("Other")) {
        setSelectedPurposes(selectedPurposes.filter((p) => p !== "Other"))
        setCustomPurpose("")
      } else {
        setSelectedPurposes([...selectedPurposes, "Other"])
      }
    } else {
      if (selectedPurposes.includes(purpose)) {
        setSelectedPurposes(selectedPurposes.filter((p) => p !== purpose))
      } else {
        setSelectedPurposes([...selectedPurposes, purpose])
      }
    }
  }

  const handleProceedToPayment = async () => {
    if (!selectedFacility || !selectedDate || !selectedTimeSlot) {
      showModal("Incomplete Information", "Please complete all required information")
      return
    }
    if (selectedPurposes.length === 0 && !customPurpose.trim()) {
      showModal("Event Required", "Please specify the event for your reservation")
      return
    }

    const selectedFacilityData = facilities.find((f) => f.id === selectedFacility?.id)
    if (!selectedFacilityData) {
      showModal("Error", "Please select a valid facility")
      return
    }

    const finalPurpose =
      selectedPurposes.length > 0
        ? selectedPurposes.join(", ") + (customPurpose.trim() ? `, ${customPurpose}` : "")
        : customPurpose

    const [startTime, endTime] = selectedTimeSlot.split(" - ")

    // ✅ Build bookingData with DB schema fields
    const bookingData = {
      facility_id: selectedFacility.id,
      reservation_date: selectedDate,
      start_time: startTime,
      end_time: endTime,
      purpose: finalPurpose,
      total_amount: selectedFacilityData.price,
      price_unit: selectedFacilityData.price_unit, // ✅ Include price_unit
      status: "pending",
      payment_status: "pending",
    }

    showModal(
      "Confirm Reservation",
      `Are you sure you want to reserve ${selectedFacility.name} on ${new Date(selectedDate).toLocaleDateString()} at ${selectedTimeSlot}?`,
      () => {
        hideModal()
        createReservation(bookingData)
      },
      hideModal,
      true
    )
  }

  const createReservation = async (bookingData) => {
    setCreating(true)
    try {
      const result = await ReservationService.createReservation(bookingData)
      if (result.success) {
        showModal(
          "Reservation Created",
          "Your reservation has been created successfully!",
          () => {
            hideModal()
            navigation.navigate("Schedule", {
              refreshNeeded: true,
              newReservation: {
                facility_id: bookingData.facility_id,
                date: bookingData.reservation_date,
                start_time: bookingData.start_time,
                end_time: bookingData.end_time,
              },
            })
          }
        )
      } else {
        showModal("Error", result.error)
      }
    } catch (error) {
      console.error("Error creating reservation:", error)
      showModal("Error", "Unable to create reservation. Please try again.")
    } finally {
      setCreating(false)
    }
  }

  const ModalComponent = () => (
    <SimpleModal
      visible={modal.visible}
      title={modal.title}
      message={modal.message}
      onConfirm={modal.onConfirm}
      onCancel={modal.onCancel}
      showCancel={modal.showCancel}
    />
  )

  return {
    handleDateSelect,
    handleFacilitySelect,
    handleTimeConfirm,
    handleCustomTimeConfirm,
    handlePurposeToggle,
    handleProceedToPayment,
    loadFacilities,
    ModalComponent,
  }
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    minWidth: 280,
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
})