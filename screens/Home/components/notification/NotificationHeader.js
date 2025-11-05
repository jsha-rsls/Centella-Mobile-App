import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { styles } from '../styles/NotificationsScreenStyles'

export const NotificationHeader = ({ 
  top, 
  unreadCount, 
  onBack, 
  onMarkAll 
}) => (
  <LinearGradient
    colors={["#F9E6E6", "#F2D5D5", "#F9E6E6"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.header, { paddingTop: top + 8 }]}
  >
    <View style={styles.headerContent}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBack}
      >
        <Ionicons name="arrow-back" size={24} color="#2d1b2e" />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.markAllButton}
        onPress={onMarkAll}
      >
        <Ionicons name="checkmark-done" size={24} color="#8B5CF6" />
      </TouchableOpacity>
    </View>
  </LinearGradient>
)