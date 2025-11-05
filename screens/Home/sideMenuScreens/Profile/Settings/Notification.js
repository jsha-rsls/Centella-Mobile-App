import { View, Text, Switch, StyleSheet, ScrollView, Platform, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import SettingsHeader from "../components/SettingsHeader"
import { supabase } from "../../../../../utils/supabase"

export default function Notification({ navigation }) {
  const [loading, setLoading] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [announcementNotifications, setAnnouncementNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        Alert.alert('Error', 'Please log in to access settings')
        navigation.goBack()
        return
      }

      setUserId(user.id)

      // Fetch resident settings from Supabase
      const { data, error } = await supabase
        .from('residents')
        .select('notifications_enabled, announcement_notifications')
        .eq('auth_user_id', user.id)
        .single()

      if (error) {
        console.error('Error loading settings:', error)
        Alert.alert('Error', 'Failed to load notification settings')
        return
      }

      if (data) {
        setNotificationsEnabled(data.notifications_enabled ?? true)
        setAnnouncementNotifications(data.announcement_notifications ?? true)
      }
    } catch (error) {
      console.error('Error in loadSettings:', error)
      Alert.alert('Error', 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (field, value) => {
    try {
      const { error } = await supabase
        .from('residents')
        .update({ [field]: value })
        .eq('auth_user_id', userId)

      if (error) {
        console.error(`Error updating ${field}:`, error)
        Alert.alert('Error', 'Failed to update setting')
        // Revert the change
        if (field === 'notifications_enabled') {
          setNotificationsEnabled(!value)
        } else if (field === 'announcement_notifications') {
          setAnnouncementNotifications(!value)
        }
        return
      }

      console.log(`✅ Updated ${field} to ${value}`)
    } catch (error) {
      console.error('Error in updateSetting:', error)
      Alert.alert('Error', 'An unexpected error occurred')
    }
  }

  const handleNotificationsToggle = (value) => {
    setNotificationsEnabled(value)
    updateSetting('notifications_enabled', value)
  }

  const handleAnnouncementToggle = (value) => {
    setAnnouncementNotifications(value)
    updateSetting('announcement_notifications', value)
  }

  const handleThemeToggle = (value) => {
    setDarkMode(value)
    // Theme functionality to be implemented later
    Alert.alert(
      'Coming Soon',
      'Dark mode feature will be available in a future update!',
      [{ text: 'OK', onPress: () => setDarkMode(false) }]
    )
  }

  const switchStyle = {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
    ...(Platform.OS === 'ios' && {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 1,
    }),
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <SettingsHeader navigation={navigation} title="Notification Settings" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SettingsHeader navigation={navigation} title="Settings" />
      
      <ScrollView style={styles.scrollContent}>
        <View style={styles.content}>
          {/* Notification Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="notifications-outline" size={18} color="#8b5a8d" />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.settingTitle}>Push Notifications</Text>
                    <Text style={styles.settingSubtitle}>Receive notifications on this device</Text>
                  </View>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleNotificationsToggle}
                  trackColor={{ false: "#d0d0d0", true: "#b88ab9" }}
                  thumbColor="#fff"
                  ios_backgroundColor="#d0d0d0"
                  style={switchStyle}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="megaphone-outline" size={18} color="#8b5a8d" />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.settingTitle}>Announcement Notifications</Text>
                    <Text style={styles.settingSubtitle}>Get notified about community announcements</Text>
                  </View>
                </View>
                <Switch
                  value={announcementNotifications}
                  onValueChange={handleAnnouncementToggle}
                  trackColor={{ false: "#d0d0d0", true: "#b88ab9" }}
                  thumbColor="#fff"
                  ios_backgroundColor="#d0d0d0"
                  style={switchStyle}
                  disabled={!notificationsEnabled}
                />
              </View>
            </View>
          </View>

          {/* Appearance Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="moon-outline" size={18} color="#8b5a8d" />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.settingTitle}>Dark Mode</Text>
                    <Text style={styles.settingSubtitle}>Coming soon</Text>
                  </View>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={handleThemeToggle}
                  trackColor={{ false: "#d0d0d0", true: "#b88ab9" }}
                  thumbColor="#fff"
                  ios_backgroundColor="#d0d0d0"
                  style={switchStyle}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f5f8",
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2d1b2e",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  settingLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginRight: 12,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#f3e8f3",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2d1b2e",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 60,
  },
})