import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f8f9fa",
  },
  
  header: {
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: "#f8f9fa",
  },
  
  headerLarge: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 26,
  },
  
  announcementIcon: {
    marginRight: 12,
  },
  
  titleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 1,
    lineHeight: 20,
  },
  
  titleLarge: {
    fontSize: 16,
    lineHeight: 18,
  },
  
  subtitle: {
    fontSize: 13,
    color: "#666",
    lineHeight: 15,
  },
  
  subtitleLarge: {
    fontSize: 12,
    lineHeight: 14,
  },
  
  // Bottom "See all" button
  seeAllButtonBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 12,
    marginHorizontal: -4,
    borderRadius: 10,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  
  seeAllButtonPressed: {
    backgroundColor: "#e9ecef",
    transform: [{ scale: 0.98 }],
  },
  
  seeAllBottomText: {
    fontSize: 14,
    color: "#231828",
    fontWeight: "500",
    marginRight: 6,
  },
  
  chevronIcon: {
    marginLeft: 2,
  },
  
  content: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  
  item: {
    paddingVertical: 18,
    borderBottomWidth: 1.5,
    borderBottomColor: "#ecedeeff",
    backgroundColor: "transparent",
    position: "relative",
  },
  
  itemPressed: {
    opacity: 0.7,
    backgroundColor: "#f8f9fa",
    transform: [{ scale: 0.98 }],
  },
  
  itemContainer: {
    position: "relative",
    marginBottom: 6,
    flexDirection: 'row',
  },
  
  itemHeader: {
    flex: 1,
    paddingRight: 44, // Space between title and badge
  },
  
  // Badge positioned in top-right corner
  badgeContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
  
  // Enhanced badge system
  timeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 1,
    position: 'relative',
    overflow: 'visible',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  
  badgePulse: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 8,
  },

  badgeSubtleAnimation: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: 7,
    opacity: 0.1,
  },
  
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  
  // Legacy badge styles
  newBadge: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 1,
    position: 'relative',
    overflow: 'visible',
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  
  newBadgePulse: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 8,
    backgroundColor: "#F59E0B",
  },
  
  newText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  
  itemContent: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },

  clockIcon: {
    marginRight: 4,
  },
  
  date: {
    fontSize: 13,
    color: "#999",
    flexShrink: 1,
  },

  veryRecentDate: {
    fontSize: 13,
    color: "#3B82F6",
    fontWeight: "500",
  },
  
  readMore: {
    fontSize: 14,
    color: "#231828",
    fontWeight: "500",
    marginRight: 4,
    lineHeight: 16,
  },
  
  readMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
  },
  
  readMoreArrow: {
    marginLeft: 2,
  },
  
  // Loading states
  loadingContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  
  skeletonItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  
  skeletonTitle: {
    height: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginBottom: 8,
    width: '70%',
  },
  
  skeletonContent: {
    height: 14,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginBottom: 12,
    width: '100%',
  },
  
  skeletonMeta: {
    height: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    width: '30%',
  },
  
  // Empty state
  emptyState: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  
  emptyImage: {
    width: 245,
    height: 245,
    marginBottom: 16,
    opacity: 0.7,
  },
  
  emptyText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
    marginBottom: 4,
  },
  
  emptySubtext: {
    fontSize: 14,
    color: "#999",
  },
})