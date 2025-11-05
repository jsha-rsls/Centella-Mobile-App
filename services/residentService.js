import { supabase } from '../utils/supabase'

/**
 * Fetch resident profile data by auth user ID
 * @param {string} authUserId - The authenticated user's UUID
 * @returns {Promise<Object|null>} Resident data or null if not found
 */
export const getResidentProfile = async (authUserId) => {
  try {
    const { data, error } = await supabase
      .from('residents')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single()

    if (error) {
      console.error('Error fetching resident profile:', error)
      return null
    }

    // Transform database fields to match app structure
    return {
      id: data.id,
      accountId: data.account_id,
      firstName: data.first_name,
      middleInitial: data.middle_initial || '',
      lastName: data.last_name,
      birthdate: data.birth_date || '', // Keep in YYYY-MM-DD format
      age: data.age || calculateAge(data.birth_date),
      block: data.block_number || '',
      lot: data.lot_number || '',
      phase: data.phase_number || '',
      email: data.email,
      contactNumber: data.contact_number || '',
      idType: data.id_type,
      frontIdUrl: data.front_id_url,
      backIdUrl: data.back_id_url,
      status: data.status || 'unverified',
      verifiedAt: data.verified_at,
      verifiedBy: data.verified_by,
      rejectionReason: data.rejection_reason || null, // ✅ ADDED
      rejectedAt: data.rejected_at || null, // ✅ ADDED
      authUserId: data.auth_user_id,
      createdAt: data.created_at
    }
  } catch (error) {
    console.error('Unexpected error fetching resident profile:', error)
    return null
  }
}

/**
 * Update resident profile data
 * @param {string} authUserId - The authenticated user's UUID
 * @param {Object} updates - Object containing fields to update
 * @returns {Promise<Object|null>} Updated resident data or null if failed
 */
export const updateResidentProfile = async (authUserId, updates) => {
  try {
    const dbUpdates = {
      first_name: updates.firstName,
      middle_initial: updates.middleInitial,
      last_name: updates.lastName,
      block_number: updates.block,
      lot_number: updates.lot,
      phase_number: updates.phase,
      contact_number: updates.contactNumber
    }

    // Only include birth_date if it exists and is valid
    if (updates.birthdate && updates.birthdate.trim() !== '') {
      // birthdate is already in YYYY-MM-DD format from DateTimePicker
      dbUpdates.birth_date = updates.birthdate
      dbUpdates.age = updates.age || calculateAge(updates.birthdate)
    } else if (updates.age) {
      // If age was explicitly updated but birthdate not touched
      dbUpdates.age = updates.age
    }

    // Remove undefined values
    Object.keys(dbUpdates).forEach(
      (key) => dbUpdates[key] === undefined && delete dbUpdates[key]
    )

    const { data, error } = await supabase
      .from('residents')
      .update(dbUpdates)
      .eq('auth_user_id', authUserId)
      .select()
      .single()

    if (error) {
      console.error('Error updating resident profile:', error)
      return null
    }

    // Transform back to app structure
    return {
      id: data.id,
      accountId: data.account_id,
      firstName: data.first_name,
      middleInitial: data.middle_initial || '',
      lastName: data.last_name,
      birthdate: data.birth_date || '', // Keep in YYYY-MM-DD format
      age: data.age || calculateAge(data.birth_date),
      block: data.block_number || '',
      lot: data.lot_number || '',
      phase: data.phase_number || '',
      email: data.email,
      contactNumber: data.contact_number || '',
      idType: data.id_type,
      frontIdUrl: data.front_id_url,
      backIdUrl: data.back_id_url,
      status: data.status || 'unverified',
      verifiedAt: data.verified_at,
      verifiedBy: data.verified_by,
      rejectionReason: data.rejection_reason || null, // ✅ ADDED
      rejectedAt: data.rejected_at || null, // ✅ ADDED
      authUserId: data.auth_user_id,
      createdAt: data.created_at
    }
  } catch (error) {
    console.error('Unexpected error updating resident profile:', error)
    return null
  }
}

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>} User object or null
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting current user:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Unexpected error getting current user:', error)
    return null
  }
}

/**
 * Change user password
 * @param {string} currentPassword - The current password for verification
 * @param {string} newPassword - The new password
 * @returns {Promise<{success: boolean, error?: string}>} Result object
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    // First, verify the current password by attempting to sign in
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || !user.email) {
      return { 
        success: false, 
        error: 'No authenticated user found' 
      }
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    })

    if (signInError) {
      return { 
        success: false, 
        error: 'Current password is incorrect' 
      }
    }

    // Update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      console.error('Error updating password:', updateError)
      return { 
        success: false, 
        error: updateError.message 
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error changing password:', error)
    return { 
      success: false, 
      error: 'An unexpected error occurred' 
    }
  }
}

/**
 * Subscribe to real-time changes for a resident profile
 * @param {string} authUserId - The authenticated user's UUID
 * @param {Function} callback - Function to call when data changes
 * @returns {Function} Unsubscribe function
 */
export const subscribeToResidentProfile = (authUserId, callback) => {
  const channel = supabase
    .channel('resident-profile-changes')
    .on(
      'postgres_changes',
      {
        event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'residents',
        filter: `auth_user_id=eq.${authUserId}`
      },
      (payload) => {
        console.log('Real-time update received:', payload)
        
        if (payload.eventType === 'DELETE') {
          callback(null)
          return
        }

        const data = payload.new
        
        // Transform database fields to match app structure
        const transformedData = {
          id: data.id,
          accountId: data.account_id,
          firstName: data.first_name,
          middleInitial: data.middle_initial || '',
          lastName: data.last_name,
          birthdate: data.birth_date || '',
          age: data.age || calculateAge(data.birth_date),
          block: data.block_number || '',
          lot: data.lot_number || '',
          phase: data.phase_number || '',
          email: data.email,
          contactNumber: data.contact_number || '',
          idType: data.id_type,
          frontIdUrl: data.front_id_url,
          backIdUrl: data.back_id_url,
          status: data.status || 'unverified',
          verifiedAt: data.verified_at,
          verifiedBy: data.verified_by,
          rejectionReason: data.rejection_reason || null, // ✅ ADDED
          rejectedAt: data.rejected_at || null, // ✅ ADDED
          authUserId: data.auth_user_id,
          createdAt: data.created_at
        }
        
        callback(transformedData)
      }
    )
    .subscribe()

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel)
  }
}

/**
 * Calculate age from birth date
 * @param {string} birthDate - Birth date in YYYY-MM-DD format
 * @returns {number} Age in years
 */
const calculateAge = (birthDate) => {
  if (!birthDate) return 0
  
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}