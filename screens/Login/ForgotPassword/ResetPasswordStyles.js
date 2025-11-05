import { StyleSheet, Dimensions } from "react-native"

const { width } = Dimensions.get("window")

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
    justifyContent: "center",
    alignItems: "center",
  },

  // Form Container
  formContainer: {
    backgroundColor: "#fff",
    width: width * 0.9,
    maxWidth: 420,
    borderRadius: 16,
    padding: 20,
    alignSelf: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.65,
  },

  // Form Header
  formHeader: {
    marginBottom: 20,
    alignItems: "center",
  },
  formTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#231828",
    marginTop: 12,
    marginBottom: 8,
    textAlign: "center",
  },
  formSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    letterSpacing: 0.2,
    lineHeight: 20,
  },

  // Input Styles
  inputContainer: {
    position: "relative",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1.5,
    borderColor: "#353935",
    borderRadius: 12,
    padding: 12,
    paddingRight: 55,
    fontSize: 14,
    color: "#333",
    minHeight: 44,
    fontWeight: "500",
  },
  inputDisabled: {
    backgroundColor: "#e9ecef",
    opacity: 0.7,
  },
  inputIcon: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: [{ translateY: -11 }],
  },
  passwordToggle: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: [{ translateY: -11 }],
    padding: 4,
  },

  // Code Input Styles
  codeContainer: {
    marginBottom: 12,
  },
  codeInput: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 8,
    paddingRight: 14,
  },
  verifyingIndicator: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: [{ translateY: -12 }],
  },

  // Button Styles
  primaryButton: {
    backgroundColor: "#231828",
    borderRadius: 12,
    padding: 11,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
    elevation: 3,
    shadowColor: "#231828",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    minHeight: 44,
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    backgroundColor: "#F9E6E6",
    elevation: 0,
    shadowOpacity: 0,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.3,
  },

  // Resend Button
  resendButton: {
    backgroundColor: "#231828",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginTop: 8,
    minHeight: 40,
    justifyContent: "center",
  },
  resendButtonDisabled: {
    backgroundColor: "#8C8585",
    opacity: 0.6,
  },
  resendButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.3,
  },

  // Secondary Button (Back to Login)
  secondaryButton: {
    backgroundColor: "#231828",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    marginTop: 24,
    minHeight: 40,
    justifyContent: "center",
    width: "40%",
    alignSelf: "center",
    elevation: 3,
    shadowColor: "#231828",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.3,
  },

  // Loading Container
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
})