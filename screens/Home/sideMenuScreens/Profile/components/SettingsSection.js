import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import styles from "../styles/ProfileStyles"

export default function SettingsSection() {
  const navigation = useNavigation()

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="settings-outline" size={18} color="#2d1b2e" />
        <Text style={styles.sectionTitle}>Settings</Text>
      </View>

      <View style={styles.card}>
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <View style={styles.settingLeft}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="key-outline" size={16} color="#2d1b2e" />
            </View>
            <View>
              <Text style={styles.settingTitle}>Change Password</Text>
              <Text style={styles.settingSubtitle}>Update your password</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => navigation.navigate('Notification')}
        >
          <View style={styles.settingLeft}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="notifications-outline" size={16} color="#2d1b2e" />
            </View>
            <View>
              <Text style={styles.settingTitle}>Notification Settings</Text>
              <Text style={styles.settingSubtitle}>Manage your notifications</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  )
}