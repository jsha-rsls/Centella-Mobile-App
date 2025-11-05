import React, { useMemo, useCallback } from "react"
import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { timePickerStyles } from "../styles/UnifiedTimePickerStyles"
import { Ionicons } from "@expo/vector-icons"
import {
  generateHours,
  generateMinutes,
} from "../utils/timeUtils"

const ITEM_HEIGHT = 40
const CONTAINER_HEIGHT = 165
const COLUMN_WIDTH = 110
const SEP_WIDTH = 20

const formatParts = (time) => {
  const hour12 = time.hour === 0 ? 12 : time.hour > 12 ? time.hour - 12 : time.hour
  const minute = (time.minute ?? 0).toString().padStart(2, "0")
  const ampm = time.hour >= 12 ? "PM" : "AM"
  return { timeText: `${hour12}:${minute}`, ampm }
}

export const renderWheelPicker = (
  timeType,
  data,
  field,
  customStartTime,
  customEndTime,
  handleCustomTimeChange
) => {
  const currentTime = timeType === "start" ? customStartTime : customEndTime

  let currentIndex = 0
  if (field === "hour") {
    currentIndex = currentTime.hour
  } else if (field === "minute") {
    currentIndex = data.findIndex((item) => item === currentTime[field])
    if (currentIndex < 0) currentIndex = 0
  }

  const cycleLength = field === "hour" ? 24 : data.length
  const padding = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2

  const onScrollEnd = useCallback(
    (event) => {
      const y = event.nativeEvent.contentOffset.y
      const index = Math.round(y / ITEM_HEIGHT)
      const displayIndex = ((index % cycleLength) + cycleLength) % cycleLength

      if (field === "hour") {
        handleCustomTimeChange(timeType, field, displayIndex)
      } else {
        const value = data[displayIndex]
        if (value !== undefined) {
          handleCustomTimeChange(timeType, field, value)
        }
      }
    },
    [data, field, handleCustomTimeChange, timeType, cycleLength]
  )

  const infiniteData = useMemo(() => {
    const loopCount = 120
    const arr = []
    for (let i = 0; i < loopCount; i++) {
      if (field === "hour") {
        const hourIndex = i % 24
        const displayHour = hourIndex === 0 ? 12 : hourIndex > 12 ? hourIndex - 12 : hourIndex
        arr.push({
          displayHour,
          ampm: hourIndex < 12 ? "AM" : "PM",
          actualHour: hourIndex,
        })
      } else {
        arr.push(data[i % data.length])
      }
    }
    return arr
  }, [field, data])

  const initialIndex = useMemo(() => {
    const half = Math.floor(infiniteData.length / 2)
    const alignedHalf = half - (half % cycleLength)
    return alignedHalf + currentIndex
  }, [infiniteData.length, currentIndex, cycleLength])

  const initialScrollY = initialIndex * ITEM_HEIGHT

  return (
    <View style={{ height: CONTAINER_HEIGHT, width: COLUMN_WIDTH, position: "relative" }}>
      <View style={timePickerStyles.highlightOverlay} />
      
      <LinearGradient
        colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0)']}
        style={timePickerStyles.fadeOverlayTop}
        pointerEvents="none"
      />
      
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,1)']}
        style={timePickerStyles.fadeOverlayBottom}
        pointerEvents="none"
      />

      <ScrollView
        style={{ flex: 1 }}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: padding }}
        contentOffset={{ x: 0, y: initialScrollY }}
        onMomentumScrollEnd={onScrollEnd}
      >
        {infiniteData.map((item, idx) => {
          let isSelected = false
          let displayText = ""

          if (field === "hour") {
            isSelected = item.actualHour === currentTime.hour
            displayText = `${item.displayHour}`
          } else {
            isSelected = currentTime[field] === item
            displayText = item.toString().padStart(2, "0")
          }

          return (
            <View
              key={idx}
              style={[
                {
                  height: ITEM_HEIGHT,
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                },
              ]}
            >
              <Text
                style={[
                  timePickerStyles.pickerItemText,
                  isSelected && timePickerStyles.pickerItemTextSelected,
                ]}
                numberOfLines={1}
              >
                {displayText}
              </Text>

              {field === "hour" && (
                <Text style={timePickerStyles.ampmText}>{item.ampm}</Text>
              )}
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

export const renderScrollablePicker = (
  timeType,
  customStartTime,
  customEndTime,
  handleCustomTimeChange,
  minuteStep = 15
) => (
  <View style={timePickerStyles.scrollablePickerContainer}>
    {renderWheelPicker(timeType, generateHours(), "hour", customStartTime, customEndTime, handleCustomTimeChange)}

    <View style={{ width: SEP_WIDTH, alignItems: "center", justifyContent: "center" }}>
      <Text style={timePickerStyles.timeSeparatorCustom}>:</Text>
    </View>

    {renderWheelPicker(timeType, generateMinutes(minuteStep), "minute", customStartTime, customEndTime, handleCustomTimeChange)}
  </View>
)

export const PresetTimePicker = ({
  presetGroups,
  selectedPresetGroup,
  setSelectedPresetGroup,
  handlePresetTimeSelect,
  isPresetSelected,
  isPresetReserved,
  onTimeConfirm,
}) => (
  <View style={timePickerStyles.presetContainer}>
    <View style={timePickerStyles.presetTabs}>
      {["morning", "afternoon", "night"].map((period) => (
        <TouchableOpacity
          key={period}
          style={[
            timePickerStyles.presetTab,
            selectedPresetGroup === period && timePickerStyles.presetTabActive,
          ]}
          onPress={() => setSelectedPresetGroup(period)}
        >
          <Text
            style={[
              timePickerStyles.presetTabText,
              selectedPresetGroup === period && timePickerStyles.presetTabTextActive,
            ]}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <ScrollView
      style={timePickerStyles.presetScrollView}
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
    >
      <View style={timePickerStyles.presetGridContainer}>
        {presetGroups[selectedPresetGroup].map((item, index) => {
          const isReserved = isPresetReserved ? isPresetReserved(item) : false
          const isSelected = isPresetSelected(item)
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                timePickerStyles.presetButton,
                isSelected && timePickerStyles.presetButtonActive,
                isReserved && timePickerStyles.presetButtonReserved,
              ]}
              onPress={() => handlePresetTimeSelect(item)}
              disabled={isReserved}
            >
              <Text
                style={[
                  timePickerStyles.presetButtonText,
                  isSelected && timePickerStyles.presetButtonTextActive,
                  isReserved && timePickerStyles.presetButtonTextReserved,
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
              {isReserved && (
                <Text style={timePickerStyles.reservedBadge}>Reserved</Text>
              )}
            </TouchableOpacity>
          )
        })}
      </View>
    </ScrollView>

    <TouchableOpacity style={timePickerStyles.doneButton} onPress={onTimeConfirm}>
      <Text style={timePickerStyles.doneButtonText}>Done</Text>
    </TouchableOpacity>
  </View>
)

export const CustomTimePicker = ({
  customStartTime,
  customEndTime,
  activeTimeType,
  setActiveTimeType,
  renderScrollablePicker,
  onTimeConfirm,
  handleCustomTimeConfirm,
  validationError,
}) => {
  const fromParts = formatParts(customStartTime || { hour: 9, minute: 0 })
  const toParts = formatParts(customEndTime || { hour: 18, minute: 0 })

  const handleTimeConfirmWithFlow = () => {
    if (activeTimeType === "start") {
      setActiveTimeType("end")
      if (handleCustomTimeConfirm) {
        handleCustomTimeConfirm("start")
      }
    } else if (activeTimeType === "end") {
      if (handleCustomTimeConfirm) {
        handleCustomTimeConfirm("end")
      }
      if (onTimeConfirm) {
        onTimeConfirm()
      }
    }
  }

  return (
    <View style={timePickerStyles.customTimeContainer}>
      <View style={timePickerStyles.customTimeLabelsRow}>
        <View style={timePickerStyles.headerColumn}>
          <Text style={timePickerStyles.fromToLabel}>From</Text>
        </View>

        <View style={timePickerStyles.headerSeparator} />

        <View style={timePickerStyles.headerColumn}>
          <Text style={timePickerStyles.fromToLabel}>To</Text>
        </View>
      </View>

      <View style={timePickerStyles.customTimeHeader}>
        <TouchableOpacity onPress={() => setActiveTimeType("start")}>
          <View style={[
            timePickerStyles.headerColumn,
            activeTimeType === "start" && timePickerStyles.activeHeaderColumn
          ]}>
            <Text
              style={[
                timePickerStyles.timeMainText,
                activeTimeType === "start" && timePickerStyles.activeTimeText,
              ]}
              numberOfLines={1}
            >
              {fromParts.timeText}
              <Text style={[
                timePickerStyles.ampmSmall,
                activeTimeType === "start" && timePickerStyles.activeAmpmText
              ]}> {fromParts.ampm}</Text>
            </Text>
          </View>
        </TouchableOpacity>

        <View style={timePickerStyles.headerSeparator}>
          <Text style={timePickerStyles.customTimeSeparator}>—</Text>
        </View>

        <TouchableOpacity onPress={() => setActiveTimeType("end")}>
          <View style={[
            timePickerStyles.headerColumn,
            activeTimeType === "end" && timePickerStyles.activeHeaderColumn
          ]}>
            <Text
              style={[
                timePickerStyles.timeMainText,
                activeTimeType === "end" && timePickerStyles.activeTimeText,
              ]}
              numberOfLines={1}
            >
              {toParts.timeText}
              <Text style={[
                timePickerStyles.ampmSmall,
                activeTimeType === "end" && timePickerStyles.activeAmpmText
              ]}> {toParts.ampm}</Text>
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {validationError ? (
        <View style={timePickerStyles.validationErrorContainer}>
          <Ionicons name="warning" color="#dc2626" size={18} />
          <Text style={timePickerStyles.validationErrorText}> {validationError}</Text>
        </View>
      ) : null}

      <View style={timePickerStyles.customTimePicker}>
        {renderScrollablePicker(activeTimeType)}
      </View>

      <View style={timePickerStyles.customTimeActions}>
        <TouchableOpacity 
          style={timePickerStyles.centeredOkayButton} 
          onPress={handleTimeConfirmWithFlow}
        >
          <Text style={timePickerStyles.okayButtonText}>
            {activeTimeType === "start" ? "Set Start Time" : "Set End Time"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}