import { StyleSheet } from "react-native";

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: "#000",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center", // ensures icon & text align properly
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#264653",
    flexShrink: 1, // prevents overflow
  },
  modalBody: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "left",
    flexShrink: 1, // ensures wrapping instead of overflowing
  },
  closeButton: {
    backgroundColor: "#2a9d8f",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});