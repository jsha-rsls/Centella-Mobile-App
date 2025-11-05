import { View, Text, Animated } from "react-native"
import { styles } from "./styles/badgeStyles"
import { getAnnouncementBadge } from "../../../utils/announcementUtils"

export default function BadgeRenderer({ 
  announcement, 
  pulseAnim, 
  recentBadgeAnim 
}) {
  const badgeInfo = getAnnouncementBadge(announcement.created_at)
  
  if (!badgeInfo) return null

  return (
    <View style={[styles.timeBadge, { backgroundColor: badgeInfo.color }]}>
      {badgeInfo.shouldPulse && (
        <Animated.View 
          style={[
            styles.badgePulse,
            { backgroundColor: badgeInfo.color },
            {
              opacity: pulseAnim.interpolate({
                inputRange: [0.5, 1],
                outputRange: [0.1, 0.3],
              }),
              transform: [
                {
                  scale: pulseAnim.interpolate({
                    inputRange: [0.5, 1],
                    outputRange: [1, 1.03],
                  })
                }
              ]
            }
          ]} 
        />
      )}
      {badgeInfo.shouldAnimate && (
        <Animated.View 
          style={[
            styles.badgeSubtleAnimation,
            { backgroundColor: badgeInfo.color },
            {
              transform: [{ scale: recentBadgeAnim }]
            }
          ]} 
        />
      )}
      <Text style={styles.badgeText}>{badgeInfo.text}</Text>
    </View>
  )
}