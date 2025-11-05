import { useMemo, useCallback } from 'react'

export const useImageHandler = (
  imageUrl,
  imageError,
  setImageError,
  { onLoad, onError } = {}
) => {
  // More robust check for valid image
  const hasImage = useMemo(() => {
    if (!imageUrl || typeof imageUrl !== 'string') return false
    const trimmed = imageUrl.trim()
    if (!trimmed) return false
    if (imageError) return false
    return /^https?:\/\/.+/i.test(trimmed) // must start with http/https
  }, [imageUrl, imageError])

  const handleImageError = useCallback(
    (error) => {
      const errorMsg = error?.nativeEvent?.error || 'Unknown error'
      __DEV__ && console.warn('Failed to load image:', imageUrl, errorMsg)
      setImageError(true)
      if (onError) onError(errorMsg, imageUrl)
    },
    [imageUrl, setImageError, onError]
  )

  const handleImageLoad = useCallback(() => {
    __DEV__ && console.log('Image loaded successfully:', imageUrl)
    if (onLoad) onLoad(imageUrl)
  }, [imageUrl, onLoad])

  return {
    hasImage,
    handleImageError,
    handleImageLoad,
  }
}
