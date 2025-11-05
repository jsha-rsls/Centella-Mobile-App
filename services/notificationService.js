import { supabase } from '../utils/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppState } from 'react-native'

const NOTIFICATIONS_STORAGE_KEY = '@centella_notifications'

// Keep a map of active subscriptions per user so we don't create duplicates
const userSubscriptions = new Map()

export const notificationService = {
  /**
   * Initialize notifications for a user
   * Loads existing notifications and sets up real-time subscriptions (only once)
   */
  async initialize(userId, callbacks = {}) {
    try {
      console.log('🔔 Initializing notifications for user:', userId)

      // Load stored notifications
      const stored = await this.getStoredNotifications(userId)

      // Setup subscriptions if not already set up for this user
      const existing = userSubscriptions.get(userId)
      if (!existing) {
        const subs = await this.setupSubscriptions(userId, callbacks)
        // store subs even if null so we don't keep trying to create multiple times
        userSubscriptions.set(userId, subs)
      } else {
        // Update callbacks if caller provided new callbacks
        if (existing && callbacks) {
          existing._callbacks = { ...(existing._callbacks || {}), ...callbacks }
        }
      }

      return stored
    } catch (error) {
      console.error('Error initializing notifications:', error)
      return []
    }
  },

  /**
   * Get stored notifications from AsyncStorage
   */
  async getStoredNotifications(userId) {
    try {
      const key = `${NOTIFICATIONS_STORAGE_KEY}_${userId}`
      const stored = await AsyncStorage.getItem(key)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error getting stored notifications:', error)
      return []
    }
  },

  /**
   * Save notifications to AsyncStorage
   */
  async saveNotifications(userId, notifications) {
    try {
      const key = `${NOTIFICATIONS_STORAGE_KEY}_${userId}`
      await AsyncStorage.setItem(key, JSON.stringify(notifications))
      return true
    } catch (error) {
      console.error('Error saving notifications:', error)
      return false
    }
  },

  /**
   * Add a new notification (persist and return the created notification)
   */
  async addNotification(userId, notification) {
    try {
      const notifications = await this.getStoredNotifications(userId)

      const newNotification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...notification,
        read: false,
        createdAt: new Date().toISOString()
      }

      const updated = [newNotification, ...notifications]
      await this.saveNotifications(userId, updated)

      console.log('🔔 New notification added:', newNotification.title)
      return newNotification
    } catch (error) {
      console.error('Error adding notification:', error)
      return null
    }
  },

  async markAsRead(userId, notificationId) {
    try {
      const notifications = await this.getStoredNotifications(userId)
      const updated = notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
      await this.saveNotifications(userId, updated)
      return true
    } catch (error) {
      console.error('Error marking notification as read:', error)
      return false
    }
  },

  async markAllAsRead(userId) {
    try {
      const notifications = await this.getStoredNotifications(userId)
      const updated = notifications.map(n => ({ ...n, read: true }))
      await this.saveNotifications(userId, updated)
      return true
    } catch (error) {
      console.error('Error marking all as read:', error)
      return false
    }
  },

  async deleteNotification(userId, notificationId) {
    try {
      const notifications = await this.getStoredNotifications(userId)
      const updated = notifications.filter(n => n.id !== notificationId)
      await this.saveNotifications(userId, updated)
      return true
    } catch (error) {
      console.error('Error deleting notification:', error)
      return false
    }
  },

  async clearAll(userId) {
    try {
      await this.saveNotifications(userId, [])
      return true
    } catch (error) {
      console.error('Error clearing notifications:', error)
      return false
    }
  },

  /**
   * Setup subscriptions (idempotent per userId)
   * Returns an object describing subscriptions (or null)
   */
  async setupSubscriptions(userId, callbacks = {}) {
    console.log('🔔 Setting up notification subscriptions for user:', userId)

    // If already have subscriptions for this user, return them (but merge callbacks)
    const existing = userSubscriptions.get(userId)
    if (existing) {
      existing._callbacks = { ...(existing._callbacks || {}), ...callbacks }
      console.log('🔔 Subscriptions already exist for user, returning existing object')
      return existing
    }

    try {
      // Create resident status subscription
      const residentSubscription = this.subscribeToResidentStatus(userId, callbacks.onResidentStatusChange)

      // Create announcements subscription
      const announcementSubscription = this.subscribeToAnnouncements(userId, callbacks.onNewAnnouncement)

      const container = {
        residentSubscription,
        announcementSubscription,
        _callbacks: callbacks
      }

      userSubscriptions.set(userId, container)
      return container
    } catch (error) {
      console.error('Error setting up subscriptions:', error)
      return null
    }
  },

  /**
   * Subscribe to resident status changes
   * Uses a stable channel name per userId (so we can safely unsubscribe later)
   */
  subscribeToResidentStatus(userId, callback) {
    console.log('🔔 Setting up resident status subscription for', userId)

    try {
      const channelName = `public:resident_status:user:${userId}`

      // If a channel with the same name already exists in supabase client, remove it first
      const existing = Array.from(supabase.getChannels ? supabase.getChannels() : []).find(c => c.topic === channelName)
      if (existing) {
        try {
          // remove old channel to avoid duplicates
          supabase.removeChannel(existing)
        } catch (err) {
          // ignore
        }
      }

      const subscription = supabase
        .channel(channelName, {
          config: {
            broadcast: { self: false }
          }
        })
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'residents',
            filter: `user_id=eq.${userId}`
          },
          async (payload) => {
            try {
              console.log('🔔 Resident status update received:', payload)

              const { old: oldRecord, new: newRecord } = payload

              // Guard if records not present
              if (!oldRecord || !newRecord) return

              // Only proceed on real status change
              if (oldRecord.status !== newRecord.status) {
                console.log(`🔔 Status changed: ${oldRecord.status} → ${newRecord.status}`)

                let notification = null

                if (newRecord.status === 'verified') {
                  notification = {
                    type: 'verification',
                    title: 'Registration Verified! 🎉',
                    message: 'Your homeowner registration has been approved. Welcome to Centella Homes!',
                    icon: 'checkmark-circle-outline',
                    data: {
                      status: 'verified',
                      timestamp: newRecord.updated_at
                    }
                  }
                } else if (newRecord.status === 'rejected') {
                  const reason = newRecord.rejection_reason || 'Please contact administration for details.'
                  notification = {
                    type: 'rejection',
                    title: 'Registration Update Required',
                    message: `Your registration needs attention: ${reason}`,
                    icon: 'alert-circle-outline',
                    data: {
                      status: 'rejected',
                      reason: newRecord.rejection_reason,
                      timestamp: newRecord.updated_at
                    }
                  }
                } else if (newRecord.status === 'pending' && oldRecord.status === 'unverified') {
                  notification = {
                    type: 'status',
                    title: 'Registration Under Review',
                    message: 'Your registration is being reviewed by our team. We\'ll notify you once it\'s processed.',
                    icon: 'time-outline',
                    data: {
                      status: 'pending',
                      timestamp: newRecord.updated_at
                    }
                  }
                }

                if (notification) {
                  const added = await this.addNotification(userId, notification)
                  if (callback) callback(added)
                }
              }
            } catch (err) {
              console.error('🔔 Error handling resident payload:', err)
            }
          }
        )
        .subscribe((status, err) => {
          console.log('🔔 Resident status subscription:', status, err ? `Error: ${err}` : '')
          if (status === 'SUBSCRIBED') {
            // nothing else needed, the container manages subscriptions
          }
        })

      return subscription
    } catch (error) {
      console.error('🔔 Error creating resident status subscription:', error)
      return null
    }
  },

  /**
   * Subscribe to announcements (stable channel so we don't create duplicates)
   */
subscribeToAnnouncements(userId, callback) {
  console.log('🔔 Setting up announcements subscription for', userId)

  try {
    const channelName = `public:announcements`

    // Remove existing duplicate channel if present
    const existing = Array.from(supabase.getChannels ? supabase.getChannels() : [])
      .find(c => c.topic === channelName)
    if (existing) {
      supabase.removeChannel(existing)
    }

    // Only subscribe to INSERT events — not UPDATE
    const subscription = supabase
      .channel(channelName, { config: { broadcast: { self: false } } })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'announcements'
        },
        async (payload) => {
          try {
            const announcement = payload.new
            if (!announcement) return

            // Only trigger for published announcements
            if (announcement.status === 'published') {
              console.log('🔔 New announcement inserted by admin:', announcement.title)

              const notification = {
                type: 'announcement',
                title: 'New Community Announcement',
                message: announcement.title,
                icon: 'megaphone-outline',
                data: {
                  announcementId: announcement.id,
                  category: announcement.category,
                  timestamp: announcement.published_at || announcement.created_at,
                  imageUrl: announcement.image_url
                }
              }

              const added = await this.addNotification(userId, notification)
              if (callback) callback(added)
            } else {
              console.log('⚪ Ignored announcement (status not published):', announcement.status)
            }
          } catch (err) {
            console.error('🔔 Error handling announcement INSERT payload:', err)
          }
        }
      )
      .subscribe((status, err) => {
        console.log('🔔 Announcements subscription:', status, err ? `Error: ${err}` : '')
      })

    return subscription
  } catch (error) {
    console.error('🔔 Error creating announcements subscription:', error)
    return null
  }
},

  /**
   * Unsubscribe a single subscription object returned from supabase.channel(...)
   */
  async unsubscribe(subscription) {
    if (!subscription) return

    try {
      console.log('🔔 Unsubscribing subscription...')
      // Find the user entry that contains this subscription and remove it from map if present
      for (const [userId, container] of userSubscriptions.entries()) {
        if (!container) continue
        const contains =
          container.residentSubscription === subscription ||
          container.announcementSubscription === subscription

        if (contains) {
          // remove only the matching channel from the container
          if (container.residentSubscription === subscription) container.residentSubscription = null
          if (container.announcementSubscription === subscription) container.announcementSubscription = null

          // if both are null, delete the map entry
          if (!container.residentSubscription && !container.announcementSubscription) {
            userSubscriptions.delete(userId)
          } else {
            userSubscriptions.set(userId, container)
          }

          break
        }
      }

      await supabase.removeChannel(subscription)
      console.log('🔔 Successfully unsubscribed')
    } catch (error) {
      console.error('🔔 Error unsubscribing:', error?.message || error)
    }
  },

  /**
   * Clean up all active subscriptions (used on app background / sign out)
   */
  async cleanup() {
    console.log('🔔 Cleaning up all notification subscriptions...')
    for (const [userId, container] of userSubscriptions.entries()) {
      try {
        if (container?.residentSubscription) await supabase.removeChannel(container.residentSubscription)
        if (container?.announcementSubscription) await supabase.removeChannel(container.announcementSubscription)
      } catch (error) {
        console.error('🔔 Error cleaning up subscription for user', userId, error?.message || error)
      }
    }
    userSubscriptions.clear()
  },

  async getUnreadCount(userId) {
    try {
      const notifications = await this.getStoredNotifications(userId)
      return notifications.filter(n => !n.read).length
    } catch (error) {
      console.error('Error getting unread count:', error)
      return 0
    }
  },

  formatTimeAgo(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    return date.toLocaleDateString()
  }
}

// Auto-cleanup on app state change
if (typeof AppState !== 'undefined' && AppState.addEventListener) {
  AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      console.log('🔔 App going to background, cleaning up notification subscriptions...')
      notificationService.cleanup()
    }
  })
}
