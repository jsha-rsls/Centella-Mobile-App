import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: "row",
    padding: 12,
    paddingTop: 8,
    marginBottom: -12, // Offset bottom padding
    gap: 10,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  baseButton: {
    flex: 1, // 🔹 all buttons same width
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 18,
  },
  prevButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  prevButtonText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 18,
  },
  nextButton: {
    backgroundColor: "#2d1b2e",
  },
  nextButtonDisabled: {
    backgroundColor: "#e0e0e0",
  },
  nextButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    lineHeight: 18,
  },
  nextButtonTextDisabled: {
    color: "#999",
  },
  createButton: {
    backgroundColor: "#2d1b2e",
  },
  createButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    lineHeight: 18,
  },
})

export default styles
