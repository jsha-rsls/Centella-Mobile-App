import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import styles from "../styles/styles"

export default function Header({ navigation, insets }) {
  return (
    <LinearGradient
      colors={["#F9E6E6", "#F2D5D5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, { paddingTop: insets.top + 11 }]}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#2d1b2e" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Contact HOA</Text>
          <Text style={styles.headerSubtitle}>We're here to help</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
    </LinearGradient>
  )
}