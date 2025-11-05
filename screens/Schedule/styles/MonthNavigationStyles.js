import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f8fafc",
  },
  monthNavButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  monthNavText: {
    fontSize: 24,
    color: "#64748b",
    fontWeight: "400",
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
})