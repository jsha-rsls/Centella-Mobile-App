import { useState, useEffect, useRef, useCallback } from "react"
import { Alert } from "react-native"
import ScheduleService from "../../../services/scheduleService"

const getTodayString = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getCurrentTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export const useScheduleData = () => {
  const [selectedFacility, setSelectedFacility] = useState("Covered Court")
  const [selectedDate, setSelectedDate] = useState(getTodayString())
  const [facilities, setFacilities] = useState([])
  const [scheduleData, setScheduleData] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const subscriptionRef = useRef(null)
  const intervalRef = useRef(null)
  const loadScheduleDataRef = useRef(null)
  const loadMonthlyReservationsRef = useRef(null)

  const isLoadingSchedule = useRef(false)
  const debounceTimer = useRef(null)

  // in-memory cache
  const cacheRef = useRef({}) // { "facilityId|date": [reservations] }

  const [skeletonLoading, setSkeletonLoading] = useState(false)

  // smart debounce: instant for single taps, debounce only for rapid taps
  const lastChangeTimeRef = useRef(0)

  useEffect(() => {
    if (facilities.length === 0) return

    const now = Date.now()
    const timeSinceLast = now - lastChangeTimeRef.current
    lastChangeTimeRef.current = now

    setSkeletonLoading(true) // show skeleton immediately

    if (timeSinceLast < 200) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        loadScheduleData().finally(() => setSkeletonLoading(false))
      }, 150)
    } else {
      loadScheduleData().finally(() => setSkeletonLoading(false))
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFacility, selectedDate, facilities.length])

  const setupRealtimeSubscription = useCallback(() => {
    if (subscriptionRef.current) {
      ScheduleService.unsubscribeFromReservations(subscriptionRef.current)
      subscriptionRef.current = null
    }

    subscriptionRef.current = ScheduleService.subscribeToReservations(() => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        clearCache() // clear cache on realtime update
        loadScheduleData()
        if (loadMonthlyReservationsRef.current) {
          loadMonthlyReservationsRef.current()
        }
      }, 120)
    })
  }, [])

  const updatePastReservations = useCallback(async () => {
    try {
      await ScheduleService.updatePastReservationsStatus()
      clearCache() // clear cache on background update
      await loadScheduleData()
      if (loadMonthlyReservationsRef.current) {
        await loadMonthlyReservationsRef.current()
      }
    } catch (error) {
      console.error('Error updating past reservations:', error)
    }
  }, [])

  const loadInitialData = useCallback(async () => {
    setLoading(true)
    await loadFacilities()
    await updatePastReservations()
    setLoading(false)
  }, [updatePastReservations])

  const loadFacilities = useCallback(async () => {
    const result = await ScheduleService.getAllFacilities()
    if (result.success) {
      setFacilities(result.data)
      if (result.data.length > 0 && !result.data.find(f => f.name === selectedFacility)) {
        setSelectedFacility(result.data[0].name)
      }
    } else {
      Alert.alert("Error", "Failed to load facilities: " + result.error)
    }
  }, [selectedFacility])

  const loadScheduleData = useCallback(async () => {
    if (isLoadingSchedule.current) return
    if (!selectedFacility || facilities.length === 0) return

    const facility = facilities.find(f => f.name === selectedFacility)
    if (!facility) return

    const cacheKey = `${facility.id}|${selectedDate}`

    // check cache first
    if (cacheRef.current[cacheKey]) {
      // Filter cached data to exclude past events
      const todayString = getTodayString()
      const currentTime = getCurrentTime()
      
      const filteredCachedData = cacheRef.current[cacheKey].filter(reservation => {
        const reservationDate = reservation.reservation_date || reservation.reservationDate
        
        // If reservation date is in the past, exclude it
        if (reservationDate < todayString) {
          return false
        }
        
        // If reservation date is today, check if end time has passed
        if (reservationDate === todayString) {
          const endTime = reservation.end_time || reservation.endTime
          if (endTime && endTime < currentTime) {
            return false
          }
        }
        
        // Exclude completed events
        if (reservation.status === 'completed') {
          return false
        }
        
        return true
      })
      
      setScheduleData(filteredCachedData)
      return
    }

    isLoadingSchedule.current = true
    try {
      const result = await ScheduleService.getReservationsForDateRange(selectedDate, selectedDate, facility.id)
      if (result.success) {
        // Additional client-side filtering to ensure no past events slip through
        const todayString = getTodayString()
        const currentTime = getCurrentTime()
        
        const filteredData = result.data.filter(reservation => {
          const reservationDate = reservation.reservation_date
          
          // If reservation date is in the past, exclude it
          if (reservationDate < todayString) {
            return false
          }
          
          // If reservation date is today, check if end time has passed
          if (reservationDate === todayString) {
            const endTime = reservation.end_time
            if (endTime && endTime < currentTime) {
              return false
            }
          }
          
          // Exclude completed events
          if (reservation.status === 'completed') {
            return false
          }
          
          return true
        })
        
        setScheduleData(filteredData)
        cacheRef.current[cacheKey] = filteredData // store filtered data in cache
      } else {
        Alert.alert("Error", "Failed to load schedule: " + result.error)
        setScheduleData([])
      }
    } catch (err) {
      console.error('loadScheduleData error:', err)
      setScheduleData([])
    } finally {
      isLoadingSchedule.current = false
    }
  }, [selectedFacility, selectedDate, facilities])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    clearCache() // force re-fetch when user pulls down
    await updatePastReservations()
    setRefreshing(false)
  }, [updatePastReservations])

  // helper to clear cache (used on refresh or realtime events)
  const clearCache = useCallback(() => {
    cacheRef.current = {}
  }, [])

  loadScheduleDataRef.current = loadScheduleData
  loadMonthlyReservationsRef.current = loadMonthlyReservationsRef.current || null

  return {
    selectedFacility,
    setSelectedFacility,
    selectedDate,
    setSelectedDate,
    facilities,
    scheduleData,
    loading,
    refreshing,
    skeletonLoading,
    onRefresh,
    loadInitialData,
    loadScheduleData,
    loadScheduleDataRef,
    loadMonthlyReservationsRef,
    clearCache // expose
  }
}