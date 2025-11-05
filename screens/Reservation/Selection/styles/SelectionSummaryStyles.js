import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(45, 27, 46, 0.08)",
    minHeight: 100,
    shadowColor: "#2d1b2e",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 6,
    textAlign: "center",
  },
  summaryGrid: {
    gap: 4,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    flexShrink: 0,
    marginRight: 6,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
    gap: 4,
  },
  value: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "right",
    marginRight: 3,
    flex: 1,
  },
  valueEmpty: {
    color: "#aaa",
  },
})

export default styles
