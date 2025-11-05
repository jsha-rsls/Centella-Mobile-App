import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  facilitySelector: {
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
  helperText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
    marginBottom: 8,
    textAlign: "center",
  },
  facilityScrollContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  facilityButton: {
    paddingHorizontal: 16,
    paddingVertical: 0,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    borderWidth: 1.5,
    borderColor: "#2d1b2e",
    minWidth: 100,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  facilityButtonSelected: {
    backgroundColor: "#2d1b2e",
    borderColor: "#2d1b2e",
  },
  facilityButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2d1b2e",
    letterSpacing: 0.3,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  facilityButtonTextSelected: {
    color: "white",
  },
})