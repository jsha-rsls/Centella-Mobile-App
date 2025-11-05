import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  // Base skeleton styles
  skeletonBase: {
    position: 'relative',
    overflow: 'hidden',
  },

  // Shimmer overlay
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },

  // Main container - match original content padding
  skeletonContainer: {
    flex: 1,
    paddingHorizontal: 20, // Keep original padding
  },

  // Search Header Skeleton - match actual layout
  skeletonSearchHeader: {
    paddingTop: 8,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginBottom: 8,
  },

  skeletonSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // Filter toggle button - matches actual size
  skeletonFilterToggle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },

  // Search bar container
  skeletonSearchBarContainer: {
    flex: 1,
  },

  skeletonSearchBar: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
  },

  // Result count area
  skeletonSubtitleContainer: {
    marginBottom: 12,
    marginTop: 0,
  },

  skeletonResultCount: {
    height: 16,
    width: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },

  // Announcement Cards - CLEAN version without shadows/borders
  skeletonCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    // Match original card dimensions better
    minHeight: 160, // Approximate height of original cards
  },

  // Card Container - matches real layout exactly
  skeletonCardContainer: {
    position: "relative",
    marginBottom: 12, // Increased to match original spacing
  },

  skeletonCardHeader: {
    position: "relative",
    paddingRight: 60,
  },

  // Title - match original title better
  skeletonTitle: {
    height: 22, // Slightly taller to match original title
    width: '88%', // Better width match
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },

  // Badge - matches real layout exactly
  skeletonBadgeContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },

  skeletonBadge: {
    height: 22,
    width: 50,
    borderRadius: 11,
    backgroundColor: "#f0f0f0",
  },

  // Content Container - match original spacing
  skeletonContentContainer: {
    marginBottom: 16, // Increased to match original
  },

  // Content lines - match original content line heights and spacing
  skeletonContentLine1: {
    height: 18, // Match original line height
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginBottom: 6, // Increased spacing
    width: '100%',
  },

  skeletonContentLine2: {
    height: 18,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginBottom: 6,
    width: '94%',
  },

  skeletonContentLine3: {
    height: 18,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    width: '72%', // Realistic truncation width
  },

  // Footer - matches real layout exactly
  skeletonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 18, // Slightly taller to match original
    marginTop: 4, // Add small top margin
  },

  // Date container with clock icon
  skeletonDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6, // Slightly larger gap
  },

  skeletonClockIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#f0f0f0",
  },

  skeletonDate: {
    height: 14,
    width: 75, // Slightly wider
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },

  // Read more container
  skeletonReadMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6, // Larger gap to match original
  },

  skeletonReadMore: {
    height: 14,
    width: 70, // Wider to match "Read more" text
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },

  skeletonArrow: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#f0f0f0",
  },
})