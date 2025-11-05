import AsyncStorage from '@react-native-async-storage/async-storage'
import { getResidentProfile } from './residentService'

const WELCOME_MODAL_KEY = '@centella_welcome_modal_shown'

/**
 * Check if welcome modal has been shown to the user
 * @param {string} userId - The user's auth ID
 * @returns {Promise<boolean>} True if modal has been shown
 */
export const hasShownWelcomeModal = async (userId) => {
  try {
    const key = `${WELCOME_MODAL_KEY}_${userId}`
    const value = await AsyncStorage.getItem(key)
    return value === 'true'
  } catch (error) {
    console.error('Error checking welcome modal status:', error)
    return false
  }
}

/**
 * Mark welcome modal as shown for the user
 * @param {string} userId - The user's auth ID
 * @returns {Promise<boolean>} Success status
 */
export const markWelcomeModalShown = async (userId) => {
  try {
    const key = `${WELCOME_MODAL_KEY}_${userId}`
    await AsyncStorage.setItem(key, 'true')
    return true
  } catch (error) {
    console.error('Error marking welcome modal as shown:', error)
    return false
  }
}

/**
 * Clear welcome modal flag (useful for testing or reset)
 * @param {string} userId - The user's auth ID
 * @returns {Promise<boolean>} Success status
 */
export const clearWelcomeModalFlag = async (userId) => {
  try {
    const key = `${WELCOME_MODAL_KEY}_${userId}`
    await AsyncStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Error clearing welcome modal flag:', error)
    return false
  }
}

/**
 * Get resident verification status
 * @param {string} userId - The user's auth ID
 * @returns {Promise<{status: string, isVerified: boolean, rejectionReason: string|null, profile: Object|null}>}
 */
export const getResidentVerificationStatus = async (userId) => {
  try {
    const profile = await getResidentProfile(userId)
    
    if (!profile) {
      return {
        status: 'unknown',
        isVerified: false,
        rejectionReason: null,
        profile: null
      }
    }

    const isVerified = profile.status === 'verified'
    
    // Get rejection reason (now properly mapped from residentService)
    const rejectionReason = profile.rejectionReason || null

    return {
      status: profile.status,
      isVerified,
      rejectionReason,
      profile
    }
  } catch (error) {
    console.error('Error getting resident verification status:', error)
    return {
      status: 'unknown',
      isVerified: false,
      rejectionReason: null,
      profile: null
    }
  }
}

/**
 * Check if user should see welcome modal
 * @param {string} userId - The user's auth ID
 * @returns {Promise<boolean>} True if welcome modal should be shown
 */
export const shouldShowWelcomeModal = async (userId) => {
  try {
    // Check if modal has already been shown
    const hasShown = await hasShownWelcomeModal(userId)
    if (hasShown) {
      return false
    }

    // Check if user is unverified
    const { status } = await getResidentVerificationStatus(userId)
    
    // Show modal only for unverified users who haven't seen it
    return status === 'unverified'
  } catch (error) {
    console.error('Error checking if should show welcome modal:', error)
    return false
  }
}