// Utility functions for announcements

export const formatRelativeDate = (dateString) => {
  // Handle null/undefined dates
  if (!dateString) {
    return 'Unknown date'
  }

  try {
    const date = new Date(dateString)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }

    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // More precise time formatting
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''} ago`
    return `${Math.ceil(diffDays / 365)} year${Math.ceil(diffDays / 365) > 1 ? 's' : ''} ago`
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Unknown date'
  }
}

export const isNewAnnouncement = (dateString) => {
  // Handle null/undefined dates
  if (!dateString) {
    return false
  }

  try {
    const date = new Date(dateString)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return false
    }

    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays <= 3 // Consider announcement "new" if posted within last 3 days
  } catch (error) {
    console.error('Error checking if announcement is new:', error)
    return false
  }
}

export const truncateContent = (content, maxLength = 150) => {
  // Handle null/undefined content
  if (!content || typeof content !== 'string') {
    return 'No content available'
  }

  if (content.length <= maxLength) return content
  return content.substring(0, maxLength).trim() + '...'
}

// New enhanced function for smart badge system
export const getAnnouncementBadge = (dateString) => {
  // Handle null/undefined dates
  if (!dateString) {
    return null
  }

  try {
    const date = new Date(dateString)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return null
    }

    const now = new Date()
    const diffInMs = now - date
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))

    // Get dates without time for accurate calendar day comparison
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const postDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const daysDiff = Math.floor((nowDate - postDate) / (1000 * 60 * 60 * 24))

    if (diffInMinutes <= 10) {
      return {
        type: 'new',
        text: 'New',
        color: '#F59E0B', // Orange
        shouldPulse: true
      }
    } else if (diffInMinutes <= 120) { // 2 hours
      return {
        type: 'recent',
        text: 'Recent',
        color: '#3B82F6', // Blue
        shouldPulse: false,
        shouldAnimate: true // Subtle animation for recent posts
      }
    } else if (daysDiff === 0) { // Same calendar day
      return {
        type: 'today',
        text: 'Today',
        color: '#6B7280', // Gray
        shouldPulse: false,
        shouldAnimate: false
      }
    } else if (daysDiff === 1) { // Previous calendar day
      return {
        type: 'yesterday',
        text: 'Yesterday',
        color: '#9CA3AF', // Lighter gray
        shouldPulse: false,
        shouldAnimate: false
      }
    }
    
    return null // No badge for older posts
  } catch (error) {
    console.error('Error getting announcement badge:', error)
    return null
  }
}

// Check if announcement is very recent (under 1 hour) for clock icon display
export const isVeryRecentAnnouncement = (dateString) => {
  if (!dateString) return false

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return false

    const now = new Date()
    const diffInMs = now - date
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    
    return diffInMinutes <= 60 // Under 1 hour
  } catch (error) {
    console.error('Error checking if announcement is very recent:', error)
    return false
  }
}

// Enhanced relative date formatting with more prominence for recent posts
export const formatEnhancedRelativeDate = (dateString) => {
  if (!dateString) return 'Unknown date'

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid date'

    const now = new Date()
    const diffInMs = now - date
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))

    // More detailed formatting for very recent posts
    if (diffInMinutes < 1) {
      return { text: 'Just now', isVeryRecent: true }
    } else if (diffInMinutes < 60) {
      return { 
        text: `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`, 
        isVeryRecent: true 
      }
    } else if (diffInHours < 2) {
      return { 
        text: `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`, 
        isVeryRecent: true 
      }
    } else {
      return { 
        text: formatRelativeDate(dateString), 
        isVeryRecent: false 
      }
    }
  } catch (error) {
    console.error('Error formatting enhanced date:', error)
    return { text: 'Unknown date', isVeryRecent: false }
  }
}