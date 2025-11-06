import React, { useEffect, useRef, memo } from 'react'
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

// Animated confetti particles that fall from top
const ConfettiParticle = memo(({ delay, left, emoji = '🎉' }) => {
  const animValue = useRef(new Animated.Value(0)).current
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(animValue, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [delay])
  
  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, screenHeight],
  })
  
  const opacity = animValue.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [0, 1, 1, 0],
  })
  
  const rotate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })
  
  return (
    <Animated.View
      style={[
        styles.confettiParticle,
        {
          left: `${left}%`,
          transform: [{ translateY }, { rotate }],
          opacity,
        },
      ]}
    >
      <Text style={styles.confettiEmoji}>{emoji}</Text>
    </Animated.View>
  )
})

ConfettiParticle.displayName = 'ConfettiParticle'

// Feature item with stagger animation
const FeatureItem = memo(({ icon, text, delay }) => {
  const slideAnim = useRef(new Animated.Value(0)).current
  
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 400,
      delay,
      useNativeDriver: true,
    }).start()
  }, [delay])
  
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-15, 0],
  })
  
  return (
    <Animated.View
      style={[
        styles.featureItem,
        {
          opacity: slideAnim,
          transform: [{ translateX }],
        },
      ]}
    >
      <View style={styles.featureIconContainer}>
        <Ionicons name={icon} size={18} color="#22c55e" />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </Animated.View>
  )
})

FeatureItem.displayName = 'FeatureItem'

export default function VerifiedModal({ 
  visible, 
  onDismiss,
  userName = 'Resident'
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current
  const checkmarkAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    if (visible) {
      // Reset all animations
      scaleAnim.setValue(0)
      checkmarkAnim.setValue(0)
      fadeAnim.setValue(0)
      slideAnim.setValue(30)

      // Orchestrated animation sequence
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(150),
          Animated.spring(checkmarkAnim, {
            toValue: 1,
            tension: 45,
            friction: 6,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(300),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(300),
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 45,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
      ]).start()
    }
  }, [visible, scaleAnim, checkmarkAnim, fadeAnim, slideAnim])

  if (!visible) {
    return null
  }

  const checkmarkScale = checkmarkAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.15, 1],
  })

  const checkmarkRotate = checkmarkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-180deg', '0deg'],
  })

  const confettiEmojis = ['🎉', '🎊', '✨', '⭐']

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <StatusBar
        backgroundColor="rgba(0, 0, 0, 0.6)"
        barStyle="light-content"
        translucent
      />
      <View style={styles.overlay}>
        <BlurView intensity={25} style={StyleSheet.absoluteFill}>
          {/* Animated confetti rain */}
          {confettiEmojis.map((emoji, i) => (
            <ConfettiParticle
              key={i}
              delay={i * 250}
              left={15 + i * 23}
              emoji={emoji}
            />
          ))}
          
          <View style={styles.modalContainer}>
            <Animated.View 
              style={[
                styles.modalContent,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: scaleAnim,
                }
              ]}
            >
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                bounces={false}
              >
                {/* Animated checkmark with glow */}
                <Animated.View 
                  style={[
                    styles.iconContainer,
                    {
                      transform: [
                        { scale: checkmarkScale },
                        { rotate: checkmarkRotate }
                      ],
                    }
                  ]}
                >
                  <View style={styles.glowCircle} />
                  <Ionicons name="checkmark-circle" size={64} color="#22c55e" />
                </Animated.View>

                {/* Main content */}
                <Animated.View
                  style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  }}
                >
                  <Text style={styles.title}>Congratulations!</Text>
                  <Text style={styles.userName}>{userName}</Text>
                  <Text style={styles.subtitle}>You're Now a Verified Homeowner</Text>

                  {/* Status card */}
                  <View style={styles.statusCard}>
                    <View style={styles.statusHeader}>
                      <View style={styles.statusDot} />
                      <Text style={styles.statusTitle}>ACCOUNT VERIFIED</Text>
                    </View>
                    <Text style={styles.statusText}>
                      Your residency verification is complete
                    </Text>
                  </View>

                  {/* Features */}
                  <View style={styles.featuresSection}>
                    <Text style={styles.featuresTitle}>✨ What You Can Do Now</Text>
                    <FeatureItem 
                      icon="calendar-outline" 
                      text="Reserve Facilities" 
                      delay={500}
                    />
                  </View>

                  {/* CTA button */}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={onDismiss}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.buttonText}>Start Exploring</Text>
                    <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                  </TouchableOpacity>

                  {/* Footer */}
                  <View style={styles.footer}>
                    <View style={styles.footerIconContainer}>
                      <Ionicons name="information-circle" size={16} color="#22c55e" />
                    </View>
                    <Text style={styles.footerText}>
                      Head to the <Text style={styles.footerBold}>Reserve</Text> tab to book your first facility!
                    </Text>
                  </View>
                </Animated.View>
              </ScrollView>
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: screenHeight * 0.9,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 18,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 20,
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  glowCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22c55e',
    opacity: 0.18,
    top: -8,
    left: -8,
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  userName: {
    fontSize: 19,
    fontWeight: '600',
    color: '#22c55e',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 21,
  },
  statusCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: '#86efac',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
    marginRight: 8,
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803d',
    letterSpacing: 0.5,
  },
  statusText: {
    fontSize: 13,
    color: '#166534',
    lineHeight: 18,
    fontWeight: '500',
  },
  featuresSection: {
    backgroundColor: '#fafafa',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  featuresTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
    fontWeight: '500',
    lineHeight: 19,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#22c55e',
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 14,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    marginRight: 8,
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  footerIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    flexShrink: 0,
  },
  footerText: {
    fontSize: 13,
    color: '#166534',
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
  footerBold: {
    fontWeight: '700',
    color: '#15803d',
  },
  confettiParticle: {
    position: 'absolute',
    top: 0,
  },
  confettiEmoji: {
    fontSize: 20,
  },
})