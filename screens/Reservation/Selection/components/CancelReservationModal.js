import React from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const { width } = Dimensions.get('window')

const CancelReservationModal = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      animationInTiming={150}
      animationOutTiming={150}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header with icon */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
            </View>
            <Text style={styles.title}>Cancel Reservation?</Text>
            <Text style={styles.message}>
              Canceling this reservation will clear all your current selections, including the facility, date, time, and purpose. You'll need to start over if you return.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Keep Editing</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: Math.min(width - 40, 340),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D1B2E',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 4,
    gap: 10,
  },
  button: {
    flex: 1,
    height: 36,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1.5,
    borderColor: '#2d1b2e',
  },
  primaryButtonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: 'white',
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: '#2d1b2e',
  },
})

export default CancelReservationModal