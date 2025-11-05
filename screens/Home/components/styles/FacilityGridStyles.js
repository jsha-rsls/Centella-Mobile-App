import { StyleSheet } from "react-native"

export const facilityGridStyles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 16,
    paddingHorizontal: 20,
    lineHeight: 18,
  },

  facilityCard: {
    width: 300,  // made wider for better button spacing
    minHeight: 220,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20, // Added bottom margin for breathing room
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#2d1b2e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(45, 27, 46, 0.06)",
  },

  iconWrapper: {
    width: 54, // increased from 44
    height: 54, // increased from 44
    borderRadius: 27, // adjusted for new size
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14, // slightly increased spacing
    shadowColor: "#2d1b2e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 17, // increased from 15
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8, // increased from 6
    color: "#1a1a1a",
  },

  cardDesc: {
    fontSize: 13, // increased from 12
    textAlign: "center",
    color: "#555",
    marginBottom: 12, // increased from 10
    lineHeight: 20, // increased from 18
    fontWeight: "500",
  },

  statusPill: {
    backgroundColor: "#f3f0f4",
    paddingHorizontal: 14, // increased from 12
    paddingVertical: 6, // increased from 4
    borderRadius: 16, // increased from 14
    marginBottom: 16, // increased from 12
    borderWidth: 1,
    borderColor: "rgba(45, 27, 46, 0.08)",
  },
  statusText: {
    fontSize: 12, // increased from 11
    fontWeight: "600",
    color: "#2d1b2e",
  },

  // Button Container for inline layout
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: 10, // Slightly increased gap for better separation
  },

  // Base button styles
  bookButton: {
    width: 130, // Fixed width to ensure exact same size
    height: 36, // Fixed height to ensure exact same size
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center", // Center content vertically
    // Removed shadow properties that might cause white squares
  },

  // Primary button (Reserve Now)
  primaryButton: {
    backgroundColor: "#2d1b2e",
  },

  // Secondary button (Check Schedule)
  secondaryButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1.5,
    borderColor: "#2d1b2e",
  },

  bookButtonText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
    color: "white",
  },

  secondaryButtonText: {
    color: "#2d1b2e",
  },

  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
    height: 16,
    alignItems: "center",
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d1d5db",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 18,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2d1b2e",
  },
    // Loading state styles
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  // Empty state styles
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
})