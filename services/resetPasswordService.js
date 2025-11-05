import { supabase } from "../utils/supabase"

const EDGE_FUNCTION_URL = "https://nhgtyrvnoanblbbkuhnu.supabase.co/functions/v1"
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY

/**
 * Send password reset verification code to user's email
 * @param {string} email - User's email address
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendResetCode = async (email) => {
  try {
    console.log("🔑 SUPABASE_KEY exists:", SUPABASE_KEY ? "Yes" : "No")
    console.log("📧 Sending reset code to:", email)

    // Check if email exists in residents table
    const { data: resident, error: residentError } = await supabase
      .from("residents")
      .select("email, first_name, auth_user_id")
      .eq("email", email)
      .single()

    if (residentError || !resident) {
      console.log("❌ Resident not found:", residentError)
      return {
        success: false,
        error: "No account found with this email address",
      }
    }

    // Check if user has auth account
    if (!resident.auth_user_id) {
      console.log("❌ No auth_user_id for resident")
      return {
        success: false,
        error: "Account not fully set up. Please contact support.",
      }
    }

    console.log("✅ Resident found, calling edge function...")

    // Call edge function to send reset code
    const response = await fetch(`${EDGE_FUNCTION_URL}/send-reset-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        email: email,
        first_name: resident.first_name,
      }),
    })

    console.log("📡 Edge function response status:", response.status)

    const result = await response.json()
    console.log("📡 Edge function response:", result)

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to send verification code",
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("❌ Send reset code error:", error)
    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
    }
  }
}

/**
 * Verify the reset code entered by user
 * @param {string} email - User's email address
 * @param {string} code - 6-digit verification code
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const verifyResetCode = async (email, code) => {
  try {
    console.log("🔍 Verifying code for:", email)

    // Call edge function to verify code
    const response = await fetch(`${EDGE_FUNCTION_URL}/verify-reset-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        email: email,
        code: code,
      }),
    })

    const result = await response.json()
    console.log("🔍 Verify response:", result)

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Invalid or expired verification code",
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("❌ Verify reset code error:", error)
    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
    }
  }
}

/**
 * Reset user's password after code verification
 * @param {string} email - User's email address
 * @param {string} code - 6-digit verification code
 * @param {string} newPassword - New password
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const resetPassword = async (email, code, newPassword) => {
  try {
    console.log("🔄 Resetting password for:", email)

    // Get user's auth_user_id
    const { data: resident, error: residentError } = await supabase
      .from("residents")
      .select("auth_user_id")
      .eq("email", email)
      .single()

    if (residentError || !resident || !resident.auth_user_id) {
      console.log("❌ Unable to find user account")
      return {
        success: false,
        error: "Unable to find user account",
      }
    }

    console.log("✅ User found, calling reset-password edge function...")

    // Call edge function to reset password
    const response = await fetch(`${EDGE_FUNCTION_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        email: email,
        code: code,
        newPassword: newPassword,
        authUserId: resident.auth_user_id,
      }),
    })

    const result = await response.json()
    console.log("🔄 Reset password response:", result)

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to reset password",
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("❌ Reset password error:", error)
    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
    }
  }
}