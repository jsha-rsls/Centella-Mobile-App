import { StyleSheet } from "react-native"

export const summaryStyles = StyleSheet.create({
  summaryCard: {
    backgroundColor: "white",
    margin: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginLeft: 8,
    flex: 1,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    marginTop: 2,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
    textAlign: "right",
    lineHeight: 18,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 2,
    borderTopColor: "#e0e0e0",
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2d1b2e",
  },
})