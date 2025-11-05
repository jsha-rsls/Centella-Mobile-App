import { StyleSheet } from "react-native";

export const cameraStyles = StyleSheet.create({
  // Camera modal
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  cameraHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  cameraCloseButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
  },
  cameraTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  captureGuide: {
    alignItems: "center",
  },
  captureGuideText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  captureFrame: {
    width: 280,
    height: 180,
    borderWidth: 2,
    borderColor: "#2a9d8f",
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  cameraControls: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingVertical: 30,
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2a9d8f",
  },

  // Photo actions grid positioning
  photoActionsGrid: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topLeft: {
    position: "absolute",
    top: 8,
    left: 8,
  },
  topRight: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  bottomLeft: {
    position: "absolute",
    bottom: 8,
    left: 8,
  },
  bottomRight: {
    position: "absolute",
    bottom: 8,
    right: 8,
  },

  // Preview button
  previewButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(42, 157, 143, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Preview Modal
  previewModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewModalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  previewCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  previewImage: {
    width: 280,
    height: 180,
    borderRadius: 8,
    marginBottom: 20,
  },
  previewCloseButtonBottom: {
    backgroundColor: "#2a9d8f",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  previewCloseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default cameraStyles;