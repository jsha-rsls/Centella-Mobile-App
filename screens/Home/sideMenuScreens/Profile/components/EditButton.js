import { View, TouchableOpacity, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "../styles/ProfileStyles"

export default function EditButton({ isEditing, onEdit, onCancel, onSave }) {
  return (
    <View style={styles.editButtonContainer}>
      {!isEditing ? (
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={onEdit}
        >
          <Ionicons name="create-outline" size={16} color="#fff" />
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.editActionsContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={onSave}
          >
            <Ionicons name="checkmark" size={16} color="#fff" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}