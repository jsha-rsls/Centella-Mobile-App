import { StyleSheet } from "react-native"

export const timelineStyles = StyleSheet.create({
  timelineCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  timelineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginLeft: 6,
  },
  timelineContent: {
    gap: 10,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2d1b2e",
    marginTop: 5,
  },
  timelineText: {
    fontSize: 13,
    color: "#666",
    flex: 1,
    lineHeight: 18,
  },
})