const dateCache = new Map()
const formatCache = new Map()

export const getTodayString = () => {
  const cacheKey = 'today'
  const cached = dateCache.get(cacheKey)
  const now = Date.now()
  
  // Cache for 1 minute to avoid excessive recalculations
  if (cached && (now - cached.timestamp < 60000)) {
    return cached.value
  }
  
  const today = new Date()
  const result = formatDateToString(today)
  
  dateCache.set(cacheKey, { value: result, timestamp: now })
  return result
}

export const formatDateToString = (date) => {
  if (!date) return ''
  
  const timestamp = date.getTime()
  const cached = formatCache.get(timestamp)
  if (cached) return cached
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const result = `${year}-${month}-${day}`
  
  formatCache.set(timestamp, result)
  
  // Clean cache when it gets too large
  if (formatCache.size > 200) {
    const keys = Array.from(formatCache.keys()).slice(0, 100)
    keys.forEach(key => formatCache.delete(key))
  }
  
  return result
}

export const adjustDate = (dateString, days) => {
  const cacheKey = `${dateString}_${days}`
  const cached = dateCache.get(cacheKey)
  
  if (cached) return cached
  
  const date = new Date(dateString + 'T00:00:00')
  date.setDate(date.getDate() + days)
  const result = formatDateToString(date)
  
  dateCache.set(cacheKey, result)
  
  // Clean cache when it gets too large
  if (dateCache.size > 100) {
    const keys = Array.from(dateCache.keys()).slice(0, 50)
    keys.forEach(key => dateCache.delete(key))
  }
  
  return result
}

// Clear caches periodically to prevent memory leaks
export const clearDateCaches = () => {
  dateCache.clear()
  formatCache.clear()
}

// Auto-clear caches every 10 minutes
setInterval(clearDateCaches, 600000)