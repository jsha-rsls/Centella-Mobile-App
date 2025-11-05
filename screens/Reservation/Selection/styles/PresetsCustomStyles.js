import { StyleSheet } from "react-native"

export const presetsCustomStyles = StyleSheet.create({
  // Mode Toggle Styles
  modeToggle: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
    padding: 2,
    marginBottom: 12,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 1,
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  modeButtonTextActive: {
    color: "#1a1a1a",
    fontWeight: "600",
  },

  // Preset Time Picker Styles
  presetContainer: {
    paddingVertical: 8,
  },

  // Preset Tabs - Increased sizes
  presetTabs: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 3,
    marginBottom: 12,
  },
  presetTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  presetTabActive: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.06,
    shadowRadius: 1,
    elevation: 1,
  },
  presetTabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  presetTabTextActive: {
    color: "#1a1a1a",
    fontWeight: "600",
  },

  presetScrollView: {
    maxHeight: 120,
    marginBottom: 12,
  },
  presetButton: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e9ecef",
    alignItems: "center",
    marginBottom: 6,
  },
  presetButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  presetButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  presetButtonTextActive: {
    color: "white",
    fontWeight: "600",
  },
  doneButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  // Custom Time Picker Styles
  customTimeContainer: {
    paddingVertical: 8,
    alignItems: "center",
  },

  fromToLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },

  customTimeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  
  activeTimeText: {
    color: "#007AFF",
  },
  ampmSmall: {
    fontSize: 14,
    color: "#666",
  },

  // Scrollable Picker Components
  scrollablePickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },

  customTimePicker: {
    marginBottom: 20,
    alignItems: "center",
  },

  // Custom Time Actions - Increased button sizes
  customTimeActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 8,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#f8f9fa",
    flex: 1,
    marginRight: 6,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  okayButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#007AFF",
    flex: 1,
    marginLeft: 6,
    alignItems: "center",
  },
  okayButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },

  // Highlight overlay and picker enhancements
  highlightOverlay: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 32,
    marginTop: -16,
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 4,
    zIndex: 1,
  },

  // Header label row
  customTimeLabelsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  // Column container used for header and for each column cell
  headerColumn: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },

  // Small separator between header columns (arrow container)
  headerSeparator: {
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  // Big time in header - Increased font size
  timeMainText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    lineHeight: 22,
  },

  customTimeSeparator: {
    fontSize: 16,
    color: "#222",
    textAlign: "center",
  },

  timeSeparatorCustom: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 8,
    alignSelf: "center",
  },

  // Item text - Increased font sizes for better readability
  pickerItemText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 32,
    minWidth: 24,
    textAlign: "center",
  },

  pickerItemTextSelected: {
    color: "#000",
    fontWeight: "600",
  },

  // AM/PM Text - Increased size
  ampmText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
    marginLeft: 4,
  },
})