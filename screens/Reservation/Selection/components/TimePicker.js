import React, { useCallback, useState, useEffect } from "react"
import { View, Text, TouchableOpacity, Alert } from "react-native"
import { timePickerStyles } from "../styles/UnifiedTimePickerStyles"
import {
  formatTime12Hour,
  PRESET_GROUPS,
  isPresetSelected,
} from "../utils/timeUtils"
import {
  renderScrollablePicker,
  PresetTimePicker,
  CustomTimePicker,
} from "./PresetsCustomTime"
import ScheduleService from "../../../../services/scheduleService"

// Separate header component
export function TimePickerHeader() {
  return (
    <View style={timePickerStyles.fixedHeader}>
      <Text style={timePickerStyles.fixedHeaderTitle}>Set Time Slot</Text>
    </View>
  )
}

export default function TimePicker({
  selectedTimeSlot,
  timeSelectionStep,
  showTimePicker,
  selectedStartTime,
  selectedEndTime,
  selectedDate,
  selectedFacility,
  onShowPicker,
  onTimeConfirm,
  onCustomTimeConfirm,
  onTimeChange,
  onChangeTime,
  minuteStep = 15,
}) {
  const presetGroups = PRESET_GROUPS

  const [pickerMode, setPickerMode] = useState("preset")
  const [selectedPresetGroup, setSelectedPresetGroup] = useState("morning")
  
  const [customStartTime, setCustomStartTime] = useState({ hour: 9, minute: 0 })
  const [customEndTime, setCustomEndTime] = useState({ hour: 18, minute: 0 })
  const [activeTimeType, setActiveTimeType] = useState("start")
  
  // New state for reservations
  const [reservedSlots, setReservedSlots] = useState([])
  const [validationError, setValidationError] = useState("")
  const [isLoadingReservations, setIsLoadingReservations] = useState(false)

  // Sync internal state with parent state
  useEffect(() => {
    if (selectedStartTime) {
      setCustomStartTime(selectedStartTime)
    }
  }, [selectedStartTime])

  useEffect(() => {
    if (selectedEndTime) {
      setCustomEndTime(selectedEndTime)
    }
  }, [selectedEndTime])

  // Fetch reserved slots when date or facility changes
  useEffect(() => {
    const loadReservedSlots = async () => {
      console.log('🔍 Loading reserved slots for:', { selectedDate, selectedFacility })
      
      if (!selectedDate || !selectedFacility) {
        console.log('⚠️ Missing date or facility, clearing reserved slots')
        setReservedSlots([])
        return
      }

      setIsLoadingReservations(true)

      try {
        // Extract facility ID
        const facilityId = typeof selectedFacility === 'object' ? selectedFacility.id : selectedFacility
        console.log('📍 Facility ID:', facilityId)

        const result = await ScheduleService.getReservationsForDateRange(
          selectedDate,
          selectedDate,
          facilityId
        )

        console.log('📊 Reservations result:', result)

        if (result.success && result.data) {
          const slots = result.data.map(res => {
            const start = res.start_time?.substring(0, 5) || res.start_time
            const end = res.end_time?.substring(0, 5) || res.end_time
            console.log('📅 Reserved slot:', { start, end, purpose: res.purpose })
            return {
              startTime: start,
              endTime: end,
            }
          })
          console.log('✅ Total reserved slots:', slots.length)
          setReservedSlots(slots)
        } else {
          console.log('❌ No reservations or error:', result.error)
          setReservedSlots([])
        }
      } catch (error) {
        console.error('💥 Error loading reserved slots:', error)
        setReservedSlots([])
      } finally {
        setIsLoadingReservations(false)
      }
    }

    loadReservedSlots()
  }, [selectedDate, selectedFacility])

  // Normalize time to HH:MM format
  const normalizeTime = (time) => {
    if (!time) return time
    if (typeof time === 'string') {
      return time.length > 5 ? time.substring(0, 5) : time
    }
    return time
  }

  // Convert time object to HH:MM string
  const timeToString = (timeObj) => {
    if (!timeObj) return "00:00"
    const hour = String(timeObj.hour || 0).padStart(2, '0')
    const minute = String(timeObj.minute || 0).padStart(2, '0')
    return `${hour}:${minute}`
  }

  // Check if a time range overlaps with any reserved slot
  const isTimeRangeReserved = (startTime, endTime) => {
    if (reservedSlots.length === 0) return false

    const start = typeof startTime === 'object' ? timeToString(startTime) : normalizeTime(startTime)
    const end = typeof endTime === 'object' ? timeToString(endTime) : normalizeTime(endTime)

    console.log('🔍 Checking overlap for:', { start, end })
    console.log('📋 Against reserved slots:', reservedSlots)

    const hasOverlap = reservedSlots.some(reserved => {
      const resStart = normalizeTime(reserved.startTime)
      const resEnd = normalizeTime(reserved.endTime)

      // Check for overlap
      const overlaps = (
        (start >= resStart && start < resEnd) ||
        (end > resStart && end <= resEnd) ||
        (start <= resStart && end >= resEnd)
      )

      if (overlaps) {
        console.log('❌ OVERLAP FOUND:', { 
          trying: { start, end }, 
          conflicts: { resStart, resEnd } 
        })
      }

      return overlaps
    })

    console.log('Result:', hasOverlap ? '❌ Reserved' : '✅ Available')
    return hasOverlap
  }

  // Check if a preset time is reserved
  const isPresetReserved = useCallback((preset) => {
    if (!preset || !preset.startTime || !preset.endTime) return false
    return isTimeRangeReserved(preset.startTime, preset.endTime)
  }, [reservedSlots])

  // Validate custom time selection
  const validateCustomTime = () => {
    // Check if end time is after start time
    const startMinutes = customStartTime.hour * 60 + customStartTime.minute
    const endMinutes = customEndTime.hour * 60 + customEndTime.minute

    if (endMinutes <= startMinutes) {
      setValidationError("End time must be after start time.")
      return false
    }

    const isReserved = isTimeRangeReserved(customStartTime, customEndTime)
    
    if (isReserved) {
      setValidationError("Already reserved. Please select another time.")
      return false
    }

    setValidationError("")
    return true
  }

  const handlePresetTimeSelect = useCallback(
    (preset) => {
      if (isPresetReserved(preset)) {
        Alert.alert(
          "Time Slot Reserved",
          "Already reserved. Please select another time.",
          [{ text: "OK" }]
        )
        return
      }

      setValidationError("")
      onTimeChange("start", preset.startTime)
      onTimeChange("end", preset.endTime)
    },
    [onTimeChange, isPresetReserved]
  )

  const handleCustomTimeChange = useCallback((timeType, field, value) => {
    const newTime = timeType === "start" ? 
      { ...customStartTime, [field]: value } : 
      { ...customEndTime, [field]: value }

    if (timeType === "start") {
      setCustomStartTime(newTime)
      onTimeChange("start", newTime)
    } else {
      setCustomEndTime(newTime)
      onTimeChange("end", newTime)
    }

    // Clear error when user changes time
    setValidationError("")
  }, [customStartTime, customEndTime, onTimeChange])

  const handleCustomTimeConfirmInternal = useCallback((timeType) => {
    // Validate before confirming
    if (timeType === "end") {
      if (!validateCustomTime()) {
        return
      }
    }

    if (onCustomTimeConfirm) {
      onCustomTimeConfirm(timeType)
    }
  }, [onCustomTimeConfirm, validateCustomTime])

  const handleTimeConfirmWrapper = useCallback(() => {
    if (pickerMode === "custom") {
      if (!validateCustomTime()) {
        return
      }
    }

    if (onTimeConfirm) {
      onTimeConfirm()
    }
  }, [pickerMode, onTimeConfirm, validateCustomTime])

  const renderScrollablePickerWithProps = useCallback(
    (timeType) =>
      renderScrollablePicker(
        timeType,
        customStartTime,
        customEndTime,
        handleCustomTimeChange,
        minuteStep
      ),
    [customStartTime, customEndTime, handleCustomTimeChange, minuteStep]
  )

  const isPresetSelectedWithProps = useCallback(
    (preset) => isPresetSelected(preset, selectedStartTime, selectedEndTime),
    [selectedStartTime, selectedEndTime]
  )

  return (
    <View style={timePickerStyles.section}>
      <View style={timePickerStyles.pickerContainer}>
        {isLoadingReservations && (
          <View style={timePickerStyles.loadingBanner}>
            <Text style={timePickerStyles.loadingBannerText}>Loading availability...</Text>
          </View>
        )}

        <View style={timePickerStyles.modeToggle}>
          <TouchableOpacity
            style={[
              timePickerStyles.modeButton,
              pickerMode === "preset" && timePickerStyles.modeButtonActive,
            ]}
            onPress={() => {
              setPickerMode("preset")
              setValidationError("")
            }}
          >
            <Text
              style={[
                timePickerStyles.modeButtonText,
                pickerMode === "preset" && timePickerStyles.modeButtonTextActive,
              ]}
            >
              Presets
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              timePickerStyles.modeButton,
              pickerMode === "custom" && timePickerStyles.modeButtonActive,
            ]}
            onPress={() => {
              setPickerMode("custom")
              setValidationError("")
            }}
          >
            <Text
              style={[
                timePickerStyles.modeButtonText,
                pickerMode === "custom" && timePickerStyles.modeButtonTextActive,
              ]}
            >
              Custom
            </Text>
          </TouchableOpacity>
        </View>

        {pickerMode === "preset" ? (
          <PresetTimePicker
            presetGroups={presetGroups}
            selectedPresetGroup={selectedPresetGroup}
            setSelectedPresetGroup={setSelectedPresetGroup}
            handlePresetTimeSelect={handlePresetTimeSelect}
            isPresetSelected={isPresetSelectedWithProps}
            isPresetReserved={isPresetReserved}
            onTimeConfirm={handleTimeConfirmWrapper}
          />
        ) : (
          <CustomTimePicker
            customStartTime={customStartTime}
            customEndTime={customEndTime}
            activeTimeType={activeTimeType}
            setActiveTimeType={setActiveTimeType}
            renderScrollablePicker={renderScrollablePickerWithProps}
            onTimeConfirm={handleTimeConfirmWrapper}
            handleCustomTimeConfirm={handleCustomTimeConfirmInternal}
            validationError={validationError}
          />
        )}
      </View>
    </View>
  )
}