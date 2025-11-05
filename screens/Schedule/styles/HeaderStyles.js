import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  calendarHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  calendarHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
  },
  calendarHeaderCentered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarHeaderTitle: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "600",
    color: "#2d1b2e",
  },
})