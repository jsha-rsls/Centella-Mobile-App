// screens/Reservation/Selection/utils/timeUtils.js

// Format time in 12-hour format with AM/PM (original format)
export const formatTime12Hour = (time) => {
  const hour12 =
    time.hour === 0 ? 12 : time.hour > 12 ? time.hour - 12 : time.hour
  const ampm = time.hour >= 12 ? "PM" : "AM"
  return `${hour12.toString().padStart(2, "0")}:${time.minute
    .toString()
    .padStart(2, "0")} ${ampm}`
}

// Format time in compact format (7 AM, 8 PM, etc.)
export const formatCompactTime = (time) => {
  const hour12 = time.hour === 0 ? 12 : time.hour > 12 ? time.hour - 12 : time.hour
  const ampm = time.hour >= 12 ? "PM" : "AM"
  return `${hour12} ${ampm}`
}

// Generate all preset times (7 AM â€“ 10 PM, 1-hour intervals) with compact format
export const generatePresetTimes = () => {
  const times = []
  for (let hour = 7; hour <= 22; hour++) {
    const startHour = hour
    const endHour = hour + 1
    times.push({
      label: `${formatCompactTime({ hour: startHour, minute: 0 })} - ${formatCompactTime({
        hour: endHour,
        minute: 0,
      })}`,
      startTime: { hour: startHour, minute: 0 },
      endTime: { hour: endHour, minute: 0 },
    })
  }
  return times
}

// Group presets into morning, afternoon, night
export const groupPresetsByTimeOfDay = () => {
  const allTimes = generatePresetTimes()
  return {
    morning: allTimes.filter(
      (time) => time.startTime.hour >= 7 && time.startTime.hour < 12
    ),
    afternoon: allTimes.filter(
      (time) => time.startTime.hour >= 12 && time.startTime.hour < 18
    ),
    night: allTimes.filter(
      (time) => time.startTime.hour >= 18 && time.startTime.hour <= 22
    ),
  }
}

// âœ… Precompute grouped presets once (global memoization)
export const PRESET_GROUPS = groupPresetsByTimeOfDay()

// Generate hours for wheel picker (24 values: 1â€“12 AM, 1â€“12 PM)
export const generateHours = () => {
  return Array.from({ length: 24 }, (_, i) => (i % 12) + 1)
}

// âœ… Generate minutes with configurable step (default 15 min)
export const generateMinutes = (step = 15) => {
  const minutes = []
  for (let i = 0; i < 60; i += step) {
    minutes.push(i)
  }
  return minutes
}

// Convert index to display hour (1â€“12)
export const getDisplayHour = (index) => (index % 12) + 1

// Get AM/PM from index (0â€“23)
export const getAMPM = (index) => (index < 12 ? "AM" : "PM")

// Convert 12-hour to 24-hour format
export const convertToActualHour = (displayHour, isAM) => {
  if (isAM) {
    return displayHour === 12 ? 0 : displayHour
  } else {
    return displayHour === 12 ? 12 : displayHour + 12
  }
}

// Check if a preset is currently selected
export const isPresetSelected = (preset, selectedStartTime, selectedEndTime) => {
  return (
    selectedStartTime.hour === preset.startTime.hour &&
    selectedStartTime.minute === preset.startTime.minute &&
    selectedEndTime.hour === preset.endTime.hour &&
    selectedEndTime.minute === preset.endTime.minute
  )
}