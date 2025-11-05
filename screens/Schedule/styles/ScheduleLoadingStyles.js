import { StyleSheet } from "react-native"

export const loadingStyles = StyleSheet.create({
  // Loading Facility Selector
  loadingFacilitySelector: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2d1b2e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(45, 27, 46, 0.06)",
  },
  loadingHelperText: {
    width: 180,
    height: 12,
    backgroundColor: "#e2e8f0",
    borderRadius: 6,
    marginBottom: 8,
  },
  loadingButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingButton: {
    width: 100,
    height: 36,
    backgroundColor: "#e2e8f0",
    borderRadius: 20,
    marginHorizontal: 4,
  },

  // Loading Calendar
  loadingCalendar: {
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#c7c7c7ff",
  },
  loadingMonthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingVertical: 12,
    marginBottom: 12,
  },
  loadingNavButton: {
    width: 32,
    height: 32,
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
  },
  loadingMonthTitle: {
    width: 140,
    height: 20,
    backgroundColor: "#e2e8f0",
    borderRadius: 10,
  },
  loadingWeekHeader: {
    height: 32,
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    marginBottom: 12,
  },
  loadingDatesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  loadingDateCell: {
    width: "12.8%",
    height: 36,
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    marginBottom: 4,
  },

  // Loading Legend
  loadingLegend: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  loadingLegendTitle: {
    width: 100,
    height: 12,
    backgroundColor: "#e2e8f0",
    borderRadius: 6,
    marginBottom: 8,
  },
  loadingLegendItems: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  loadingLegendItem: {
    width: 120,
    height: 12,
    backgroundColor: "#e2e8f0",
    borderRadius: 6,
  },
})