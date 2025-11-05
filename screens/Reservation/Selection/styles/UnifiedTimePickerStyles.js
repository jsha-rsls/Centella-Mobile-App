import { StyleSheet } from "react-native"

export const timePickerStyles = StyleSheet.create({
  // ===== Section Styles =====
    fixedHeader: {
      paddingHorizontal: 20,
      paddingVertical: 12, // Reduced from 16
    },

    fixedHeaderTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#1a1a1a",
      textAlign: "center",
    },

  // ===== Picker Container =====
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16, // Reduced from 20
    marginTop: 6, // Reduced from 8
    marginBottom: 20, // Reduced from 24
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // ===== Mode Toggle =====
  modeToggle: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 3, // Reduced from 4
    marginBottom: 12, // Reduced from 16
  },
  modeButton: {
    flex: 1,
    paddingVertical: 6, // Reduced from 8
    paddingHorizontal: 10, // Reduced from 12
    borderRadius: 6,
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeButtonText: {
    fontSize: 13, // Reduced from 14
    fontWeight: "500",
    color: "#666",
  },
  modeButtonTextActive: {
    color: "#1a1a1a",
    fontWeight: "600",
  },

  // ===== Preset Picker =====
  presetContainer: {
    paddingVertical: 6, // Reduced from 10
  },
  presetTabs: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 2, // Reduced from 3
    marginBottom: 10, // Reduced from 12
  },
  presetTab: {
    flex: 1,
    paddingVertical: 8, // Reduced from 10
    borderRadius: 6,
    alignItems: "center",
  },
  presetTabActive: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 1,
    elevation: 1,
  },
  presetTabText: {
    fontSize: 13, // Reduced from 14
    fontWeight: "500",
    color: "#666",
  },
  presetTabTextActive: {
    color: "#1a1a1a",
    fontWeight: "600",
  },
  presetScrollView: {
    maxHeight: 160, // Reduced from 200
    marginBottom: 10, // Reduced from 12
  },
  presetGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  presetButton: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 6, // Reduced from 8
    paddingHorizontal: 6, // Reduced from 8
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e9ecef",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6, // Reduced from 8
    width: "48%",
    minHeight: 36, // Reduced from 40
  },
  presetButtonActive: {
    backgroundColor: "#2d1b2e", // Changed from #007AFF to purple
    borderColor: "#2d1b2e", // Changed from #007AFF to purple
  },
  presetButtonText: {
    fontSize: 12, // Reduced from 13
    fontWeight: "500",
    color: "#1a1a1a",
    textAlign: "center",
  },
  presetButtonTextActive: {
    color: "white",
    fontWeight: "600",
  },
  doneButton: {
    backgroundColor: "#2d1b2e", // Changed from #007AFF to purple
    paddingVertical: 10, // Reduced from 12
    borderRadius: 6,
    alignItems: "center",
  },
  doneButtonText: {
    color: "white",
    fontSize: 15, // Reduced from 16
    fontWeight: "600",
  },

// ===== Custom Time Picker - MORE COMPACT =====
customTimeContainer: {
  paddingVertical: 4, // Reduced from 6
  alignItems: "center",
},
customTimeLabelsRow: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 3,
  width: 240, // Match total wheel picker width (110 + 20 + 110)
},
headerColumn: {
  width: 110, // Match COLUMN_WIDTH exactly
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 6,
  paddingHorizontal: 12, // Match wheel highlight left/right padding
  transition: "all 0.2s ease",
},
// COMPACT: Subtle highlight effect matching wheel picker
activeHeaderColumn: {
  backgroundColor: "rgba(45, 27, 46, 0.08)", // Same as wheel highlight
  borderWidth: 1,
  borderRadius: 6, // Match wheel highlight border radius
  borderColor: "rgba(45, 27, 46, 0.15)", // Same as wheel highlight
},
headerSeparator: {
  width: 20, // Match SEP_WIDTH exactly
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 0,
},
fromToLabel: {
  fontSize: 12, // Reduced from 13
  color: "#555",
  fontWeight: "500",
},
customTimeHeader: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginVertical: 5,
  width: 240, // Match total wheel picker width (110 + 20 + 110)
},
timeMainText: {
  fontSize: 16, // Slightly smaller for compactness
  fontWeight: "600",
  color: "#000",
  textAlign: "center",
},
activeTimeText: {
  color: "#2d1b2e", // Purple text on subtle background
  fontSize: 16, // Keep same size
  fontWeight: "700", // Slightly bolder for active state
},
ampmSmall: {
  fontSize: 12, // Slightly smaller for compactness
  color: "#666",
},
// COMPACT: Active AM/PM text styling
activeAmpmText: {
  fontSize: 12,
  color: "#2d1b2e", // Purple text to match active state
  fontWeight: "600",
},
customTimeSeparator: {
  fontSize: 20, // Reduced from 24
  color: "#222",
  textAlign: "center",
  fontWeight: "300",
  lineHeight: 20, // Reduced from 24
  paddingTop: 1, // Reduced from 2
},
customTimePicker: {
  marginBottom: 12, // Reduced from 16
  alignItems: "center",
},
customTimeActions: {
  flexDirection: "row",
  justifyContent: "center",
  width: "100%",
  paddingHorizontal: 4,
  marginTop: 6, // Reduced from 8
},
closeButton: {
  paddingVertical: 8, // Reduced from 10
  paddingHorizontal: 14, // Reduced from 16
  borderRadius: 6,
  borderWidth: 1,
  borderColor: "#e0e0e0",
  backgroundColor: "#f8f9fa",
  flex: 1,
  marginRight: 8,
  alignItems: "center",
},
closeButtonText: {
  fontSize: 13, // Reduced from 14
  color: "#666",
  fontWeight: "500",
},
okayButton: {
  paddingVertical: 8, // Reduced from 10
  paddingHorizontal: 14, // Reduced from 16
  borderRadius: 6,
  backgroundColor: "#2d1b2e", // Changed from #007AFF to purple
  flex: 1,
  marginLeft: 8,
  alignItems: "center",
},
okayButtonText: {
  fontSize: 13, // Reduced from 14
  color: "white",
  fontWeight: "600",
},
// New centered okay button style
centeredOkayButton: {
  paddingVertical: 10, // Reduced from 12
  paddingHorizontal: 28, // Reduced from 32
  borderRadius: 6,
  backgroundColor: "#2d1b2e", // Changed from #007AFF to purple
  alignItems: "center",
  minWidth: 90, // Reduced from 100
},

// ===== Picker Items - ADJUSTED FOR 165px CONTAINER =====
scrollablePickerContainer: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginHorizontal: 0,
},
timeSeparatorCustom: {
  fontSize: 24, // Adjusted for smaller container
  fontWeight: "bold",
  color: "#333",
  textAlign: "center",
  lineHeight: 40, // Match ITEM_HEIGHT
},
pickerItemText: {
  fontSize: 14, // Adjusted for smaller container
  color: "#666",
  lineHeight: 22, // Adjusted for 40px ITEM_HEIGHT
  textAlign: "center",
  fontWeight: "500",
},
pickerItemTextSelected: {
  color: "#2d1b2e", // Changed from #000 to purple for selected state
  fontWeight: "700",
  fontSize: 16, // Adjusted for smaller container
},
ampmText: {
  fontSize: 10, // Adjusted for smaller container
  fontWeight: "600",
  color: "#666",
  backgroundColor: "#f8f9fa",
  paddingHorizontal: 4, // Reduced
  paddingVertical: 1, // Reduced
  borderRadius: 3,
  marginLeft: 3,
},
highlightOverlay: {
  position: "absolute",
  top: "50%",
  left: 12,
  right: 12,
  height: 32, // Adjusted for 40px ITEM_HEIGHT
  marginTop: -16, // Half of height
  backgroundColor: "rgba(45, 27, 46, 0.08)", // Changed to purple with opacity
  borderRadius: 6,
  zIndex: 1,
  borderWidth: 1,
  borderColor: "rgba(45, 27, 46, 0.15)", // Changed to purple with opacity
},
// SIMPLIFIED Fade effect overlays - adjusted for 165px container
fadeOverlayTop: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 55, // About 1/3 of 165px container
  zIndex: 2,
  pointerEvents: "none",
},
fadeOverlayBottom: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: 55, // About 1/3 of 165px container
  zIndex: 2,
  pointerEvents: "none",
},
// NOTE: All individual fadeLayer styles have been removed 
// since LinearGradient handles the fade effect automatically

presetButtonReserved: {
  backgroundColor: "#fef2f2", // Light red background
  borderColor: "#fca5a5", // Red border
  opacity: 0.7,
},
presetButtonTextReserved: {
  color: "#991b1b", // Dark red text
  textDecorationLine: "line-through",
},
reservedBadge: {
  fontSize: 10,
  color: "#dc2626",
  fontWeight: "600",
  backgroundColor: "#fee2e2",
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 4,
  marginTop: 4,
  overflow: "hidden",
},


validationErrorContainer: {
  backgroundColor: "#fef2f2",
  borderLeftWidth: 3,
  borderLeftColor: "#dc2626",
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: 6,
  marginVertical: 8,
  flexDirection: "row",
  alignItems: "center",
},
validationErrorText: {
  fontSize: 12,
  color: "#991b1b",
  fontWeight: "500",
  flex: 1,
  lineHeight: 18,
  marginLeft: 8,
},


loadingBanner: {
  backgroundColor: "#eff6ff",
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 6,
  marginBottom: 12,
  alignItems: "center",
},
loadingBannerText: {
  fontSize: 12,
  color: "#1e40af",
  fontWeight: "500",
},


})