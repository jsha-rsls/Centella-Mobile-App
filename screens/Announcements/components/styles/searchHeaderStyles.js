import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    backgroundColor: 'transparent', // Made transparent
    borderColor: '#e9ecef',
    borderBottomWidth: 1,
  },

  // Search Row with Filter Toggle
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },

  // Filter Toggle Button
  filterToggleButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  filterToggleButtonActive: {
    backgroundColor: '#f0f8ff',
    borderColor: '#3B82F6',
  },

  // Search Bar Styles
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minHeight: 48,
    maxHeight: 48,
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  searchIcon: {
    marginRight: 12,
    color: '#666',
  },

  searchInput: {
    flex: 1,
    color: '#333',
    paddingVertical: 0,
    paddingRight: 40, // Space for clear button and indicator
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: 20,
    height: 24,
  },

  clearButtonContainer: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 28,
  },

  clearButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },

  searchingIndicator: {
    position: 'absolute',
    right: 45,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
  },

  searchingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    opacity: 0.8,
  },

  // Filter Chips Container
  filterChipsContainer: {
    marginBottom: 6,
  },

  filterChipsScroll: {
    flexGrow: 0,
  },

  filterChipsScrollContent: {
    paddingRight: 20,
    alignItems: 'center',
  },

  // Individual Filter Chip
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minHeight: 36,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  filterChipActive: {
    backgroundColor: '#f0f8ff',
    borderColor: '#3B82F6',
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  filterChipIcon: {
    marginRight: 6,
  },

  filterChipText: {
    fontWeight: '500',
    color: '#666',
    marginRight: 6,
  },

  filterChipTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },

  filterChipBadge: {
    backgroundColor: '#f1f3f4',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterChipBadgeActive: {
    backgroundColor: '#3B82F6',
  },

  filterChipBadgeText: {
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },

  filterChipBadgeTextActive: {
    color: 'white',
  },

  filterChipClose: {
    marginLeft: 4,
    padding: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },

  // Active Indicator
  activeIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },

  activeIndicatorText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginRight: 12,
  },

  clearAllButton: {
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f1f3f4',
  },

  clearAllButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
})