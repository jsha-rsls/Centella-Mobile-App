import { useState, useEffect, useRef } from 'react'
import { announcementService } from "../../../services/announcementService"
import { RealtimeManager } from "../utils/RealtimeManager"

export const useAnnouncementData = (navigation) => {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [viewingAnnouncement, setViewingAnnouncement] = useState(null)
  
  const realtimeManager = useRef(new RealtimeManager()).current

  useEffect(() => {
    realtimeManager.setupRealtimeSubscription(setAnnouncements)

    return () => {
      realtimeManager.cleanup()
    }
  }, [])

  const fetchAllAnnouncements = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)
      const data = await announcementService.getAllAnnouncements()
      setAnnouncements(data)
    } catch (error) {
      console.error('Error fetching announcements:', error)
      setError('Failed to load announcements. Please try again.')
    } finally {
      if (isRefresh) {
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }

  const handleAnnouncementPress = async (announcement) => {
    try {
      setViewingAnnouncement(announcement.id)
      await announcementService.incrementViews(announcement.id)
    } catch (error) {
      console.error('Error incrementing views:', error)
    } finally {
      setViewingAnnouncement(null)
    }
    
    navigation.navigate("ViewAnnouncement", { announcement })
  }

  const onRefresh = () => {
    fetchAllAnnouncements(true)
  }

  return {
    announcements,
    loading,
    refreshing,
    error,
    viewingAnnouncement,
    fetchAllAnnouncements,
    handleAnnouncementPress,
    onRefresh
  }
}