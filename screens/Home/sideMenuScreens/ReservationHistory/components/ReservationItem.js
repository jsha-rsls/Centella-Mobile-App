// screens/Home/sideMenuScreens/ReservationHistory/components/ReservationItem.js
import { View, Text, TouchableOpacity, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useRef } from "react"
import { getStatusColor, getStatusBg, getStatusIcon, getFacilityIcon } from "../utils/reservationHelpers"
import styles from "../styles"

export default function ReservationItem({ reservation, isLast, onCancelPress, isCurrentTab }) {
  const [showCancel, setShowCancel] = useState(false)
  const slideAnimation = useRef(new Animated.Value(0)).current
  const lastTap = useRef(null)

  const handleDoubleTap = () => {
    if (!isCurrentTab || showCancel) return
    
    const now = Date.now()
    const DOUBLE_TAP_DELAY = 300

    if (lastTap.current && (now - lastTap.current) < DOUBLE_TAP_DELAY) {
      // Double tap detected
      Animated.spring(slideAnimation, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start()
      
      setShowCancel(true)
    } else {
      lastTap.current = now
    }
  }

  const handleCancel = () => {
    // Call the parent's cancel handler immediately
    onCancelPress(reservation)
    
    // Then animate back
    setShowCancel(false)
    Animated.spring(slideAnimation, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }

  const handleOutsidePress = () => {
    if (showCancel) {
      Animated.spring(slideAnimation, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start(() => setShowCancel(false))
    }
  }

  const slideLeft = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  })

  const cancelOpacity = slideAnimation.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.5, 1],
  })

  return (
    <View style={[styles.reservationItemContainer, isLast && styles.reservationItemLast]}>
      <View style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Cancel Action Button (Hidden Behind) */}
        {isCurrentTab && (
          <Animated.View 
            style={[
              styles.hiddenCancelButton,
              { 
                opacity: cancelOpacity,
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: 80,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.cancelButtonAction}
              onPress={handleCancel}
              activeOpacity={0.8}
              disabled={!showCancel}
            >
              <Ionicons name="close-circle" size={20} color="#fff" />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Main Reservation Item */}
        <Animated.View 
          style={[
            { 
              transform: [{ translateX: slideLeft }],
              zIndex: 2
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.reservationItemWrapper}
            onPress={showCancel ? handleOutsidePress : handleDoubleTap}
            activeOpacity={0.7}
          >
            <View style={styles.reservationItem}>
              <View style={styles.itemHeader}>
                <View style={styles.itemHeaderLeft}>
                  <View style={styles.facilityIconContainer}>
                    <Ionicons name={getFacilityIcon(reservation.facility)} size={18} color="#2d1b2e" />
                  </View>
                  <Text style={styles.facilityName} numberOfLines={1}>
                    {reservation.facility}
                  </Text>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: getStatusBg(reservation.status) }]}>
                  <Ionicons name={getStatusIcon(reservation.status)} size={10} color={getStatusColor(reservation.status)} />
                  <Text style={[styles.statusText, { color: getStatusColor(reservation.status) }]}>
                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.itemFooter}>
                <View style={styles.itemDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={12} color="#666" />
                    <Text style={styles.detailText}>{reservation.date}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={12} color="#666" />
                    <Text style={styles.detailText}>{reservation.time}</Text>
                  </View>
                </View>

                <Text style={styles.amountText}>₱{reservation.totalAmount.toFixed(2)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  )
}