import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import SettingsHeader from "../components/SettingsHeader"
import styles from "./CPStyles"
import { changePassword } from "../../../../../services/residentService"

export default function ChangePassword({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Password validation criteria
  const hasMinLength = newPassword.length >= 8
  const hasUpperCase = /[A-Z]/.test(newPassword)
  const hasLowerCase = /[a-z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match")
      return
    }

    if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      Alert.alert("Error", "Password does not meet all requirements")
      return
    }

    setLoading(true)

    try {
      const result = await changePassword(currentPassword, newPassword)

      if (result.success) {
        Alert.alert("Success", "Password changed successfully", [
          { 
            text: "OK", 
            onPress: () => {
              // Clear fields
              setCurrentPassword("")
              setNewPassword("")
              setConfirmPassword("")
              navigation.goBack()
            }
          }
        ])
      } else {
        Alert.alert("Error", result.error || "Failed to change password")
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.")
      console.error("Change password error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <SettingsHeader navigation={navigation} title="Change Password" />
      
      <ScrollView style={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                placeholder="Enter current password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                <Ionicons 
                  name={showCurrentPassword ? "eye-off-outline" : "eye-outline"} 
                  size={18} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                <Ionicons 
                  name={showNewPassword ? "eye-off-outline" : "eye-outline"} 
                  size={18} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={18} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.criteriaCard}>
            <View style={styles.criteriaRow}>
              <Ionicons 
                name={hasMinLength ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={hasMinLength ? "#4CAF50" : "#ccc"} 
              />
              <Text style={[styles.criteriaText, hasMinLength && styles.criteriaTextValid]}>
                8+ characters
              </Text>
            </View>

            <View style={styles.criteriaRow}>
              <Ionicons 
                name={hasUpperCase ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={hasUpperCase ? "#4CAF50" : "#ccc"} 
              />
              <Text style={[styles.criteriaText, hasUpperCase && styles.criteriaTextValid]}>
                Uppercase (A-Z)
              </Text>
            </View>

            <View style={styles.criteriaRow}>
              <Ionicons 
                name={hasLowerCase ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={hasLowerCase ? "#4CAF50" : "#ccc"} 
              />
              <Text style={[styles.criteriaText, hasLowerCase && styles.criteriaTextValid]}>
                Lowercase (a-z)
              </Text>
            </View>

            <View style={styles.criteriaRow}>
              <Ionicons 
                name={hasNumber ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={hasNumber ? "#4CAF50" : "#ccc"} 
              />
              <Text style={[styles.criteriaText, hasNumber && styles.criteriaTextValid]}>
                Number (0-9)
              </Text>
            </View>

            <View style={styles.criteriaRow}>
              <Ionicons 
                name={hasSpecialChar ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={hasSpecialChar ? "#4CAF50" : "#ccc"} 
              />
              <Text style={[styles.criteriaText, hasSpecialChar && styles.criteriaTextValid]}>
                Special (!@#$%)
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Update Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}