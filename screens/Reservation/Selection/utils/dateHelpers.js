/**
 * Date utility functions for the Selection component
 */

export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/**
 * Generate calendar grid for a given month and year
 * @param {number} month - Month (0-11)
 * @param {number} year - Full year
 * @param {string} selectedDate - Currently selected date in ISO format
 * @returns {Array} Calendar grid with week arrays
 */
export const generateCalendar = (month, year, selectedDate = null) => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const calendar = []
  const today = new Date()
  
  for (let week = 0; week < 6; week++) {
    const weekDays = []
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + (week * 7) + day)
      
      const isCurrentMonth = currentDate.getMonth() === month
      const isPastDate = currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())
      
      weekDays.push({
        date: currentDate.getDate(),
        fullDate: currentDate,
        isCurrentMonth,
        isPastDate,
        isSelected: selectedDate === currentDate.toISOString().split('T')[0]
      })
    }
    calendar.push(weekDays)
  }
  return calendar
}

/**
 * Format time object to 12-hour format string
 * @param {Object} time - Time object with hour and minute properties
 * @returns {string} Formatted time string (e.g., "02:30 PM")
 */
export const formatTime12Hour = (time) => {
  const hour12 = time.hour === 0 ? 12 : time.hour > 12 ? time.hour - 12 : time.hour
  const ampm = time.hour >= 12 ? 'PM' : 'AM'
  return `${hour12.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')} ${ampm}`
}

/**
 * Format time object to 24-hour format string
 * @param {Object} time - Time object with hour and minute properties
 * @returns {string} Formatted time string (e.g., "14:30")
 */
export const formatTime24Hour = (time) => {
  return `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`
}

/**
 * Check if the given times match any preset combination
 * @param {Object} startTime - Start time object
 * @param {Object} endTime - End time object
 * @returns {boolean} True if times match a preset
 */
export const isPresetTimeRange = (startTime, endTime) => {
  // Check if times match any 1-hour preset from 7 AM to 10 PM
  if (!startTime || !endTime) return false
  
  const startHour = startTime.hour
  const endHour = endTime.hour
  const startMinute = startTime.minute || 0
  const endMinute = endTime.minute || 0
  
  // Preset patterns: 7-8, 8-9, 9-10, ..., 21-22
  return (
    startMinute === 0 && 
    endMinute === 0 && 
    startHour >= 7 && 
    startHour <= 21 && 
    endHour === startHour + 1
  )
}

/**
 * Validate if end time is after start time
 * CRITICAL FIX: Skip validation for preset selections
 * @param {Object} startTime - Start time object
 * @param {Object} endTime - End time object
 * @param {boolean} skipForPresets - Whether to skip validation for preset times
 * @returns {boolean} True if end time is after start time
 */
export const isValidTimeRange = (startTime, endTime, skipForPresets = true) => {
  if (!startTime || !endTime) return false
  
  // CRITICAL: Check if this is a preset selection and skip validation if requested
  if (skipForPresets && (global.isPresetSelection || isPresetTimeRange(startTime, endTime))) {
    return true // Always valid for presets
  }
  
  const startMinutes = startTime.hour * 60 + startTime.minute
  const endMinutes = endTime.hour * 60 + endTime.minute
  return endMinutes > startMinutes
}

/**
 * Enhanced validation that's preset-aware
 * @param {Object} startTime - Start time object
 * @param {Object} endTime - End time object
 * @returns {Object} Validation result with isValid boolean and reason string
 */
export const validateTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return { isValid: false, reason: "Both start and end times are required" }
  }
  
  // Always allow preset time ranges
  if (isPresetTimeRange(startTime, endTime)) {
    return { isValid: true, reason: "Valid preset time range" }
  }
  
  // For custom times, do normal validation
  const startMinutes = startTime.hour * 60 + startTime.minute
  const endMinutes = endTime.hour * 60 + endTime.minute
  
  if (endMinutes <= startMinutes) {
    return { isValid: false, reason: "End time must be after start time" }
  }
  
  return { isValid: true, reason: "Valid custom time range" }
}

/**
 * Check if time is within facility operating hours
 * @param {Object} startTime - Start time object
 * @param {Object} endTime - End time object
 * @param {number} openHour - Facility opening hour (default: 7)
 * @param {number} closeHour - Facility closing hour (default: 23)
 * @returns {boolean} True if time is within operating hours
 */
export const isWithinOperatingHours = (startTime, endTime, openHour = 7, closeHour = 24) => {
  return startTime.hour >= openHour && 
         (endTime.hour < closeHour || (endTime.hour === closeHour && endTime.minute === 0))
}