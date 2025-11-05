import { useRef } from "react"
import { Animated } from "react-native"

export const usePaymentAnimation = () => {
  const successScale = useRef(new Animated.Value(0)).current
  const successOpacity = useRef(new Animated.Value(0)).current
  const confettiAnims = useRef([...Array(12)].map(() => ({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    rotate: new Animated.Value(0),
  }))).current

  const triggerSuccessAnimation = () => {
    // Success modal animation
    Animated.parallel([
      Animated.spring(successScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start()

    // Confetti animation
    confettiAnims.forEach((anim, index) => {
      const angle = (index / confettiAnims.length) * Math.PI * 2
      const distance = 100 + Math.random() * 50
      
      Animated.parallel([
        Animated.timing(anim.x, {
          toValue: Math.cos(angle) * distance,
          duration: 1000 + Math.random() * 500,
          useNativeDriver: true,
        }),
        Animated.timing(anim.y, {
          toValue: Math.sin(angle) * distance - 50,
          duration: 1000 + Math.random() * 500,
          useNativeDriver: true,
        }),
        Animated.timing(anim.rotate, {
          toValue: Math.random() * 720,
          duration: 1000 + Math.random() * 500,
          useNativeDriver: true,
        })
      ]).start()
    })
  }

  return {
    successScale,
    successOpacity,
    confettiAnims,
    triggerSuccessAnimation
  }
}