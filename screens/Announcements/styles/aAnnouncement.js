import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  
  // Header Styles
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },

  headerContentCentered: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d1b2e",
    textAlign: "center",
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#5a4a5b",
    textAlign: "center",
    fontWeight: "400",
  },

  // Content Area
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0, // SearchHeader provides spacing
  },
  
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8, // Small top margin for better spacing after SearchHeader
  },
  
  resultCountText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  
  // Announcement Cards - SHADOWS REMOVED
  announcementCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    position: "relative",
    // All shadow properties removed for clean transition
    borderWidth: 1,
    borderColor: "#dcdddeff", // Light border for subtle separation
  },

  cardPressed: {
    opacity: 0.7,
    backgroundColor: "#f8f9fa",
    transform: [{ scale: 0.98 }],
  },

  cardContainer: {
    position: "relative",
    marginBottom: 6,
  },

  cardHeader: {
    paddingRight: 60, // Space for badge
  },

  // Badge positioned in top-right corner
  badgeContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },

  // Card Content
  announcementTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 12,
    lineHeight: 22,
    paddingRight: 4, // Clean separation from badge
  },
  
  announcementContent: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },

  // Card Footer
  announcementFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  clockIcon: {
    marginRight: 4,
  },

  announcementDate: {
    fontSize: 13,
    color: "#999",
  },

  veryRecentDate: {
    fontSize: 13,
    color: "#3B82F6",
    fontWeight: "500",
  },

  readMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  readMore: {
    fontSize: 14,
    color: "#231828",
    fontWeight: "500",
    marginRight: 4,
    lineHeight: 16,
  },

  readMoreArrow: {
    marginLeft: 2,
  },

  // Error States - SHADOWS REMOVED
  errorCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    // All shadow properties removed
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },

  errorButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },

  errorButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },

  // Empty States - SHADOWS REMOVED
  emptyStateCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginBottom: 16,
    // All shadow properties removed
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  emptyIcon: {
    fontSize: 32,
    marginBottom: 12,
    opacity: 0.6,
  },

  emptyText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
    marginBottom: 4,
    textAlign: 'center',
  },

  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: 'center',
  },

  clearSearchButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    alignSelf: 'center',
  },
  
  clearSearchButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
})