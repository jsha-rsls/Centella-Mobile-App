import { StyleSheet, Dimensions } from "react-native"

const { width, height } = Dimensions.get("window")

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  
  // Subtle decorative elements
  decorativeCircle1: {
    position: 'absolute',
    top: '15%',
    right: '10%',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: '20%',
    left: '8%',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  decorativeCircle3: {
    position: 'absolute',
    top: '35%',
    left: '5%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },

  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 40,
    zIndex: 1,
  },

  // Welcome Text
  welcomeText: {
    fontSize: 22,
    color: "#2D2D2D",
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 1,
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  // Logo Section
  logoContainer: {
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },
  logo: {
    width: 180,
    height: 108,
  },

  // Title
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2D2D2D",
    marginBottom: 12,
    textAlign: "center",
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
  },

  // Subtitle
  subtitle: {
    fontSize: 16,
    color: "#2D2D2D",
    marginBottom: 40,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 22,
    paddingHorizontal: 20,
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  // Community Features
  featuresContainer: {
    alignItems: 'flex-start',
    marginBottom: 60,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  featureIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(45, 45, 45, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  iconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2D2D2D',
  },
  featureText: {
    fontSize: 14,
    color: '#2D2D2D',
    fontWeight: '500',
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  // Loading Section
  loadingContainer: {
    position: "absolute",
    bottom: 80,
    width: "85%",
    alignItems: "center",
  },
  loadingBarContainer: {
    height: 4,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  loadingBar: {
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 2,
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  loadingText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '400',
    letterSpacing: 0.3,
    textAlign: 'center',
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
})