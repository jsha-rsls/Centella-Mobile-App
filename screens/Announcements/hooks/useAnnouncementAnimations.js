import { useState, useEffect, useRef } from 'react'
import { Animated } from 'react-native'
import { BadgeAnimations } from "../utils/BadgeAnimations"

export const useAnnouncementAnimations = (loading, refreshing, announcements) => {
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [skeletonFadeOut, setSkeletonFadeOut] = useState(false)
  const [contentReady, setContentReady] = useState(false)
  
  // Animation refs
  const contentOpacity = useRef(new Animated.Value(0)).current
  const contentStaggerAnims = useRef([]).current
  const badgeAnimations = useRef(new BadgeAnimations()).current
  const headerAnim = useRef(new Animated.Value(0)).current

  // Initialize content animations based on announcements length
  useEffect(() => {
    if (announcements.length > 0 && contentStaggerAnims.length !== announcements.length) {
      contentStaggerAnims.length = 0 // Clear existing
      for (let i = 0; i < announcements.length; i++) {
        contentStaggerAnims.push(new Animated.Value(0))
      }
    }
  }, [announcements.length])

  // Initialize badge animations
  useEffect(() => {
    badgeAnimations.startAnimations()
    
    // Header entrance animation
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
    
    return () => {
      badgeAnimations.stopAnimations()
    }
  }, [])

  // Transition logic
  useEffect(() => {
    if (!loading && !refreshing && announcements.length > 0) {
      // Start skeleton fade + content fade simultaneously
      setSkeletonFadeOut(true)
      setContentReady(true)

      const staggeredContentAnimations = Animated.stagger(
        25,
        [
          Animated.timing(contentOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          ...contentStaggerAnims.map(anim =>
            Animated.spring(anim, {
              toValue: 1,
              tension: 150,
              friction: 10,
              useNativeDriver: true,
            })
          )
        ]
      )
      staggeredContentAnimations.start()
    } else if (loading) {
      setShowSkeleton(true)
      setSkeletonFadeOut(false)
      setContentReady(false)
      contentOpacity.setValue(0)
      contentStaggerAnims.forEach(anim => anim.setValue(0))
      badgeAnimations.resetFadeAnimation()
    }
  }, [loading, refreshing, announcements.length])

  const handleSkeletonFadeComplete = () => {
    // Skeleton fully gone now
    setShowSkeleton(false)
  }

  return {
    showSkeleton,
    skeletonFadeOut,
    contentReady,
    contentOpacity,
    contentStaggerAnims,
    badgeAnimations,
    headerAnim,
    handleSkeletonFadeComplete
  }
}
