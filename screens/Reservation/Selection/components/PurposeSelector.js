import React, { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, TextInput, Animated } from "react-native"
import { purposeStyles } from "../styles/PurposeSelectorStyles"
import { getPurposeOptions } from "../utils/purposeConstants" 

export default function PurposeSelector({
  selectedFacility,
  selectedPurposes,
  customPurpose,
  onPurposeToggle,
  onCustomPurposeChange,
}) {
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [fadeAnim] = useState(new Animated.Value(0))

  // ✅ FIX: getPurposeOptions now handles both object and string
  const currentPurposeOptions = getPurposeOptions(selectedFacility)

  // ✅ Debug: Log to see what's happening (remove in production)
  useEffect(() => {
    console.log('PurposeSelector Debug:', {
      selectedFacility,
      currentPurposeOptions
    })
  }, [selectedFacility])

  // Handle "Other" selection with smooth animation
  useEffect(() => {
    const shouldShow = selectedPurposes.includes("Other")
    setShowCustomInput(shouldShow)
    
    Animated.timing(fadeAnim, {
      toValue: shouldShow ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [selectedPurposes, fadeAnim])

  const handlePurposeToggle = (purpose) => {
    if (purpose === "Other") {
      if (selectedPurposes.includes("Other")) {
        // Only allow deselect normally
        onPurposeToggle("Other")
        onCustomPurposeChange("")
      } else {
        // Add "Other" but only show input, require typing before proceeding
        onPurposeToggle("Other")
      }
    } else {
      onPurposeToggle(purpose)
    }
  }

  const renderPurposeOption = (purpose, index) => {
    const isSelected = selectedPurposes.includes(purpose)
    
    return (
      <TouchableOpacity
        key={purpose}
        style={[
          purposeStyles.purposeChip,
          isSelected && purposeStyles.purposeChipSelected,
        ]}
        onPress={() => handlePurposeToggle(purpose)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            purposeStyles.purposeChipText,
            isSelected && purposeStyles.purposeChipTextSelected,
          ]}
        >
          {purpose}
        </Text>
      </TouchableOpacity>
    )
  }

  // ✅ FIX: Show helpful message if no options available
  if (!selectedFacility) {
    return (
      <View style={purposeStyles.container}>
        <View style={purposeStyles.header}>
          <Text style={purposeStyles.title}>Event Type</Text>
        </View>
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: '#999', fontSize: 14 }}>
            No facility selected
          </Text>
        </View>
      </View>
    )
  }

  if (currentPurposeOptions.length === 0) {
    return (
      <View style={purposeStyles.container}>
        <View style={purposeStyles.header}>
          <Text style={purposeStyles.title}>Event Type</Text>
        </View>
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: '#999', fontSize: 14, textAlign: 'center' }}>
            No purpose options available for this facility
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={purposeStyles.container}>
      <View style={purposeStyles.header}>
        <Text style={purposeStyles.title}>Event Type</Text>
      </View>

      {/* Purpose Options Grid */}
      <View style={purposeStyles.chipContainer}>
        {currentPurposeOptions.map((purpose, index) => 
          renderPurposeOption(purpose, index)
        )}
      </View>

      {/* Custom Purpose Input */}
      {showCustomInput && (
        <Animated.View 
          style={[
            purposeStyles.customSection,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={purposeStyles.helperText}>Please specify your purpose</Text>
          <TextInput
            style={purposeStyles.customInput}
            placeholder="Specify purpose..."
            placeholderTextColor="#999"
            value={customPurpose}
            onChangeText={onCustomPurposeChange}
            maxLength={100}
            multiline
            textAlignVertical="top"
            returnKeyType="done"
            blurOnSubmit={true}
          />
        </Animated.View>
      )}
    </View>
  )
}