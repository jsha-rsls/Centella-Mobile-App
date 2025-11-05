import { View, Text, ScrollView, RefreshControl, Animated } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import { LinearGradient } from 'expo-linear-gradient'
import { useState, useEffect } from "react"

import { styles } from "./styles/aAnnouncement"
import SearchHeader from "./components/SearchHeader"
import AnnouncementList from "./components/AnnouncementList"
import { useAnnouncementData } from "./hooks/useAnnouncementData"
import { useAnnouncementAnimations } from "./hooks/useAnnouncementAnimations"
import { useAnnouncementFilters } from "./hooks/useAnnouncementFilters"
import { getTabBarHeight } from "./utils/platformUtils"
import SkeletonLoader from "./components/SkeletonLoader"

export default function AllAnnouncements({ navigation }) {
  const insets = useSafeAreaInsets()
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  
  // Custom hooks for data management
  const {
    announcements,
    loading,
    refreshing,
    error,
    viewingAnnouncement,
    fetchAllAnnouncements,
    handleAnnouncementPress,
    onRefresh
  } = useAnnouncementData(navigation)
  
  // Custom hook for animations
  const {
    showSkeleton,
    skeletonFadeOut,
    contentReady,
    contentOpacity,
    contentStaggerAnims,
    badgeAnimations,
    headerAnim,
    handleSkeletonFadeComplete
  } = useAnnouncementAnimations(loading, refreshing, announcements)
  
  // Custom hook for filtering
  const { filteredAnnouncements } = useAnnouncementFilters(
    announcements, 
    searchQuery, 
    activeFilter
  )
  
  // Platform-specific tab bar height calculation
  const tabBarHeight = getTabBarHeight(insets)
  
  useEffect(() => {
    fetchAllAnnouncements()
  }, [])

  return (
    <SafeAreaView 
      style={styles.container} 
      edges={['left', 'right', 'bottom']}  // 🔹 exclude top so header overlaps status bar
    >
      <ExpoStatusBar style="auto" translucent backgroundColor="transparent" />

      {/* Header */}
      <LinearGradient
        colors={["#F9E6E6", "#F2D5D5", "#F9E6E6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 8 }]} // 🔹 manually add safe top
      >
        <View style={styles.headerContentCentered}>
          <Text style={styles.headerTitle}>All Announcements</Text>
          <Text style={styles.headerSubtitle}>From Homeowners Association</Text>
        </View>
      </LinearGradient>

  {/* Search Header Component */}
  {contentReady && (
    <Animated.View style={{ opacity: contentOpacity }}>
      <SearchHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        announcements={announcements}
      />
    </Animated.View>
  )}

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={[{ paddingBottom: tabBarHeight }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
            title="Pull to refresh..."
            titleColor="#666"
          />
        }
      >
        {/* Content with skeleton and announcement list */}
        <View style={{ position: 'relative' }}>
          {/* Skeleton Layer */}
          {showSkeleton && (
            <View style={{ 
              position: showSkeleton && !skeletonFadeOut ? 'relative' : 'absolute', 
              top: 0, left: 0, right: 0, 
              zIndex: skeletonFadeOut ? 1 : 2 
            }}>
              <SkeletonLoader 
                count={5} 
                fadeOut={skeletonFadeOut}
                onFadeComplete={handleSkeletonFadeComplete}
              />
            </View>
          )}
          
          {/* Content Layer */}
          <AnnouncementList
            announcements={filteredAnnouncements}
            contentReady={contentReady}
            contentOpacity={contentOpacity}
            contentStaggerAnims={contentStaggerAnims}
            showSkeleton={showSkeleton}
            searchQuery={searchQuery}
            activeFilter={activeFilter}
            error={error}
            viewingAnnouncement={viewingAnnouncement}
            badgeAnimations={badgeAnimations}
            onAnnouncementPress={handleAnnouncementPress}
            onRefresh={onRefresh}
            onClearFilters={() => {
              setSearchQuery('')
              setActiveFilter('all')
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
