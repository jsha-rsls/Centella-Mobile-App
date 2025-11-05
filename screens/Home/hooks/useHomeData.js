import { useState, useEffect, useRef } from "react"
import { AppState } from "react-native"
import { announcementService } from "../../../services/announcementService"

export const useHomeData = () => {
  const [recentAnnouncements, setRecentAnnouncements] = useState([])
  const [announcementsLoading, setAnnouncementsLoading] = useState(false)
  const subscriptionRef = useRef(null)
  const retryTimeoutRef = useRef(null)
  const retryCountRef = useRef(0)
  const isMountedRef = useRef(true)
  const appStateRef = useRef(AppState.currentState)

  const MAX_RETRIES = 3
  const RETRY_DELAY = 2000

  useEffect(() => {
    isMountedRef.current = true
    fetchRecentAnnouncements()
    setupRealtimeSubscription()

    // Handle app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange)

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false
      cleanupSubscription()
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
      subscription?.remove()
    }
  }, [])

  const handleAppStateChange = (nextAppState) => {
    console.log('🏠 App state changed:', appStateRef.current, '→', nextAppState)
    
    // If coming back to active from background, reconnect subscription
    if (
      appStateRef.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('🏠 App became active, reconnecting subscription...')
      reconnectSubscription()
    }
    
    appStateRef.current = nextAppState
  }

  const cleanupSubscription = () => {
    if (subscriptionRef.current) {
      console.log('🏠 Cleaning up subscription...')
      announcementService.unsubscribeFromAnnouncements(subscriptionRef.current)
      subscriptionRef.current = null
    }
  }

  const reconnectSubscription = () => {
    cleanupSubscription()
    retryCountRef.current = 0
    if (isMountedRef.current) {
      setupRealtimeSubscription()
      // Also refetch data to ensure we're in sync
      fetchRecentAnnouncements()
    }
  }

  const fetchRecentAnnouncements = async () => {
    if (!isMountedRef.current) return

    try {
      setAnnouncementsLoading(true)
      const data = await announcementService.getRecentAnnouncements(2)
      
      if (isMountedRef.current) {
        setRecentAnnouncements(data)
        console.log('🏠 Fetched recent announcements:', data.length)
      }
    } catch (error) {
      console.error('🏠 Error fetching recent announcements:', error)
      // Retry fetch on error
      if (retryCountRef.current < MAX_RETRIES && isMountedRef.current) {
        retryCountRef.current++
        retryTimeoutRef.current = setTimeout(() => {
          fetchRecentAnnouncements()
        }, RETRY_DELAY * retryCountRef.current)
      }
    } finally {
      if (isMountedRef.current) {
        setAnnouncementsLoading(false)
      }
    }
  }

  const setupRealtimeSubscription = () => {
    if (!isMountedRef.current) return

    console.log('🏠 Setting up realtime subscription...')
    
    try {
      subscriptionRef.current = announcementService.subscribeToAnnouncements(
        handleRealtimeUpdate
      )

      // Verify subscription was created
      if (!subscriptionRef.current) {
        console.error('🏠 Failed to create subscription, retrying...')
        if (retryCountRef.current < MAX_RETRIES && isMountedRef.current) {
          retryCountRef.current++
          retryTimeoutRef.current = setTimeout(() => {
            setupRealtimeSubscription()
          }, RETRY_DELAY * retryCountRef.current)
        }
      } else {
        console.log('🏠 Subscription created successfully')
        retryCountRef.current = 0 // Reset retry count on success
      }
    } catch (error) {
      console.error('🏠 Error setting up subscription:', error)
      // Retry on error
      if (retryCountRef.current < MAX_RETRIES && isMountedRef.current) {
        retryCountRef.current++
        retryTimeoutRef.current = setTimeout(() => {
          setupRealtimeSubscription()
        }, RETRY_DELAY * retryCountRef.current)
      }
    }
  }

  const handleRealtimeUpdate = (payload) => {
    if (!isMountedRef.current) {
      console.log('🏠 Component unmounted, ignoring update')
      return
    }

    console.log('🏠 Received realtime update:', {
      event: payload.eventType,
      id: payload.new?.id || payload.old?.id,
      title: payload.new?.title || payload.old?.title
    })

    const { eventType, new: newRecord, old: oldRecord } = payload

    setRecentAnnouncements(currentAnnouncements => {
      // Create a copy to work with
      let updatedAnnouncements = [...currentAnnouncements]
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      try {
        switch (eventType) {
          case 'INSERT':
            if (newRecord?.status === 'published') {
              const createdAt = new Date(newRecord.created_at)
              
              if (createdAt >= sevenDaysAgo) {
                console.log('🏠 Adding new announcement:', newRecord.title)
                // Add to beginning and limit to 2
                updatedAnnouncements = [newRecord, ...updatedAnnouncements].slice(0, 2)
              } else {
                console.log('🏠 Skipping INSERT (too old):', newRecord.title)
              }
            }
            break

          case 'UPDATE':
            const recordId = newRecord?.id || oldRecord?.id
            const updateIndex = updatedAnnouncements.findIndex(a => a.id === recordId)
            
            if (updateIndex !== -1) {
              // Exists in current list
              if (newRecord?.status === 'published') {
                const createdAt = new Date(newRecord.created_at)
                
                if (createdAt >= sevenDaysAgo) {
                  console.log('🏠 Updating announcement:', newRecord.title)
                  updatedAnnouncements[updateIndex] = newRecord
                } else {
                  console.log('🏠 Removing announcement (no longer recent):', newRecord.title)
                  updatedAnnouncements.splice(updateIndex, 1)
                }
              } else {
                console.log('🏠 Removing announcement (unpublished):', oldRecord?.title)
                updatedAnnouncements.splice(updateIndex, 1)
              }
            } else {
              // Doesn't exist, maybe newly published
              if (newRecord?.status === 'published') {
                const createdAt = new Date(newRecord.created_at)
                
                if (createdAt >= sevenDaysAgo) {
                  console.log('🏠 Adding newly published announcement:', newRecord.title)
                  updatedAnnouncements = [newRecord, ...updatedAnnouncements].slice(0, 2)
                }
              }
            }
            break

          case 'DELETE':
            const deleteId = oldRecord?.id
            const originalLength = updatedAnnouncements.length
            updatedAnnouncements = updatedAnnouncements.filter(a => a.id !== deleteId)
            
            if (updatedAnnouncements.length !== originalLength) {
              console.log('🏠 Removed deleted announcement')
              
              // If we now have less than 2, refetch to fill the gap
              if (updatedAnnouncements.length < 2 && isMountedRef.current) {
                console.log('🏠 Refetching to fill gap after deletion')
                setTimeout(() => fetchRecentAnnouncements(), 500)
                return currentAnnouncements // Return current while we fetch
              }
            }
            break

          default:
            console.log('🏠 Unknown event type:', eventType)
            break
        }

        // Sort by created_at descending and ensure we only keep top 2
        const sorted = updatedAnnouncements
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 2)

        console.log('🏠 Updated announcements count:', sorted.length)
        return sorted

      } catch (error) {
        console.error('🏠 Error processing realtime update:', error)
        // On error, return current state and refetch
        if (isMountedRef.current) {
          setTimeout(() => fetchRecentAnnouncements(), 1000)
        }
        return currentAnnouncements
      }
    })
  }

  return {
    recentAnnouncements,
    announcementsLoading,
    fetchRecentAnnouncements,
    reconnectSubscription // Export for manual reconnection if needed
  }
}