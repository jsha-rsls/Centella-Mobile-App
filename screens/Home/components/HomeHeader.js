import { useCallback, useRef } from 'react'
import { View, Text, TouchableOpacity, Image, InteractionManager } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from '@react-navigation/native'
import { styles } from "../HomeStyles"

export default function HomeHeader({ insets, navigation, firstName }) {
  const lastPressTime = useRef(0)

  // Reset debounce when screen gains focus
  useFocusEffect(
    useCallback(() => {
      lastPressTime.current = 0
    }, [])
  )

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const handleMenuPress = useCallback(() => {
    const now = Date.now()
    
    // Simple debounce - prevent double press
    if (now - lastPressTime.current < 300) {
      return
    }
    
    lastPressTime.current = now
    
    // Wait for interactions to complete before navigating
    InteractionManager.runAfterInteractions(() => {
      navigation.navigate('SideMenu')
    })
  }, [navigation])

  const handleNotifications = useCallback(() => {
    const now = Date.now()
    
    if (now - lastPressTime.current < 300) {
      return
    }
    
    lastPressTime.current = now
    
    InteractionManager.runAfterInteractions(() => {
      navigation.navigate('Notifications')
    })
  }, [navigation])

  return (
    <LinearGradient
      colors={["#F9E6E6", "#F2D5D5", "#F9E6E6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.headerNew, { paddingTop: insets.top + 8 }]}
    >
      <View style={styles.headerContentNew}>
        <View style={styles.headerLeftNew}>
          <Image 
            source={require("../../../assets/clean-logo.png")} 
            style={styles.headerLogoNew} 
            resizeMode="contain" 
          />
          <View style={styles.headerTextNew}>
            <Text style={[styles.headerGreeting, { color: '#2d1b2e' }]}>
              {getGreeting()}!
            </Text>
            <Text style={[styles.headerSubtitleNew, { color: '#5a4a5b' }]}>
              Welcome back, {firstName}!
            </Text>
          </View>
        </View>
        <View style={styles.headerRightNew}>
          <TouchableOpacity 
            style={[styles.notificationButton, { backgroundColor: 'rgba(45, 27, 46, 0.15)' }]} 
            onPress={handleNotifications}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="notifications-outline" size={20} color="#2d1b2e" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.burgerButton, { backgroundColor: 'rgba(45, 27, 46, 0.15)' }]} 
            onPress={handleMenuPress}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="menu-outline" size={22} color="#2d1b2e" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )
}