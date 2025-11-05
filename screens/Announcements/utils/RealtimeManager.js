import { announcementService } from "../../../services/announcementService"
import { AppState } from 'react-native'

export class RealtimeManager {
  constructor() {
    this.subscriptionRef = null
    this.isActive = false
    this.appStateSubscription = null
  }

  setupRealtimeSubscription(updateCallback) {
    // Clean up any existing subscription first
    this.cleanup()

    console.log('🔄 Setting up realtime subscription...')
    
    try {
      this.subscriptionRef = announcementService.subscribeToAnnouncements(
        (payload) => this.handleRealtimeUpdate(payload, updateCallback)
      )
      
      this.isActive = true
      
      // Set up app state listener for automatic cleanup
      this.setupAppStateListener()
      
      return this.subscriptionRef
    } catch (error) {
      console.error('🔄 Error setting up realtime subscription:', error)
      this.isActive = false
      return null
    }
  }

  setupAppStateListener() {
    // Remove existing listener if any
    if (this.appStateSubscription) {
      this.appStateSubscription.remove()
    }

    // Listen for app state changes
    this.appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        console.log('🔄 App going to background, pausing realtime...')
        this.cleanup()
      }
    })
  }

  handleRealtimeUpdate(payload, updateCallback) {
    if (!this.isActive) {
      console.log('🔄 Skipping realtime update - manager is inactive')
      return
    }

    const { eventType, new: newRecord, old: oldRecord } = payload

    updateCallback(currentAnnouncements => {
      let updatedAnnouncements = [...currentAnnouncements]

      switch (eventType) {
        case 'INSERT':
          // Add new announcement at the beginning (since we order by created_at desc)
          if (newRecord && newRecord.status === 'published') {
            // Check if it's not already in the list
            const exists = updatedAnnouncements.some(a => a.id === newRecord.id)
            if (!exists) {
              updatedAnnouncements = [newRecord, ...updatedAnnouncements]
              console.log('🔄 Added new announcement:', newRecord.id)
            }
          }
          break

        case 'UPDATE':
          // Update existing announcement
          const updateIndex = updatedAnnouncements.findIndex(a => a.id === newRecord.id)
          if (updateIndex !== -1) {
            if (newRecord.status === 'published') {
              updatedAnnouncements[updateIndex] = newRecord
              console.log('🔄 Updated announcement:', newRecord.id)
            } else {
              // If status changed to not published, remove it
              updatedAnnouncements.splice(updateIndex, 1)
              console.log('🔄 Removed unpublished announcement:', newRecord.id)
            }
          } else if (newRecord.status === 'published') {
            // If it wasn't in the list but now published, add it
            updatedAnnouncements = [newRecord, ...updatedAnnouncements]
            console.log('🔄 Added newly published announcement:', newRecord.id)
          }
          break

        case 'DELETE':
          // Remove deleted announcement
          const beforeLength = updatedAnnouncements.length
          updatedAnnouncements = updatedAnnouncements.filter(a => a.id !== oldRecord.id)
          if (updatedAnnouncements.length < beforeLength) {
            console.log('🔄 Deleted announcement:', oldRecord.id)
          }
          break

        default:
          console.log('🔄 Unknown event type:', eventType)
          break
      }

      // Sort by created_at descending to maintain order
      return updatedAnnouncements.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      )
    })
  }

  async cleanup() {
    console.log('🔄 Cleaning up realtime manager...')
    
    this.isActive = false
    
    // Remove app state listener
    if (this.appStateSubscription) {
      this.appStateSubscription.remove()
      this.appStateSubscription = null
    }

    // Unsubscribe from announcements
    if (this.subscriptionRef) {
      try {
        await announcementService.unsubscribeFromAnnouncements(this.subscriptionRef)
        this.subscriptionRef = null
        console.log('🔄 Realtime manager cleaned up successfully')
      } catch (error) {
        console.error('🔄 Error during cleanup (non-critical):', error?.message || error)
        this.subscriptionRef = null
      }
    }
  }

  // Check if the manager is currently active
  isSubscriptionActive() {
    return this.isActive && this.subscriptionRef !== null
  }
}