import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import styles from "./ResetPasswordStyles"
import { sendResetCode, verifyResetCode, resetPassword } from "../../../services/resetPasswordService"
import CustomModal from "../CustomModal"

const DEFAULT_MODAL_CONFIG = {
  type: "info",
  title: "",
  message: "",
  primaryButton: { text: "OK", onPress: () => {} },
  secondaryButton: null,
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default function ResetPasswordScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const scrollViewRef = useRef(null)
  
  // Form State
  const [formState, setFormState] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  })
  
  // UI State
  const [uiState, setUiState] = useState({
    loading: false,
    sendingCode: false,
    verifying: false,
    showNewPassword: false,
    showConfirmPassword: false,
    isCodeVerified: false,
    codeSent: false,
    countdown: 0,
    modalVisible: false,
  })

  const [modalConfig, setModalConfig] = useState(DEFAULT_MODAL_CONFIG)

  // Optimized form field updaters
  const updateFormState = useCallback((field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }, [])

  const updateUIState = useCallback((field, value) => {
    setUiState(prev => ({ ...prev, [field]: value }))
  }, [])

  const showModal = useCallback((config) => {
    setModalConfig(config)
    updateUIState("modalVisible", true)
  }, [updateUIState])

  // Countdown timer
  useEffect(() => {
    let timer
    if (uiState.countdown > 0) {
      timer = setTimeout(() => {
        setUiState(prev => ({ ...prev, countdown: prev.countdown - 1 }))
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [uiState.countdown])

  const handleInputFocus = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 80, animated: true })
    }, 100)
  }, [])

  const handleSendCode = useCallback(async () => {
    const emailInput = formState.email.trim()

    if (!emailInput) {
      showModal({
        type: "missing",
        title: "Email Required",
        message: "Please enter your email address",
        primaryButton: { text: "OK", onPress: () => updateUIState("modalVisible", false) },
      })
      return
    }

    if (!validateEmail(emailInput)) {
      showModal({
        type: "error",
        title: "Invalid Email",
        message: "Please enter a valid email address",
        primaryButton: { text: "OK", onPress: () => updateUIState("modalVisible", false) },
      })
      return
    }

    Keyboard.dismiss()
    updateUIState("sendingCode", true)

    try {
      const result = await sendResetCode(emailInput)
      if (result.success) {
        updateUIState("codeSent", true)
        updateUIState("countdown", 60)
        showModal({
          type: "success",
          title: "Code Sent",
          message: "A verification code has been sent to your email",
          primaryButton: { text: "OK", onPress: () => updateUIState("modalVisible", false) },
        })
      } else {
        showModal({
          type: "error",
          title: "Failed to Send Code",
          message: result.error || "Unable to send verification code. Please try again.",
          primaryButton: { text: "OK", onPress: () => updateUIState("modalVisible", false) },
        })
      }
    } catch (error) {
      showModal({
        type: "error",
        title: "Error",
        message: "An unexpected error occurred. Please try again.",
        primaryButton: { text: "OK", onPress: () => updateUIState("modalVisible", false) },
      })
    } finally {
      updateUIState("sendingCode", false)
    }
  }, [formState.email, showModal, updateUIState])

  const handleCodeChange = useCallback((text) => {
    const cleaned = text.replace(/[^0-9]/g, "")
    updateFormState("verificationCode", cleaned)
  }, [updateFormState])

  // Auto-verify when 6 digits entered
  useEffect(() => {
    if (formState.verificationCode.length === 6 && !uiState.isCodeVerified && !uiState.verifying) {
      handleVerifyCode()
    }
  }, [formState.verificationCode])

  const handleVerifyCode = useCallback(async () => {
    if (formState.verificationCode.length !== 6) return
    updateUIState("verifying", true)

    try {
      const result = await verifyResetCode(formState.email.trim(), formState.verificationCode)
      if (result.success) {
        updateUIState("isCodeVerified", true)
        showModal({
          type: "success",
          title: "Code Verified",
          message: "You can now set your new password",
          primaryButton: { text: "OK", onPress: () => updateUIState("modalVisible", false) },
        })
      } else {
        updateFormState("verificationCode", "")
        showModal({
          type: "error",
          title: "Invalid Code",
          message: result.error || "The verification code is incorrect",
          primaryButton: { text: "OK", onPress: () => updateUIState("modalVisible", false) },
        })
      }
    } catch (error) {
      updateFormState("verificationCode", "")
      showModal({
        type: "error",
        title: "Error",
        message: "Failed to verify code. Please try again.",
        primaryButton: { text: "OK", onPress: () => updateUIState("modalVisible", false) },
      })
    } finally {
      updateUIState("verifying", false)
    }
  }, [formState.email, formState.verificationCode, showModal, updateFormState, updateUIState])

  const handleResetPassword = useCallback(async () => {
    const newPwd = formState.newPassword.trim()
    const confirmPwd = formState.confirmPassword.trim()

    if (!newPwd || !confirmPwd) {
      showModal({
        type: "missing",
        title: "Incomplete",
        message: "Please fill in both password fields",
        primaryButton: { text: "OK", onPress: () => updateUIState("modalVisible", false) },
      })
      return
    }

    if (newPwd.length < 8) {
      showModal({
        type: "error",
        title: "Weak Password",
        message: "Password must be at least 8 characters long",
        primaryButton: { text: "OK", onPress: () => updateUIState("modalVisible", false) },
      })
      return
    }

    if (newPwd !== confirmPwd) {
      showModal({
        type: "error",
        title: "Passwords Don't Match",
        message: "The passwords you entered do not match",
        primaryButton: { text: "OK", onPress: () => updateUIState("modalVisible", false) },
      })
      return
    }

    Keyboard.dismiss()
    updateUIState("loading", true)

    try {
      const result = await resetPassword(formState.email.trim(), formState.verificationCode, newPwd)
      if (result.success) {
        showModal({
          type: "success",
          title: "Password Reset Successful",
          message: "Your password has been updated. You can now login with your new password.",
          primaryButton: {
            text: "Go to Login",
            onPress: () => {
              updateUIState("modalVisible", false)
              navigation.navigate("Login")
            },
          },
        })
      } else {
        showModal({
          type: "error",
          title: "Reset Failed",
          message: result.error || "Unable to reset password. Please try again.",
          primaryButton: { text: "OK", onPress: () => updateUIState("modalVisible", false) },
        })
      }
    } catch (error) {
      showModal({
        type: "error",
        title: "Error",
        message: "An unexpected error occurred. Please try again.",
        primaryButton: { text: "OK", onPress: () => updateUIState("modalVisible", false) },
      })
    } finally {
      updateUIState("loading", false)
    }
  }, [formState, showModal, updateUIState])

  // Memoized subtitle
  const subtitleText = useMemo(() => {
    if (!uiState.codeSent) {
      return "Enter your email to receive a verification code"
    }
    if (!uiState.isCodeVerified) {
      return "Enter the 6-digit code sent to your email"
    }
    return "Set your new password"
  }, [uiState.codeSent, uiState.isCodeVerified])

  const isResendDisabled = uiState.countdown > 0 || uiState.sendingCode || uiState.loading

  return (
    <LinearGradient colors={["#231828", "#F9E6E6", "#231828"]} style={styles.gradient}>
      <ExpoStatusBar style="light" translucent />
      <View style={[styles.statusBarSpacer, { height: insets.top }]} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -100}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={true}
          scrollEventThrottle={16}
        >
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Ionicons name="key-outline" size={48} color="#231828" />
              <Text style={styles.formTitle}>Reset Password</Text>
              <Text style={styles.formSubtitle}>{subtitleText}</Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, (uiState.codeSent || uiState.loading) && styles.inputDisabled]}
                placeholder="Email Address"
                placeholderTextColor="#8C8585"
                value={formState.email}
                onChangeText={(text) => updateFormState("email", text)}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!uiState.codeSent && !uiState.loading}
                onFocus={handleInputFocus}
              />
              <View style={styles.inputIcon}>
                <Ionicons name="mail-outline" size={22} color="#8C8585" />
              </View>
            </View>

            {uiState.codeSent && !uiState.isCodeVerified && (
              <View style={styles.codeContainer}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, styles.codeInput]}
                    placeholder="XXXXXX"
                    placeholderTextColor="#8C8585"
                    value={formState.verificationCode}
                    onChangeText={handleCodeChange}
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!uiState.verifying && !uiState.loading}
                    onFocus={handleInputFocus}
                  />
                  {uiState.verifying && (
                    <View style={styles.verifyingIndicator}>
                      <ActivityIndicator size="small" color="#231828" />
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.resendButton, isResendDisabled && styles.resendButtonDisabled]}
                  onPress={handleSendCode}
                  disabled={isResendDisabled}
                  activeOpacity={0.7}
                >
                  {uiState.sendingCode ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.resendButtonText}>
                      {uiState.countdown > 0 ? `Resend (${uiState.countdown}s)` : "Resend Code"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {!uiState.codeSent && (
              <TouchableOpacity
                style={[styles.primaryButton, uiState.sendingCode && styles.primaryButtonDisabled]}
                onPress={handleSendCode}
                disabled={uiState.sendingCode}
                activeOpacity={0.8}
              >
                {uiState.sendingCode ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.primaryButtonText}>Sending...</Text>
                  </View>
                ) : (
                  <Text style={styles.primaryButtonText}>Send Verification Code</Text>
                )}
              </TouchableOpacity>
            )}

            {uiState.isCodeVerified && (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    placeholderTextColor="#8C8585"
                    value={formState.newPassword}
                    onChangeText={(text) => updateFormState("newPassword", text)}
                    secureTextEntry={!uiState.showNewPassword}
                    autoCapitalize="none"
                    editable={!uiState.loading}
                    onFocus={handleInputFocus}
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => updateUIState("showNewPassword", !uiState.showNewPassword)}
                    disabled={uiState.loading}
                  >
                    <Ionicons
                      name={uiState.showNewPassword ? "eye-outline" : "eye-off-outline"}
                      size={22}
                      color="#8C8585"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm New Password"
                    placeholderTextColor="#8C8585"
                    value={formState.confirmPassword}
                    onChangeText={(text) => updateFormState("confirmPassword", text)}
                    secureTextEntry={!uiState.showConfirmPassword}
                    autoCapitalize="none"
                    editable={!uiState.loading}
                    onFocus={handleInputFocus}
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => updateUIState("showConfirmPassword", !uiState.showConfirmPassword)}
                    disabled={uiState.loading}
                  >
                    <Ionicons
                      name={uiState.showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                      size={22}
                      color="#8C8585"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, uiState.loading && styles.primaryButtonDisabled]}
                  onPress={handleResetPassword}
                  disabled={uiState.loading}
                  activeOpacity={0.8}
                >
                  {uiState.loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} />
                      <Text style={styles.primaryButtonText}>Resetting...</Text>
                    </View>
                  ) : (
                    <Text style={styles.primaryButtonText}>Reset Password</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

<TouchableOpacity
  style={styles.secondaryButton}
  onPress={() => {
    navigation.pop()
  }}
  activeOpacity={0.8}
  disabled={uiState.loading}
>
  <Text style={[styles.secondaryButtonText, uiState.loading && { opacity: 0.5 }]}>
    Back to Login
  </Text>
</TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {uiState.modalVisible && (
        <CustomModal
          visible={uiState.modalVisible}
          onClose={() => updateUIState("modalVisible", false)}
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          primaryButton={modalConfig.primaryButton}
          secondaryButton={modalConfig.secondaryButton}
        />
      )}
    </LinearGradient>
  )
}