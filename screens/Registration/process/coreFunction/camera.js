import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { cameraStyles } from "./cameraStyles";
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export const CameraCapture = ({
  frontId,
  setFrontId,
  backId,
  setBackId,
  selectedId,
  showAlert, // NEW: Modal alert function passed from parent
  cameraButtonStyle,
  photoPreviewContainerStyle,
  photoPreviewStyle,
  photoActionsStyle,
  retakeButtonStyle,
  removeButtonStyle,
  photoLabelStyle,
  cameraButtonDisabledStyle,
  cameraButtonTextStyle,
  cameraButtonTextDisabledStyle,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [currentCapture, setCurrentCapture] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  
  // Confirmation modal for photo removal
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [photoToRemove, setPhotoToRemove] = useState(null);
  
  const cameraRef = useRef(null);

  const handleCameraCapture = async (type) => {
    if (!permission?.granted) {
      const permissionResult = await requestPermission();
      if (!permissionResult.granted) {
        showAlert(
          "Camera Permission Required",
          "Please allow camera access to capture your ID photos.",
          "error"
        );
        return;
      }
    }

    setCurrentCapture(type);
    setCameraVisible(true);
  };

  const cropToFrame = async (photo) => {
    try {
      const screenData = Dimensions.get("window");
      const screenWidth = screenData.width;

      const frameWidth = 280;
      const frameHeight = 180;

      const photoWidth = photo.width;
      const photoHeight = photo.height;

      const cameraAspectRatio = 4 / 3;
      const previewHeight = screenWidth * (1 / cameraAspectRatio);

      const frameX = (screenWidth - frameWidth) / 2;
      const frameY = (previewHeight - frameHeight) / 2;

      const scaleX = photoWidth / screenWidth;
      const scaleY = photoHeight / previewHeight;

      const correctionY = 1.28;

      const cropX = Math.max(0, frameX * scaleX);
      const cropY = Math.max(0, frameY * scaleY * correctionY);
      const cropWidth = Math.min(frameWidth * scaleX, photoWidth - cropX);
      const cropHeight = Math.min(frameHeight * scaleY, photoHeight - cropY);

      const croppedImage = await manipulateAsync(
        photo.uri,
        [
          {
            crop: {
              originX: cropX,
              originY: cropY,
              width: cropWidth,
              height: cropHeight,
            },
          },
        ],
        { compress: 0.8, format: SaveFormat.JPEG }
      );

      return croppedImage;
    } catch (error) {
      console.error("Crop error:", error);
      return photo;
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: false,
        });

        const croppedPhoto = await cropToFrame(photo);

        if (currentCapture === "front") {
          setFrontId(croppedPhoto.uri);
        } else {
          setBackId(croppedPhoto.uri);
        }

        setCameraVisible(false);
        setCurrentCapture(null);
      } catch (error) {
        showAlert("Error", "Failed to capture photo. Please try again.", "error");
        console.error("Camera capture error:", error);
      }
    }
  };

  const closeCameraModal = () => {
    setCameraVisible(false);
    setCurrentCapture(null);
  };

  const removePhoto = (type) => {
    setPhotoToRemove(type);
    setConfirmModalVisible(true);
  };

  const confirmRemovePhoto = () => {
    if (photoToRemove === "front") {
      setFrontId(null);
    } else {
      setBackId(null);
    }
    setConfirmModalVisible(false);
    setPhotoToRemove(null);
  };

  const cancelRemovePhoto = () => {
    setConfirmModalVisible(false);
    setPhotoToRemove(null);
  };

  const showPreview = (imageUri, type) => {
    setPreviewImage(imageUri);
    setPreviewType(type);
    setPreviewVisible(true);
  };

  const closePreview = () => {
    setPreviewVisible(false);
    setPreviewImage(null);
    setPreviewType(null);
  };

  return (
    <>
      {/* Front ID */}
      <View style={{ flex: 1, marginRight: 8 }}>
        {frontId ? (
          <View style={photoPreviewContainerStyle}>
            <Image source={{ uri: frontId }} style={photoPreviewStyle} />
            <View style={cameraStyles.photoActionsGrid}>
              <TouchableOpacity
                style={[retakeButtonStyle, cameraStyles.topLeft]}
                onPress={() => handleCameraCapture("front")}
              >
                <Ionicons name="camera" size={16} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[removeButtonStyle, cameraStyles.topRight]}
                onPress={() => removePhoto("front")}
              >
                <Ionicons name="trash" size={16} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[cameraStyles.previewButton, cameraStyles.bottomRight]}
                onPress={() => showPreview(frontId, "front")}
              >
                <Ionicons name="eye" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <Text style={[photoLabelStyle, cameraStyles.bottomLeft]}>Front ID</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              cameraButtonStyle,
              !selectedId && cameraButtonDisabledStyle,
            ]}
            onPress={() => handleCameraCapture("front")}
            disabled={!selectedId}
          >
            <Ionicons
              name="camera"
              size={24}
              color={!selectedId ? "#ccc" : "#2a9d8f"}
            />
            <Text
              style={[
                cameraButtonTextStyle,
                !selectedId && cameraButtonTextDisabledStyle,
              ]}
            >
              Capture Front ID
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Back ID */}
      <View style={{ flex: 1, marginLeft: 8 }}>
        {backId ? (
          <View style={photoPreviewContainerStyle}>
            <Image source={{ uri: backId }} style={photoPreviewStyle} />
            <View style={cameraStyles.photoActionsGrid}>
              <TouchableOpacity
                style={[retakeButtonStyle, cameraStyles.topLeft]}
                onPress={() => handleCameraCapture("back")}
              >
                <Ionicons name="camera" size={16} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[removeButtonStyle, cameraStyles.topRight]}
                onPress={() => removePhoto("back")}
              >
                <Ionicons name="trash" size={16} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[cameraStyles.previewButton, cameraStyles.bottomRight]}
                onPress={() => showPreview(backId, "back")}
              >
                <Ionicons name="eye" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <Text style={[photoLabelStyle, cameraStyles.bottomLeft]}>Back ID</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              cameraButtonStyle,
              !selectedId && cameraButtonDisabledStyle,
            ]}
            onPress={() => handleCameraCapture("back")}
            disabled={!selectedId}
          >
            <Ionicons
              name="camera"
              size={24}
              color={!selectedId ? "#ccc" : "#2a9d8f"}
            />
            <Text
              style={[
                cameraButtonTextStyle,
                !selectedId && cameraButtonTextDisabledStyle,
              ]}
            >
              Capture Back ID
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Confirmation Modal for Photo Removal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={cancelRemovePhoto}
      >
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}>
          <View style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 24,
            width: "80%",
            maxWidth: 320,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}>
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#ff9800",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}>
              <Ionicons name="warning" size={32} color="#fff" />
            </View>
            
            <Text style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#333",
              marginBottom: 8,
              textAlign: "center",
            }}>
              Remove Photo
            </Text>
            
            <Text style={{
              fontSize: 14,
              color: "#666",
              textAlign: "center",
              marginBottom: 20,
            }}>
              Are you sure you want to remove the {photoToRemove} ID photo?
            </Text>
            
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#f0f0f0",
                  borderRadius: 8,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  flex: 1,
                }}
                onPress={cancelRemovePhoto}
              >
                <Text style={{
                  color: "#333",
                  fontSize: 15,
                  fontWeight: "600",
                  textAlign: "center",
                }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  backgroundColor: "#dc3545",
                  borderRadius: 8,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  flex: 1,
                }}
                onPress={confirmRemovePhoto}
              >
                <Text style={{
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: "600",
                  textAlign: "center",
                }}>
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Camera Modal */}
      <Modal
        visible={cameraVisible}
        animationType="slide"
        onRequestClose={closeCameraModal}
      >
        <View style={cameraStyles.cameraContainer}>
          <View style={cameraStyles.cameraHeader}>
            <TouchableOpacity
              style={cameraStyles.cameraCloseButton}
              onPress={closeCameraModal}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={cameraStyles.cameraTitle}>
              Capture {currentCapture === "front" ? "Front" : "Back"} ID
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={{ flex: 1 }}>
            <CameraView
              ref={cameraRef}
              style={cameraStyles.camera}
              facing="back"
              mode="picture"
            />
            <View style={cameraStyles.cameraOverlay}>
              <View style={cameraStyles.captureGuide}>
                <Text style={cameraStyles.captureGuideText}>
                  Position your {currentCapture} ID within the frame
                </Text>
                <View style={cameraStyles.captureFrame} />
              </View>
            </View>
          </View>

          <View style={cameraStyles.cameraControls}>
            <TouchableOpacity
              style={cameraStyles.captureButton}
              onPress={takePicture}
            >
              <View style={cameraStyles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Preview Modal */}
      <Modal
        visible={previewVisible}
        animationType="fade"
        onRequestClose={closePreview}
        transparent={true}
      >
        <View style={cameraStyles.previewModalContainer}>
          <View style={cameraStyles.previewModalContent}>
            <View style={cameraStyles.previewHeader}>
              <Text style={cameraStyles.previewTitle}>
                {previewType === "front" ? "Front" : "Back"} ID Preview
              </Text>
              <TouchableOpacity
                style={cameraStyles.previewCloseButton}
                onPress={closePreview}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            {previewImage && (
              <Image 
                source={{ uri: previewImage }} 
                style={cameraStyles.previewImage}
                resizeMode="fit"
              />
            )}
            
            <TouchableOpacity
              style={cameraStyles.previewCloseButtonBottom}
              onPress={closePreview}
            >
              <Text style={cameraStyles.previewCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};