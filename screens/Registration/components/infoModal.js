import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./infoModalStyle";

export default function InfoModal({ visible, onClose }) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#2a9d8f"
              style={{ marginRight: 6, marginTop: 3 }}
            />
            <Text style={styles.modalTitle}>Why we need your ID</Text>
          </View>

          <Text style={styles.modalBody}>
            We ask for a valid government ID to confirm your residency at{" "}
            <Text style={{ fontWeight: "600" }}>Centella Homes</Text>.{"\n\n"}
            Your captured ID photos will only be visible to{" "}
            <Text style={{ fontWeight: "600" }}>authorized HOA admins</Text>{" "}
            during the approval process.{"\n\n"}
            Once your account is approved, the ID images will be{" "}
            <Text style={{ fontWeight: "600", color: "#e63946" }}>
              permanently deleted
            </Text>
            . We do not store or share your ID with any third parties.
          </Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}