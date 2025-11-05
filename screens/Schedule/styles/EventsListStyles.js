import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  eventsSection: {
    marginBottom: 24,
  },

  eventsHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 4,
  },

  eventsHeader: {
    fontSize: 22,
    color: "#0f172a",
    fontWeight: "700",
    letterSpacing: -0.5,
  },

  eventCount: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },

  eventsList: {
    gap: 16,
  },

  emptyState: {
    backgroundColor: "#f8fafc",
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginHorizontal: 4,
  },

  emptyStateText: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    fontWeight: "500",
  },

  // Unified Event Card
  eventItem: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 0,
    overflow: "hidden",

    // subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  // Status indicator bar (colored stripe)
  eventStatusIndicator: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },

  // Content inside card
  eventContent: {
    padding: 10,
    paddingLeft: 24, // extra space for status indicator
  },

  // Header row (icon + title + badge)
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    lineHeight: 24,
    marginBottom: 4,
  },

  eventSubtitle: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
    lineHeight: 18,
  },

  // Status badge
  statusBadgeCompact: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },

  statusBadgeTextCompact: {
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // Time row
  eventDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  timeSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  timeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  // Icon circle (borrowed from modern layout, now unified)
  modernIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  modernIconText: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
  },

  // Pagination Styles
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 4,
    gap: 12,
  },

  paginationButton: {
    backgroundColor: "#2d1b2e",
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  paginationButtonDisabled: {
    backgroundColor: "#e2e8f0",
    shadowOpacity: 0,
    elevation: 0,
  },

  paginationButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  paginationButtonTextDisabled: {
    color: "#94a3b8",
  },

  paginationInfo: {
    alignItems: "center",
    paddingHorizontal: 16,
  },

  paginationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },

  paginationSubtext: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
})