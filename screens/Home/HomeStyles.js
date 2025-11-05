import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  // NEW HEADER STYLES
  headerNew: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContentNew: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 50,
  },
  headerLeftNew: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerLogoNew: {
    width: 48,
    height: 48,
    marginRight: 8,
  },
  headerTextNew: {
    flex: 1,
  },
  headerGreeting: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerSubtitleNew: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 1,
  },
  headerRightNew: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    width: 38,
    height: 38,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  burgerButton: {
    width: 38,
    height: 38,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // REST OF THE EXISTING STYLES
  content: {
    flex: 1,
  },

  // ⬇️ PATCHED: removed horizontal padding so FacilityGrid centers correctly
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },

  activityCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#27a427",
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 14,
    color: "#666",
  },
})