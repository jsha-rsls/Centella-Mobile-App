import { supabase } from '../utils/supabase'
import { AppState } from 'react-native'

// Track active subscriptions to ensure proper cleanup
const activeSubscriptions = new Set()

export const announcementService = {
  // Fetch all published announcements ordered by created_at descending
  async getAllAnnouncements() {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          id,
          title,
          content,
          category,
          status,
          image_url,
          views,
          created_at,
          published_at,
          created_by
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching announcements:', error)
        throw error
      }

      // Log announcements with images for debugging
      const withImages = data.filter(ann => ann.image_url)
      console.log(`📷 Found ${withImages.length} announcements with images:`, 
        withImages.map(ann => ({ id: ann.id, title: ann.title, image_url: ann.image_url }))
      )

      return data
    } catch (error) {
      console.error('Service error:', error)
      throw error
    }
  },

  // Fetch a single announcement by ID
  async getAnnouncementById(id) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          id,
          title,
          content,
          category,
          status,
          image_url,
          views,
          created_at,
          published_at,
          created_by
        `)
        .eq('id', id)
        .eq('status', 'published')
        .single()

      if (error) {
        console.error('Error fetching announcement:', error)
        throw error
      }

      // Log image URL for debugging
      if (data.image_url) {
        console.log('📷 Fetched announcement with image:', {
          id: data.id,
          title: data.title,
          image_url: data.image_url
        })
      }

      return data
    } catch (error) {
      console.error('Service error:', error)
      throw error
    }
  },

  // Increment view count for an announcement
  async incrementViews(id) {
    try {
      // First, get the current views count
      const { data: currentData, error: fetchError } = await supabase
        .from('announcements')
        .select('views')
        .eq('id', id)
        .single()

      if (fetchError) {
        console.error('Error fetching current views:', fetchError)
        throw fetchError
      }

      const currentViews = currentData?.views || 0
      
      // Then update with incremented value
      const { error: updateError } = await supabase
        .from('announcements')
        .update({ views: currentViews + 1 })
        .eq('id', id)

      if (updateError) {
        console.error('Error updating views:', updateError)
        throw updateError
      }

      console.log('📊 Views incremented successfully for announcement:', id)
    } catch (error) {
      console.error('Service error:', error)
      throw error
    }
  },

  // Get recent announcements (last 7 days)
  async getRecentAnnouncements(limit = 2) {
    try {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { data, error } = await supabase
        .from('announcements')
        .select(`
          id,
          title,
          content,
          category,
          status,
          image_url,
          views,
          created_at,
          published_at,
          created_by
        `)
        .eq('status', 'published')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching recent announcements:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Service error:', error)
      throw error
    }
  },

  // Subscribe to real-time changes for announcements
  subscribeToAnnouncements(callback) {
    console.log('📡 Setting up real-time subscription for announcements...')
    
    try {
      // Create unique channel name to avoid conflicts
      const channelName = `announcements-${Date.now()}`
      
      const subscription = supabase
        .channel(channelName, {
          config: {
            broadcast: { self: false },
            presence: { key: '' }
          }
        })
        .on(
          'postgres_changes',
          {
            event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: 'announcements'
          },
          (payload) => {
            console.log('📡 Real-time announcement update received:', {
              event: payload.eventType,
              table: payload.table,
              new: payload.new ? { 
                id: payload.new.id, 
                title: payload.new.title, 
                status: payload.new.status,
                image_url: payload.new.image_url 
              } : null,
              old: payload.old ? { 
                id: payload.old.id, 
                title: payload.old.title, 
                status: payload.old.status,
                image_url: payload.old.image_url 
              } : null
            })
            
            // Client-side filtering and processing
            const { eventType, new: newRecord, old: oldRecord } = payload
            
            // For INSERT and UPDATE events, only process if the new record is published
            // For DELETE events, we always process since we need to remove from UI
            let shouldProcess = false
            
            switch (eventType) {
              case 'INSERT':
                shouldProcess = newRecord && newRecord.status === 'published'
                if (shouldProcess) {
                  console.log('📢 New announcement published:', newRecord.title)
                  // Note: Push notification is handled by database trigger
                }
                break
              case 'UPDATE':
                // Process if either old or new record is published (to handle status changes)
                shouldProcess = (newRecord && newRecord.status === 'published') || 
                               (oldRecord && oldRecord.status === 'published')
                if (shouldProcess && newRecord.status === 'published' && oldRecord.status !== 'published') {
                  console.log('📢 Announcement status changed to published:', newRecord.title)
                  // Note: Push notification is handled by database trigger
                }
                break
              case 'DELETE':
                // Always process deletes to remove from UI
                shouldProcess = true
                console.log('🗑️ Announcement deleted:', oldRecord?.id)
                break
              default:
                shouldProcess = false
            }
            
            if (shouldProcess) {
              console.log('📡 Processing real-time update:', eventType, newRecord?.id || oldRecord?.id)
              callback(payload)
            } else {
              console.log('📡 Skipping real-time update (not published):', eventType, newRecord?.id || oldRecord?.id)
            }
          }
        )
        .subscribe((status, err) => {
          console.log('📡 Subscription status:', status, err ? `Error: ${err}` : '')
          
          if (status === 'SUBSCRIBED') {
            console.log('📡 Successfully subscribed to announcements channel:', channelName)
            activeSubscriptions.add(subscription)
          } else if (status === 'CHANNEL_ERROR') {
            console.error('📡 Error subscribing to announcements channel:', err)
            activeSubscriptions.delete(subscription)
          } else if (status === 'TIMED_OUT') {
            console.error('📡 Subscription timed out')
            activeSubscriptions.delete(subscription)
          } else if (status === 'CLOSED') {
            console.log('📡 Subscription closed')
            activeSubscriptions.delete(subscription)
          }
        })

      return subscription
    } catch (error) {
      console.error('📡 Error creating subscription:', error)
      return null
    }
  },

  // Unsubscribe from real-time updates
  async unsubscribeFromAnnouncements(subscription) {
    if (!subscription) {
      console.log('📡 No subscription to unsubscribe from')
      return
    }

    try {
      console.log('📡 Unsubscribing from announcements channel...')
      
      // Remove from active subscriptions set
      activeSubscriptions.delete(subscription)
      
      // Unsubscribe from the channel
      await supabase.removeChannel(subscription)
      
      console.log('📡 Successfully unsubscribed from announcements channel')
    } catch (error) {
      // Silently handle errors during cleanup to prevent crashes
      console.error('📡 Error unsubscribing (non-critical):', error?.message || error)
    }
  },

  // Clean up all active subscriptions (useful for app state changes)
  async cleanupAllSubscriptions() {
    console.log('📡 Cleaning up all active subscriptions...')
    
    const subscriptions = Array.from(activeSubscriptions)
    activeSubscriptions.clear()
    
    for (const subscription of subscriptions) {
      try {
        await supabase.removeChannel(subscription)
        console.log('📡 Cleaned up subscription')
      } catch (error) {
        console.error('📡 Error cleaning up subscription (non-critical):', error?.message || error)
      }
    }
  }
}

// Auto-cleanup on app state change (background/inactive)
let appStateSubscription = null

if (typeof AppState !== 'undefined') {
  appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      console.log('📡 App going to background, cleaning up subscriptions...')
      announcementService.cleanupAllSubscriptions()
    }
  })
}