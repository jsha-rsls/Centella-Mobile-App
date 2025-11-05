import { StyleSheet } from "react-native"

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f5f8",
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#2d1b2e",
    marginBottom: 6,
  },
  passwordInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0d4e0",
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 42,
    fontSize: 14,
    color: "#2d1b2e",
  },
  criteriaCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0d4e0",
    gap: 6,
  },
  criteriaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  criteriaText: {
    fontSize: 12,
    color: "#999",
  },
  criteriaTextValid: {
    color: "#4CAF50",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#2d1b2e",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
})