export const getIconColor = (type) => {
  switch (type) {
    case 'announcement': return '#8B5CF6'
    case 'reservation': return '#10B981'
    case 'payment': return '#3B82F6'
    case 'reminder': return '#F59E0B'
    case 'alert': return '#EF4444'
    default: return '#6B7280'
  }
}