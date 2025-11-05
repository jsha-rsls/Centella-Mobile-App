import { View, Text } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { styles } from "../styles/HeaderStyles"

export default function Header({ insets }) {
  return (
    <LinearGradient
      colors={["#F9E6E6", "#F2D5D5", "#F9E6E6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.calendarHeader, { paddingTop: insets.top + 8 }]}
    >
      <View style={styles.calendarHeaderContent}>
        <View style={styles.calendarHeaderCentered}>
          <Text style={[styles.calendarHeaderTitle, { color: '#2d1b2e', textAlign: 'center' }]}>
            Events Calendar
          </Text>
        </View>
      </View>
    </LinearGradient>
  )
}