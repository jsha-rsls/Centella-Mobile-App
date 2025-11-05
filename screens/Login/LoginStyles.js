import {
  StyleSheet,
  Platform,
  Dimensions
} from "react-native"

const {
  height,
  width
} = Dimensions.get("window")

export default StyleSheet.create({
  gradient: {
    flex: 1
  },
  statusBarSpacer: {
    backgroundColor: "transparent"
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  // Logo Section - Centered like in Figma
  logoSection: {
    alignItems: 'center', // Center the entire logo section
    marginBottom: 10,
    width: '100%',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center', // center text vertically with logo
    justifyContent: 'center', // center the whole row
    width: '100%',
  },
  logoIcon: {
    width: 95,
    height: 95,
  },
  brandTextContainer: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2D2D2D',
    letterSpacing: 1.5,
    lineHeight: 34, // match text height so lines look balanced
    textAlign: 'left', // keep left-aligned inside container
  },

  // Form Container
  formContainer: {
    backgroundColor: "#fff",
    width: width * 0.85,
    maxWidth: 420,
    borderRadius: 16,
    padding: 20,
    alignSelf: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.65,
  },

  formHeader: {
    marginBottom: 24,
    alignItems: "center",
  },
  formTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#231828",
    marginBottom: 8,
    textAlign: "center",
  },
  formSubtitle: {
    fontSize: 14,
    color: "#231828",
    textAlign: "center",
    letterSpacing: 0.2,
  },

  // Input Styles
  inputContainer: {
    position: "relative",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1.5,
    borderColor: "#353935",
    borderRadius: 12,
    padding: 14,
    paddingRight: 55,
    fontSize: 14,
    color: "#333",
    minHeight: 48,
    fontWeight: "500",
  },
  inputIcon: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{
      translateY: -12
    }],
    zIndex: 1,
  },
  passwordToggle: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{
      translateY: -14
    }],
    padding: 4,
    zIndex: 1,
  },

  // Button Styles
  authButton: {
    backgroundColor: "#231828",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#231828",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    minHeight: 48,
    justifyContent: "center",
  },
  authButtonDisabled: {
    backgroundColor: "#F9E6E6",
    elevation: 0,
    shadowOpacity: 0,
  },
  authButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Forgot Password Styles
  forgotPasswordContainer: {
    marginTop: 8,
    alignItems: "center",
  },
  forgotPasswordText: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.2,
    color: "#231828",
  },
  forgotPasswordUnderline: {
    height: 1.2,
    backgroundColor: "#231828",
    width: "49%",
    marginTop: 1.3,
    marginBottom: 8,
  },

  // Divider Styles
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#8C8585",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#8C8585",
    fontSize: 14,
    fontWeight: "500",
  },

  // Register Link Styles
  registerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  registerLink: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  registerLinkText: {
    fontWeight: "600",
    color: "#231828",
    fontSize: 15,
    letterSpacing: 0.2,
  },
  registerLinkTextUnderline: {
    height: 1.2,
    backgroundColor: "#231828",
    alignSelf: "stretch",
    marginTop: 1.5,
  },
  suggestionContainer: {
    paddingHorizontal: 14,
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C8E6C9",
    alignSelf: "center",
  },
  suggestionText: {
    fontSize: 13,
    color: "#2E7D32",
    fontWeight: "600",
    textAlign: "center",
  },

  autoLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F5F1F5',
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 6,

  },
  autoLoginTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  autoLoginText: {
    fontSize: 14,
    color: '#5C4F5C',
    fontWeight: '500',
  },

})