import { StyleSheet } from "react-native"

export default StyleSheet.create({
  // Container & Layout
  container: {
    flex: 1,
    backgroundColor: "#eeeff0ff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2d1b2e",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(45, 27, 46, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(45, 27, 46, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Avatar Section
  avatarSection: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 12,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F9E6E6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 8,
    gap: 6,
    alignSelf: "center",
  },
  emailText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    lineHeight: 14,
    numberOfLines: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4caf50",
    marginRight: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2e7d32",
  },

  // Edit Buttons
  editButtonContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2d1b2e",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  editProfileButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  editActionsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 13,
    fontWeight: "600",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2d1b2e",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },

  // Section
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingLeft: 2,
    gap: 7,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2d1b2e",
    lineHeight: 18,
  },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    elevation: 0,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    overflow: 'hidden',
  },

  // Info Row & Fields
  infoRow: {
    paddingVertical: 10,
  },
  labelWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8, 
    gap: 6,
  },
  labelText: {
    fontSize: 14,
    color: "#444",
  },
  infoValue: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "600",
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 2,
  },

  // Input Fields
  input: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "600",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  // Full Name Input
  fullNameInputContainer: {
    flexDirection: "row",
    gap: 8,
  },
  nameInput: {
    flex: 1,
  },
  miInput: {
    width: 50,
  },

  // Birthdate & Age Fields
  twoColumnRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
  },
  columnLeft: {
    flex: 1.5,
  },
  columnRight: {
    flex: 1,
  },
  columnDivider: {
    width: 1,
    backgroundColor: "#e0e0e0",
    alignSelf: "stretch",
    marginTop: 22,
  },
  ageEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageDisplayInput: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    flex: 1,
  },
  ageDisplayText: {
    color: '#666',
    fontSize: 14,
  },
  infoIconContainer: {
    position: 'relative',
    marginLeft: 6,
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: 24,
    right: -10,
    backgroundColor: '#2d1b2e',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 16,
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -5,
    right: 14,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#2d1b2e',
  },

  // Address Input
  addressInputContainer: {
    flexDirection: "row",
    gap: 8,
  },
  addressInputRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addressPrefix: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  addressInput: {
    flex: 1,
  },

  // Settings Row
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    lineHeight: 18,
  },
  settingSubtitle: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
    lineHeight: 14,
  },

  // Account Row
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  accountLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  accountIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  accountTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    lineHeight: 18,
  },
})