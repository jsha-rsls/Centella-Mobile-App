import React, { useState, useEffect, useRef } from "react"
import { View, Text, TouchableOpacity, ActivityIndicator, Animated, Dimensions, Image } from "react-native"
import { Ionicons } from '@expo/vector-icons'
import { announcementService } from "../../services/announcementService"
import { formatRelativeDate, isVeryRecentAnnouncement, formatEnhancedRelativeDate } from "../../utils/announcementUtils"
import HTMLRenderer from "./HTMLRenderer"
import BadgeRenderer from "./components/BadgeRenderer"
import { BadgeAnimations } from "./utils/BadgeAnimations"
import { styles } from "./styles/recentAStyles"

// Helper to get plain text length from HTML
function getPlainTextLength(html) {
  if (!html) return 0
  return html.replace(/<[^>]*>/g, '').trim().length
}

// Helper to truncate HTML content
function truncateHTML(html, maxLength = 80) {
  if (!html) return ''
  const plainText = html.replace(/<[^>]*>/g, '').trim()
  if (plainText.length <= maxLength) return html
  
  // Truncate and add ellipsis
  const truncated = plainText.substring(0, maxLength).trim()
  return truncated + '...'
}

export default function AnnouncementCard({ 
  recentAnnouncements, 
  announcementsLoading, 
  navigation 
}) {
  const [pressedItem, setPressedItem] = useState(null)
  const [viewingAnnouncement, setViewingAnnouncement] = useState(null)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  
  // Initialize badge animations manager
  const badgeAnimations = useRef(new BadgeAnimations()).current
  
  const { width: screenWidth } = Dimensions.get('window')
  const isLargeScreen = screenWidth > 400
  
  useEffect(() => {
    badgeAnimations.startAnimations()
    
    if (!announcementsLoading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        })
      ]).start()
    }
    
    return () => {
      badgeAnimations.stopAnimations()
    }
  }, [announcementsLoading])

  const handleAnnouncementPress = async (announcement) => {
    try {
      setViewingAnnouncement(announcement.id)
      await announcementService.incrementViews(announcement.id)
    } catch (error) {
      console.error('Error incrementing views:', error)
    } finally {
      setViewingAnnouncement(null)
    }
    
    navigation.navigate("ViewAnnouncement", { announcement })
  }

  const handleSeeAllRecentAnnouncements = () => {
    navigation.navigate("Announcements")
  }

  const renderLoadingSkeleton = () => (
    <View style={styles.loadingContainer}>
      {[1, 2, 3].map((item) => (
        <View key={item} style={styles.skeletonItem}>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonContent} />
          <View style={styles.skeletonMeta} />
        </View>
      ))}
    </View>
  )

  return (
    <View style={styles.card}>
      {/* Clean Header without button */}
      <View style={[styles.header, isLargeScreen && styles.headerLarge]}>
        <View style={styles.titleRow}>
          <Ionicons 
            name="megaphone-outline" 
            size={isLargeScreen ? 24 : 26} 
            color="#231828" 
            style={styles.announcementIcon}
          />
          <View style={styles.titleContainer}>
            <Text style={[styles.title, isLargeScreen && styles.titleLarge]}>
              Recent Announcements
            </Text>
            <Text style={[styles.subtitle, isLargeScreen && styles.subtitleLarge]}>
              Homeowners Association
            </Text>
          </View>
        </View>
      </View>
      
      {announcementsLoading ? (
        renderLoadingSkeleton()
      ) : (
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {recentAnnouncements.length > 0 ? recentAnnouncements.map((announcement, index) => {
            const titleLength = getPlainTextLength(announcement.title)
            const truncatedTitle = truncateHTML(announcement.title, 80)
            const isTitleTruncated = titleLength > 80
            
            return (
              <Animated.View
                key={announcement.id}
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }}
              >
                <TouchableOpacity 
                  style={[
                    styles.item,
                    pressedItem === announcement.id && styles.itemPressed
                  ]} 
                  onPress={() => handleAnnouncementPress(announcement)}
                  onPressIn={() => setPressedItem(announcement.id)}
                  onPressOut={() => setPressedItem(null)}
                  activeOpacity={0.8}
                >
                  <View style={styles.itemContainer}>
                    <View style={styles.itemHeader}>
                      <HTMLRenderer
                        html={truncatedTitle}
                        style={styles.itemTitle}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      />
                    </View>
                    
                    {/* Badge positioned absolutely in top-right */}
                    <View style={styles.badgeContainer}>
                      <BadgeRenderer
                        announcement={announcement}
                        pulseAnim={badgeAnimations.getPulseAnim()}
                        recentBadgeAnim={badgeAnimations.getRecentBadgeAnim()}
                      />
                    </View>
                  </View>
                  
                  <HTMLRenderer
                    html={announcement.content}
                    style={styles.itemContent}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  />
                  
                  <View style={styles.itemFooter}>
                    <View style={styles.dateContainer}>
                      {isVeryRecentAnnouncement(announcement.created_at) && (
                        <Ionicons 
                          name="time-outline" 
                          size={14} 
                          color="#3B82F6" 
                          style={styles.clockIcon}
                        />
                      )}
                      <Text 
                        style={[
                          styles.date,
                          isVeryRecentAnnouncement(announcement.created_at) && styles.veryRecentDate
                        ]}
                      >
                        {(() => {
                          const dateInfo = formatEnhancedRelativeDate(announcement.created_at)
                          return dateInfo.text
                        })()}
                      </Text>
                    </View>
                    
                    {viewingAnnouncement === announcement.id ? (
                      <ActivityIndicator size="small" color="#231828" />
                    ) : (
                      <View style={styles.readMoreContainer}>
                        <Text style={styles.readMore}>Read more</Text>
                        <Ionicons 
                          name="chevron-forward" 
                          size={14} 
                          color="#231828" 
                          style={styles.readMoreArrow}
                        />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )
          }) : (
            <View style={styles.emptyState}>
              <Image 
                source={require('../../assets/announcement.png')}
                style={styles.emptyImage}
                resizeMode="contain"
              />
              <Text style={styles.emptyText}>No announcements yet</Text>
              <Text style={styles.emptySubtext}>New updates will appear here</Text>
            </View>
          )}
          
          {/* See all button at bottom */}
          {recentAnnouncements.length > 0 && (
            <TouchableOpacity 
              style={[
                styles.seeAllButtonBottom,
                pressedItem === 'seeAll' && styles.seeAllButtonPressed
              ]} 
              onPress={handleSeeAllRecentAnnouncements}
              onPressIn={() => setPressedItem('seeAll')}
              onPressOut={() => setPressedItem(null)}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllBottomText}>
                View all announcements
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={16} 
                color="#231828" 
                style={styles.chevronIcon}
              />
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
    </View>
  )
}