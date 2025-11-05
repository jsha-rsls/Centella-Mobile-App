import { Animated, Easing } from 'react-native'

export const useHeaderAnimations = (scrollY) => {
  const HEADER_MAX_HEIGHT = 200
  const HEADER_MIN_HEIGHT = 110
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

  // Collapsing header height
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  })

  // Fade/slide out animation for header content
  const headerContentOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.4, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  const headerContentTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -12],
    extrapolate: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  // Centered title fade in (late)
  const centeredTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.85, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  return {
    headerHeight,
    headerContentOpacity,
    headerContentTranslateY,
    centeredTitleOpacity,
    HEADER_MAX_HEIGHT,
    HEADER_MIN_HEIGHT,
    HEADER_SCROLL_DISTANCE
  }
}