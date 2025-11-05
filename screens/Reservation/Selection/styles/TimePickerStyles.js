import { StyleSheet } from "react-native"

export const timePickerStyles = StyleSheet.create({
  // Date/Time Button Styles
  dateTimeButton: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 8,
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  editIcon: {
    fontSize: 16,
  },

  // Selected Time Display
  selectedTimeBox: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#27a427",
    backgroundColor: "#e8f5e8",
  },
  selectedTimeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#27a427",
    textAlign: "center",
  },

  // Picker Container
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // Time Picker Title
  timePickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "capitalize",
  },

  // Classic Time Picker Styles
  timePicker: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  timeColumn: {
    alignItems: "center",
    minWidth: 60,
  },
  timeArrow: {
    fontSize: 18,
    color: "#27a427",
    fontWeight: "bold",
    paddingVertical: 8,
  },
  timeValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    textAlign: "center",
    minWidth: 60,
    marginVertical: 8,
  },
  timeSeparator: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginHorizontal: 8,
  },
  timeSeparatorCustom: {
    fontSize: 26,
    fontWeight: "600",
    marginHorizontal: 12,
    alignSelf: "center",
  },
  ampmColumn: {
    alignItems: "center",
    marginLeft: 16,
  },
  confirmButton: {
    backgroundColor: "#27a427",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  // Mode Toggle Styles
  modeToggle: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  modeButtonTextActive: {
    color: "#1a1a1a",
    fontWeight: "600",
  },

  // Preset Time Picker Styles
  presetContainer: {
    paddingVertical: 10,
  },
  presetLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },

  // Preset Tabs
  presetTabs: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 2,
    marginBottom: 20,
  },
  presetTab: {
    flex: 1,
    paddingVertical: 8,
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
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  presetTabText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  presetTabTextActive: {
    color: "#1a1a1a",
    fontWeight: "600",
  },

  presetScrollView: {
    maxHeight: 200,
    marginBottom: 20,
  },
  presetGrid: {
    gap: 8,
  },
  presetButton: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    alignItems: "center",
    marginBottom: 8,
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
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  // Custom Time Picker Styles
  customTimeContainer: {
    paddingVertical: 10,
    alignItems: "center",
  },

  // From/To Labels
  customTimeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginBottom: 5,
  },
  fromToLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },

  customTimeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  customStartTime: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  customEndTime: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
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
    marginHorizontal: 12,
  },
  pickerColumn: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    width: 60,
  },
  pickerScroll: {
    height: 200,
  },
  pickerItem: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  pickerItemSelected: {
    backgroundColor: "transparent",
  },

  // AM/PM Container
  ampmContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
  },
  ampmButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginVertical: 2,
  },
  ampmButtonSelected: {
    backgroundColor: "#007AFF",
  },
  ampmText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ampmTextSelected: {
    color: "white",
    fontWeight: "600",
  },

  customTimePicker: {
    marginBottom: 40,
    alignItems: "center",
  },

  // Custom Time Actions
  customTimeActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#f8f9fa",
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  okayButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    flex: 1,
    marginLeft: 10,
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
    height: 40,
    marginTop: -20,
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 8,
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
    width: 110,
    alignItems: "center",
    justifyContent: "center",
  },

  // Small separator between header columns (arrow container)
  headerSeparator: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  // Big time in header
  timeMainText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    lineHeight: 28,
  },

  customTimeSeparator: {
    fontSize: 20,
    color: "#222",
    textAlign: "center",
  },

  // Item text (keeps same font-size & lineHeight so it doesn't jump)
  pickerItemText: {
    fontSize: 18,
    color: "#666",
    lineHeight: 40,
    minWidth: 36,
    textAlign: "center",
  },

  pickerItemTextSelected: {
    color: "#000",
    fontWeight: "600",
  },
})