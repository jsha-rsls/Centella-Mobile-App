import React, { useRef, useEffect } from "react"
import { View, Animated, StyleSheet, Text } from "react-native"
import { styles as eventStyles } from "../styles/EventsListStyles"

export default function SkeletonEventsList({ count = 1 }) {
  const shimmer = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1200, useNativeDriver: false }),
        Animated.timing(shimmer, { toValue: 0, duration: 1200, useNativeDriver: false }),
      ])
    ).start()
  }, [shimmer])

  const backgroundColor = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: ["#e5e7eb", "#f3f4f6"],
  })

  const items = Array.from({ length: count })

  return (
    <View style={eventStyles.eventsList}>
      {items.map((_, index) => (
        <View key={index} style={eventStyles.eventItem}>
          {/* Status bar */}
          <Animated.View style={[eventStyles.eventStatusIndicator, { backgroundColor }]} />

          <View style={eventStyles.eventContent}>
            {/* Header */}
            <View style={eventStyles.eventHeader}>
              {/* Icon + title/subtitle skeleton */}
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 12 }}>
                <Animated.View style={[skeletonStyles.circle, { backgroundColor, marginRight: 12 }]} />
                <View style={{ flex: 1 }}>
                  <Animated.View style={[skeletonStyles.line, { width: "70%", height: 18, backgroundColor }]} />
                  <Animated.View style={[skeletonStyles.line, { width: "50%", height: 14, marginTop: 6, backgroundColor }]} />
                </View>
              </View>

              {/* Badge skeleton */}
              <Animated.View style={[skeletonStyles.badge, { backgroundColor }]} />
            </View>

            {/* Time row skeleton */}
            <View style={eventStyles.eventDetails}>
              <Animated.View style={[skeletonStyles.line, { width: 120, height: 14, backgroundColor }]} />
            </View>
          </View>
        </View>
      ))}
    </View>
  )
}

const skeletonStyles = StyleSheet.create({
  line: { borderRadius: 6 },
  circle: { width: 36, height: 36, borderRadius: 18 },
  badge: { width: 60, height: 20, borderRadius: 10 },
})
