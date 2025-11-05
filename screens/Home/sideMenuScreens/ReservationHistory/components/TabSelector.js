// screens/Home/sideMenuScreens/ReservationHistory/components/TabSelector.js
import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "../styles"

export default function TabSelector({ activeTab, setActiveTab, currentCount, historyCount }) {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'current' && styles.activeTab]}
        onPress={() => setActiveTab('current')}
      >
        <Ionicons 
          name="calendar" 
          size={18} 
          color={activeTab === 'current' ? "#2d1b2e" : "#999"} 
        />
        <Text style={[styles.tabText, activeTab === 'current' && styles.activeTabText]}>
          Current
        </Text>
        {currentCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{currentCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tab, activeTab === 'history' && styles.activeTab]}
        onPress={() => setActiveTab('history')}
      >
        <Ionicons 
          name="time" 
          size={18} 
          color={activeTab === 'history' ? "#2d1b2e" : "#999"} 
        />
        <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
          History
        </Text>
        {historyCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{historyCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}