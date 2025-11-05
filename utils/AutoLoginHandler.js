import { useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import { loginWithEmailOrAccountId } from './authHelper'

const AUTO_LOGIN_KEY = 'auto_login_enabled'
const STORED_CREDENTIALS_KEY = 'stored_credentials'

/**
 * Hook to handle auto-login functionality using expo-secure-store
 * Call this in your main App component or navigation setup
 * 
 * @param {Function} onAutoLoginSuccess - Callback when auto-login succeeds
 * @param {Function} onAutoLoginFail - Callback when auto-login fails
 * @returns {Object} - { isChecking: boolean }
 */
export const useAutoLogin = (onAutoLoginSuccess, onAutoLoginFail) => {
  useEffect(() => {
    checkAndPerformAutoLogin()
  }, [])

  const checkAndPerformAutoLogin = async () => {
    try {
      // Check if auto-login is enabled
      const autoLoginEnabled = await SecureStore.getItemAsync(AUTO_LOGIN_KEY)
      
      if (autoLoginEnabled !== 'true') {
        onAutoLoginFail?.()
        return
      }

      // Get stored credentials
      const credentialsJson = await SecureStore.getItemAsync(STORED_CREDENTIALS_KEY)
      
      if (!credentialsJson) {
        onAutoLoginFail?.()
        return
      }

      const credentials = JSON.parse(credentialsJson)
      
      // Perform auto-login
      const result = await loginWithEmailOrAccountId(
        credentials.identifier,
        credentials.password
      )

      if (result.success) {
        onAutoLoginSuccess?.({
          id: result.user.profile.id,
          auth_user_id: result.user.auth.id,
          email: result.user.profile.email,
          account_id: result.user.profile.account_id,
          first_name: result.user.profile.first_name,
          last_name: result.user.profile.last_name,
          middle_initial: result.user.profile.middle_initial,
          contact_number: result.user.profile.contact_number,
          block_number: result.user.profile.block_number,
          lot_number: result.user.profile.lot_number,
          phase_number: result.user.profile.phase_number,
        })
      } else {
        // Clear credentials if auto-login fails
        await SecureStore.deleteItemAsync(STORED_CREDENTIALS_KEY)
        await SecureStore.deleteItemAsync(AUTO_LOGIN_KEY)
        onAutoLoginFail?.()
      }
    } catch (error) {
      console.log('Auto-login error:', error)
      onAutoLoginFail?.()
    }
  }
}

/**
 * Save credentials securely for auto-login
 * @param {string} identifier - Email or account ID
 * @param {string} password - User's password
 */
export const saveCredentialsForAutoLogin = async (identifier, password) => {
  try {
    const credentials = {
      identifier,
      password,
      timestamp: Date.now(),
    }
    await SecureStore.setItemAsync(STORED_CREDENTIALS_KEY, JSON.stringify(credentials))
    return { success: true }
  } catch (error) {
    console.log('Error saving credentials:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get auto-login preference
 */
export const getAutoLoginEnabled = async () => {
  try {
    const value = await SecureStore.getItemAsync(AUTO_LOGIN_KEY)
    return value === 'true'
  } catch (error) {
    console.log('Error getting auto-login preference:', error)
    return false
  }
}

/**
 * Set auto-login preference
 * @param {boolean} enabled - Whether auto-login should be enabled
 */
export const setAutoLoginEnabled = async (enabled) => {
  try {
    await SecureStore.setItemAsync(AUTO_LOGIN_KEY, enabled.toString())
    
    if (!enabled) {
      // If turning off, clear stored credentials
      await SecureStore.deleteItemAsync(STORED_CREDENTIALS_KEY)
    }
    return { success: true }
  } catch (error) {
    console.log('Error setting auto-login preference:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Clear auto-login data (call this on logout)
 */
export const clearAutoLoginData = async () => {
  try {
    await SecureStore.deleteItemAsync(STORED_CREDENTIALS_KEY)
    await SecureStore.deleteItemAsync(AUTO_LOGIN_KEY)
    return { success: true }
  } catch (error) {
    console.log('Error clearing auto-login data:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Check if credentials are stored (useful for debugging)
 */
export const hasStoredCredentials = async () => {
  try {
    const credentials = await SecureStore.getItemAsync(STORED_CREDENTIALS_KEY)
    return credentials !== null
  } catch (error) {
    return false
  }
}