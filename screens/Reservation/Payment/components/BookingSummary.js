import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { summaryStyles } from "../styles/SummaryStyles"

export default function BookingSummary({ bookingData, collapsed, onToggle }) {
  return (
    <TouchableOpacity 
      style={summaryStyles.summaryCard}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[
        summaryStyles.summaryHeader,
        !collapsed && { marginBottom: 16 }
      ]}>
        <Ionicons name="document-text-outline" size={20} color="#2d1b2e" />
        <Text style={summaryStyles.summaryTitle}>Reservation Summary</Text>
        <Ionicons 
          name={collapsed ? "chevron-down" : "chevron-up"} 
          size={20} 
          color="#666" 
        />
      </View>
      
      {!collapsed && (
        <>
          <View style={summaryStyles.summaryRow}>
            <Text style={summaryStyles.summaryLabel}>Facility</Text>
            <Text style={summaryStyles.summaryValue}>{bookingData.facility}</Text>
          </View>
          
          <View style={summaryStyles.summaryRow}>
            <Text style={summaryStyles.summaryLabel}>Schedule</Text>
            <Text style={summaryStyles.summaryValue}>
              {bookingData.date} | {bookingData.time}
            </Text>
          </View>
          
          <View style={summaryStyles.summaryRow}>
            <Text style={summaryStyles.summaryLabel}>Event</Text>
            <Text style={summaryStyles.summaryValue}>{bookingData.purpose}</Text>
          </View>
          
          <View style={summaryStyles.totalSection}>
            <Text style={summaryStyles.totalLabel}>Total Amount</Text>
            <Text style={summaryStyles.totalValue}>₱{bookingData.price}</Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  )
}