import { Image, Animated, View, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useRef, useState } from 'react'
import HTMLRenderer from '../HTMLRenderer'
import { viewStyles } from '../styles/viewStyles'
import { getStatusBarGradient, getOverlayGradient } from '../utils/gradientUtils'
import HeaderContent from './HeaderContent'
import HeaderButtons from './HeaderButtons'

// Component for sliding text when title is long (for centered title only)
function SlidingTitle({ html, style }) {
  const translateX = useRef(new Animated.Value(0)).current
  const [textWidth, setTextWidth] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    if (textWidth > containerWidth && containerWidth > 0) {
      // Start sliding animation
      const slideDistance = textWidth - containerWidth
      const slideAnimation = Animated.loop(
        Animated.sequence([
          Animated.delay(2000), // Wait 2s before starting
          Animated.timing(translateX, {
            toValue: -slideDistance,
            duration: slideDistance * 15, // Smooth speed
            useNativeDriver: true,
          }),
          Animated.delay(1000), // Pause at end
          Animated.timing(translateX, {
            toValue: 0,
            duration: slideDistance * 15,
            useNativeDriver: true,
          }),
          Animated.delay(2000), // Pause at start
        ])
      )
      slideAnimation.start()
      return () => slideAnimation.stop()
    }
  }, [textWidth, containerWidth, translateX])

  return (
    <View 
      style={{ overflow: 'hidden', width: '100%' }}
      onLayout={(e) => {
        if (containerWidth === 0) {
          setContainerWidth(e.nativeEvent.layout.width)
        }
      }}
    >
      <Animated.View
        style={{
          flexDirection: 'row',
          transform: [{ translateX }],
        }}
        onLayout={(e) => {
          if (textWidth === 0) {
            setTextWidth(e.nativeEvent.layout.width)
          }
        }}
      >
        <HTMLRenderer html={html} style={style} />
      </Animated.View>
    </View>
  )
}

// Helper to get plain text length from HTML
function getPlainTextLength(html) {
  if (!html) return 0
  // Remove HTML tags and get approximate length
  return html.replace(/<[^>]*>/g, '').trim().length
}

// Get adaptive font size based on title length (for main header)
function getAdaptiveFontSize(titleLength, baseSize = 28) {
  if (titleLength < 40) return baseSize // Short title
  if (titleLength < 70) return baseSize - 3 // Medium title
  if (titleLength < 100) return baseSize - 5 // Long title
  return baseSize - 7 // Very long title
}

// Get adaptive centered title font size (smaller for top bar)
function getAdaptiveCenteredFontSize(titleLength, baseSize = 16) {
  if (titleLength < 40) return baseSize
  if (titleLength < 70) return baseSize - 1
  if (titleLength < 100) return baseSize - 2
  return baseSize - 3
}

export default function AnimatedHeader({
  announcement,
  hasImage,
  headerHeight,
  headerContentOpacity,
  headerContentTranslateY,
  centeredTitleOpacity,
  onBackPress,
  onMenuPress,
  onImageError,
  onImageLoad,
  gradientColors,
  formatRelativeDate
}) {
  const titleLength = getPlainTextLength(announcement.title)
  const headerFontSize = getAdaptiveFontSize(titleLength)
  const centeredFontSize = getAdaptiveCenteredFontSize(titleLength)

  if (hasImage) {
    return (
      <Animated.View style={[viewStyles.fixedImageHeader, { height: headerHeight }]}>
        <Image
          source={{ uri: announcement.image_url }}
          style={viewStyles.heroImage}
          resizeMode="cover"
          onError={onImageError}
          onLoad={onImageLoad}
          cache="force-cache"
        />
        
        {/* Overlay gradient */}
        <LinearGradient
          colors={getStatusBarGradient()}
          locations={[0, 0.5, 1]}
          style={viewStyles.statusBarGradient}
        />
        
        <HeaderButtons 
          onBackPress={onBackPress}
          onMenuPress={onMenuPress}
        />

        {/* Centered Title - Always single line with scrolling if too long */}
        <Animated.View 
          style={[
            viewStyles.centeredTitleContainer,
            { opacity: centeredTitleOpacity }
          ]}
        >
          <SlidingTitle 
            html={announcement.title}
            style={[
              viewStyles.centeredTitle, 
              { 
                fontSize: centeredFontSize,
                lineHeight: centeredFontSize + 4
              }
            ]}
          />
        </Animated.View>

        <HeaderContent
          announcement={announcement}
          headerContentOpacity={headerContentOpacity}
          headerContentTranslateY={headerContentTranslateY}
          formatRelativeDate={formatRelativeDate}
          adaptiveFontSize={headerFontSize}
        />
      </Animated.View>
    )
  }

  return (
    <Animated.View style={[viewStyles.fixedGradientHeader, { height: headerHeight }]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={viewStyles.animatedGradientHeader}
      >
        {/* Overlay */}
        <LinearGradient
          colors={getOverlayGradient()}
          locations={[0, 1]}
          style={viewStyles.gradientStatusBarOverlay}
        />
        
        <HeaderButtons 
          onBackPress={onBackPress}
          onMenuPress={onMenuPress}
        />

        {/* Centered Title - Always single line with scrolling if too long */}
        <Animated.View 
          style={[
            viewStyles.centeredTitleContainer,
            { opacity: centeredTitleOpacity }
          ]}
        >
          <SlidingTitle 
            html={announcement.title}
            style={[
              viewStyles.centeredTitle,
              { 
                fontSize: centeredFontSize,
                lineHeight: centeredFontSize + 4
              }
            ]}
          />
        </Animated.View>

        <HeaderContent
          announcement={announcement}
          headerContentOpacity={headerContentOpacity}
          headerContentTranslateY={headerContentTranslateY}
          formatRelativeDate={formatRelativeDate}
          adaptiveFontSize={headerFontSize}
        />
      </LinearGradient>
    </Animated.View>
  )
}