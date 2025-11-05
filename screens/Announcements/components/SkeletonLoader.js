import React, { useEffect, useRef } from "react"
import { View, Animated } from "react-native"
import { styles } from "./styles/skeletonStyles"

export default function SkeletonLoader({ count = 5, fadeOut = false, onFadeComplete = null }) {
  const shimmerAnim = useRef(new Animated.Value(0)).current
  const staggeredAnims = useRef(
    Array.from({ length: count }, () => new Animated.Value(0))
  ).current
  const containerOpacity = useRef(new Animated.Value(1)).current

  // Enhanced fade-out animation with faster timing
  useEffect(() => {
    if (fadeOut) {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 400, // Much faster fade to reduce blank screen time
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && onFadeComplete) {
          onFadeComplete() // Notify parent that fade is complete
        }
      })
    }
  }, [fadeOut, containerOpacity, onFadeComplete])

  useEffect(() => {
    // Enhanced shimmer animation - more fluid
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1600, // Slightly faster for more liveliness
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    )

    // Enhanced staggered card animations - smoother entrance
    const staggeredAnimations = Animated.stagger(
      60, // Optimized stagger timing
      staggeredAnims.map(anim =>
        Animated.spring(anim, {
          toValue: 1,
          tension: 100, // Spring animation for organic feel
          friction: 8,
          useNativeDriver: true,
        })
      )
    )

    // Start animations with optimized timing
    const startTimer = setTimeout(() => {
      shimmerAnimation.start()
      staggeredAnimations.start()
    }, 50)

    return () => {
      clearTimeout(startTimer)
      shimmerAnimation.stop()
      staggeredAnims.forEach(anim => anim.stopAnimation())
    }
  }, [shimmerAnim, staggeredAnims, count])

  // Enhanced shimmer overlay with better interpolation
  const shimmerStyle = {
    opacity: shimmerAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.1, 0.3, 0.1], // Smoother fade curve
    }),
    transform: [
      {
        translateX: shimmerAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-50, 50], // Subtle movement for life
        }),
      },
    ],
  }

  const renderSkeletonCard = (index) => {
    const cardOpacity = {
      opacity: staggeredAnims[index],
      transform: [
        {
          translateY: staggeredAnims[index].interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0], // Slide up effect
          }),
        },
        {
          scale: staggeredAnims[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.95, 1], // Subtle scale for premium feel
          }),
        },
      ],
    }

    return (
      <Animated.View key={index} style={[styles.skeletonCard, cardOpacity]}>
        {/* Header with absolutely positioned badge - matches real layout */}
        <View style={styles.skeletonCardContainer}>
          <View style={styles.skeletonCardHeader}>
            {/* Title - matches real title layout */}
            <View style={[styles.skeletonTitle, styles.skeletonBase]}>
              <Animated.View style={[styles.shimmerOverlay, shimmerStyle]} />
            </View>
          </View>
          
          {/* Absolutely positioned badge - matches real layout */}
          <View style={styles.skeletonBadgeContainer}>
            <View style={[styles.skeletonBadge, styles.skeletonBase]}>
              <Animated.View style={[styles.shimmerOverlay, shimmerStyle]} />
            </View>
          </View>
        </View>

        {/* Content - 3 lines to match numberOfLines={3} */}
        <View style={styles.skeletonContentContainer}>
          <View style={[styles.skeletonContentLine1, styles.skeletonBase]}>
            <Animated.View style={[styles.shimmerOverlay, shimmerStyle]} />
          </View>
          <View style={[styles.skeletonContentLine2, styles.skeletonBase]}>
            <Animated.View style={[styles.shimmerOverlay, shimmerStyle]} />
          </View>
          <View style={[styles.skeletonContentLine3, styles.skeletonBase]}>
            <Animated.View style={[styles.shimmerOverlay, shimmerStyle]} />
          </View>
        </View>

        {/* Footer - matches real layout */}
        <View style={styles.skeletonFooter}>
          {/* Date with clock icon space */}
          <View style={styles.skeletonDateContainer}>
            <View style={[styles.skeletonClockIcon, styles.skeletonBase]}>
              <Animated.View style={[styles.shimmerOverlay, shimmerStyle]} />
            </View>
            <View style={[styles.skeletonDate, styles.skeletonBase]}>
              <Animated.View style={[styles.shimmerOverlay, shimmerStyle]} />
            </View>
          </View>
          
          {/* Read more with arrow */}
          <View style={styles.skeletonReadMoreContainer}>
            <View style={[styles.skeletonReadMore, styles.skeletonBase]}>
              <Animated.View style={[styles.shimmerOverlay, shimmerStyle]} />
            </View>
            <View style={[styles.skeletonArrow, styles.skeletonBase]}>
              <Animated.View style={[styles.shimmerOverlay, shimmerStyle]} />
            </View>
          </View>
        </View>
      </Animated.View>
    )
  }

  return (
    <Animated.View style={[styles.skeletonContainer, { opacity: containerOpacity }]}>
      {/* SearchHeader Skeleton - Enhanced with smooth animations */}
      <Animated.View 
        style={[
          styles.skeletonSearchHeader,
          {
            opacity: staggeredAnims[0] || 1, // Fade in with first card
            transform: [
              {
                translateY: (staggeredAnims[0] || new Animated.Value(1)).interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.skeletonSearchRow}>
          {/* Filter toggle button - with enhanced shimmer */}
          <View style={[styles.skeletonFilterToggle, styles.skeletonBase]}>
            <Animated.View style={[styles.shimmerOverlay, shimmerStyle]} />
          </View>
          
          {/* Search bar - with enhanced shimmer */}
          <View style={styles.skeletonSearchBarContainer}>
            <View style={[styles.skeletonSearchBar, styles.skeletonBase]}>
              <Animated.View style={[styles.shimmerOverlay, shimmerStyle]} />
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Result count area - with smooth entrance */}
      <Animated.View 
        style={[
          styles.skeletonSubtitleContainer,
          {
            opacity: staggeredAnims[0] || 1,
            transform: [
              {
                translateY: (staggeredAnims[0] || new Animated.Value(1)).interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.skeletonResultCount, styles.skeletonBase]}>
          <Animated.View style={[styles.shimmerOverlay, shimmerStyle]} />
        </View>
      </Animated.View>

      {/* Announcement Cards with staggered entrance */}
      {Array.from({ length: count }, (_, index) => renderSkeletonCard(index))}
    </Animated.View>
  )
}