import { supabase } from '../utils/supabase'
import { File } from 'expo-file-system'

/**
 * Upload image to Supabase storage for resubmission (SECURED)
 * @param {string} imageUri - Local image URI
 * @param {string} type - 'front' or 'back'
 * @param {string} accountId - User's account ID
 * @returns {Promise<string|null>} File path of uploaded image
 */
const uploadResubmitImage = async (imageUri, type, accountId) => {
  if (!imageUri) return null

  try {
    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 9)
    const fileName = `resubmit-ids/${accountId}_${type}_${timestamp}_${randomString}.jpg`

    console.log(`📸 Uploading resubmit ${type} ID: ${fileName}`)

    // Use File class for SDK 54+
    const file = new File(imageUri)
    const base64 = await file.base64()
    
    // Convert base64 to Uint8Array
    const uint8Array = Uint8Array.from(atob(base64), c => c.charCodeAt(0))

    // Upload to Supabase Storage (authenticated upload)
    const { error } = await supabase.storage
      .from('user-ids')
      .upload(fileName, uint8Array, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/jpeg',
      })

    if (error) {
      console.error(`❌ Upload failed (${type}):`, error.message)
      throw new Error(`Failed to upload ${type} ID: ${error.message}`)
    }

    console.log(`✅ ${type} ID uploaded:`, fileName)
    return fileName // Return path, not public URL
  } catch (err) {
    console.error(`💥 Upload exception (${type}):`, err)
    throw err
  }
}

/**
 * Get signed URL for a file
 * @param {string} filePath - File path in storage
 * @param {number} expiresIn - Expiry time in seconds (default 1 hour)
 * @returns {Promise<string|null>} Signed URL
 */
export const getSignedUrl = async (filePath, expiresIn = 3600) => {
  try {
    if (!filePath) return null

    const { data, error } = await supabase.storage
      .from('user-ids')
      .createSignedUrl(filePath, expiresIn)

    if (error) {
      console.error('❌ Failed to get signed URL:', error)
      return null
    }

    return data.signedUrl
  } catch (err) {
    console.error('💥 Signed URL exception:', err)
    return null
  }
}

/**
 * Delete old ID images from storage
 * @param {string} frontIdPath - Front ID path to delete
 * @param {string} backIdPath - Back ID path to delete
 */
const deleteOldIdImages = async (frontIdPath, backIdPath) => {
  try {
    const filesToRemove = []

    if (frontIdPath) {
      filesToRemove.push(frontIdPath)
    }

    if (backIdPath) {
      filesToRemove.push(backIdPath)
    }

    if (filesToRemove.length > 0) {
      const { error } = await supabase.storage
        .from('user-ids')
        .remove(filesToRemove)

      if (error) {
        console.error('❌ Failed to delete old images:', error)
      } else {
        console.log('🧹 Deleted old ID images:', filesToRemove)
      }
    }
  } catch (err) {
    console.error('💥 Delete old images exception:', err)
  }
}

/**
 * Resubmit verification with updated information
 * @param {string} authUserId - User's auth ID
 * @param {Object} updateData - Data to update
 * @param {string} updateData.resubmitType - 'info', 'id', or 'both'
 * @param {Object} updateData.personalInfo - Personal information fields
 * @param {Object} updateData.idInfo - ID information and photos
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const resubmitVerification = async (authUserId, updateData) => {
  try {
    const { resubmitType, personalInfo, idInfo } = updateData

    // Get current resident profile
    const { data: currentProfile, error: fetchError } = await supabase
      .from('residents')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single()

    if (fetchError || !currentProfile) {
      throw new Error('Could not fetch current profile')
    }

    // Prepare update object
    const dbUpdates = {}

    // Update personal information if provided
    if (personalInfo && (resubmitType === 'info' || resubmitType === 'both')) {
      dbUpdates.first_name = personalInfo.firstName
      dbUpdates.middle_initial = personalInfo.middleInitial || null
      dbUpdates.last_name = personalInfo.lastName
      dbUpdates.contact_number = personalInfo.contactNumber
      dbUpdates.block_number = personalInfo.blockNumber
      dbUpdates.lot_number = personalInfo.lotNumber
      dbUpdates.phase_number = personalInfo.phaseNumber
    }

    // Update ID information if provided
    if (idInfo && (resubmitType === 'id' || resubmitType === 'both')) {
      // Upload new ID photos
      const [newFrontIdPath, newBackIdPath] = await Promise.all([
        uploadResubmitImage(idInfo.frontIdUri, 'front', currentProfile.account_id),
        uploadResubmitImage(idInfo.backIdUri, 'back', currentProfile.account_id),
      ])

      if (!newFrontIdPath || !newBackIdPath) {
        throw new Error('Failed to upload ID photos')
      }

      // Delete old ID images if they exist
      if (currentProfile.front_id_url || currentProfile.back_id_url) {
        await deleteOldIdImages(currentProfile.front_id_url, currentProfile.back_id_url)
      }

      dbUpdates.id_type = idInfo.idType
      dbUpdates.front_id_url = newFrontIdPath // Store path, not URL
      dbUpdates.back_id_url = newBackIdPath   // Store path, not URL
    }

    // Reset status to unverified and clear rejection fields
    dbUpdates.status = 'unverified'
    dbUpdates.rejection_reason = null
    dbUpdates.rejected_at = null

    // Update the database
    const { data, error: updateError } = await supabase
      .from('residents')
      .update(dbUpdates)
      .eq('auth_user_id', authUserId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Update error:', updateError)
      throw new Error(updateError.message)
    }

    console.log('✅ Resubmission successful:', data)
    return { success: true, data }
  } catch (error) {
    console.error('💥 Resubmission failed:', error)
    return { 
      success: false, 
      error: error.message || 'Failed to resubmit verification'
    }
  }
}

/**
 * Check if user can resubmit (status must be 'rejected')
 * @param {string} authUserId - User's auth ID
 * @returns {Promise<{canResubmit: boolean, status: string}>}
 */
export const canResubmit = async (authUserId) => {
  try {
    const { data, error } = await supabase
      .from('residents')
      .select('status')
      .eq('auth_user_id', authUserId)
      .single()

    if (error || !data) {
      return { canResubmit: false, status: 'unknown' }
    }

    return { 
      canResubmit: data.status === 'rejected', 
      status: data.status 
    }
  } catch (error) {
    console.error('Error checking resubmit eligibility:', error)
    return { canResubmit: false, status: 'unknown' }
  }
}