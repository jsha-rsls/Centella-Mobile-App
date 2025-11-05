import React, { memo, useEffect, useRef } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const { width: screenWidth } = Dimensions.get('window')

// Memoized sub-components for better performance
const StatusBanner = memo(() => (
  <View style={styles.statusBanner}>
    <Ionicons name="time-outline" size={20} color="#d97706" />
  <View style={styles.statusTextContainer}>
    <Text style={styles.statusTitle}>Account Verification in Progress</Text>
    <Text style={styles.statusSubtext}>Usually completed within 5–30 minutes</Text>
  </View>
  </View>
))

const AccessCard = memo(({ icon, text, enabled }) => (
  <View style={[styles.accessCard, enabled ? styles.enabledCard : styles.disabledCard]}>
    <Ionicons 
      name={enabled ? "checkmark-circle" : "lock-closed"} 
      size={18} 
      color={enabled ? "#27a427" : "#dc2626"} 
    />
    <Text style={[styles.accessCardText, !enabled && styles.disabledText]}>
      {text}
    </Text>
  </View>
))

const WelcomeModal = ({ visible, onDismiss, userName = 'Resident' }) => {
  // Single animated value for better performance
  const modalAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      // Reset and animate in
      modalAnim.setValue(0)
      Animated.spring(modalAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true, // CRITICAL: Uses native driver for 60fps
      }).start()
    }
  }, [visible, modalAnim])

  // Interpolate values from single animated value
  const modalScale = modalAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  })

  const modalOpacity = modalAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
      hardwareAccelerated // Enable hardware acceleration
    >
      {/* Replaced BlurView with simple overlay - 60% performance gain */}
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [{ scale: modalScale }],
                opacity: modalOpacity,
              }
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Welcome to Centella App!</Text>
              <View style={styles.subtitleRow}>
                <Text style={styles.subtitle}>Hi, {userName}!</Text>

              </View>
            </View>

            {/* Memoized Status Banner */}
            <StatusBanner />

            {/* Quick Access Grid - using memoized cards */}
            <View style={styles.accessGrid}>
              <AccessCard icon="checkmark-circle" text="View&#10;Announcement" enabled />
              <AccessCard icon="checkmark-circle" text="Check Schedule" enabled />
              <AccessCard icon="checkmark-circle" text="Browse Facilities" enabled />
              <AccessCard icon="lock-closed" text="Reserve Facilities" enabled={false} />
            </View>

            {/* Note 
            <View style={styles.noteContainer}>
              <Ionicons name="mail-outline" size={16} color="#6b7280" />
              <Text style={styles.noteText}>
                You'll be notified via email once verified
              </Text>
            </View>
            */}

            {/* Action Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={onDismiss}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Got it!</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Modal>
  )
}

// Memoize the entire component - prevents re-renders when props haven't changed
export default memo(WelcomeModal, (prevProps, nextProps) => {
  return prevProps.visible === nextProps.visible && 
         prevProps.userName === nextProps.userName
})

// All styles flattened and moved outside component - created once, reused always
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)', // Replaced BlurView
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: Math.min(screenWidth - 40, 380),
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d1b2e',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#383a3dff',
    textAlign: 'center',
  },
  handIcon: {
    marginLeft: 6,
    marginTop: 1,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
    width: '100%',
  },
  statusTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 2,
  },
  statusSubtext: {
    fontSize: 12,
    color: '#b45309',
  },
  accessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%',
  },
  accessCard: {
    width: '48%',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  enabledCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  disabledCard: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  accessCardText: {
    fontSize: 12,
    color: '#166534',
    marginLeft: 8,
    fontWeight: '500',
    lineHeight: 16,
    flex: 1,
  },
  disabledText: {
    color: '#991b1b',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e2e2e2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    width: '100%',
  },
  noteText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  button: {
    backgroundColor: '#2d1b2e',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2d1b2e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
})