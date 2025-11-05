// Gradient colors by category
export const getGradientColors = (category = '') => {
  const normalizedCategory = category.toLowerCase()
  
  if (normalizedCategory === 'announcement') {
    return ['#4F46E5', '#7C3AED', '#EC4899']
  } else if (normalizedCategory === 'updates') {
    return ['#059669', '#0D9488', '#0891B2']
  } else {
    return ['#6366F1', '#8B5CF6', '#A855F7']
  }
}

// Optional: Add more gradient utility functions
export const getGradientByIndex = (index) => {
  const gradients = [
    ['#4F46E5', '#7C3AED', '#EC4899'],
    ['#059669', '#0D9488', '#0891B2'],
    ['#6366F1', '#8B5CF6', '#A855F7'],
    ['#DC2626', '#EA580C', '#F59E0B'],
    ['#7C2D12', '#A16207', '#CA8A04']
  ]
  return gradients[index % gradients.length]
}

export const getStatusBarGradient = () => ['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)', 'transparent']
export const getOverlayGradient = () => ['rgba(0,0,0,0.3)', 'transparent']