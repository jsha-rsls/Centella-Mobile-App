import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useRef } from "react"

export default function CustomModal({
  visible,
  onClose,
  title,
  message,
  type = "info", // "success", "error", "info"
  primaryButton = { text: "OK", onPress: onClose },
  secondaryButton = null,
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      scaleAnim.setValue(0)
      opacityAnim.setValue(0)
    }
  }, [visible])

  const getIconConfig = () => {
    switch (type) {
      case "success":
        return { name: "checkmark-circle", color: "#10B981" }
      case "error":
        return { name: "close-circle", color: "#EF4444" }
      case "warning":
        return { name: "alert-circle", color: "#F59E0B" }
      case "missing":
        return { name: "help-circle", color: "#8B5CF6" }
      default:
        return { name: "information-circle", color: "#3B82F6" }
    }
  }

  const iconConfig = getIconConfig()

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <TouchableOpacity style={styles.overlayTouchable} activeOpacity={1} onPress={onClose} />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={iconConfig.name} size={38} color={iconConfig.color} />
          </View>

          <Text style={styles.title}>{title}</Text>
          {message && <Text style={styles.message}>{message}</Text>}

          <View style={styles.buttonContainer}>
            {secondaryButton && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={secondaryButton.onPress}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>{secondaryButton.text}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, !secondaryButton && styles.fullWidth]}
              onPress={primaryButton.onPress}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>{primaryButton.text}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayTouchable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    width: "75%",
    maxWidth: 300,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#231828",
    marginBottom: 4,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 14,
    lineHeight: 19,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
    justifyContent: "center",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 38,
  },
  fullWidth: {
    width: "auto",
  },
  primaryButton: {
    backgroundColor: "#231828",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  secondaryButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  secondaryButtonText: {
    color: "#231828",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
})