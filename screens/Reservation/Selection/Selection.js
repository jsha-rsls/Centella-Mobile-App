import { useState, useEffect, useContext, useCallback } from "react"
import { View, ScrollView, Alert, KeyboardAvoidingView, Platform, BackHandler } from "react-native"
import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import { SafeAreaView } from "react-native-safe-area-context"
import { useFocusEffect } from "@react-navigation/native"
import { styles } from "./styles/SelectionStyles"
import FacilityPicker, { FacilityPickerHeader } from "./components/FacilityPicker"

import DatePicker from "./components/DatePicker"
import TimePicker from "./components/TimePicker"
import PurposeSelector from "./components/PurposeSelector"
import StepIndicator from "./components/StepIndicator"
import SelectionSummary from "./components/SelectionSummary"
import NavigationButtons from "./components/NavigationButtons"
import { useSelectionState } from "./hooks/useSelectionState"
import { useSelectionHandlers } from "./hooks/useSelectionHandlers"
import SelectionSkeleton from './components/SelectionSkeleton'


// Context
import { SelectionContext } from "../../../navigation/SelectionContext"

// Reuse modal from tabs
import TabChangeConfirmationModal from "./components/TabChangeConfirmationModal"

export default function Selection({ navigation, route }) {
  const { facilityType, selectedTime } = route.params || {}

  const { hasSelections, setHasSelections } = useContext(SelectionContext)

  const [currentStep, setCurrentStep] = useState(1)
  const [currentSubstep, setCurrentSubstep] = useState(1)
  const totalSteps = 3

  const [showBackModal, setShowBackModal] = useState(false)

  const {
    selectedFacility,
    selectedDate,
    selectedTimeSlot,
    selectedPurposes,
    customPurpose,
    facilities,
    loading,
    creating,
    dateSelected,
    facilitySelected,
    showDatePicker,
    showTimePicker,
    showFacilityPicker,
    selectedStartTime,
    selectedEndTime,
    timeSelectionStep,
    selectedMonth,
    selectedYear,
    tempDate,
    setSelectedFacility,
    setSelectedDate,
    setSelectedTimeSlot,
    setSelectedPurposes,
    setCustomPurpose,
    setFacilities,
    setLoading,
    setCreating,
    setDateSelected,
    setFacilitySelected,
    setShowDatePicker,
    setShowTimePicker,
    setShowFacilityPicker,
    setSelectedStartTime,
    setSelectedEndTime,
    setTimeSelectionStep,
    setSelectedMonth,
    setSelectedYear,
    setTempDate,
    resetAllState,
  } = useSelectionState(facilityType, selectedTime)

  const {
    handleDateSelect,
    handleFacilitySelect,
    handleTimeConfirm,
    handleCustomTimeConfirm,
    handlePurposeToggle,
    handleProceedToPayment,
    loadFacilities,
    ModalComponent,
  } = useSelectionHandlers({
    selectedFacility,
    selectedDate,
    selectedTimeSlot,
    selectedPurposes,
    customPurpose,
    facilities,
    selectedStartTime,
    selectedEndTime,
    timeSelectionStep,
    setSelectedFacility,
    setSelectedDate,
    setSelectedTimeSlot,
    setSelectedPurposes,
    setCustomPurpose,
    setFacilities,
    setLoading,
    setCreating,
    setDateSelected,
    setFacilitySelected,
    setShowDatePicker,
    setShowTimePicker,
    setShowFacilityPicker,
    setSelectedStartTime,
    setSelectedEndTime,
    setTimeSelectionStep,
    setTempDate,
    navigation,
  })

  useEffect(() => {
    if (
      selectedFacility?.id ||
      selectedDate ||
      selectedTimeSlot ||
      selectedPurposes.length > 0 ||
      customPurpose.trim()
    ) {
      setHasSelections(true)
    } else {
      setHasSelections(false)
    }
  }, [selectedFacility, selectedDate, selectedTimeSlot, selectedPurposes, customPurpose])

  useFocusEffect(
    useCallback(() => {
      resetAllState()
      setCurrentStep(1)
      setCurrentSubstep(1)
      setHasSelections(false)
      loadFacilities()
    }, [])
  )

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (hasSelections) {
        setShowBackModal(true)
        return true
      }
      return false
    })
    return () => backHandler.remove()
  }, [hasSelections])

  const handleConfirmBackNavigation = () => {
    setShowBackModal(false)
    resetAllState()
    setHasSelections(false)
    navigation.goBack()
  }

  const handleCancelBackNavigation = () => {
    setShowBackModal(false)
  }

const handleProceedToPaymentScreen = () => {
  // Validate all selections
  if (!selectedFacility || !selectedDate || !selectedTimeSlot) {
    Alert.alert("Incomplete Information", "Please complete all required information")
    return
  }
  
  if (selectedPurposes.length === 0 && !customPurpose.trim()) {
    Alert.alert("Event Required", "Please specify the event for your reservation")
    return
  }

  const facilityObject = facilities.find((f) => f.id === selectedFacility?.id)
  
  if (!facilityObject) {
    Alert.alert("Error", "Please select a valid facility")
    return
  }

  // Build purpose string
  let purpose = ""
  const filteredPurposes = selectedPurposes.filter(p => p !== "Other")
  
  if (filteredPurposes.length > 0) {
    purpose = filteredPurposes.join(", ")
    if (customPurpose.trim()) {
      purpose += ", " + customPurpose.trim()
    }
  } else if (customPurpose.trim()) {
    purpose = customPurpose.trim()
  }

  // Split time slot into start and end times
  const [startTime, endTime] = selectedTimeSlot.split(" - ")

  // ✅ Prepare booking data for Payment screen
  const bookingData = {
    reservation_date: selectedDate,
    start_time: startTime,
    end_time: endTime,
    purpose: purpose,
  }

  // ✅ Pass facilityData separately (this is what Payment.js expects)
  const facilityData = {
    id: facilityObject.id,
    name: facilityObject.name,
    price: facilityObject.price,
    price_unit: facilityObject.price_unit || 'per hour',
  }

  // Navigate to Payment screen with both bookingData and facilityData
  navigation.navigate("Payment", { 
    bookingData, 
    facilityData 
  })
}

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedFacility) {
      Alert.alert("Selection Required", "Please select a facility to continue.")
      return
    }

    if (currentStep === 2) {
      if (currentSubstep === 1) {
        if (!selectedDate) {
          Alert.alert("Selection Required", "Please select a date to continue.")
          return
        }
        setCurrentSubstep(2)
        return
      } else if (currentSubstep === 2) {
        if (!selectedTimeSlot) {
          Alert.alert("Selection Required", "Please select a time to continue.")
          return
        }
        setCurrentStep(3)
        setCurrentSubstep(1)
        return
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      setCurrentSubstep(1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep === 2 && currentSubstep === 2) {
      setCurrentSubstep(1)
    } else if (currentStep === 3) {
      setCurrentStep(2)
      setCurrentSubstep(2)
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setCurrentSubstep(1)
    }
  }

  const canProceedFromCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return selectedFacility
      case 2:
        if (currentSubstep === 1) {
          return selectedDate
        } else {
          return selectedTimeSlot
        }
      case 3:
        return selectedPurposes.length > 0 || customPurpose.trim()
      default:
        return false
    }
  }

  const getStepStatus = (step) => {
    if (step < currentStep) return 'completed'
    if (step === currentStep) {
      if (step === 2) {
        if (currentSubstep === 1) return 'half-completed'
        if (currentSubstep === 2) return 'active'
      }
      return 'active'
    }
    if (step === 2 && currentStep > 2) return 'completed'
    return 'inactive'
  }

if (loading) {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ExpoStatusBar style="auto" />
      
      {/* Show StepIndicator during loading */}
      <StepIndicator 
        currentStep={currentStep} 
        currentSubstep={currentSubstep}
        totalSteps={totalSteps}
        getStepStatus={getStepStatus}
      />
      
      {/* Show Skeleton loading */}
      <SelectionSkeleton />
    </SafeAreaView>
  )
}

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ExpoStatusBar style="auto" />

      <View style={{ flex: 1 }}>
        <StepIndicator 
          currentStep={currentStep} 
          currentSubstep={currentSubstep}
          totalSteps={totalSteps}
          getStepStatus={getStepStatus}
        />

        <SelectionSummary
          selectedFacility={selectedFacility}
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          selectedPurposes={selectedPurposes}
          customPurpose={customPurpose}
          facilities={facilities}
          currentStep={currentStep}
        />

        {currentStep === 1 && <FacilityPickerHeader />}

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ 
              flexGrow: 1
            }}
          >
            {currentStep === 1 && (
              <View style={styles.stepContainer}>
                <FacilityPicker
                  selectedFacility={selectedFacility}
                  facilitySelected={facilitySelected}
                  showFacilityPicker={showFacilityPicker}
                  facilities={facilities}
                  onShowPicker={() => setShowFacilityPicker(true)}
                  onFacilitySelect={handleFacilitySelect}
                />
              </View>
            )}

            {currentStep === 2 && (
              <View style={styles.stepContainer}>
                {currentSubstep === 1 && (
                  <DatePicker
                    selectedDate={selectedDate}
                    dateSelected={dateSelected}
                    showDatePicker={showDatePicker}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    onShowPicker={() => setShowDatePicker(true)}
                    onDateSelect={handleDateSelect}
                    onMonthChange={(month, year) => {
                      setSelectedMonth(month)
                      setSelectedYear(year)
                    }}
                    selectedFacility={selectedFacility}
                  />
                )}

                {currentSubstep === 2 && (
                  <TimePicker
                    selectedDate={selectedDate}
                    selectedFacility={selectedFacility}
                    facilities={facilities}
                    selectedTimeSlot={selectedTimeSlot}
                    timeSelectionStep={timeSelectionStep}
                    showTimePicker={showTimePicker}
                    selectedStartTime={selectedStartTime}
                    selectedEndTime={selectedEndTime}
                    onShowPicker={() => setShowTimePicker(true)}
                    onTimeConfirm={handleTimeConfirm}
                    onCustomTimeConfirm={handleCustomTimeConfirm}
                    onTimeChange={(timeType, time) => {
                      if (timeType === "start") {
                        setSelectedStartTime(time)
                      } else {
                        setSelectedEndTime(time)
                      }
                    }}
                    onChangeTime={() => {
                      setShowTimePicker(true)
                      setTimeSelectionStep("start")
                    }}
                  />
                )}
              </View>
            )}

            {currentStep === 3 && (
              <View style={styles.stepContainer}>
                <PurposeSelector
                  selectedFacility={selectedFacility}
                  selectedPurposes={selectedPurposes}
                  customPurpose={customPurpose}
                  onPurposeToggle={handlePurposeToggle}
                  onCustomPurposeChange={setCustomPurpose}
                />
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

<NavigationButtons
  currentStep={currentStep}
  currentSubstep={currentSubstep}
  totalSteps={totalSteps}
  canProceedFromCurrentStep={canProceedFromCurrentStep()}
  creating={creating}
  onNextStep={handleNextStep}
  onPrevStep={handlePrevStep}
  onCancel={() => navigation.goBack()}
  onCreateReservation={handleProceedToPaymentScreen}  // ✅ Changed this
/>

      <ModalComponent />

      <TabChangeConfirmationModal
        visible={showBackModal}
        onConfirm={handleConfirmBackNavigation}
        onCancel={handleCancelBackNavigation}
        targetTabName={"previous screen"}
      />
    </SafeAreaView>
  )
}