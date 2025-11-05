import { useState, useEffect, useCallback, useRef } from 'react'
import { notificationService } from '../../../services/notificationService'
import { getCurrentUser } from '../../../services/residentService'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [subscriptions, setSubscriptions] = useState(null)
  const [userId, setUserId] = useState(null)

  // Use ref to track whether init is in progress/cancelled
  const isMountedRef = useRef(true)
  const initInProgressRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Get current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser()
        if (user) {
          setUserId(user.id)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching current user:', error)
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  // Initialize notifications and subscriptions (only once per session)
  useEffect(() => {
    if (!userId) return
    if (subscriptions) return // already initialized

    let cancelled = false
    initInProgressRef.current = true

    const init = async () => {
      try {
        setLoading(true)

        // Load stored notifications
        const stored = await notificationService.initialize(userId, {
          onResidentStatusChange: (notification) => {
            console.log('📱 Status change notification:', notification)
            if (notification && isMountedRef.current) {
              setNotifications(prev => [notification, ...prev])
            }
          },
          onNewAnnouncement: (notification) => {
            console.log('📱 New announcement notification:', notification)
            if (notification && isMountedRef.current) {
              setNotifications(prev => [notification, ...prev])
            }
          }
        })

        if (cancelled) return

        if (isMountedRef.current) {
          setNotifications(stored || [])
        }

        // Try to read the subscriptions object stored in notificationService
        // (notificationService.initialize stored it in its map). We can't access
        // the internal map here, but setupSubscriptions returns the subs container.
        // To keep local state consistent, call setupSubscriptions again but the
        // service will return the existing container.
        const subsContainer = await notificationService.setupSubscriptions(userId, {
          onResidentStatusChange: (notification) => {
            if (notification && isMountedRef.current) {
              setNotifications(prev => [notification, ...prev])
            }
          },
          onNewAnnouncement: (notification) => {
            if (notification && isMountedRef.current) {
              setNotifications(prev => [notification, ...prev])
            }
          }
        })

        if (cancelled) return

        if (isMountedRef.current) {
          setSubscriptions(subsContainer)
        }
      } catch (error) {
        console.error('Error initializing notifications:', error)
      } finally {
        initInProgressRef.current = false
        if (isMountedRef.current) setLoading(false)
      }
    }

    init()

    return () => {
      cancelled = true
      // do NOT unsubscribe here unconditionally; only cleanup if we created them and they were returned to us
      // but still attempt small cleanup if subscriptions exist
      if (subscriptions) {
        try {
          if (subscriptions.residentSubscription) {
            notificationService.unsubscribe(subscriptions.residentSubscription)
          }
          if (subscriptions.announcementSubscription) {
            notificationService.unsubscribe(subscriptions.announcementSubscription)
          }
        } catch (err) {
          console.warn('Error during notification cleanup:', err)
        }
        setSubscriptions(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!userId) return

    try {
      const success = await notificationService.markAllAsRead(userId)
      if (success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }, [userId])

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId) => {
    if (!userId) return

    try {
      const success = await notificationService.markAsRead(userId, notificationId)
      if (success) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        )
      }
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }, [userId])

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    if (!userId) return

    try {
      const success = await notificationService.deleteNotification(userId, notificationId)
      if (success) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }, [userId])

  // Clear all notifications
  const clearAll = useCallback(async () => {
    if (!userId) return

    try {
      const success = await notificationService.clearAll(userId)
      if (success) {
        setNotifications([])
      }
    } catch (error) {
      console.error('Error clearing notifications:', error)
    }
  }, [userId])

  // Refresh notifications from storage
  const refreshNotifications = useCallback(async () => {
    if (!userId) return

    try {
      setLoading(true)
      const stored = await notificationService.getStoredNotifications(userId)
      setNotifications(stored)
    } catch (error) {
      console.error('Error refreshing notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const unreadNotifications = notifications.filter(n => !n.read)
  const readNotifications = notifications.filter(n => n.read)
  const unreadCount = unreadNotifications.length

  return {
    notifications,
    unreadNotifications,
    readNotifications,
    unreadCount,
    loading,
    markAllAsRead,
    markAsRead,
    deleteNotification,
    clearAll,
    refreshNotifications
  }
}
