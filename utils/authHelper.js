import { supabase } from "./supabase";

/**
 * Login helper that supports both email and account_id authentication
 * Uses Supabase Auth for secure authentication
 * @param {string} identifier - Either email or account_id
 * @param {string} password - User's password
 * @returns {Object} - { success: boolean, user: object, error: string }
 */
export const loginWithEmailOrAccountId = async (identifier, password) => {
  try {
    // First, determine if identifier is email or account_id
    const isEmail = identifier.includes('@');
    
    let email = identifier;
    
    // If it's not an email, it's an account_id - we need to find the corresponding email
    if (!isEmail) {
      const { data: userData, error: lookupError } = await supabase
        .from('residents')
        .select('email')
        .eq('account_id', identifier.trim())
        .single();
      
      if (lookupError || !userData) {
        return {
          success: false,
          user: null,
          error: 'Account ID not found. Please check your Account ID and try again.'
        };
      }
      
      email = userData.email;
    }
    
    // Authenticate with Supabase Auth using the email
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    
    if (authError) {
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (authError.message.includes('Invalid login credentials')) {
        errorMessage = isEmail 
          ? 'Invalid email or password.' 
          : 'Invalid Account ID or password.';
      } else if (authError.message.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email address before logging in.';
      } else if (authError.message.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please wait a moment and try again.';
      }
      
      return {
        success: false,
        user: null,
        error: errorMessage
      };
    }
    
    // Get user profile data from residents table
    const { data: profileData, error: profileError } = await supabase
      .from('residents')
      .select('*')
      .eq('auth_user_id', authData.user.id)
      .single();
    
    if (profileError) {
      // Fallback: Try to find user by email
      const { data: fallbackProfile, error: fallbackError } = await supabase
        .from('residents')
        .select('*')
        .eq('email', authData.user.email)
        .single();
      
      if (fallbackError || !fallbackProfile) {
        return {
          success: false,
          user: null,
          error: 'Profile not found. This user may not be registered in the system. Please contact support.'
        };
      }
      
      return {
        success: true,
        user: {
          auth: authData.user,
          profile: fallbackProfile
        },
        error: null
      };
    }
    
    return {
      success: true,
      user: {
        auth: authData.user,
        profile: profileData
      },
      error: null
    };
    
  } catch (error) {
    return {
      success: false,
      user: null,
      error: 'An unexpected error occurred. Please try again.'
    };
  }
};

/**
 * Helper function to check if current user is authenticated
 * and get their profile data
 */
export const getCurrentUserProfile = async () => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, user: null, error: 'Not authenticated' };
    }
    
    const { data: profileData, error: profileError } = await supabase
      .from('residents')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();
    
    if (profileError) {
      // Try fallback by email
      const { data: fallbackProfile, error: fallbackError } = await supabase
        .from('residents')
        .select('*')
        .eq('email', user.email)
        .single();
      
      if (fallbackError) {
        return { 
          success: false, 
          user: null, 
          error: 'Profile not found' 
        };
      }
      
      return {
        success: true,
        user: {
          auth: user,
          profile: fallbackProfile
        },
        error: null
      };
    }
    
    return {
      success: true,
      user: {
        auth: user,
        profile: profileData
      },
      error: null
    };
    
  } catch (error) {
    return { 
      success: false, 
      user: null, 
      error: 'Failed to get user profile' 
    };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: 'Failed to sign out' };
  }
};

/**
 * Debug helper to check what's in the residents table
 */
export const debugResidentsTable = async () => {
  try {
    const { data: residents, error } = await supabase
      .from('residents')
      .select('id, email, account_id, auth_user_id')
      .limit(10);
    
    return { success: !error, data: residents, error };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  }
};
