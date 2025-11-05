import { View, Text, TouchableOpacity, ActivityIndicator, Animated } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { styles } from "../styles/aAnnouncement"
import HTMLRenderer from "../HTMLRenderer"
import BadgeRenderer from "./BadgeRenderer"
import { isVeryRecentAnnouncement, formatEnhancedRelativeDate } from "../../../utils/announcementUtils"

export default function AnnouncementCard({
  announcement,
  index,
  contentStaggerAnims,
  searchQuery,
  viewingAnnouncement,
  badgeAnimations,
  onPress
}) {
  const cardAnim = contentStaggerAnims[index] || new Animated.Value(1)
  
  const cardAnimStyle = {
    opacity: cardAnim,
    transform: [
      {
        translateY: cardAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [15, 0],
        }),
      },
      {
        scale: cardAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.98, 1],
        }),
      },
    ],
  }

  return (
    <Animated.View style={cardAnimStyle}>
      <TouchableOpacity 
        style={styles.announcementCard}
        onPress={() => onPress(announcement)}
        activeOpacity={0.85}
      >
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <HTMLRenderer
              html={announcement.title}
              style={styles.announcementTitle}
              highlightQuery={searchQuery.trim()}
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
        
        {/* Render content with HTML formatting, truncation, and highlighting */}
        <HTMLRenderer
          html={announcement.content}
          style={styles.announcementContent}
          numberOfLines={3}
          highlightQuery={searchQuery.trim()}
        />
        
        <View style={styles.announcementFooter}>
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
                styles.announcementDate,
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
}