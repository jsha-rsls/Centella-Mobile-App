import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import styles from "../styles/StepIndicatorStyles"

export default function StepIndicator({ currentStep, currentSubstep, totalSteps, getStepStatus }) {
  const insets = useSafeAreaInsets()
  const stepNames = ["Select Facility", "Select Date & Time", "Select Event"]

  // Update step name for substeps
  const getStepName = () => {
    if (currentStep === 2) {
      if (currentSubstep === 1) {
        return "Select Date"
      } else if (currentSubstep === 2) {
        return "Select Time"
      }
    }
    return stepNames[currentStep - 1]
  }

  return (
    <LinearGradient
      colors={["#F9E6E6", "#F2D5D5", "#F9E6E6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.headerContainer, { paddingTop: insets.top }]}
    >
      {/* Step Title */}
      <Text style={styles.stepTitle}>{getStepName()}</Text>
      
      {/* Step Progress Indicator */}
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1
          const stepStatus = getStepStatus(stepNumber)
          
          const isActive = stepStatus === 'active'
          const isCompleted = stepStatus === 'completed'
          const isHalfCompleted = stepStatus === 'half-completed'

          return (
            <View key={stepNumber} style={styles.stepWrapper}>
              <View style={styles.stepCircleContainer}>
                {/* Main circle */}
                <View
                  style={[
                    styles.stepCircle,
                    isActive && styles.stepCircleActive,
                    isCompleted && styles.stepCircleCompleted,
                    isHalfCompleted && styles.stepCircleHalfCompleted,
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={18} color="#2d1b2e" />
                  ) : (
                    <Text
                      style={[
                        styles.stepNumber,
                        (isActive || isHalfCompleted) && styles.stepNumberActive,
                      ]}
                    >
                      {stepNumber}
                    </Text>
                  )}
                </View>
                
                {/* Half-filled overlay for step 2 when date is selected but time is not */}
                {isHalfCompleted && (
                  <View style={styles.halfFillOverlay}>
                    <View style={styles.halfFillLeft} />
                  </View>
                )}
              </View>
              
              {stepNumber < totalSteps && (
                <View style={[
                  styles.stepLine, 
                  (isCompleted || (stepNumber === 1 && currentStep > 1)) && styles.stepLineCompleted
                ]} />
              )}
            </View>
          )
        })}
      </View>
    </LinearGradient>
  )
}