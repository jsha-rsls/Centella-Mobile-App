import React from 'react'
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNotifications } from '../hooks/useNotifications'
import { NotificationHeader } from './notification/NotificationHeader'
import { NotificationItem } from './notification/NotificationItem'
import { EmptyNotifications } from './notification/EmptyNotifications'
import { styles } from './styles/NotificationsScreenStyles'
import * as announcementService from '../../../services/announcementService'

export default function NotificationsScreen({ navigation }) {
  const { top } = useSafeAreaInsets()
  const {
    notifications,
    unreadNotifications,
    readNotifications,
    unreadCount,
    loading,
    markAllAsRead,
    markAsRead
  } = useNotifications()

  const handleNotificationPress = async (notification) => {
    await markAsRead(notification.id)

    if (notification.type === 'announcement' && notification.data?.announcementId) {
      try {
        // fetch the latest announcement by id
        const announcement = await announcementService.getAnnouncementById(notification.data.announcementId)

        if (announcement) {
          navigation.navigate('ViewAnnouncement', { announcement })
        } else {
          // If not found, inform user instead of silently navigating away
          console.warn('Announcement not found for id', notification.data.announcementId)
          Alert.alert('Announcement not found', 'This announcement may have been removed.')
        }
      } catch (error) {
        console.error('Error fetching announcement:', error)
        Alert.alert('Error', 'Failed to load the announcement.')
      }
    } else if (notification.type === 'verification') {
      navigation.navigate('MainTabs', { screen: 'Home' })
    } else if (notification.type === 'rejection') {
      navigation.navigate('Profile')
    } else if (notification.type === 'status') {
      navigation.navigate('MainTabs', { screen: 'Home' })
    }
  }

  return (
    <View style={styles.container}>
      <NotificationHeader
        top={top}
        unreadCount={unreadCount}
        onBack={() => navigation.goBack()}
        onMarkAll={markAllAsRead}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {notifications.length === 0 ? (
            <EmptyNotifications />
          ) : (
            <>
              {unreadCount > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>New</Text>
                  {unreadNotifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onPress={() => handleNotificationPress(notification)}
                    />
                  ))}
                </View>
              )}

              {readNotifications.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Earlier</Text>
                  {readNotifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onPress={() => handleNotificationPress(notification)}
                    />
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}
    </View>
  )
}
