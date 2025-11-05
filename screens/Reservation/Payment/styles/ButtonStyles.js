import { StyleSheet } from "react-native"

export const buttonStyles = StyleSheet.create({
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  payButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#2d1b2e",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  payButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
  },
  payButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  payButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  payButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})