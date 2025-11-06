import React, { useState, useRef, useEffect } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { styles } from "../styles/calendarStyles"

// Utility function to get today's date in local timezone
const getTodayString = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Utility function to format date to YYYY-MM-DD in local timezone
const formatDateToString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Spam protection constants – tweak as needed
 */
const CLICK_WINDOW_MS = 1200      // sliding window to measure clicks (ms)
const CLICK_THRESHOLD = 5         // number of clicks inside window to trigger lock
const LOCK_DURATION_MS = 5000     // how long to lock after spam detected (ms)

const FacilityLegend = () => (
  <View style={styles.legendContainer}>
    <Text style={styles.legendTitle}>Facility Legend:</Text>
    <View style={styles.legendRow}>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, styles.coveredCourtDot]} />
        <Text style={styles.legendText}>Covered Court</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, styles.multiPurposeHallDot]} />
        <Text style={styles.legendText}>Multi Purpose Hall</Text>
      </View>
    </View>
  </View>
)

export default function Calendar({
  calendarDates,
  selectedDate,
  isCurrentMonth,
  isSelectedDate,
  hasReservations,
  getReservationsByFacility,
  onDateSelect,
  currentMonth,
  onMonthChange
}) {
  const [calendarLocked, setCalendarLocked] = useState(false)
  const [lockCountdown, setLockCountdown] = useState(0)
  const [warningMessage, setWarningMessage] = useState("")
  const lockTimeoutRef = useRef(null)
  const lockIntervalRef = useRef(null)
  const clickTimestampsRef = useRef([])

  useEffect(() => {
    return () => {
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current)
      if (lockIntervalRef.current) clearInterval(lockIntervalRef.current)
    }
  }, [])

  const isPastDate = (date) => {
    if (!date) return false
    const today = getTodayString()
    const dateStr = formatDateToString(date)
    return dateStr < today
  }

  const isPastMonth = () => {
    if (!currentMonth) return false
    const today = new Date()
    const currentYear = currentMonth.getFullYear()
    const currentMonthNum = currentMonth.getMonth()
    const todayYear = today.getFullYear()
    const todayMonth = today.getMonth()
    
    // Check if current displayed month is the same as or before today's month
    return currentYear < todayYear || 
           (currentYear === todayYear && currentMonthNum <= todayMonth)
  }

  const handleDatePress = (date) => {
    const now = Date.now()
    clickTimestampsRef.current = clickTimestampsRef.current.filter(
      ts => now - ts <= CLICK_WINDOW_MS
    )
    clickTimestampsRef.current.push(now)

    if (calendarLocked) return // ignore presses while locked

    onDateSelect(date)

    if (clickTimestampsRef.current.length >= CLICK_THRESHOLD) {
      setCalendarLocked(true)
      setLockCountdown(LOCK_DURATION_MS / 1000)

      // start countdown interval
      lockIntervalRef.current = setInterval(() => {
        setLockCountdown(prev => {
          if (prev <= 1) {
            clearInterval(lockIntervalRef.current)
            lockIntervalRef.current = null
            return 0
          }
          return prev - 1
        })
      }, 1000)

      // auto-unlock after timeout
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current)
      lockTimeoutRef.current = setTimeout(() => {
        setCalendarLocked(false)
        setWarningMessage("")
        clickTimestampsRef.current = []
        lockTimeoutRef.current = null
      }, LOCK_DURATION_MS)
    }
  }

  useEffect(() => {
    if (calendarLocked && lockCountdown > 0) {
      setWarningMessage(
        `Whoa – slow down! Too many selections in a short time. Please wait ${lockCountdown} second${lockCountdown > 1 ? "s" : ""}.`
      )
    } else if (!calendarLocked) {
      setWarningMessage("")
    }
  }, [calendarLocked, lockCountdown])

  return (
    <View style={styles.calendarContainer}>
      {/* Month Navigation */}
      <View style={styles.monthHeader}>
        <TouchableOpacity 
          style={[
            styles.monthNavButton,
            isPastMonth() && { opacity: 0.3 }
          ]} 
          onPress={() => onMonthChange("prev")}
          disabled={isPastMonth()}
        >
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        
        <Text style={styles.monthTitle}>
          {currentMonth ? currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Loading..."}
        </Text>
        
        <TouchableOpacity 
          style={styles.monthNavButton} 
          onPress={() => onMonthChange("next")}
        >
          <Ionicons name="chevron-forward" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Week Days Header */}
      <View style={styles.weekDaysHeader}>
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day, index) => (
          <View key={day} style={styles.weekDayContainer}>
            <Text style={styles.weekDayLabel}>{day}</Text>
            {index < 6 && <Text style={styles.weekDayDivider}>|</Text>}
          </View>
        ))}
      </View>

      <View style={styles.calendarDatesGrid}>
        {calendarDates.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dateCell,
              !isCurrentMonth(date) && styles.dateCellOtherMonth,
              isSelectedDate(date) && styles.dateCellSelected,
              isPastDate(date) && styles.dateCellPast,
              calendarLocked && { opacity: 0.45 } // visually indicate locked state
            ]}
            onPress={() => handleDatePress(date)}
            disabled={isPastDate(date) || calendarLocked}
          >
            <Text
              style={[
                styles.dateCellText,
                !isCurrentMonth(date) && styles.dateCellTextOther,
                isSelectedDate(date) && styles.dateCellTextSelected,
                isPastDate(date) && styles.dateCellTextPast,
              ]}
            >
              {date.getDate()}
            </Text>

            {!isSelectedDate(date) && (() => {
              const facilities = getReservationsByFacility(date)
              const facilitiesWithReservations = [
                facilities.coveredCourt && 'coveredCourt',
                facilities.multiPurposeHall && 'multiPurposeHall',
                facilities.other && 'other'
              ].filter(Boolean)

              return facilitiesWithReservations.length > 0 && (
                <View style={styles.facilityDotsContainer}>
                  {facilitiesWithReservations.map((facility) => (
                    <View
                      key={facility}
                      style={[
                        styles.facilityDot,
                        facility === 'coveredCourt' && styles.coveredCourtDot,
                        facility === 'multiPurposeHall' && styles.multiPurposeHallDot,
                        facility === 'other' && styles.otherFacilityDot,
                        facilitiesWithReservations.length > 1 && { marginHorizontal: 1 }
                      ]}
                    />
                  ))}
                </View>
              )
            })()}
          </TouchableOpacity>
        ))}
      </View>

      <FacilityLegend />

      {/* centered warning message below legend */}
      {warningMessage !== "" && (
        <View style={{ marginTop: 10, alignItems: "center" }}>
          <Text style={{ fontSize: 12, color: "#ef4444", fontWeight: "600", textAlign: "center", maxWidth: "90%" }}>
            {warningMessage}
          </Text>
        </View>
      )}
    </View>
  )
}