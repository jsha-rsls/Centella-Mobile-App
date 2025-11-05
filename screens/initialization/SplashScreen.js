import { View, Image, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import { LinearGradient } from "expo-linear-gradient"
import { useFonts } from "expo-font"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  withRepeat,
  Easing,
  interpolate,
  Extrapolate,
  runOnJS,
} from "react-native-reanimated"
import { useEffect } from "react"
import styles from "./SplashScreenStyle"

export default function SplashScreen({ 
  onTransitionComplete,
  loadingDuration = 3000,
  transitionDuration = 800,
  autoLoginStatus = 'default', // 'checking' | 'success' | 'default'
}) {
  // Load all icon fonts needed for the app
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    ...MaterialCommunityIcons.font,
  })

  // Simple animation values
  const logoScale = useSharedValue(0.7)
  const logoOpacity = useSharedValue(0)
  const titleOpacity = useSharedValue(0)
  const titleTranslateY = useSharedValue(20)
  const subtitleOpacity = useSharedValue(0)
  const subtitleTranslateY = useSharedValue(20)
  const loadingProgress = useSharedValue(0)
  const welcomeOpacity = useSharedValue(0)
  
  // Transition animation values
  const screenOpacity = useSharedValue(1)
  const screenScale = useSharedValue(1)
  const contentTranslateY = useSharedValue(0)
  
  // Gentle floating animation for background
  const backgroundFloat = useSharedValue(0)

  // Dynamic loading text based on auto-login status
  const getLoadingText = () => {
    switch (autoLoginStatus) {
      case 'checking':
        return 'Just a moment, signing you in...'
      case 'success':
        return 'Welcome back! Let’s get you connected...'
      case 'default':
      default:
        return 'Building your community space...'
    }
  }

  useEffect(() => {
    if (!fontsLoaded) return

    backgroundFloat.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    )

    logoScale.value = withTiming(1, { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
    logoOpacity.value = withTiming(1, { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })

    welcomeOpacity.value = withDelay(400, withTiming(1, { duration: 600, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }))
    titleOpacity.value = withDelay(600, withTiming(1, { duration: 700, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }))
    titleTranslateY.value = withDelay(600, withTiming(0, { duration: 700, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }))
    subtitleOpacity.value = withDelay(900, withTiming(1, { duration: 600, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }))
    subtitleTranslateY.value = withDelay(900, withTiming(0, { duration: 600, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }))

    const loadingStartDelay = 1100
    const actualLoadingDuration = Math.max(loadingDuration - loadingStartDelay, 500)

    loadingProgress.value = withDelay(
      loadingStartDelay,
      withTiming(1, { duration: actualLoadingDuration, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }, (finished) => {
        if (finished) runOnJS(startExitTransition)()
      })
    )
  }, [loadingDuration, fontsLoaded])

  const startExitTransition = () => {
    screenOpacity.value = withTiming(0, { duration: transitionDuration, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
    screenScale.value = withTiming(0.95, { duration: transitionDuration, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
    contentTranslateY.value = withTiming(-50, { duration: transitionDuration, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }, (finished) => {
      if (finished && onTransitionComplete) runOnJS(onTransitionComplete)()
    })
  }

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
    transform: [{ scale: screenScale.value }],
  }))

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(backgroundFloat.value, [0, 1], [-10, 10], Extrapolate.CLAMP) }]
  }))

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }]
  }))

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }))

  const welcomeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: welcomeOpacity.value,
  }))

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }))

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }))

  const loadingBarAnimatedStyle = useAnimatedStyle(() => ({
    width: `${loadingProgress.value * 100}%`,
  }))

  const loadingTextAnimatedStyle = useAnimatedStyle(() => ({
    opacity: loadingProgress.value,
  }))

  if (!fontsLoaded) return null

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <SafeAreaView style={styles.safeArea}>
        <ExpoStatusBar style="light" translucent={true} />
        
        <LinearGradient
          colors={["#231828", "#F9E6E6", "#231828"]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        >
          <Animated.View style={[styles.decorativeCircle1, backgroundAnimatedStyle]} />
          <Animated.View style={[styles.decorativeCircle2, backgroundAnimatedStyle]} />
          <Animated.View style={[styles.decorativeCircle3, backgroundAnimatedStyle]} />

          <Animated.View style={[styles.content, contentAnimatedStyle]}>
            <Animated.Text style={[styles.welcomeText, welcomeAnimatedStyle]}>
              Welcome to
            </Animated.Text>

            <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
              <Image 
                source={require("../../assets/clean-logo.png")} 
                style={styles.logo} 
                resizeMode="contain" 
              />
            </Animated.View>

            <Animated.Text style={[styles.title, titleAnimatedStyle]}>
              Centella Homes
            </Animated.Text>

            <Animated.Text style={[styles.subtitle, subtitleAnimatedStyle]}>
              Connecting Neighbors & Building Community
            </Animated.Text>

            <Animated.View style={[styles.featuresContainer, subtitleAnimatedStyle]}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}><View style={styles.iconDot} /></View>
                <Text style={styles.featureText}>Reserve Amenities</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}><View style={styles.iconDot} /></View>
                <Text style={styles.featureText}>Connect with Neighbors</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}><View style={styles.iconDot} /></View>
                <Text style={styles.featureText}>Community Updates</Text>
              </View>
            </Animated.View>

            <View style={styles.loadingContainer}>
              <View style={styles.loadingBarContainer}>
                <Animated.View style={[styles.loadingBar, loadingBarAnimatedStyle]} />
              </View>
              <Animated.Text style={[styles.loadingText, loadingTextAnimatedStyle]}>
                {getLoadingText()}
              </Animated.Text>
            </View>
          </Animated.View>
        </LinearGradient>
      </SafeAreaView>
    </Animated.View>
  )
}