import { useEffect, useCallback, useState } from "react"
import { ScrollView, RefreshControl, Platform, View } from "react-native"
import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context"
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useFocusEffect } from "@react-navigation/native"

import Header from "./components/Header"
import FacilitySelector from "./components/FacilitySelector"
import Calendar from "./components/Calendar"
import EventsList from "./components/EventsList"

import { useScheduleData } from "./hooks/useScheduleData"
import { useCalendar } from "./hooks/useCalendar"
import { styles } from "./styles/Schedule"
import { loadingStyles } from "./styles/ScheduleLoadingStyles"

export default function Schedule({ navigation, route }) {
  const insets = useSafeAreaInsets()
  const tabBarHeight = useBottomTabBarHeight()

  const bottomPadding = Platform.OS === 'ios' 
    ? Math.max(tabBarHeight - insets.bottom, 20) 
    : tabBarHeight + 20

  const {
    selectedFacility,
    setSelectedFacility,
    selectedDate,
    setSelectedDate,
    facilities,
    refreshing,
    onRefresh,
    loadInitialData,
    loadMonthlyReservationsRef
  } = useScheduleData()

  const {
    calendarDates,
    currentMonth,
    monthlyReservations,
    handleMonthChange,
    handleDateSelect,
    isCurrentMonth,
    isSelectedDate,
    hasReservations,
    getReservationsByFacility,
    isLoading: calendarLoading
  } = useCalendar(facilities, selectedDate, setSelectedDate, loadMonthlyReservationsRef)

  // Local UI state for showing skeleton on facility/date switch
  const [localSkeleton, setLocalSkeleton] = useState(false)

  // Get the schedule data for the selected date from monthlyReservations
  const scheduleData = monthlyReservations[selectedDate] || []

  // Filter by selected facility
  const filteredScheduleData = selectedFacility 
    ? scheduleData.filter(reservation => {
        const facilityName = reservation.facilityName || ''
        return facilityName.toLowerCase().includes(selectedFacility.toLowerCase())
      })
    : scheduleData

  useFocusEffect(
    useCallback(() => {
      loadInitialData()
    }, [loadInitialData]),
  )

  // Handle facility pre-selection from navigation params
  useEffect(() => {
    if (route.params?.facilityName && facilities.length > 0) {
      setSelectedFacility(route.params.facilityName)
      // Clear the param after using it
      navigation.setParams({ facilityName: null })
    }
  }, [route.params?.facilityName, facilities, setSelectedFacility, navigation])

  useEffect(() => {
    if (route.params?.refreshNeeded) {
      const { newReservation } = route.params
      if (newReservation) {
        setSelectedFacility(newReservation.facility)
        setSelectedDate(newReservation.date)
      }
      navigation.setParams({ refreshNeeded: false, newReservation: null })
      setTimeout(() => onRefresh(), 400)
    }
  }, [route.params, setSelectedDate, setSelectedFacility, navigation, onRefresh])

  const onFacilitySelect = useCallback((facility) => {
    setLocalSkeleton(true)
    setSelectedFacility(facility)
    setTimeout(() => setLocalSkeleton(false), 300)
  }, [setSelectedFacility])

  const onCalendarDateSelect = useCallback((date) => {
    setLocalSkeleton(true)
    handleDateSelect(date)
    setTimeout(() => setLocalSkeleton(false), 300)
  }, [handleDateSelect])

  const handleRefresh = useCallback(async () => {
    await onRefresh()
    if (loadMonthlyReservationsRef.current) {
      await loadMonthlyReservationsRef.current()
    }
  }, [onRefresh, loadMonthlyReservationsRef])

  // Show loading state only on initial mount
  const isInitialLoading = !facilities.length || !currentMonth

  if (isInitialLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <ExpoStatusBar style="dark" />
        <Header loading={true} insets={insets} />
        
        {/* Loading Facility Selector */}
        <View style={loadingStyles.loadingFacilitySelector}>
          <View style={loadingStyles.loadingHelperText} />
          <View style={loadingStyles.loadingButtonsContainer}>
            {[1, 2].map((item) => (
              <View key={item} style={loadingStyles.loadingButton} />
            ))}
          </View>
        </View>
        
        {/* Loading Calendar */}
        <View style={loadingStyles.loadingCalendar}>
          <View style={loadingStyles.loadingMonthHeader}>
            <View style={loadingStyles.loadingNavButton} />
            <View style={loadingStyles.loadingMonthTitle} />
            <View style={loadingStyles.loadingNavButton} />
          </View>
          <View style={loadingStyles.loadingWeekHeader} />
          <View style={loadingStyles.loadingDatesGrid}>
            {Array.from({ length: 42 }).map((_, index) => (
              <View key={index} style={loadingStyles.loadingDateCell} />
            ))}
          </View>
          <View style={loadingStyles.loadingLegend}>
            <View style={loadingStyles.loadingLegendTitle} />
            <View style={loadingStyles.loadingLegendItems}>
              <View style={loadingStyles.loadingLegendItem} />
              <View style={loadingStyles.loadingLegendItem} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ExpoStatusBar style="dark" />

      <Header insets={insets} />

      <FacilitySelector
        facilities={facilities}
        selectedFacility={selectedFacility}
        onFacilitySelect={onFacilitySelect}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing || calendarLoading} 
            onRefresh={handleRefresh}
          />
        }
        keyboardShouldPersistTaps="handled"
      >
        <Calendar
          calendarDates={calendarDates}
          selectedDate={selectedDate}
          isCurrentMonth={isCurrentMonth}
          isSelectedDate={isSelectedDate}
          hasReservations={hasReservations}
          getReservationsByFacility={getReservationsByFacility}
          onDateSelect={onCalendarDateSelect}
          currentMonth={currentMonth}
          onMonthChange={handleMonthChange}
        />

        {/* Use filtered calendar data instead of scheduleData from useScheduleData */}
        <EventsList 
          scheduleData={filteredScheduleData}
          selectedDate={selectedDate}
          loading={localSkeleton || calendarLoading}
          skeletonCount={scheduleData.length || 1}
        />
      </ScrollView>
    </SafeAreaView>
  )
}