import { View, Animated, StyleSheet } from "react-native"
import { useEffect, useRef } from "react"
import styles from "../styles/ProfileStyles"

export default function SkeletonLoader() {
  const animatedValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [])

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  })

  const SkeletonBox = ({ width, height, style }) => (
    <Animated.View
      style={[
        skeletonStyles.skeleton,
        { width, height, opacity },
        style,
      ]}
    />
  )

  return (
    <>
      {/* Avatar Section Skeleton */}
      <View style={styles.avatarSection}>
        <SkeletonBox width={80} height={80} style={{ borderRadius: 40, marginBottom: 12 }} />
        <SkeletonBox width={180} height={24} style={{ borderRadius: 4, marginBottom: 8 }} />
        <SkeletonBox width={220} height={16} style={{ borderRadius: 4, marginBottom: 8 }} />
        <SkeletonBox width={140} height={24} style={{ borderRadius: 12 }} />
      </View>

      {/* Edit Button Skeleton */}
      <View style={styles.editButtonContainer}>
        <SkeletonBox width={120} height={40} style={{ borderRadius: 20 }} />
      </View>

      {/* Personal Info Section Skeleton */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <SkeletonBox width={20} height={20} style={{ borderRadius: 10, marginRight: 8 }} />
          <SkeletonBox width={160} height={18} style={{ borderRadius: 4 }} />
        </View>

        <View style={styles.card}>
          {/* Full Name Row */}
          <View style={styles.infoRow}>
            <SkeletonBox width={80} height={16} style={{ borderRadius: 4, marginBottom: 8 }} />
            <SkeletonBox width="100%" height={20} style={{ borderRadius: 4 }} />
          </View>
          <View style={styles.divider} />

          {/* Birthdate and Age Row */}
          <View style={styles.infoRow}>
            <View style={styles.twoColumnRow}>
              <View style={styles.columnLeft}>
                <SkeletonBox width={70} height={16} style={{ borderRadius: 4, marginBottom: 8 }} />
                <SkeletonBox width="90%" height={20} style={{ borderRadius: 4 }} />
              </View>
              <View style={styles.columnDivider} />
              <View style={styles.columnRight}>
                <SkeletonBox width={40} height={16} style={{ borderRadius: 4, marginBottom: 8 }} />
                <SkeletonBox width="80%" height={20} style={{ borderRadius: 4 }} />
              </View>
            </View>
          </View>
          <View style={styles.divider} />

          {/* Address Row */}
          <View style={styles.infoRow}>
            <SkeletonBox width={110} height={16} style={{ borderRadius: 4, marginBottom: 8 }} />
            <SkeletonBox width="100%" height={20} style={{ borderRadius: 4 }} />
          </View>
          <View style={styles.divider} />

          {/* Contact Number Row */}
          <View style={styles.infoRow}>
            <SkeletonBox width={120} height={16} style={{ borderRadius: 4, marginBottom: 8 }} />
            <SkeletonBox width="100%" height={20} style={{ borderRadius: 4 }} />
          </View>
        </View>
      </View>
    </>
  )
}

const skeletonStyles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e0e0e0',
  },
})