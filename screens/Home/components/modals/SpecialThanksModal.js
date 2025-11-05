import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { LinearGradient } from "expo-linear-gradient"
import { useAudioPlayer } from "expo-audio"

export default function SpecialThanksModal({ visible, onClose }) {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const [showModal, setShowModal] = useState(visible)
  const [currentSlide, setCurrentSlide] = useState(0)

  const slideOpacity = useRef(new Animated.Value(0)).current
  const slideScale = useRef(new Animated.Value(0.8)).current
  const heartScale = useRef(new Animated.Value(0)).current

  // Use the new expo-audio hook
  const player = useAudioPlayer(require("../../../../assets/8bit/IGY-TWICE-8BIT.mp3"))

  // Memoize team members array
  const teamMembers = useMemo(() => [
    { name: "Alyssa Clarisse G. Bernales", icon: "ribbon", color: "#ec4899", role: "Project Leader & UI/UX Designer" },
    { name: "James Axl E. Boco", icon: "color-palette", color: "#8b5cf6", role: "UI/UX Designer" },
    { name: "Kaye J. Gagbo", icon: "brush", color: "#f59e0b", role: "UI/UX Designer" },
    { name: "Joshua T. Rosales", icon: "code-slash", color: "#10b981", role: "Project Developer & UI/UX Designer" },
  ], [])

  // Load and play music
  useEffect(() => {
    if (visible) {
      // Play the audio when modal opens
      try {
        player.volume = 0.15
        player.play()
      } catch (error) {
        console.log("Failed to play audio:", error)
      }
    } else {
      // Stop and reset audio when modal closes
      try {
        player.pause()
        player.seekTo(0)
      } catch (error) {
        // Silently ignore if player was already released
      }
    }

    return () => {
      try {
        player.pause()
      } catch (error) {
        // Silently ignore if player was already released
      }
    }
  }, [visible, player])

  // Memoize animation callback
  const animateSlide = useCallback((index) => {
    // Reset animations
    slideOpacity.setValue(0)
    slideScale.setValue(0.8)
    heartScale.setValue(0)

    // Animate in
    Animated.parallel([
      Animated.timing(slideOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(slideScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Wait before next slide
      if (index < teamMembers.length) {
        setTimeout(() => {
          // Animate out
          Animated.parallel([
            Animated.timing(slideOpacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(slideScale, {
              toValue: 0.8,
              duration: 500,
              useNativeDriver: true,
            }),
          ]).start(() => {
            if (index + 1 <= teamMembers.length) {
              setCurrentSlide(index + 1)
              animateSlide(index + 1)
            }
          })
        }, 3800)
      } else {
        // Last slide (thank you) - animate heart
        Animated.sequence([
          Animated.spring(heartScale, {
            toValue: 1.2,
            tension: 50,
            friction: 3,
            useNativeDriver: true,
          }),
          Animated.spring(heartScale, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start()
      }
    })
  }, [teamMembers.length, slideOpacity, slideScale, heartScale])

  // Slideshow animation
  useEffect(() => {
    if (visible) {
      setShowModal(true)
      setCurrentSlide(0)

      // Fade in overlay
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start()

      // Start slideshow
      animateSlide(0)
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowModal(false)
        setCurrentSlide(0)
      })
    }
  }, [visible, fadeAnim, animateSlide])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  if (!showModal) return null

  const isLastSlide = currentSlide === teamMembers.length
  const currentMember = teamMembers[currentSlide]

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={isLastSlide ? ["#fecaca", "#fed7aa", "#fde68a"] : ["#f3e8ff", "#e9d5ff", "#ddd6fe"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          >
            {!isLastSlide ? (
              // Team member slide
              <Animated.View
                style={[
                  styles.slideContent,
                  {
                    opacity: slideOpacity,
                    transform: [{ scale: slideScale }],
                  },
                ]}
              >
                <View style={[styles.iconContainer, { backgroundColor: currentMember.color + "20" }]}>
                  <Ionicons name={currentMember.icon} size={56} color={currentMember.color} />
                </View>
                <Text style={styles.memberName}>{currentMember.name}</Text>
                <Text style={styles.roleText}>{currentMember.role}</Text>
                <View style={styles.sparkleContainer}>
                  <Ionicons name="sparkles" size={20} color={currentMember.color} />
                </View>
              </Animated.View>
            ) : (
              // Thank you slide
              <Animated.View
                style={[
                  styles.thankYouContent,
                  {
                    opacity: slideOpacity,
                    transform: [{ scale: slideScale }],
                  },
                ]}
              >
                <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                  <Ionicons name="heart" size={72} color="#ef4444" />
                </Animated.View>
                <Text style={styles.thankYouTitle}>Thank You!</Text>
                <Text style={styles.thankYouMessage}>
                  For supporting our project{"\n"}and believing in our work
                </Text>
                <View style={styles.schoolBadge}>
                  <Ionicons name="school" size={18} color="#8b5cf6" />
                  <Text style={styles.schoolText}>Colegio de Montalban</Text>
                </View>
                <Text style={styles.appVersion}>Centella Homes App V1</Text>

                <TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.8}>
                  <LinearGradient
                    colors={["#ec4899", "#8b5cf6"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.closeButtonGradient}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Progress indicator */}
            <View style={styles.progressContainer}>
              {teamMembers.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    currentSlide === index && styles.progressDotActive,
                    currentSlide === index && { backgroundColor: isLastSlide ? "#ef4444" : "#8b5cf6" },
                  ]}
                />
              ))}
              <View
                style={[
                  styles.progressDot,
                  currentSlide === teamMembers.length && styles.progressDotActive,
                  currentSlide === teamMembers.length && { backgroundColor: "#ef4444" },
                ]}
              />
            </View>

            {/* Music credit (small text at bottom) */}
            {!isLastSlide && (
              <Text style={styles.musicCredit}>
                ♪ Music: I Got You (8-Bit Twice Emulation)
              </Text>
            )}
          </LinearGradient>
        </View>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 380,
    borderRadius: 24,
    overflow: "hidden",
  },
  gradientBackground: {
    padding: 32,
    minHeight: 420,
    justifyContent: "center",
    alignItems: "center",
  },
  slideContent: {
    alignItems: "center",
    width: "100%",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  memberName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  roleText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  sparkleContainer: {
    marginTop: 12,
  },
  thankYouContent: {
    alignItems: "center",
    width: "100%",
  },
  thankYouTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1f2937",
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  thankYouMessage: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
    fontWeight: "500",
  },
  schoolBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    marginBottom: 12,
  },
  schoolText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
  },
  appVersion: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 8,
    marginBottom: 24,
    fontWeight: "600",
  },
  closeButton: {
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
  },
  closeButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  progressDotActive: {
    width: 24,
    transform: [{ scaleY: 1.2 }],
  },
  musicCredit: {
    position: "absolute",
    bottom: 12,
    fontSize: 10,
    color: "rgba(0, 0, 0, 0.4)",
    fontWeight: "600",
  },
})