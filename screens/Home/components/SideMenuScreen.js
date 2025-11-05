import { useState, useEffect, useRef } from "react"
import { View, Text, TouchableOpacity, Dimensions, Animated, BackHandler } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { signOut } from "../../../utils/authHelper"
import { clearAutoLoginData } from "../../../utils/AutoLoginHandler"
import CustomModal from "./modals/CustomModal"
import SpecialThanksModal from "./modals/SpecialThanksModal"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const MENU_WIDTH = SCREEN_WIDTH * 0.8

export default function SideMenuScreen({ navigation, route }) {
  const insets = useSafeAreaInsets()
  const { onLogout } = route.params || {}

  const slideAnim = useRef(new Animated.Value(MENU_WIDTH)).current
  const [modalVisible, setModalVisible] = useState(false)
  const [specialThanksVisible, setSpecialThanksVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [modalConfig, setModalConfig] = useState({
    type: "info",
    title: "",
    message: "",
    primaryButton: { text: "OK", onPress: () => {} },
    secondaryButton: null,
  })
  const [tapCount, setTapCount] = useState(0)

  const showModal = (config) => {
    setModalConfig(config)
    setModalVisible(true)
  }

  useEffect(() => {
    // Reset state
    setIsClosing(false)
    slideAnim.setValue(MENU_WIDTH)
    
    // Slide in animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()

    // Handle Android back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!isClosing) {
        handleClose()
      }
      return true
    })

    return () => {
      backHandler.remove()
    }
  }, [])

  const handleClose = () => {
    if (isClosing) return
    
    setIsClosing(true)
    
    Animated.timing(slideAnim, {
      toValue: MENU_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      // Use goBack instead of navigate to properly handle navigation stack
      if (navigation.canGoBack()) {
        navigation.goBack()
      }
    })
  }

  const handleMenuPress = (screenName) => {
    if (isClosing) return
    
    setIsClosing(true)
    
    Animated.timing(slideAnim, {
      toValue: MENU_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      // Navigate after animation completes
      navigation.replace(screenName)
    })
  }

  const handleLogout = () => {
    if (isClosing) return
    
    showModal({
      type: "confirm",
      title: "Logout",
      message: "Are you sure you want to logout?",
      primaryButton: {
        text: "Logout",
        onPress: async () => {
          setModalVisible(false)
          try {
            await clearAutoLoginData()
            const result = await signOut()
            
            if (result.success) {
              handleClose()
              
              if (onLogout) {
                setTimeout(() => {
                  onLogout()
                }, 300)
              }
            } else {
              showModal({
                type: "error",
                title: "Error",
                message: result.error || "Failed to logout. Please try again.",
                primaryButton: {
                  text: "OK",
                  onPress: () => setModalVisible(false),
                },
              })
            }
          } catch (error) {
            showModal({
              type: "error",
              title: "Error",
              message: "An unexpected error occurred during logout.",
              primaryButton: {
                text: "OK",
                onPress: () => setModalVisible(false),
              },
            })
            console.error("Logout error:", error)
          }
        },
      },
      secondaryButton: {
        text: "Cancel",
        onPress: () => setModalVisible(false),
      },
    })
  }

  const menuItems = [
    { 
      icon: "person-outline", 
      title: "Profile", 
      subtitle: "Manage your account", 
      onPress: () => handleMenuPress("Profile") 
    },
    { 
      icon: "calendar-outline", 
      title: "Reservation History", 
      subtitle: "View your bookings", 
      onPress: () => handleMenuPress("ReservationHistory") 
    },
    { 
      icon: "call-outline", 
      title: "Contact HOA", 
      subtitle: "Get in touch with us", 
      onPress: () => handleMenuPress("ContactHoa") 
    },
    { 
      icon: "help-circle-outline", 
      title: "FAQs", 
      subtitle: "Frequently asked questions", 
      onPress: () => handleMenuPress("Faqs") 
    },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <ExpoStatusBar style="auto" translucent={true} />

      {/* Backdrop */}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        activeOpacity={1}
        onPress={handleClose}
      />

      {/* Menu Panel */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: MENU_WIDTH,
          backgroundColor: "white",
          shadowColor: "#000",
          shadowOffset: { width: -2, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 10,
          transform: [{ translateX: slideAnim }],
        }}
      >
        {/* Header */}
        <LinearGradient
          colors={["#F9E6E6", "#F2D5D5", "#F9E6E6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: insets.top + 8,
            paddingBottom: 12,
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: 50,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#2d1b2e" }}>Menu</Text>
                <Text style={{ fontSize: 14, color: "#5a4a5b" }}>Settings & More</Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "rgba(45, 27, 46, 0.15)",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={handleClose}
              disabled={isClosing}
            >
              <Ionicons name="close-outline" size={20} color="#2d1b2e" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Menu Items */}
        <View style={{ flex: 1, paddingTop: 16 }}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#f0f0f0",
              }}
              onPress={item.onPress}
              activeOpacity={0.7}
              disabled={isClosing}
            >
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: "#f8f9fa",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name={item.icon} size={20} color="#231828" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "600", color: "#1a1a1a" }}>{item.title}</Text>
                <Text style={{ fontSize: 12, color: "#666", marginTop: 1 }}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View
          style={{
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: "#f0f0f0",
            paddingBottom: insets.bottom + 16,
          }}
        >
          {/* Logout */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
            onPress={handleLogout}
            activeOpacity={0.7}
            disabled={isClosing}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: "#ffebee",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name="log-out-outline" size={20} color="#f44336" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "600", color: "#f44336" }}>Logout</Text>
              <Text style={{ fontSize: 12, color: "#999", marginTop: 1 }}>Sign out of your account</Text>
            </View>
          </TouchableOpacity>

          {/* App Version with Easter Egg */}
          <View
            style={{
              marginTop: 16,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: "#f0f0f0",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setTapCount((prev) => {
                  const newCount = prev + 1
                  if (newCount >= 13) {
                    setSpecialThanksVisible(true)
                    return 0
                  }
                  return newCount
                })
              }}
              activeOpacity={0.7}
              disabled={isClosing}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: "#999",
                  textAlign: "center",
                }}
              >
                Centella Homes App V1
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Custom Modal (for logout confirmation) */}
      {modalVisible && (
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          primaryButton={modalConfig.primaryButton}
          secondaryButton={modalConfig.secondaryButton}
        />
      )}

      {/* Special Thanks Modal (Easter Egg) */}
      <SpecialThanksModal
        visible={specialThanksVisible}
        onClose={() => setSpecialThanksVisible(false)}
      />
    </View>
  )
}