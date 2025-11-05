import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import { ScrollView, Platform, View, Animated } from "react-native"
import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { styles } from "./HomeStyles"
import { useHomeData } from "./hooks/useHomeData"
import { useResidentVerification } from "./hooks/useResidentVerification"
import HomeHeader from "./components/HomeHeader"
import RecentAnnouncement from "../Announcements/RecentAnnouncement"
import FacilityGrid from "./components/FacilityGrid"
import QuickActions from "./components/QuickActions"
import WelcomeModal from "./components/modals/WelcomeModal"
import VerifiedModal from "./components/modals/VerifiedModal"
import RejectedModal from "./components/modals/RejectedModal"
import ResubmitModal from "./components/modals/ResubmitModal"
import VerificationRequiredModal from "./components/modals/VerificationRequiredModal"

const AnimatedScrollArrow = ({ scrollY }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(1)).current

  React.useEffect(() => {
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -4,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    )

    bounceAnimation.start()

    return () => {
      bounceAnimation.stop()
    }
  }, [bounceAnim])

  React.useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      const opacity = Math.max(0, Math.min(1, (150 - value) / 100))
      fadeAnim.setValue(opacity)
    })

    return () => {
      scrollY.removeListener(listener)
    }
  }, [scrollY, fadeAnim])

  return (
    <View style={{
      alignItems: 'center',
      marginVertical: 12,
    }}>
      <Animated.View
        style={{
          transform: [{ translateY: bounceAnim }],
          opacity: fadeAnim,
        }}
      >
        <Ionicons 
          name="chevron-down" 
          size={16} 
          color="#2d1b2e" 
          style={{ opacity: 0.6 }}
        />
      </Animated.View>
      
      <View style={{
        height: 1,
        backgroundColor: '#e5e7eb',
        width: '70%',
        marginTop: 8,
        opacity: 0.6
      }} />
    </View>
  )
}

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { recentAnnouncements, announcementsLoading } = useHomeData()
  const scrollY = useRef(new Animated.Value(0)).current
  
  // Modal visibility states
  const [showVerificationRequired, setShowVerificationRequired] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [showVerifiedModal, setShowVerifiedModal] = useState(false)
  const [showRejectedModal, setShowRejectedModal] = useState(false)
  const [showResubmitModal, setShowResubmitModal] = useState(false)
  
  const {
    showWelcomeModal: hookShowWelcome,
    showVerifiedModal: hookShowVerified,
    showRejectedModal: hookShowRejected,
    handleDismissWelcomeModal: hookDismissWelcome,
    handleDismissVerifiedModal: hookDismissVerified,
    handleDismissRejectedModal: hookDismissRejected,
    residentProfile,
    rejectionReason,
    refreshProfile,
  } = useResidentVerification()

  // Sync hook states with component states (for backwards compatibility)
  React.useEffect(() => {
    setShowWelcomeModal(hookShowWelcome)
  }, [hookShowWelcome])

  React.useEffect(() => {
    setShowVerifiedModal(hookShowVerified)
  }, [hookShowVerified])

  React.useEffect(() => {
    setShowRejectedModal(hookShowRejected)
  }, [hookShowRejected])

  let tabBarHeight = 0
  try {
    tabBarHeight = useBottomTabBarHeight()
  } catch (error) {
    tabBarHeight = Platform.OS === "ios" ? 82 : 68
  }

  const bottomPadding = useMemo(
    () => Platform.OS === "ios"
      ? Math.max(tabBarHeight - insets.bottom, 20)
      : tabBarHeight + 20,
    [tabBarHeight, insets.bottom]
  )

  const firstName = useMemo(
    () => residentProfile?.firstName || residentProfile?.first_name || 'Resident',
    [residentProfile]
  )

  // Memoized modal handlers to prevent unnecessary function recreation
  const handleDismissWelcome = useCallback(() => {
    setShowWelcomeModal(false)
    hookDismissWelcome()
  }, [hookDismissWelcome])

  const handleDismissVerified = useCallback(() => {
    setShowVerifiedModal(false)
    hookDismissVerified()
  }, [hookDismissVerified])

  const handleDismissRejected = useCallback(() => {
    setShowRejectedModal(false)
    hookDismissRejected()
  }, [hookDismissRejected])

  const handleOpenResubmit = useCallback(() => {
    handleDismissRejected()
    setTimeout(() => {
      setShowResubmitModal(true)
    }, 300)
  }, [handleDismissRejected])

  const handleCloseResubmit = useCallback(() => {
    setShowResubmitModal(false)
  }, [])

  const handleResubmitSuccess = useCallback(() => {
    if (refreshProfile) {
      refreshProfile()
    }
  }, [refreshProfile])

  const handleDismissVerificationRequired = useCallback(() => {
    setShowVerificationRequired(false)
  }, [])

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ExpoStatusBar style="auto" translucent={true} />

      <HomeHeader insets={insets} navigation={navigation} firstName={firstName} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: bottomPadding,
            flexGrow: 1,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 0,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <QuickActions navigation={navigation} />

        <View style={{ paddingHorizontal: 20 }}>
          <RecentAnnouncement
            recentAnnouncements={recentAnnouncements}
            announcementsLoading={announcementsLoading}
            navigation={navigation}
          />
        </View>

        <View style={{ paddingHorizontal: 40 }}>
          <AnimatedScrollArrow scrollY={scrollY} />
        </View>

        <FacilityGrid navigation={navigation} />
      </ScrollView>

      {/* Optimized Modals with memoized components */}

      {/* Welcome Modal - shown on first-time verification success */}
      <WelcomeModal
        visible={showWelcomeModal}
        onDismiss={handleDismissWelcome}
        userName={firstName}
      />

      {/* Verified Modal - shown when verification is approved */}
      <VerifiedModal
        visible={showVerifiedModal}
        onDismiss={handleDismissVerified}
        userName={firstName}
      />

      {/* Rejection Modal - shown when verification is rejected */}
      <RejectedModal
        visible={showRejectedModal}
        onDismiss={handleDismissRejected}
        onResubmit={handleOpenResubmit}
        userName={firstName}
        rejectionReason={rejectionReason}
      />

      {/* Resubmit Modal - shown when user wants to resubmit after rejection */}
      <ResubmitModal
        visible={showResubmitModal}
        onDismiss={handleCloseResubmit}
        onSuccess={handleResubmitSuccess}
        userName={firstName}
        rejectionReason={rejectionReason}
        currentProfile={residentProfile}
      />

      {/* Verification Required Modal - shown when accessing restricted features */}
      <VerificationRequiredModal
        visible={showVerificationRequired}
        onClose={handleDismissVerificationRequired}
        featureName="Facility Reservations"
      />
    </SafeAreaView>
  )
}