import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { notificationService } from '../../../../services/notificationService'
import { getIconColor } from '../../utils/notificationUtils'
import { styles } from '../styles/NotificationItemStyles'

// Utility function to strip HTML tags and clean text
const stripHtmlTags = (html) => {
  if (!html) return ''
  
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '')
  
  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
  
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim()
  
  return text
}

export const NotificationItem = ({ notification, onPress }) => {
  const iconColor = getIconColor(notification.type)
  const timeAgo = notificationService.formatTimeAgo(notification.createdAt)
  
  // Clean the message text
  const cleanMessage = stripHtmlTags(notification.message)

  return (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        !notification.read && styles.unreadNotification
      ]}
      onPress={() => onPress(notification)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
        <Ionicons 
          name={notification.icon} 
          size={24} 
          color={iconColor} 
        />
      </View>

      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>
            {notification.title}
          </Text>
          {!notification.read && <View style={styles.unreadDot} />}
        </View>
        
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {cleanMessage}
        </Text>
        
        <Text style={styles.notificationTime}>
          {timeAgo}
        </Text>
      </View>
    </TouchableOpacity>
  )
}