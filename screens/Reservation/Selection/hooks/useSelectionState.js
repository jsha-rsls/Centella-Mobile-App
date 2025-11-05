import { useState } from "react"

export function useSelectionState(facilityType, selectedTime, preSelectedFacilityId) {
  // Main selection states
  // Initialize as null to properly handle facility objects
  const [selectedFacility, setSelectedFacility] = useState(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(selectedTime || "")
  const [selectedPurposes, setSelectedPurposes] = useState([])
  const [customPurpose, setCustomPurpose] = useState("")

  // Data and loading states
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  // UI states
  const [dateSelected, setDateSelected] = useState(false)
  const [facilitySelected, setFacilitySelected] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [showFacilityPicker, setShowFacilityPicker] = useState(false)

  // Time picker states
  const [selectedStartTime, setSelectedStartTime] = useState({ hour: 12, minute: 0 })
  const [selectedEndTime, setSelectedEndTime] = useState({ hour: 12, minute: 0 })
  const [timeSelectionStep, setTimeSelectionStep] = useState("start") // 'start', 'end', 'complete'

  // Date picker states
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [tempDate, setTempDate] = useState(new Date())

  // Reset function to clear all selections
  const resetAllState = () => {
    // Reset main selections completely (don't keep route params)
    setSelectedFacility(null)
    setSelectedDate("")
    setSelectedTimeSlot("")
    setSelectedPurposes([])
    setCustomPurpose("")

    // Reset UI states
    setDateSelected(false)
    setFacilitySelected(false)
    setShowDatePicker(false)
    setShowTimePicker(false)
    setShowFacilityPicker(false)

    // Reset time picker states
    setSelectedStartTime({ hour: 12, minute: 0 })
    setSelectedEndTime({ hour: 12, minute: 0 })
    setTimeSelectionStep("start")

    // Reset date picker states to current date
    const now = new Date()
    setSelectedMonth(now.getMonth())
    setSelectedYear(now.getFullYear())
    setTempDate(now)

    // Reset loading states
    setCreating(false)
    // Note: We don't reset loading or facilities here as they should be handled by loadFacilities
  }

  return {
    // Values
    selectedFacility,
    selectedDate,
    selectedTimeSlot,
    selectedPurposes,
    customPurpose,
    facilities,
    loading,
    creating,
    dateSelected,
    facilitySelected,
    showDatePicker,
    showTimePicker,
    showFacilityPicker,
    selectedStartTime,
    selectedEndTime,
    timeSelectionStep,
    selectedMonth,
    selectedYear,
    tempDate,

    // Setters
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
    setSelectedMonth,
    setSelectedYear,
    setTempDate,

    // Reset function
    resetAllState,
  }
}