import React, { useState, useRef, useEffect } from "react"
import { View, Text, TouchableOpacity, FlatList, Dimensions, Animated, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { facilityGridStyles } from "./styles/FacilityGridStyles"
import ReservationService from "../../../services/ReservationService"

const { width } = Dimensions.get("window")

export default function FacilityGrid({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const animatedValue = useRef(new Animated.Value(0)).current

  // Load facilities from database on mount
  useEffect(() => {
    loadFacilities()
  }, [])

  const loadFacilities = async () => {
    setLoading(true)
    const result = await ReservationService.getFacilities()
    if (result.success) {
      setFacilities(result.data)
    }
    setLoading(false)
  }
  
  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index
      setActiveIndex(newIndex)

      Animated.spring(animatedValue, {
        toValue: newIndex,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start()
    }
  })
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 })

  const handleReserve = (facility) => {
    // Navigate to the Reserve tab with facility pre-selection
    navigation.navigate("Reserve", {
      screen: "Selection",
      params: { 
        preSelectedFacilityId: facility.id, // Pass facility ID from database
        preSelectedFacilityName: facility.name, // Pass facility name for reference
        autoSelectFacility: true // Flag to indicate auto-selection
      }
    })
  }

  const handleCheckSchedule = (facility) => {
    // Navigate to Schedule tab with facility filter
    navigation.navigate("Schedule", { 
      facilityId: facility.id,
      facilityName: facility.name 
    })
  }

  // Map icon names from database to Ionicons
  const getIconName = (iconString) => {
    // You can customize this mapping based on your database icon values
    const iconMap = {
      '🏀': 'basketball',
      '🏢': 'business',
      'basketball': 'basketball',
      'business': 'business',
      'home': 'home',
      'fitness': 'fitness',
    }
    return iconMap[iconString] || 'home-outline'
  }

  if (loading) {
    return (
      <View style={facilityGridStyles.section}>
        <Text style={facilityGridStyles.sectionTitle}>Reserve Facility</Text>
        <View style={facilityGridStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#5a4a5a" />
          <Text style={facilityGridStyles.loadingText}>Loading facilities...</Text>
        </View>
      </View>
    )
  }

  if (facilities.length === 0) {
    return (
      <View style={facilityGridStyles.section}>
        <Text style={facilityGridStyles.sectionTitle}>Reserve Facility</Text>
        <View style={facilityGridStyles.emptyContainer}>
          <Text style={facilityGridStyles.emptyText}>No facilities available</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={facilityGridStyles.section}>
      <Text style={facilityGridStyles.sectionTitle}>Reserve Facility</Text>
      <Text style={facilityGridStyles.sectionSubtitle}>Check schedules and reserve your preferred time slot</Text>

      {/* Animated Dots */}
      <View style={facilityGridStyles.indicatorContainer}>
        {facilities.map((_, index) => {
          const inputRange = [index - 1, index, index + 1]
          const scale = animatedValue.interpolate({
            inputRange,
            outputRange: [1, 1.2, 1],
            extrapolate: 'clamp',
          })
          const opacity = animatedValue.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          })
          
          return (
            <Animated.View
              key={index}
              style={[
                facilityGridStyles.indicatorDot,
                activeIndex === index && facilityGridStyles.activeDot,
                { transform: [{ scale }], opacity }
              ]}
            />
          )
        })}
      </View>

      {/* Centered FlatList */}
      <FlatList
        data={facilities}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        snapToInterval={width}
        snapToAlignment="center"
        decelerationRate="fast"
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        renderItem={({ item }) => (
          <View style={{ width, alignItems: "center" }}>
            <View style={facilityGridStyles.facilityCard}>
              <View style={facilityGridStyles.iconWrapper}>
                <Ionicons name={getIconName(item.icon)} size={32} color="#2d1b2e" />
              </View>
              <Text style={facilityGridStyles.cardTitle}>{item.name}</Text>
              <Text style={facilityGridStyles.cardDesc}>
                ₱{item.price} {item.price_unit || 'per hour'}
              </Text>
              <View style={facilityGridStyles.statusPill}>
                <Text style={facilityGridStyles.statusText}>Available Today</Text>
              </View>

              {/* Inline Buttons */}
              <View style={facilityGridStyles.buttonContainer}>
                <TouchableOpacity
                  style={[facilityGridStyles.bookButton, facilityGridStyles.secondaryButton]}
                  onPress={() => handleCheckSchedule(item)}
                >
                  <Text style={[facilityGridStyles.bookButtonText, facilityGridStyles.secondaryButtonText]}>
                    Check Schedule
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[facilityGridStyles.bookButton, facilityGridStyles.primaryButton]}
                  onPress={() => handleReserve(item)}
                >
                  <Text style={facilityGridStyles.bookButtonText}>Reserve Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  )
}