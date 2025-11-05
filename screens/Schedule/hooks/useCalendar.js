import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import ScheduleService from "../../../services/scheduleService"

const formatDateToString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const useCalendar = (facilities, selectedDate, setSelectedDate, loadMonthlyReservationsRef) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [monthlyReservations, setMonthlyReservations] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const subscriptionRef = useRef(null)

  // Compute calendar dates with memoization
  const calendarDates = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(startDate)
      d.setDate(startDate.getDate() + i)
      return d
    })
  }, [currentMonth])

  useEffect(() => {
    if (facilities.length) {
      loadMonthlyReservations()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth, facilities.length])

  useEffect(() => {
    setupCalendarRealtimeSubscription()
    return () => {
      if (subscriptionRef.current) {
        ScheduleService.unsubscribeFromReservations(subscriptionRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth])

  // expose load function via ref for other hooks
  useEffect(() => {
    if (loadMonthlyReservationsRef) {
      loadMonthlyReservationsRef.current = loadMonthlyReservations
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMonthlyReservationsRef, currentMonth])

  const setupCalendarRealtimeSubscription = useCallback(() => {
    if (subscriptionRef.current) {
      ScheduleService.unsubscribeFromReservations(subscriptionRef.current)
    }

    subscriptionRef.current = ScheduleService.subscribeToReservations((payload) => {
      // lightweight check: only reload when change affects visible month
      const changeDate = payload.new?.reservation_date || payload.old?.reservation_date
      if (changeDate) {
        const changeMonth = new Date(changeDate + 'T00:00:00')
        const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
        const currentMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
        if (changeMonth >= currentMonthStart && changeMonth <= currentMonthEnd) {
          // small delay to batch rapid updates
          setTimeout(() => loadMonthlyReservations(), 100)
        }
      } else {
        setTimeout(() => loadMonthlyReservations(), 150)
      }
    })
  }, [currentMonth])

  const loadMonthlyReservations = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()
      const firstDay = formatDateToString(new Date(year, month, 1))
      const lastDay = formatDateToString(new Date(year, month + 1, 0))

      const result = await ScheduleService.getReservationsGroupedByDate(firstDay, lastDay)
      if (result.success) {
        setMonthlyReservations(result.data)
      } else {
        console.error('Error loading monthly reservations:', result.error)
        setMonthlyReservations({})
      }
    } catch (error) {
      console.error('Unexpected error loading monthly reservations:', error)
      setMonthlyReservations({})
    } finally {
      setIsLoading(false)
    }
  }, [currentMonth, isLoading])

  // Stable handlers (useCallback to prevent re-creation)
  const handleMonthChange = useCallback((direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      newMonth.setMonth(newMonth.getMonth() + (direction === "prev" ? -1 : 1))
      return newMonth
    })
  }, [])

  const isCurrentMonth = useCallback((date) => date.getMonth() === currentMonth.getMonth(), [currentMonth])
  const isSelectedDate = useCallback((date) => formatDateToString(date) === selectedDate, [selectedDate])

  const hasReservations = useCallback((date) => {
    if (!date) return false
    const dateStr = formatDateToString(date)
    return (monthlyReservations[dateStr] && monthlyReservations[dateStr].length > 0)
  }, [monthlyReservations])

  // memoized getter - cheap calculations kept inside
  const getReservationsByFacility = useCallback((date) => {
    if (!date) return { coveredCourt: false, multiPurposeHall: false, other: false, hasOngoing: false }
    
    const dateStr = formatDateToString(date)
    const dayReservations = monthlyReservations[dateStr] || []
    
    const facilityTypes = {
      coveredCourt: false,
      multiPurposeHall: false,
      other: false,
      hasOngoing: false
    }

    const today = ScheduleService.getTodayString()
    const currentTime = ScheduleService.getCurrentTime()

    for (const reservation of dayReservations) {
      if (!reservation?.facilityName) continue
      
      if (dateStr === today) {
        const isOngoing = reservation.startTime <= currentTime && reservation.endTime > currentTime
        if (isOngoing) facilityTypes.hasOngoing = true
      }
      
      const name = reservation.facilityName.toLowerCase()
      if (name.includes('covered court')) facilityTypes.coveredCourt = true
      else if (name.includes('multi') || name.includes('purpose') || name.includes('hall')) facilityTypes.multiPurposeHall = true
      else facilityTypes.other = true
    }

    return facilityTypes
  }, [monthlyReservations])

  const handleDateSelect = useCallback((date) => {
    const dateStr = formatDateToString(date)
    if (!isCurrentMonth(date)) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1))
    }
    setSelectedDate(dateStr)
  }, [isCurrentMonth, setSelectedDate])

  return {
    calendarDates,
    currentMonth,
    monthlyReservations,
    handleMonthChange,
    handleDateSelect,
    isCurrentMonth,
    isSelectedDate,
    hasReservations,
    getReservationsByFacility,
    isLoading
  }
}
