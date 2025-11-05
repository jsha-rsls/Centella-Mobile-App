import { supabase } from '../utils/supabase'

export const sendVerificationCode = async (email, onProgress) => {
  try {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, message: "Please enter a valid email address." };
    }

    // Create abort controller with 15-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    // Update progress after 5 seconds
    const progressTimeout = setTimeout(() => {
      if (onProgress) {
        onProgress("Still sending... Almost there!");
      }
    }, 5000);

    try {
      const { data, error } = await supabase.functions.invoke('send-verification-code', {
        body: { email },
      });

      clearTimeout(timeoutId);
      clearTimeout(progressTimeout);

      if (error) {
        console.error("Edge function error:", error);
        
        // Handle timeout
        if (error.message?.includes('timeout') || error.message?.includes('network')) {
          return { 
            success: false, 
            message: "Request timed out. Please try again in a moment." 
          };
        }
        
        // Handle rate limiting
        if (error.message?.includes('rate limit') || error.status === 429) {
          return {
            success: false,
            message: "Too many attempts. Please wait a moment and try again."
          };
        }

        // Handle authentication errors
        if (error.status === 401 || error.status === 403) {
          return {
            success: false,
            message: "Authentication error. Please refresh the page and try again."
          };
        }

        // Generic server error
        return { 
          success: false, 
          message: "Unable to send verification code. Please try again." 
        };
      }

      if (!data.success) {
        return { 
          success: false, 
          message: data.message || "Unable to send verification code. Please try again." 
        };
      }

      return { 
        success: true, 
        message: data.message || "Verification code sent! Check your email (including spam folder)." 
      };
    } catch (invokeError) {
      clearTimeout(timeoutId);
      clearTimeout(progressTimeout);

      // Handle abort/timeout
      if (invokeError.name === 'AbortError') {
        return { 
          success: false, 
          message: "Request timed out. Please try again in a moment." 
        };
      }

      throw invokeError;
    }
  } catch (error) {
    console.error("sendVerificationCode exception:", error);
    
    // Network-specific errors
    if (error.message?.includes('Failed to fetch') || 
        error.message?.includes('network') ||
        error.message?.includes('NetworkError')) {
      return { 
        success: false, 
        message: "No internet connection. Please check your connection and try again." 
      };
    }
    
    return { 
      success: false, 
      message: "Something went wrong. Please try again." 
    };
  }
};

export const verifyCode = async (email, code) => {
  try {
    if (!email || !code) {
      return { success: false, message: "Email and code are required." };
    }

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      return { success: false, message: "Please enter a valid 6-digit code." };
    }

    // Create abort controller with 10-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const { data, error } = await supabase.functions.invoke('verify-code', {
        body: { email, code },
      });

      clearTimeout(timeoutId);

      if (error) {
        console.error("Edge function error:", error);
        
        // Handle timeout
        if (error.message?.includes('timeout') || error.message?.includes('network')) {
          return { 
            success: false, 
            message: "Request timed out. Please try again." 
          };
        }

        // Handle authentication errors
        if (error.status === 401 || error.status === 403) {
          return {
            success: false,
            message: "Session expired. Please refresh the page and try again."
          };
        }

        // Generic server error
        return { 
          success: false, 
          message: "Unable to verify code. Please try again." 
        };
      }

      if (!data.success) {
        // Return the server's user-friendly message directly
        return { 
          success: false, 
          message: data.message || "Verification failed. Please try again." 
        };
      }

      return { 
        success: true, 
        message: data.message || "Email verified successfully!" 
      };
    } catch (invokeError) {
      clearTimeout(timeoutId);

      if (invokeError.name === 'AbortError') {
        return { 
          success: false, 
          message: "Verification timed out. Please try again." 
        };
      }

      throw invokeError;
    }
  } catch (error) {
    console.error("verifyCode exception:", error);
    
    if (error.message?.includes('Failed to fetch') || 
        error.message?.includes('network') ||
        error.message?.includes('NetworkError')) {
      return { 
        success: false, 
        message: "No internet connection. Please check your connection and try again." 
      };
    }
    
    return { 
      success: false, 
      message: "Something went wrong. Please try again." 
    };
  }
};