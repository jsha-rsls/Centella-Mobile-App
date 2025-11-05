import { StyleSheet, Dimensions, Platform } from 'react-native'

const { width, height } = Dimensions.get('window')
const statusBarHeight = Platform.OS === 'ios' ? 47 : 24

export const viewStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },

  // Fixed Image Header (when image exists)
  fixedImageHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260,
    zIndex: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },

  // Fixed Gradient Header (when no image)
  fixedGradientHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },

  animatedGradientHeader: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },

  // Hero image fills header height
  heroImage: {
    width: width,
    height: '100%',
  },

  // Status bar gradient overlay
  statusBarGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 5,
    backgroundColor: 'transparent',
  },
  gradientStatusBarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 5,
  },

  // Title + metadata container inside header (pinned to bottom)
  gradientHeaderContent: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    zIndex: 6,
  },
  
  // Centered title that appears when scrolling
  centeredTitleContainer: {
    position: 'absolute',
    top: 0,
    left: 56,
    right: 56,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 7,
  },
  
  centeredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 48,
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Updated gradient header title - uses HTMLRenderer, white color for visibility
  gradientHeaderTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 34,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginBottom: 4,
  },

  // Gradient header metadata styles
  gradientMetadataRow: {
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  gradientMetadataText: {
    color: '#ffffff',
    opacity: 0.9,
    fontSize: 13,
    fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  gradientMetadataSeparator: {
    color: '#ffffff',
    opacity: 0.8,
    marginHorizontal: 6,
    fontSize: 14,
  },

  // Back Button Overlay Styles
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
  },
  backButtonBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Menu Button
  menuButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
  },
  menuButtonBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Content Container Styles
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 4,
  },

  // Metadata Row Styles
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  announcementCategory: {
    backgroundColor: '#E3F2FD',
  },
  updatesCategory: {
    backgroundColor: '#E8F5E8',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  metadataSeparator: {
    marginHorizontal: 6,
    alignSelf: 'center',
    transform: [{ translateY: 1 }],
    color: 'rgba(255, 255, 255, 0.7)', 
    fontSize: 8,
  },
  metadataText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },

  // Title Styles
  title: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    lineHeight: 32,
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  titleWithImage: {
    fontSize: 26,
  },

  // Content Styles
  contentText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#36454F',
    textAlign: 'justify',
    letterSpacing: 0.25,
    marginBottom: 12,
  },

  // Modal Styles for Text Formatting
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: height * 0.7,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginLeft: -24, // Center accounting for close button
  },
})