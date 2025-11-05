import { StyleSheet } from "react-native"

export const purposeStyles = StyleSheet.create({
  // Main Container
  container: {
    marginBottom: 10, // Reduced from 20 to 10
  },
  
  // Header Section
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
  },

  // Purpose Chips Container
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: -3,
  },
  
  // Purpose Chip Styles
  purposeChip: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    margin: 3,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
    flexBasis: "48%", // Two columns with space between
    maxWidth: "48%",
  },
  purposeChipSelected: {
    backgroundColor: "#413242ff",
    borderColor: "#F2D5D5",
    //backgroundColor: "#0f766e",
    //borderColor: "#0f766e",
  },
  
  // Purpose Chip Text
  purposeChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  purposeChipTextSelected: {
    color: "#ffffff",
    fontWeight: "700",
  },

  // Custom Purpose Section
  customSection: {
    marginTop: 12, // Reduced from 16 to 12
  },
  
  // Helper text spacing
  helperText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8, // Add this to control spacing between helper text and input
    fontWeight: "500",
  },
  
  // Custom Input
  customInput: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    color: "#1f2937",
    textAlignVertical: "top",
    minHeight: 60,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 0, // Ensure no extra margin at bottom
  },

  // Error States (for future use)
  errorText: {
    fontSize: 12,
    color: "#dc2626",
    marginTop: 4,
    fontWeight: "500",
  },
  inputError: {
    borderColor: "#dc2626",
    backgroundColor: "#fef2f2",
  },
})