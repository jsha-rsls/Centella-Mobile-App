import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { styles } from "../styles/MonthNavigationStyles"

export default function MonthNavigation({ currentMonth, onMonthChange }) {
  return (
    <View style={styles.monthHeader}>
      <TouchableOpacity 
        style={styles.monthNavButton} 
        onPress={() => onMonthChange("prev")}
      >
        <Ionicons name="chevron-back" size={24} color="#374151" />
      </TouchableOpacity>
      
      <Text style={styles.monthTitle}>
        {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </Text>
      
      <TouchableOpacity 
        style={styles.monthNavButton} 
        onPress={() => onMonthChange("next")}
      >
        <Ionicons name="chevron-forward" size={24} color="#374151" />
      </TouchableOpacity>
    </View>
  )
}