import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { ChevronLeft, ChevronRight } from "lucide-react-native"
import ScheduleService from "../../../services/scheduleService"
import { styles } from "../styles/EventsListStyles"
import SkeletonEventsList from "./SkeletonEventsList"

// Helper: get first name
const getFirstName = (bookedBy) => {
  if (!bookedBy || bookedBy === "Unknown User") {
    return "Unknown"
  }
  return bookedBy.split(" ")[0]
}

// Helper: normalize reservation data (handles both camelCase and snake_case)
const normalizeReservation = (reservation) => {
  return {
    id: reservation.id,
    purpose: reservation.purpose,
    bookedBy: reservation.bookedBy || reservation.booked_by,
    startTime: reservation.startTime || reservation.start_time,
    endTime: reservation.endTime || reservation.end_time,
  }
}

// Helper: status & colors
const getEventStatus = (reservation, selectedDate) => {
  const normalized = normalizeReservation(reservation)
  
  // Get today's date in YYYY-MM-DD format (local timezone)
  const today = new Date()
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  
  // Get current time in HH:MM format
  const now = new Date()
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const reservationDate = selectedDate

  if (reservationDate > todayString) {
    return { 
      status: "upcoming",
      label: "Upcoming",
      color: "#3b82f6",
      bgColor: "#eff6ff",
    }
  } else if (reservationDate === todayString) {
    const startHHMM = normalized.startTime ? normalized.startTime.substring(0, 5) : '00:00'
    const endHHMM = normalized.endTime ? normalized.endTime.substring(0, 5) : '23:59'
    
    if (startHHMM > currentTime) {
      return { 
        status: "upcoming",
        label: "Today",
        color: "#f59e0b",
        bgColor: "#fef3c7",
      }
    } else if (endHHMM > currentTime) {
      return { 
        status: "ongoing",
        label: "Live",
        color: "#10b981",
        bgColor: "#d1fae5",
      }
    } else {
      return { 
        status: "completed",
        label: "Done",
        color: "#6b7280",
        bgColor: "#f3f4f6",
      }
    }
  }
  return { 
    status: "completed",
    label: "Done",
    color: "#6b7280",
    bgColor: "#f3f4f6",
  }
}

// Unified event card renderer
const renderEventCard = (reservation, index, eventStatus) => {
  const normalized = normalizeReservation(reservation)
  
  return (
    <TouchableOpacity
      key={reservation.id || index}
      style={styles.eventItem}
      activeOpacity={0.7}
    >
      {/* Left colored stripe */}
      <View
        style={[
          styles.eventStatusIndicator,
          { backgroundColor: eventStatus.color },
        ]}
      />

      <View style={styles.eventContent}>
        {/* Header with title + badge */}
        <View style={styles.eventHeader}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.eventTitle}>
              {normalized.purpose || `Event ${index + 1}`}
            </Text>
            <Text style={styles.eventSubtitle}>
              Reserved by {getFirstName(normalized.bookedBy)}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadgeCompact,
              { backgroundColor: eventStatus.bgColor },
            ]}
          >
            <Text
              style={[
                styles.statusBadgeTextCompact,
                { color: eventStatus.color },
              ]}
            >
              {eventStatus.label}
            </Text>
          </View>
        </View>

        {/* Time row */}
        <View style={styles.eventDetails}>
          <View style={styles.timeSection}>
            <Text style={{ fontSize: 12, color: eventStatus.color, marginRight: 6 }}>
              ◉
            </Text>
            <Text style={styles.timeText}>
              {normalized.startTime && normalized.endTime
                ? `${ScheduleService.formatTimeForDisplay(normalized.startTime)} - ${ScheduleService.formatTimeForDisplay(normalized.endTime)}`
                : "TBD"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default function EventsList({ scheduleData, loading, skeletonCount = 1, selectedDate }) {
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 5

  // Reset to page 1 when scheduleData or selectedDate changes
  useEffect(() => {
    setCurrentPage(1)
  }, [scheduleData, selectedDate])

  // Calculate pagination
  const totalPages = Math.ceil(scheduleData.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentEvents = scheduleData.slice(startIndex, endIndex)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <View style={styles.eventsSection}>
      {/* Header */}
      <View style={styles.eventsHeaderContainer}>
        <Text style={styles.eventsHeader}>Scheduled Events</Text>
        {scheduleData.length > 0 && !loading && (
          <Text style={styles.eventCount}>
            {scheduleData.length} {scheduleData.length === 1 ? 'Event' : 'Events'}
          </Text>
        )}
      </View>

      {/* Handle loading / empty / data states */}
      {loading ? (
        <SkeletonEventsList count={skeletonCount} />
      ) : scheduleData.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No events scheduled for this day
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.eventsList}>
            {currentEvents.map((reservation, index) => {
              const eventStatus = getEventStatus(reservation, selectedDate)
              return renderEventCard(reservation, startIndex + index, eventStatus)
            })}
          </View>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage === 1 && styles.paginationButtonDisabled
                ]}
                onPress={handlePrevPage}
                disabled={currentPage === 1}
                activeOpacity={0.7}
              >
                <ChevronLeft 
                  size={20} 
                  color={currentPage === 1 ? "#94a3b8" : "white"} 
                  strokeWidth={2.5}
                />
              </TouchableOpacity>

              <View style={styles.paginationInfo}>
                <Text style={styles.paginationText}>
                  Page {currentPage} of {totalPages}
                </Text>
                <Text style={styles.paginationSubtext}>
                  Showing {startIndex + 1}-{Math.min(endIndex, scheduleData.length)} of {scheduleData.length}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage === totalPages && styles.paginationButtonDisabled
                ]}
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
                activeOpacity={0.7}
              >
                <ChevronRight 
                  size={20} 
                  color={currentPage === totalPages ? "#94a3b8" : "white"} 
                  strokeWidth={2.5}
                />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  )
}