import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  scrollView: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollContent: {
    paddingHorizontal: 8,
    flexGrow: 1,
  },
  actionCard: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 2,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  iconContainer: {
    width: 36,
    height: 36,
    backgroundColor: "#f0f7ff",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#e8f2ff",
  },
  actionTitle: {
    fontSize: 10,
    fontWeight: "600",
    color: "#2c3e50",
    textAlign: "center",
    lineHeight: 12,
    numberOfLines: 2,
  },
});