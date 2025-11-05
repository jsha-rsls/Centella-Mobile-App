import { StyleSheet } from "react-native"

export const datePickerStyles = StyleSheet.create({
  // Section Layout Styles
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },

  // Calendar Container
  calendarContainer: {
    backgroundColor: "#ddd6d6ff",
    borderRadius: 12,
    padding: 12,
    //marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  // Date Picker Header
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  navButton: {
    fontSize: 20,
    color: "#2d1b2e",
    fontWeight: "bold",
    padding: 6,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a1a",
  },

  // Week Days Header
  weekDaysHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    width: 32,
    textAlign: "center",
  },

  // Calendar Days
  calendar: {
    paddingHorizontal: 2,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 3,
  },
  dayButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fafafa",
    position: "relative",
  },
  dayButtonDisabled: {
    opacity: 0.8,
  },
  dayButtonPast: {
    opacity: 0.5,
  },
  dayButtonSelected: {
    backgroundColor: "#413242ff",
    borderColor: "#F2D5D5",
    borderWidth: 2,
  },

  // Day Text
  dayText: {
    fontSize: 12,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  dayTextDisabled: {
    color: "#ccc",
  },
  dayTextPast: {
    color: "#999",
    fontWeight: "500",
  },
  dayTextSelected: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  // Facility Dot
  facilityDotsContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  facilityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },

  // Time Slots (Details Only)
  timeSlotsContainer: {
    marginTop: 16,
    backgroundColor: "#ddd6d6ff",
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  timeSlotsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  timeSlotsSubtitle: {
    fontSize: 11,
    color: "#666",
    marginBottom: 10,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  slotItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1.5,
  },
  slotAvailable: {
    backgroundColor: "#f0fdf4",
    borderColor: "#86efac",
  },
  slotReserved: {
    backgroundColor: "#fef2f2",
    borderColor: "#fca5a5",
  },
  slotText: {
    fontSize: 13,
    fontWeight: "500",
  },
  slotTextAvailable: {
    color: "#166534",
  },
  slotTextReserved: {
    color: "#991b1b",
  },
  slotStatus: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusAvailable: {
    backgroundColor: "#dcfce7",
  },
  statusReserved: {
    backgroundColor: "#fee2e2",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  statusTextAvailable: {
    color: "#166534",
  },
  statusTextReserved: {
    color: "#991b1b",
  },
  noSlotsContainer: {
    padding: 16,
    alignItems: "center",
  },
  noSlotsText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
  },
})
