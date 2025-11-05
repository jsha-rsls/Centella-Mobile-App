import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { styles } from '../styles/NotificationsScreenStyles'

export const EmptyNotifications = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="notifications-off-outline" size={80} color="#D1D5DB" />
    <Text style={styles.emptyTitle}>No notifications</Text>
    <Text style={styles.emptyText}>You're all caught up!</Text>
  </View>
)