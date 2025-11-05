import { useEffect, useRef, useState, useCallback } from "react"
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native"
import { datePickerStyles } from "../styles/DatePickerStyles"
import ScheduleService from "../../../../services/scheduleService"

export default function DatePicker({
  selectedDate,
  dateSelected,
  showDatePicker,
  selectedMonth,
  selectedYear,
  onShowPicker,
  onDateSelect,
  onMonthChange,
  selectedFacility,
}) {
  const [monthlyReservations, setMonthlyReservations] = useState({})
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const subscriptionRef = useRef(null)

  const generateCalendar = (month, year) => {
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const calendar = []
    const today = new Date()

    for (let week = 0; week < 6; week++) {
      const weekDays = []
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + week * 7 + day)

        const isCurrentMonth = currentDate.getMonth() === month
        const isPastDate = currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())

        const currentDateString = currentDate.getFullYear() + '-' +
          String(currentDate.getMonth() + 1).padStart(2, '0') + '-' +
          String(currentDate.getDate()).padStart(2, '0')

        weekDays.push({
          date: currentDate.getDate(),
          fullDate: currentDate,
          dateString: currentDateString,
          isCurrentMonth,
          isPastDate,
          isSelected: selectedDate === currentDateString,
        })
      }
      calendar.push(weekDays)
    }
    return calendar
  }

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ]
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handleMonthNavigation = (direction) => {
    if (direction === "prev") {
      if (selectedMonth === 0) onMonthChange(11, selectedYear - 1)
      else onMonthChange(selectedMonth - 1, selectedYear)
    } else {
      if (selectedMonth === 11) onMonthChange(0, selectedYear + 1)
      else onMonthChange(selectedMonth + 1, selectedYear)
    }
  }

  const normalizeTime = (time) => {
    if (!time) return time
    return time.length > 5 ? time.substring(0, 5) : time
  }

  const formatTime = (time24) => {
    const [hours, minutes] = (time24 || "00:00").split(':')
    const hour = parseInt(hours || "0", 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const facilityIdForQuery = (() => {
    if (!selectedFacility) return null
    if (typeof selectedFacility === 'object') {
      return selectedFacility.id ?? null
    }
    if (typeof selectedFacility === 'number' || /^\d+$/.test(String(selectedFacility))) {
      return selectedFacility
    }
    return null
  })()

  const matchesSelectedFacility = (res) => {
    if (!selectedFacility) return false
    const resFacilityId = res.facilityId != null ? String(res.facilityId) : null
    const resFacilityName = res.facilityName ? String(res.facilityName).toLowerCase() : ''

    if (typeof selectedFacility === 'object') {
      if (selectedFacility.id != null) {
        return String(selectedFacility.id) === resFacilityId
      }
      if (selectedFacility.name) {
        return resFacilityName.includes(String(selectedFacility.name).toLowerCase())
      }
      return false
    }
    if (typeof selectedFacility === 'number' || /^\d+$/.test(String(selectedFacility))) {
      return String(selectedFacility) === resFacilityId
    }
    if (typeof selectedFacility === 'string') {
      return resFacilityName.includes(selectedFacility.toLowerCase())
    }
    return false
  }

  const getFacilityDot = (dateString) => {
    const dayReservations = monthlyReservations[dateString] || []
    return dayReservations.some(res => matchesSelectedFacility(res))
  }

  const getFacilityColor = () => {
    if (!selectedFacility) return "#f59e0b"
    const nameCandidate = (typeof selectedFacility === 'object' ? (selectedFacility.name || '') : String(selectedFacility))
    const name = (nameCandidate || '').toLowerCase()
    if (name.includes("covered court")) return "#2d1b2e"
    if (name.includes("hall") || name.includes("multi")) return "#10b981"
    return "#f59e0b"
  }

  const loadMonthlyReservations = useCallback(async () => {
    try {
      const firstDay = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`
      const lastDay = new Date(selectedYear, selectedMonth + 1, 0)
      const lastDayStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`

      const result = await ScheduleService.getReservationsGroupedByDate(firstDay, lastDayStr, facilityIdForQuery)
      if (result.success) {
        setMonthlyReservations(result.data)
      } else {
        setMonthlyReservations({})
      }
    } catch (error) {
      console.error('Error loading monthly reservations:', error)
      setMonthlyReservations({})
    }
  }, [selectedMonth, selectedYear, facilityIdForQuery])

  const loadAvailableSlots = useCallback(async () => {
    if (!selectedDate || (!selectedFacility && facilityIdForQuery == null)) {
      setAvailableSlots([])
      return
    }
    setLoadingSlots(true)
    try {
      const result = await ScheduleService.getReservationsForDateRange(
        selectedDate,
        selectedDate,
        facilityIdForQuery
      )
      if (result.success) {
        const reservations = result.data || []
        const allSlots = []
        for (let hour = 7; hour <= 22; hour++) {
          const startTime = normalizeTime(`${String(hour).padStart(2, '0')}:00`)
          const endTime = normalizeTime(`${String(hour + 1).padStart(2, '0')}:00`)
          const isReserved = reservations.some(reservation => {
            const resStartTime = normalizeTime(reservation.start_time)
            const resEndTime = normalizeTime(reservation.end_time)
            return (
              (startTime >= resStartTime && startTime < resEndTime) ||
              (endTime > resStartTime && endTime <= resEndTime) ||
              (startTime <= resStartTime && endTime >= resEndTime)
            )
          })
          allSlots.push({
            startTime,
            endTime,
            available: !isReserved,
            label: `${formatTime(startTime)} - ${formatTime(endTime)}`
          })
        }
        setAvailableSlots(allSlots)
      } else {
        setAvailableSlots([])
      }
    } catch (error) {
      console.error('Error loading available slots:', error)
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }, [selectedDate, facilityIdForQuery, selectedFacility])

  useEffect(() => {
    subscriptionRef.current = ScheduleService.subscribeToReservations(() => {
      loadMonthlyReservations()
      loadAvailableSlots()
    })
    return () => {
      if (subscriptionRef.current) {
        ScheduleService.unsubscribeFromReservations(subscriptionRef.current)
      }
    }
  }, [loadMonthlyReservations, loadAvailableSlots])

  useEffect(() => {
    loadMonthlyReservations()
  }, [loadMonthlyReservations])

  useEffect(() => {
    if (selectedDate) loadAvailableSlots()
  }, [selectedDate, selectedFacility, facilityIdForQuery])

  const shouldShowTimeSlots = selectedDate && (selectedFacility || facilityIdForQuery != null)

  return (
    <View style={datePickerStyles.section}>
      <View style={datePickerStyles.sectionHeader}>
        <Text style={datePickerStyles.sectionTitle}>Available dates</Text>
      </View>

      {/* Calendar */}
      <View style={datePickerStyles.calendarContainer}>
        <View style={datePickerStyles.pickerHeader}>
          <TouchableOpacity onPress={() => handleMonthNavigation("prev")}>
            <Text style={datePickerStyles.navButton}>←</Text>
          </TouchableOpacity>
          <Text style={datePickerStyles.monthYear}>
            {monthNames[selectedMonth]} {selectedYear}
          </Text>
          <TouchableOpacity onPress={() => handleMonthNavigation("next")}>
            <Text style={datePickerStyles.navButton}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={datePickerStyles.weekDaysHeader}>
          {weekDays.map((day) => (
            <Text key={day} style={datePickerStyles.weekDayText}>
              {day}
            </Text>
          ))}
        </View>

        <View style={datePickerStyles.calendar}>
          {generateCalendar(selectedMonth, selectedYear).map((week, weekIndex) => (
            <View key={weekIndex} style={datePickerStyles.weekRow}>
              {week.map((day, dayIndex) => {
                const hasDot = getFacilityDot(day.dateString)
                return (
                  <TouchableOpacity
                    key={dayIndex}
                    style={[
                      datePickerStyles.dayButton,
                      !day.isCurrentMonth && datePickerStyles.dayButtonDisabled,
                      day.isPastDate && datePickerStyles.dayButtonPast,
                      day.isSelected && datePickerStyles.dayButtonSelected,
                    ]}
                    onPress={() => onDateSelect(day)}
                    disabled={!day.isCurrentMonth || day.isPastDate}
                  >
                    <Text
                      style={[
                        datePickerStyles.dayText,
                        !day.isCurrentMonth && datePickerStyles.dayTextDisabled,
                        day.isPastDate && datePickerStyles.dayTextPast,
                        day.isSelected && datePickerStyles.dayTextSelected,
                      ]}
                    >
                      {day.date}
                    </Text>
                    {hasDot && !day.isSelected && day.isCurrentMonth && (
                      <View style={datePickerStyles.facilityDotsContainer}>
                        <View style={[
                          datePickerStyles.facilityDot,
                          { backgroundColor: getFacilityColor() }
                        ]} />
                      </View>
                    )}
                  </TouchableOpacity>
                )
              })}
            </View>
          ))}
        </View>
      </View>

      {/* Detailed Time Slots */}
      {shouldShowTimeSlots && (
        <View style={datePickerStyles.timeSlotsContainer}>
          <Text style={datePickerStyles.timeSlotsTitle}>Time Slots Details</Text>
          <Text style={datePickerStyles.timeSlotsSubtitle}>
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </Text>
          {loadingSlots ? (
            <View style={datePickerStyles.loadingContainer}>
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text style={datePickerStyles.loadingText}>Loading slots...</Text>
            </View>
          ) : (
            <ScrollView style={datePickerStyles.slotsScrollView} showsVerticalScrollIndicator={false}>
              {availableSlots.map((slot, index) => (
                <View
                  key={index}
                  style={[
                    datePickerStyles.slotItem,
                    slot.available ? datePickerStyles.slotAvailable : datePickerStyles.slotReserved
                  ]}
                >
                  <Text style={[
                    datePickerStyles.slotText,
                    slot.available ? datePickerStyles.slotTextAvailable : datePickerStyles.slotTextReserved
                  ]}>
                    {slot.label}
                  </Text>
                  <View style={[
                    datePickerStyles.slotStatus,
                    slot.available ? datePickerStyles.statusAvailable : datePickerStyles.statusReserved
                  ]}>
                    <Text style={[
                      datePickerStyles.statusText,
                      slot.available ? datePickerStyles.statusTextAvailable : datePickerStyles.statusTextReserved
                    ]}>
                      {slot.available ? '✓ Available' : '✕ Reserved'}
                    </Text>
                  </View>
                </View>
              ))}
              {availableSlots.filter(s => s.available).length === 0 && (
                <View style={datePickerStyles.noSlotsContainer}>
                  <Text style={datePickerStyles.noSlotsText}>No available time slots for this date</Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  )
}
