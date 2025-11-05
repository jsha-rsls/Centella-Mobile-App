import { StyleSheet } from "react-native"

export const termsStyles = StyleSheet.create({
  termsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  termsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginLeft: 6,
  },
  termsContent: {
    gap: 6,
  },
  termsText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
})