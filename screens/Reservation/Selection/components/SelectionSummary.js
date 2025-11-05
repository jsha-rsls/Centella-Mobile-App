import { View, Text } from "react-native"
import styles from "../styles/SelectionSummaryStyles"

export default function SelectionSummary({
  selectedFacility,
  selectedDate,
  selectedTimeSlot,
  selectedPurposes,
  customPurpose,
  facilities,
  currentStep,
}) {
  const formatPurpose = () => {
    const filteredPurposes = selectedPurposes.filter((p) => p !== "Other")

    // ✅ NEW: Limit to first 2 items
    const MAX_DISPLAY = 2
    let displayPurposes = [...filteredPurposes]
    let hasMore = false

    // If "Other" is selected and there's a custom purpose
    if (selectedPurposes.includes("Other") && customPurpose.trim()) {
      const othersFormatted = `${customPurpose.trim()}`
      displayPurposes.push(othersFormatted)
    }

    // Check if we have more than MAX_DISPLAY items
    if (displayPurposes.length > MAX_DISPLAY) {
      hasMore = true
      displayPurposes = displayPurposes.slice(0, MAX_DISPLAY)
    }

    // Format the display string
    if (displayPurposes.length > 0) {
      const purposeText = displayPurposes.join(", ")
      return hasMore ? `${purposeText}...` : purposeText
    }

    return ""
  }

  const formatTimeSlot = (timeSlot) => {
    if (!timeSlot) return ""

    const formatTime = (time) => {
      const [hour, minute] = time.split(":").map(Number)
      const date = new Date()
      date.setHours(hour, minute)

      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: minute === 0 ? undefined : "2-digit",
        hour12: true,
      })
    }

    const [start, end] = timeSlot.split(" - ")
    return `${formatTime(start)} - ${formatTime(end)}`
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Selection</Text>

      <View style={styles.summaryGrid}>
        {/* Facility */}
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Facility:</Text>
          <View style={styles.valueContainer}>
            <Text style={[styles.value, !selectedFacility && styles.valueEmpty]}>
              {selectedFacility?.name || "Not selected"}
            </Text>
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Date & Time:</Text>
          <Text
            style={[
              styles.value,
              (!selectedDate && !selectedTimeSlot) && styles.valueEmpty,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {selectedDate && selectedTimeSlot
              ? `${new Date(selectedDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })} • ${formatTimeSlot(selectedTimeSlot)}`
              : selectedDate
              ? new Date(selectedDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : selectedTimeSlot
              ? formatTimeSlot(selectedTimeSlot)
              : "Not selected"}
          </Text>
        </View>

        {/* Event */}
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Event:</Text>
          <View style={styles.valueContainer}>
            <Text
              style={[
                styles.value,
                !selectedPurposes.length && !customPurpose.trim() && styles.valueEmpty,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {selectedPurposes.length > 0 || customPurpose.trim()
                ? formatPurpose()
                : "Not selected"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
