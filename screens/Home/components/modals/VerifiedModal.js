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
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'

const { width: screenWidth } = Dimensions.get('window')

// Memoized feature items to prevent unnecessary re-renders
const FeatureItem = memo(({ icon, text }) => (
  <View style={styles.featureItem}>
    <Ionicons name={icon} size={18} color="#22c55e" />
    <Text style={styles.featureText}>{text}</Text>
  </View>
))

FeatureItem.displayName = 'FeatureItem'

// Memoized success card section
const SuccessCard = memo(() => (
  <View style={styles.successCard}>
    <View style={styles.successHeader}>
      <View style={styles.successDot} />
      <Text style={styles.successTitle}>Account Status Updated</Text>
    </View>
    <Text style={styles.successText}>Verified Homeowner ✓</Text>
    <Text style={styles.successSubtext}>
      You now have full access to all Centella features.
    </Text>
  </View>
))

SuccessCard.displayName = 'SuccessCard'

// Memoized confetti section
const ConfettiSection = memo(() => (
  <View style={styles.confettiContainer}>
    <Text style={styles.confetti}>🎉</Text>
    <Text style={[styles.confetti, styles.confettiRight]}>🎉</Text>
  </View>
))

ConfettiSection.displayName = 'ConfettiSection'

// Memoized features box
const FeaturesBox = memo(() => (
  <View style={styles.featuresBox}>
    <Text style={styles.featuresTitle}>What's New:</Text>
    <FeatureItem icon="calendar" text="Book facility reservations" />
    <FeatureItem icon="people" text="Access community amenities" />
    <FeatureItem icon="star" text="Full homeowner privileges" />
  </View>
))

FeaturesBox.displayName = 'FeaturesBox'

// Memoized button section
const ActionButton = memo(({ onPress }) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={styles.buttonText}>Start Exploring</Text>
    <Ionicons name="arrow-forward" size={20} color="#ffffff" />
  </TouchableOpacity>
))

ActionButton.displayName = 'ActionButton'

export default function VerifiedModal({ 
  visible, 
  onDismiss,
  userName = 'Resident'
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current
  const checkmarkAnim = useRef(new Animated.Value(0)).current

  // ✅ FIXED: Proper rotation interpolation with string output including 'deg'
  const animationInterpolations = useMemo(() => ({
    modalScale: scaleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    }),
    checkmarkScale: checkmarkAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    // Return string with 'deg' directly from interpolate
    checkmarkRotate: checkmarkAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['-45deg', '0deg'],  // ✅ Strings with 'deg' included
    }),
  }), [scaleAnim, checkmarkAnim])

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0)
      checkmarkAnim.setValue(0)

      // Sequence animations with native driver
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(checkmarkAnim, {
          toValue: 1,
          tension: 40,
          friction: 6,
          useNativeDriver: true,
          delay: 200,
        }),
      ]).start()
    }
  }, [visible, scaleAnim, checkmarkAnim])

  // Add error boundary protection
  if (!visible) {
    return null
  }

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
                  transform: [{ scale: animationInterpolations.modalScale }],
                }
              ]}
            >
              {/* Animated Checkmark Icon - ✅ FIXED rotation */}
              <Animated.View 
                style={[
                  styles.iconContainer,
                  {
                    transform: [
                      { scale: animationInterpolations.checkmarkScale },
                      { rotate: animationInterpolations.checkmarkRotate }  // ✅ No concatenation needed
                    ],
                  }
                ]}
              >
                <Ionicons name="checkmark-circle" size={64} color="#22c55e" />
              </Animated.View>

              {/* Confetti/Celebration effect */}
              <ConfettiSection />

              {/* Title */}
              <Text style={styles.title}>Congratulations, {userName}! 🎊</Text>

              {/* Subtitle */}
              <Text style={styles.subtitle}>You're Now Verified!</Text>

              {/* Message */}
              <Text style={styles.message}>
                Your account has been successfully verified by the HOA administrators.
              </Text>

              {/* Success Card */}
              <SuccessCard />

              {/* Features unlocked */}
              <FeaturesBox />

              {/* Button */}
              <ActionButton onPress={onDismiss} />

              {/* Footer note */}
              <Text style={styles.footerText}>
                You can now access the 'Reserve Tab' to book facilities!
              </Text>
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
    width: Math.min(screenWidth - 40, 400),
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 15,
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  confettiContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  confetti: {
    fontSize: 32,
    opacity: 0.8,
  },
  confettiRight: {
    transform: [{ scaleX: -1 }],
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#22c55e',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  successCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: '#86efac',
  },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  successDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
    marginRight: 10,
  },
  successTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#15803d',
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 6,
  },
  successSubtext: {
    fontSize: 14,
    color: '#15803d',
    lineHeight: 20,
  },
  featuresBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 10,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#22c55e',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    marginRight: 8,
  },
  footerText: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
  },
})