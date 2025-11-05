import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "../styles/styles"

export default function ContactMethodCard({ method, onPress }) {
  return (
    <TouchableOpacity 
      style={styles.contactCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.contactHeader}>
        <View style={[
          styles.contactIconContainer,
          { backgroundColor: method.color || "#F9E6E6" }
        ]}>
          <Ionicons name={method.icon} size={24} color="#2d1b2e" />
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>{method.title}</Text>
          <Text style={styles.contactValue}>{method.value}</Text>
          <Text style={styles.contactSubtitle}>{method.subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  )
}