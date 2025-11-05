import { Animated } from "react-native"

export class BadgeAnimations {
  constructor() {
    this.pulseAnim = new Animated.Value(0.5)
    this.recentBadgeAnim = new Animated.Value(1)
    this.fadeAnim = new Animated.Value(0)
    this.animations = []
  }

  startAnimations() {
    // Pulse animation for "New" badge
    const pulsing = Animated.loop(
      Animated.sequence([
        Animated.timing(this.pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(this.pulseAnim, {
          toValue: 0.5,
          duration: 2000,
          useNativeDriver: true,
        })
      ])
    )
    
    // Subtle animation for "Recent" badge
    const recentAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(this.recentBadgeAnim, {
          toValue: 1.02,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(this.recentBadgeAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ])
    )

    // Start animations
    pulsing.start()
    recentAnimation.start()

    // Store references for cleanup
    this.animations = [pulsing, recentAnimation]
  }

  startFadeInAnimation() {
    return Animated.timing(this.fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    })
  }

  resetFadeAnimation() {
    this.fadeAnim.setValue(0)
  }

  stopAnimations() {
    this.animations.forEach(animation => animation.stop())
    this.animations = []
  }

  // Getters for animation values
  getPulseAnim() {
    return this.pulseAnim
  }

  getRecentBadgeAnim() {
    return this.recentBadgeAnim
  }

  getFadeAnim() {
    return this.fadeAnim
  }
}