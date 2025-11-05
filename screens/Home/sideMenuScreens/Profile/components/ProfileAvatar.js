import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as Clipboard from 'expo-clipboard'
import { useState, useRef } from "react"
import styles from "../styles/ProfileStyles"

export default function ProfileAvatar({ userData, showAccountId, onToggleAccountId }) {
  const [toastMessage, setToastMessage] = useState("")
  const toastOpacity = useRef(new Animated.Value(0)).current
  const toastTranslateY = useRef(new Animated.Value(20)).current
  
  const showToast = (message) => {
    setToastMessage(message)
    
    // Animate in
    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(toastTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
    
    // Animate out after 2 seconds
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(toastTranslateY, {
          toValue: 20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToastMessage("")
      })
    }, 2000)
  }
  
  const handleCopyToClipboard = async () => {
    const textToCopy = showAccountId ? userData.accountId : userData.email
    const label = showAccountId ? "Account ID" : "Email"
    
    try {
      await Clipboard.setStringAsync(textToCopy)
      showToast(`${label} copied to clipboard`)
    } catch (error) {
      showToast("Failed to copy")
    }
  }

  // Get status display configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case 'verified':
        return {
          icon: 'checkmark-circle',
          text: 'Verified Resident',
          dotColor: '#4caf50',
          textColor: '#2e7d32',
          bgColor: '#e8f5e9'
        }
      case 'unverified':
        return {
          icon: 'time-outline',
          text: 'Pending Verification',
          dotColor: '#ff9800',
          textColor: '#e65100',
          bgColor: '#fff3e0'
        }
      case 'rejected':
        return {
          icon: 'close-circle',
          text: 'Verification Rejected',
          dotColor: '#f44336',
          textColor: '#c62828',
          bgColor: '#ffebee'
        }
      default:
        return {
          icon: 'help-circle-outline',
          text: 'Status Unknown',
          dotColor: '#9e9e9e',
          textColor: '#616161',
          bgColor: '#f5f5f5'
        }
    }
  }

  const statusConfig = getStatusConfig(userData.status)

  return (
    <>
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color="#2d1b2e" />
        </View>
        <Text style={styles.userName}>
          {userData.firstName} {userData.middleInitial}. {userData.lastName}
        </Text>
        
        <TouchableOpacity 
          style={styles.emailContainer}
          onPress={onToggleAccountId}
          onLongPress={handleCopyToClipboard}
          activeOpacity={0.7}
          delayLongPress={500}
        >
          <Ionicons 
            name={showAccountId ? "person-outline" : "mail-outline"} 
            size={14} 
            color="#666" 
          />
          <Text style={styles.emailText} numberOfLines={1}>
            {showAccountId ? `Account ID: ${userData.accountId}` : userData.email}
          </Text>
        </TouchableOpacity>

        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
          <View style={[styles.statusDot, { backgroundColor: statusConfig.dotColor }]} />
          <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
            {statusConfig.text}
          </Text>
        </View>
      </View>
      
      {/* Toast Notification */}
      {toastMessage !== "" && (
        <Animated.View 
          style={[
            toastStyles.toast,
            {
              opacity: toastOpacity,
              transform: [{ translateY: toastTranslateY }]
            }
          ]}
        >
          <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
          <Text style={toastStyles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}
    </>
  )
}

const toastStyles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: -15,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d1b2e',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    gap: 8,
  },
  toastText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
})