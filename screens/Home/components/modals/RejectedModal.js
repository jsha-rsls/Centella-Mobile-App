import React, { useEffect, useRef, useMemo, memo } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'

const { width: screenWidth } = Dimensions.get('window')

// Memoized rejection reason card
const RejectionReasonCard = memo(({ displayReason }) => (
  <View style={styles.rejectionCard}>
    <View style={styles.rejectionHeader}>
      <Ionicons name="alert-circle" size={18} color="#dc2626" />
      <Text style={styles.rejectionTitle}>Reason for Decline</Text>
    </View>
    <ScrollView 
      style={styles.reasonScrollView}
      contentContainerStyle={styles.reasonScrollContent}
      nestedScrollEnabled
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.rejectionText}>{displayReason}</Text>
    </ScrollView>
  </View>
))

RejectionReasonCard.displayName = 'RejectionReasonCard'

// Memoized step item component
const StepItem = memo(({ number, text }) => (
  <View style={styles.stepItem}>
    <View style={styles.stepNumber}>
      <Text style={styles.stepNumberText}>{number}</Text>
    </View>
    <Text style={styles.stepText}>{text}</Text>
  </View>
))

StepItem.displayName = 'StepItem'

// Memoized steps container with all steps
const StepsContainer = memo(() => (
  <View style={styles.stepsContainer}>
    <Text style={styles.stepsTitle}>What You Can Do:</Text>
    
    <StepItem number="1" text="Review the reason above carefully" />
    <StepItem number="2" text="Click 'Resubmit' to update your information" />
    <StepItem number="3" text="Submit for review again" />
  </View>
))

StepsContainer.displayName = 'StepsContainer'

// Memoized button row
const ButtonRow = memo(({ onClose, onResubmit }) => (
  <View style={styles.buttonRow}>
    <TouchableOpacity
      style={[styles.button, styles.secondaryButton]}
      onPress={onClose}
      activeOpacity={0.8}
    >
      <Text style={styles.secondaryButtonText}>Close</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.button, styles.primaryButton]}
      onPress={onResubmit}
      activeOpacity={0.8}
    >
      <Ionicons name="refresh" size={18} color="#ffffff" style={{ marginRight: 6 }} />
      <Text style={styles.primaryButtonText}>Resubmit</Text>
    </TouchableOpacity>
  </View>
))

ButtonRow.displayName = 'ButtonRow'

export default function RejectedModal({ 
  visible, 
  onDismiss,
  onResubmit,
  userName = 'Resident',
  rejectionReason = null,
}) {
  const shakeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0)).current

  // Memoize animation interpolations
  const animationInterpolations = useMemo(() => ({
    modalScale: scaleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    }),
  }), [scaleAnim])

  // Memoize display reason to prevent recalculation
  const displayReason = useMemo(
    () => rejectionReason || 'Your submission did not meet our verification requirements.',
    [rejectionReason]
  )

  useEffect(() => {
    if (visible) {
      shakeAnim.setValue(0)
      scaleAnim.setValue(0)

      // All animations use useNativeDriver: true for smooth 60fps performance
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
        ]),
      ]).start()
    }
  }, [visible, shakeAnim, scaleAnim])

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <StatusBar
        backgroundColor="rgba(0, 0, 0, 0.5)"
        barStyle="light-content"
        translucent
      />
      <View style={styles.overlay}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill}>
          <View style={styles.modalContainer}>
            <Animated.View 
              style={[
                styles.modalContent,
                {
                  transform: [
                    { scale: animationInterpolations.modalScale },
                    { translateX: shakeAnim }
                  ],
                }
              ]}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="close-circle" size={56} color="#dc2626" />
              </View>

              <Text style={styles.title}>Verification Declined</Text>
              <Text style={styles.subtitle}>Hi {userName},</Text>

              <Text style={styles.message}>
                Unfortunately, your account verification was not approved by the HOA administrators.
              </Text>

              {/* Rejection reason card - memoized */}
              <RejectionReasonCard displayReason={displayReason} />

              {/* Steps container - memoized */}
              <StepsContainer />

              {/* Button row - memoized */}
              <ButtonRow onClose={onDismiss} onResubmit={onResubmit} />
            </Animated.View>
          </View>
        </BlurView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 15,
    maxHeight: '80%',
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  rejectionCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#fecaca',
  },
  rejectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fecaca',
  },
  rejectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991b1b',
    marginLeft: 8,
  },
  reasonScrollView: {
    maxHeight: 80,
  },
  reasonScrollContent: {
    flexGrow: 1,
  },
  rejectionText: {
    fontSize: 14,
    color: '#7f1d1d',
    lineHeight: 20,
    fontWeight: '500',
  },
  stepsContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2d1b2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  stepText: {
    fontSize: 13,
    color: '#4b5563',
    flex: 1,
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4b5563',
  },
  primaryButton: {
    backgroundColor: '#2d1b2e',
    shadowColor: '#2d1b2e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
})