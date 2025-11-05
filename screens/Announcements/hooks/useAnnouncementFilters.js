import { useMemo } from 'react'
import { getAnnouncementBadge } from "../../../utils/announcementUtils"

export const useAnnouncementFilters = (announcements, searchQuery, activeFilter) => {
  const filteredAnnouncements = useMemo(() => {
    let filtered = [...announcements]

    // Apply filter first
    if (activeFilter !== 'all') {
      if (['new', 'recent', 'today', 'yesterday'].includes(activeFilter)) {
        // Time-based filtering
        filtered = filtered.filter(announcement => {
          const badgeInfo = getAnnouncementBadge(announcement.created_at)
          return badgeInfo && badgeInfo.type === activeFilter
        })
      } else if (activeFilter === 'announcements') {
        // Type-based filtering: announcements (exclude updates)
        filtered = filtered.filter(announcement => {
          if (announcement.category) {
            const category = announcement.category.toLowerCase()
            return category === 'announcements' || category === 'announcement'
          }
          return true
        })
      } else if (activeFilter === 'updates') {
        // Type-based filtering: updates only
        filtered = filtered.filter(announcement => {
          if (announcement.category) {
            const category = announcement.category.toLowerCase()
            return category === 'updates' || category === 'update'
          }
          return false
        })
      }
    }

    // Apply search query (instant search)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(announcement => {
        const titleText = announcement.title.replace(/<[^>]*>/g, '').toLowerCase()
        const contentText = announcement.content.replace(/<[^>]*>/g, '').toLowerCase()
        
        return titleText.includes(query) || contentText.includes(query)
      })
    }

    return filtered
  }, [announcements, searchQuery, activeFilter])

  return {
    filteredAnnouncements
  }
}