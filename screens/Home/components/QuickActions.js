import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { styles } from "./styles/QuickActionsStyles"

export default function QuickActions({ navigation }) {
  const quickActions = [
    {
      id: 1,
      icon: "person-outline",
      title: "My Profile",
      onPress: () => navigation.navigate("Profile"),
    },
    {
      id: 2,
      icon: "clipboard-outline",
      title: "My Reservations",
      onPress: () => navigation.navigate("ReservationHistory"),
    },
    {
      id: 3,
      icon: "calendar-outline",
      title: "View Schedule",
      onPress: () => navigation.navigate("Schedule"),
    },
    {
      id: 4,
      icon: "call-outline",
      title: "Contact HOA",
      onPress: () => navigation.navigate("ContactHoa"),
    },
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Access</Text>
      <View style={styles.cardContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {quickActions.map((action) => (
            <TouchableOpacity 
              key={action.id}
              style={styles.actionCard} 
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={action.icon} 
                  size={18} 
                  color="#2d1b2e" 
                />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}