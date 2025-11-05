import {
  StyleSheet,
  Dimensions
} from "react-native"
const {
  width
} = Dimensions.get("window")

export default StyleSheet.create({
  gradient: {
    flex: 1,
  },
  statusBarSpacer: {
    backgroundColor: "transparent",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "flex-start",
  },

  // Shared Styles
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#231828",
    marginBottom: 6,
    alignSelf: "flex-start",
    letterSpacing: 0.2,
  },

  // Progress Bar Styles - NO CONTAINER
  progressContainer: {
    marginBottom: 24,
  },
  stepText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  stepBarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepBar: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  stepBarActive: {
    backgroundColor: "#fff",
  },

  // Card Styles - Match Login
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    elevation: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.65,
    width: width * 0.9,
    maxWidth: 440,
    alignSelf: "center",
  },

  avatarWrapper: {
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
    color: "#231828",
    letterSpacing: 0.3,
  },

  // NEW: Subtitle for Step 3
  confirmSubtitle: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 18,
  },

  // Input Styles - Match Login EXACTLY
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1.5,
    borderColor: "#353935",
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    width: "100%",
    color: "#333",
    fontWeight: "500",
    minHeight: 48,
  },

  // Full name input styles
  fullNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  middleInitialInput: {
    width: 50,
    textAlign: "center",
    marginHorizontal: 4,
  },

  // Compact input style
  inputCompact: {
    marginBottom: 10,
  },

  // Birthdate input styles - More compact
  birthDateAgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%",
  },
  birthDateColumn: {
    flex: 1,
    marginRight: 8,
  },
  ageColumn: {
    width: 80,
  },

  flexInput: {
    flex: 1,
    marginRight: 8,
  },

  ageInputCompact: {
    textAlign: "center",
    width: "100%",
  },

  // Home address styles
  homeAddressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    width: "100%",
  },
  homeAddressInput: {
    flex: 1,
    marginRight: 8,
  },
  homeAddressInputLast: {
    flex: 1,
    marginRight: 0,
  },

  // ID Picker
  idPickerWrapper: {
    borderWidth: 1.5,
    borderColor: "#353935",
    borderRadius: 12,
    marginBottom: 16,
    width: "100%",
    backgroundColor: "#f8f9fa",
    overflow: "hidden",
  },
  idPicker: {
    width: "100%",
    height: 55,
    fontSize: 14,
    color: "#333",
    paddingHorizontal: 10,
    fontWeight: "500",
  },

  // Upload Button Front and Back ID
  uploadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    width: "100%",
  },
  uploadButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#231828",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    backgroundColor: "#F9E6E6",
    marginHorizontal: 4,
    minHeight: 48,
    justifyContent: "center",
  },
  uploadButtonText: {
    color: "#231828",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.3,
  },
  uploadButtonDisabled: {
    backgroundColor: "#e0e0e0",
    borderColor: "#999",
  },
  uploadButtonTextDisabled: {
    color: "#999",
  },

  // Disclaimer Message
  disclaimerText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    marginBottom: 16,
  },
  learnMoreText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#231828",
    textDecorationLine: "underline",
    marginBottom: 16,
  },

  // Email and Verification Code Styles
  verificationRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 12,
  },
  verificationInputWrapper: {
    flex: 1,
    position: "relative",
  },
  resendButton: {
    backgroundColor: "#F9E6E6",
    borderRadius: 12,
    paddingHorizontal: 16,
    minWidth: 100,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#231828",
  },
  resendText: {
    color: "#231828",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.3,
  },

  // Password Styles
  passwordHint: {
    fontSize: 12,
    color: "#666",
    marginBottom: 16,
    lineHeight: 18,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderWidth: 1.5,
    borderColor: "#353935",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    width: "100%",
    minHeight: 48,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },

  // Navigation Buttons - Match Login
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },

  stepButton: {
    backgroundColor: "#231828",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#231828",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    minHeight: 44,
    justifyContent: "center",
  },

  fullButton: {
    flex: 1,
  },

  stepButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.4,
  },

  // Account Created
  accountCreated: {
    fontSize: 18,
    fontWeight: "700",
    color: "#231828",
    marginBottom: 8,
    textAlign: "center",
  },
  accountId: {
    fontSize: 16,
    color: "#231828",
    marginBottom: 12,
    fontWeight: "600",
  },
  saveNote: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  reviewBox: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#353935",
    marginBottom: 20,
    width: "100%",
  },
  reviewItem: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
    fontWeight: "500",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: "#231828",
    borderRadius: 6,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkboxCheck: {
    color: "#231828",
    fontWeight: "bold",
    fontSize: 16,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },

  // Loading container 
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginVertical: 16,
    borderWidth: 1.5,
    borderColor: '#353935',
  },

  loadingText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },

  loadingButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Disabled button styles
  stepButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.7,
    elevation: 0,
    shadowOpacity: 0,
  },

  stepButtonTextDisabled: {
    color: '#ddd',
  },

  // Capture ID
  cameraButton: {
    borderWidth: 2,
    borderColor: "#231828",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
    backgroundColor: "#F9E6E6",
  },
  cameraButtonDisabled: {
    borderColor: "#999",
    backgroundColor: "#e0e0e0",
  },
  cameraButtonText: {
    color: "#231828",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  cameraButtonTextDisabled: {
    color: "#999",
  },

  // Photo preview
  photoPreviewContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  photoPreview: {
    width: "100%",
    height: 100,
    borderRadius: 12,
  },
  photoActions: {
    position: "absolute",
    top: 4,
    right: 4,
    flexDirection: "row",
    gap: 4,
  },
  retakeButton: {
    backgroundColor: "rgba(35, 24, 40, 0.85)",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButton: {
    backgroundColor: "rgba(230, 57, 70, 0.85)",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  photoLabel: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "rgba(35, 24, 40, 0.85)",
    color: "#fff",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontWeight: "600",
  },

  // Divider styles - Match Login
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#8C8585",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#8C8585",
    fontWeight: "500",
  },

  // Login link styles - Match Login
  loginLinkContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  loginLinkText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 4,
  },
  loginLink: {
    fontSize: 15,
    color: "#231828",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  loginLinkUnderline: {
    height: 1.2,
    backgroundColor: "#231828",
    alignSelf: "stretch",
    marginTop: 1.5,
  },

  // ============================================
  // NEW IMPROVED STYLES FOR STEP 3
  // ============================================

  // Information Sections
  infoSection: {
    marginBottom: 24,
    width: "100%",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  sectionIcon: {
    marginRight: 6,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#231828",
    letterSpacing: 0.2,
  },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  infoRow: {
    paddingVertical: 6,
  },

  infoLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  infoValue: {
    fontSize: 14,
    color: "#231828",
    fontWeight: "600",
    lineHeight: 20,
  },

  infoDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 3,
  },

  // ID Preview Styles
  idPreviewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 10,
  },

  idPreviewItem: {
    flex: 1,
  },

  idPreviewLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
  },

  idPreviewImageWrapper: {
    position: "relative",
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#f8f9fa",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
  },

  idPreviewImage: {
    width: "100%",
    height: 70,
    resizeMode: "cover",
  },

  idPreviewBadge: {
    position: "absolute",
    top: 3,
    right: 3,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  idPreviewPlaceholder: {
    height: 70,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },

  // Account ID Box
  accountIdBox: {
    backgroundColor: "#FFF9E6",
    borderRadius: 10,
    padding: 14,

    marginTop: 4,
    borderWidth: 2,
    borderColor: "#FFD700",
    alignItems: "center",
  },

  accountIdLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  accountIdValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#231828",
    marginBottom: 6,
    letterSpacing: 1,
  },

  accountIdNoteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  accountIdNote: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },

  checkboxRowImproved: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    padding: 4,
    marginRight: 8,
  },
  checkboxBoxImproved: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxBoxChecked: {
    backgroundColor: '#231828',
    borderColor: '#231828',
  },
  checkboxTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  checkboxLabelImproved: {
    fontSize: 14,
    color: '#333',
  },
  checkboxLinkText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  termsSection: {
    marginTop: 16,
    marginBottom: 28,
  },

  // Improved Loading Container
  loadingContainerImproved: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginVertical: 20,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
  },

  loadingTextImproved: {
    marginTop: 16,
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },

  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginTop: 16,
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#231828",
    borderRadius: 4,
  },

  progressText: {
    marginTop: 8,
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },

  // Improved Navigation
  navRowImproved: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 24,
    width: "100%",
    gap: 16, // ensures even spacing between buttons
  },

  // Improved Back Button – now has border, background, and better visibility
  backButtonLink: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.8,
    borderColor: "#231828",
    backgroundColor: "#F9E6E6",
    elevation: 2,
    shadowColor: "#231828",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    minHeight: 52,
  },

  backButtonLinkDisabled: {
    opacity: 0.6,
    backgroundColor: "#f1f1f1",
    borderColor: "#999",
  },

  backButtonLinkText: {
    fontSize: 15,
    color: "#231828",
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  backButtonLinkTextDisabled: {
    color: "#999",
  },

  confirmButton: {
    flex: 1,
    backgroundColor: "#231828",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    elevation: 4,
    shadowColor: "#231828",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    minHeight: 52,
  },

  confirmButtonDisabled: {
    backgroundColor: "#999",
    opacity: 0.6,
    elevation: 0,
    shadowOpacity: 0,
  },

  confirmButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
})