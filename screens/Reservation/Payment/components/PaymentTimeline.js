import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { timelineStyles } from "../styles/TimelineStyles"

export default function PaymentTimeline() {
  return (
    <View style={timelineStyles.timelineCard}>
      <View style={timelineStyles.timelineHeader}>
        <Ionicons name="time-outline" size={18} color="#2d1b2e" />
        <Text style={timelineStyles.timelineTitle}>What Happens Next?</Text>
      </View>
      <View style={timelineStyles.timelineContent}>
        <View style={timelineStyles.timelineItem}>
          <View style={timelineStyles.timelineDot} />
          <Text style={timelineStyles.timelineText}>Payment confirmation (Instant)</Text>
        </View>
        <View style={timelineStyles.timelineItem}>
          <View style={timelineStyles.timelineDot} />
          <Text style={timelineStyles.timelineText}>Reservation approved (Within 5 mins)</Text>
        </View>
        <View style={timelineStyles.timelineItem}>
          <View style={timelineStyles.timelineDot} />
          <Text style={timelineStyles.timelineText}>Arrive & enjoy your booking!</Text>
        </View>
      </View>
    </View>
  )
}