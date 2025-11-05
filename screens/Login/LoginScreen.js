import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Keyboard,
  Animated,
  Switch,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import styles from "./LoginStyles"
import { loginWithEmailOrAccountId } from "../../utils/authHelper"
import { 
  getAutoLoginEnabled, 
  setAutoLoginEnabled, 
  saveCredentialsForAutoLogin,
  clearAutoLoginData 
} from "../../utils/AutoLoginHandler"
import CustomModal from "./CustomModal" 

const EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "icloud.com", "mail.com"]

export default function LoginScreen({ navigation, onAuthenticate }) {
  const insets = useSafeAreaInsets()
  const scrollViewRef = useRef(null)
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [emailSuggestion, setEmailSuggestion] = useState("")
  const [autoLoginEnabled, setAutoLoginEnabledState] = useState(false)
  const suggestionOpacity = useRef(new Animated.Value(0)).current
  const passwordTranslate = useRef(new Animated.Value(0)).current
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false)
  const [modalConfig, setModalConfig] = useState({
    type: "info",
    title: "",
    message: "",
    primaryButton: { text: "OK", onPress: () => {} },
    secondaryButton: null,
  })

  const showModal = (config) => {
    setModalConfig(config)
    setModalVisible(true)
  }

  // Load auto-login preference on mount
  useEffect(() => {
    loadAutoLoginPreference()
  }, [])

  const loadAutoLoginPreference = async () => {
    try {
      const enabled = await getAutoLoginEnabled()
      setAutoLoginEnabledState(enabled)
    } catch (error) {
      console.log("Error loading auto-login preference:", error)
    }
  }

  const handleAutoLoginToggle = async (value) => {
    setAutoLoginEnabledState(value)
    await setAutoLoginEnabled(value)
  }

  useEffect(() => {
    if (showSuggestions) {
      Animated.timing(suggestionOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
      Animated.timing(passwordTranslate, {
        toValue: 15,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(suggestionOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
      Animated.timing(passwordTranslate, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [showSuggestions, suggestionOpacity, passwordTranslate])

  const handleInputFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 150, animated: true })
    }, 100)
  }

  const handleIdentifierChange = (text) => {
    setIdentifier(text)
    
    // Check if user typed @ and text looks like an email
    if (text.includes("@") && !text.endsWith("@")) {
      const atIndex = text.indexOf("@")
      const beforeAt = text.substring(0, atIndex + 1)
      const afterAt = text.substring(atIndex + 1).toLowerCase()
      
      // Find matching domain suggestions
      const matchedDomains = EMAIL_DOMAINS.filter(domain =>
        domain.startsWith(afterAt) && domain !== afterAt
      )
      
      if (matchedDomains.length > 0) {
        const suggestion = beforeAt + matchedDomains[0]
        setEmailSuggestion(suggestion)
        setShowSuggestions(true)
      } else {
        setShowSuggestions(false)
      }
    } else {
      setShowSuggestions(false)
      setEmailSuggestion("")
    }
  }

  const handleSuggestionPress = () => {
    setIdentifier(emailSuggestion)
    setShowSuggestions(false)
    setEmailSuggestion("")
  }

  const handleLogin = async () => {
    const idInput = identifier.trim()
    const pwdInput = password.trim()

    // Smart validation
    if (!idInput && !pwdInput) {
      showModal({
        type: "missing",
        title: "Missing Fields",
        message: "Please enter your email/account ID and password",
        primaryButton: {
          text: "OK",
          onPress: () => setModalVisible(false),
        },
      })
      return
    }

    if (!idInput) {
      showModal({
        type: "missing",
        title: "Incomplete",
        message: "Please enter your email or account ID",
        primaryButton: {
          text: "OK",
          onPress: () => setModalVisible(false),
        },
      })
      return
    }

    if (!pwdInput) {
      showModal({
        type: "missing",
        title: "Incomplete",
        message: "Please enter your password",
        primaryButton: {
          text: "OK",
          onPress: () => setModalVisible(false),
        },
      })
      return
    }

    Keyboard.dismiss()
    setLoading(true)

    try {
      const result = await loginWithEmailOrAccountId(idInput, pwdInput)

      if (result.success) {
        // Save credentials if auto-login is enabled
        if (autoLoginEnabled) {
          await saveCredentialsForAutoLogin(idInput, pwdInput)
        }

        setLoading(false)
        showModal({
          type: "success",
          title: "Welcome back!",
          message: `Hello ${result.user.profile?.first_name || "User"}! 🎉`,
          primaryButton: {
            text: "Continue",
            onPress: () => {
              setModalVisible(false)
              onAuthenticate?.(true, {
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
            },
          },
        })
      } else {
        setLoading(false)
        // Clear stored credentials on failed login
        await clearAutoLoginData()
        setAutoLoginEnabledState(false)
        
        showModal({
          type: "error",
          title: "Login Failed",
          message: result.error,
          primaryButton: {
            text: "OK",
            onPress: () => setModalVisible(false),
          },
        })
      }
    } catch (error) {
      setLoading(false)
      showModal({
        type: "error",
        title: "Error",
        message: "An unexpected error occurred. Please try again.",
        primaryButton: {
          text: "OK",
          onPress: () => setModalVisible(false),
        },
      })
    }
  }

  const isEmail = identifier.includes("@")

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
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.brandContainer}>
              <Image
                source={require("../../assets/clean-logo.png")}
                style={styles.logoIcon}
                resizeMode="contain"
              />
              <View style={styles.brandTextContainer}>
                <Text style={styles.brandTitle}>CENTELLA</Text>
                <Text style={styles.brandTitle}>APP</Text>
              </View>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Hello, Neighbor</Text>
              <Text style={styles.formSubtitle}>Join your community today</Text>
            </View>

            {/* Email/Account ID Input */}
            <View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email or Account ID"
                  placeholderTextColor="#8C8585"
                  value={identifier}
                  onChangeText={handleIdentifierChange}
                  autoCapitalize="none"
                  keyboardType={isEmail ? "email-address" : "default"}
                  editable={!loading}
                  onFocus={handleInputFocus}
                />
                <View style={styles.inputIcon}>
                  <Ionicons
                    name={
                      identifier.trim().length > 0 && /^\d/.test(identifier.trim())
                        ? "person-outline"
                        : "mail-outline"
                    }
                    size={22}
                    color={"#8C8585"}
                    style={{ marginRight: 4.5 }}
                  />
                </View>
              </View>

              {/* Email Suggestion */}
              {showSuggestions && emailSuggestion && (
                <Animated.View style={{ opacity: suggestionOpacity }}>
                  <TouchableOpacity
                    style={styles.suggestionContainer}
                    onPress={handleSuggestionPress}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.suggestionText}>{emailSuggestion}</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>

            {/* Password Input */}
            <Animated.View
              style={[
                styles.inputContainer,
                {
                  transform: [{ translateY: passwordTranslate }],
                },
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#8C8585"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
                onFocus={handleInputFocus}
                textContentType="oneTimeCode"
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#8C8585"
                />
              </TouchableOpacity>
            </Animated.View>

            {/* Auto-Login Switch */}
            <View style={styles.autoLoginContainer}>
              <View style={styles.autoLoginTextContainer}>
                <Ionicons name="phone-portrait-outline" size={18} color="#5C4F5C" />
                <Text style={styles.autoLoginText}>Stay logged in</Text>
              </View>
              <Switch
                value={autoLoginEnabled}
                onValueChange={handleAutoLoginToggle}
                trackColor={{ false: "#D1C4D1", true: "#8B6F8B" }}
                thumbColor={autoLoginEnabled ? "#5C4F5C" : "#f4f3f4"}
                ios_backgroundColor="#D1C4D1"
                disabled={loading}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.authButton, loading && styles.authButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.authButtonText}>Logging In...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.authButtonText}>Log In</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
                </View>
              )}
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate("ResetPassword")}
              disabled={loading}
              style={styles.forgotPasswordContainer}
            >
              <Text style={[styles.forgotPasswordText, loading && { opacity: 0.5 }]}>
                Forgot Password?
              </Text>
              <View style={styles.forgotPasswordUnderline} />
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Not a member yet?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                activeOpacity={0.5}
                disabled={loading}
                style={styles.registerLink}
              >
                <Text style={[styles.registerLinkText, loading && { opacity: 0.5 }]}>
                  Register Now
                </Text>
                <View style={styles.registerLinkTextUnderline} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Modal */}
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        primaryButton={modalConfig.primaryButton}
        secondaryButton={modalConfig.secondaryButton}
      />
    </LinearGradient>
  )
}