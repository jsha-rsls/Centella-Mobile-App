import React from "react"
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from "react-native"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import styles from "../styles/NavigationButtonsStyles"

export default function NavigationButtons({
  currentStep,
  totalSteps,
  canProceedFromCurrentStep,
  creating,
  onNextStep,
  onPrevStep,
  onCancel,
  onCreateReservation,
}) {
  const insets = useSafeAreaInsets()
  const tabBarHeight = useBottomTabBarHeight()

  const bottomPadding =
    Platform.OS === "ios"
      ? Math.max(tabBarHeight - insets.bottom, 20)
      : tabBarHeight + 20

  return (
    <View style={[styles.navigationContainer, { paddingBottom: bottomPadding }]}>
      {currentStep === 1 ? (
        <TouchableOpacity
          style={[styles.baseButton, styles.cancelButton]}
          onPress={onCancel}
          activeOpacity={0.9}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="close" size={18} color="#666" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </View>
        </TouchableOpacity>
      ) : (
        currentStep > 1 && (
          <TouchableOpacity
            style={[styles.baseButton, styles.prevButton]}
            onPress={onPrevStep}
            activeOpacity={0.9}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="chevron-back" size={18} color="#666" />
              <Text style={styles.prevButtonText}>Previous</Text>
            </View>
          </TouchableOpacity>
        )
      )}

      {currentStep < totalSteps ? (
        <TouchableOpacity
          style={[
            styles.baseButton,
            styles.nextButton,
            !canProceedFromCurrentStep && styles.nextButtonDisabled,
          ]}
          onPress={onNextStep}
          disabled={!canProceedFromCurrentStep}
          activeOpacity={0.9}
        >
          <View style={styles.buttonContent}>
            <Text
              style={[
                styles.nextButtonText,
                !canProceedFromCurrentStep && styles.nextButtonTextDisabled,
              ]}
            >
              Next
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={!canProceedFromCurrentStep ? "#999" : "white"}
            />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.baseButton,
            styles.createButton,
            creating && { opacity: 0.7 },
            !canProceedFromCurrentStep && styles.nextButtonDisabled,
          ]}
          onPress={onCreateReservation}
          disabled={creating || !canProceedFromCurrentStep}
          activeOpacity={0.9}
        >
          {creating ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={[styles.createButtonText, { marginLeft: 8 }]}>
                Reserving...
              </Text>
            </View>
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.createButtonText}>Reserve</Text>
              <Ionicons name="checkmark" size={18} color="white" />
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  )
}
