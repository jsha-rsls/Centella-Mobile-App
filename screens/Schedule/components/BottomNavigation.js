import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { styles } from "../styles/bottomNavigationStyles"

const navItems = [
  { key: "home", label: "Home", icon: "home" },
  { key: "schedule", label: "Schedule", icon: "calendar" },
  { key: "reserve", label: "Reserve", icon: "bookmark" },
  { key: "news", label: "News", icon: "notifications" },
  { key: "history", label: "History", icon: "time" },
  { key: "announcement", label: "Announcement", icon: "notifications" },
]

export default function BottomNavigation({ activeTab, onTabChange }) {
  return (
    <View style={styles.bottomNavigation}>
      <View style={styles.navContainer}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.navItem, activeTab === item.key && styles.navItemActive]}
            onPress={() => onTabChange(item.key)}
          >
            <Ionicons
              name={activeTab === item.key ? item.icon : `${item.icon}-outline`}
              size={24}
              color={activeTab === item.key ? "#007bff" : "#9ca3af"}
            />
            <Text style={[
              styles.navLabel, 
              activeTab === item.key && styles.navLabelActive
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}