import { View, Text, TouchableOpacity, ActivityIndicator, Image, ScrollView, Modal } from "react-native";
import { useEffect, useState, useRef } from "react";
import { Animated } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from "../RegistrationStyles";
import { handleRegistrationProcess } from "./coreFunction/uploadToDatabase";
import RegistrationSuccessModal from "../components/RegistrationSuccessModal";

export default function StepThree({...props}) {
  const {
    navigation,
    step,
    accountId,
    setAccountId,
    firstName,
    middleInitial,
    lastName,
    birthDate,
    calculateAge,
    contactNumber,
    blockNumber,
    lotNumber,
    phaseNumber,
    email,
    selectedId,
    idLabels,
    password,
    frontId,
    backId,
    agreeTerms,
    setAgreeTerms,
    agreePrivacy,
    setAgreePrivacy,
    handleNext,
    handleBack,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Alert Modal State
  const [alertModal, setAlertModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "error"
  });

  // Show alert modal function
  const showAlert = (title, message, type = "error") => {
    setAlertModal({
      visible: true,
      title,
      message,
      type
    });
  };

  const closeAlert = () => {
    setAlertModal({
      visible: false,
      title: "",
      message: "",
      type: "error"
    });
  };

  // Get icon and color based on alert type
  const getAlertIcon = () => {
    switch (alertModal.type) {
      case "success":
        return { name: "check-circle", color: "#4CAF50" };
      case "info":
        return { name: "information", color: "#2196F3" };
      default:
        return { name: "alert-circle", color: "#f44336" };
    }
  };

  // Generate Account ID if missing
  useEffect(() => {
    if (!accountId) {
      const generatedId = Math.floor(100000 + Math.random() * 900000).toString();
      setAccountId(generatedId);
    }
  }, [accountId]);

  const handleConfirm = async () => {
    // Validation checks
    if (!agreeTerms || !agreePrivacy) {
      showAlert("Agreement Required", "You must agree to Terms & Privacy Policy.", "error");
      return;
    }

    if (!password || password.trim().length < 6) {
      showAlert("Invalid Password", "Password must be at least 6 characters long.", "error");
      return;
    }

    if (!frontId || !backId) {
      showAlert("Missing ID Photos", "Please capture both front and back ID photos.", "error");
      return;
    }

    if (!selectedId) {
      showAlert("Missing ID Type", "Please select your ID type.", "error");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      const userData = {
        accountId,
        setAccountId,
        email,
        password,
        frontId,
        backId,
        firstName,
        middleInitial,
        lastName,
        birthDate,
        calculateAge,
        contactNumber,
        blockNumber,
        lotNumber,
        phaseNumber,
        selectedId
      };

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const result = await handleRegistrationProcess(userData, setLoadingMessage);

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsLoading(false);
        setLoadingMessage("");
        setUploadProgress(0);

        // Show success modal
        setShowSuccessModal(true);
      }, 500);

    } catch (error) {
      setIsLoading(false);
      setLoadingMessage("");
      setUploadProgress(0);
      
      showAlert("Registration Failed", error.message || "Registration failed. Please check your connection and try again.", "error");
    }
  };

  // Toast animation setup
  const [toastMessage, setToastMessage] = useState("");
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(20)).current;

  const showToast = (message) => {
    setToastMessage(message);

    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(toastTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(toastTranslateY, {
          toValue: 20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setToastMessage(""));
    }, 2000);
  };

  const handleCopyAccountId = async () => {
    try {
      await Clipboard.setStringAsync(accountId.toString());
      Haptics.selectionAsync();
      showToast("Account ID copied to clipboard");
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showToast("Failed to copy");
    }
  };

  return (
    <>
      {/* Success Modal */}
      <RegistrationSuccessModal 
        visible={showSuccessModal}
        onContinue={() => {
          setShowSuccessModal(false);
          handleNext();
        }}
      />

      {/* Alert Modal */}
      <Modal
        visible={alertModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAlert}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            width: '100%',
            maxWidth: 340,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}>
            <View style={{ marginBottom: 16 }}>
              <MaterialCommunityIcons
                name={getAlertIcon().name}
                size={56}
                color={getAlertIcon().color}
              />
            </View>
            
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#333',
              marginBottom: 8,
              textAlign: 'center',
            }}>
              {alertModal.title}
            </Text>
            
            <Text style={{
              fontSize: 15,
              color: '#666',
              textAlign: 'center',
              marginBottom: 24,
              lineHeight: 22,
            }}>
              {alertModal.message}
            </Text>
            
            <TouchableOpacity 
              style={{
                backgroundColor: '#231828',
                paddingVertical: 12,
                paddingHorizontal: 40,
                borderRadius: 8,
                width: '100%',
                alignItems: 'center',
              }}
              onPress={closeAlert}
              activeOpacity={0.8}
            >
              <Text style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '600',
              }}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.cardTitle}>Review Your Information</Text>
        <Text style={styles.confirmSubtitle}>
          Please review your details carefully before submitting
        </Text>

        {/* Personal Information Section */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle-outline" size={20} color="#231828" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>
                {firstName} {middleInitial ? middleInitial + "." : ""} {lastName}
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Birthdate</Text>
              <Text style={styles.infoValue}>
                {birthDate ? birthDate.toLocaleDateString() : ""}{" "}
                {birthDate ? `(${calculateAge(birthDate)} years old)` : ""}
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Information Section */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call-outline" size={20} color="#231828" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Contact Information</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{email}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Contact Number</Text>
              <Text style={styles.infoValue}>{contactNumber}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Home Address</Text>
              <Text style={styles.infoValue}>
                Block {blockNumber}, Lot {lotNumber}, Phase {phaseNumber}
              </Text>
            </View>
          </View>
        </View>

        {/* ID Verification Section */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card-outline" size={20} color="#231828" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>ID Verification</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID Type</Text>
              <Text style={styles.infoValue}>{idLabels[selectedId] || selectedId}</Text>
            </View>
            <View style={styles.infoDivider} />
            
            {/* ID Photos Preview */}
            <View style={styles.idPreviewContainer}>
              <View style={styles.idPreviewItem}>
                <Text style={styles.idPreviewLabel}>Front ID</Text>
                {frontId ? (
                  <View style={styles.idPreviewImageWrapper}>
                    <Image source={{ uri: frontId }} style={styles.idPreviewImage} />
                    <View style={styles.idPreviewBadge}>
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                  </View>
                ) : (
                  <View style={styles.idPreviewPlaceholder}>
                    <Ionicons name="close" size={16} color="#999" />
                  </View>
                )}
              </View>

              <View style={styles.idPreviewItem}>
                <Text style={styles.idPreviewLabel}>Back ID</Text>
                {backId ? (
                  <View style={styles.idPreviewImageWrapper}>
                    <Image source={{ uri: backId }} style={styles.idPreviewImage} />
                    <View style={styles.idPreviewBadge}>
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                  </View>
                ) : (
                  <View style={styles.idPreviewPlaceholder}>
                    <Ionicons name="close" size={16} color="#999" />
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Account ID Info Box */}
        <View style={styles.accountIdBox}>
          <Text style={styles.accountIdLabel}>Your Account ID</Text>

          <TouchableOpacity
            onLongPress={handleCopyAccountId}
            delayLongPress={300}
            activeOpacity={0.7}
          >
            <Text style={styles.accountIdValue}>{accountId}</Text>
          </TouchableOpacity>

          <View style={styles.accountIdNoteRow}>
            <Ionicons name="information-circle-outline" size={14} color="#666" />
            <Text style={styles.accountIdNote}>Save this ID as a backup login option</Text>
          </View>

          {/* Toast Notification */}
          {toastMessage !== "" && (
            <Animated.View
              style={{
                position: "absolute",
                bottom: -120,
                alignSelf: "center",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#2d1b2e",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 25,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                gap: 8,
                opacity: toastOpacity,
                transform: [{ translateY: toastTranslateY }],
              }}
            >
              <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
              <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>
                {toastMessage}
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Terms & Conditions Checkboxes */}
        <View style={styles.termsSection}>
          {/* Terms & Conditions */}
          <View style={styles.checkboxRowImproved}>
            <TouchableOpacity
              onPress={() => setAgreeTerms(!agreeTerms)}
              disabled={isLoading}
              style={styles.checkboxContainer}
            >
              <View style={[styles.checkboxBoxImproved, agreeTerms && styles.checkboxBoxChecked]}>
                {agreeTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
            </TouchableOpacity>
            
            <View style={styles.checkboxTextContainer}>
              <Text style={styles.checkboxLabelImproved}>
                I agree to the{' '}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('TermsConditions')}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <Text style={styles.checkboxLinkText}>Terms & Conditions</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Privacy Policy */}
          <View style={styles.checkboxRowImproved}>
            <TouchableOpacity
              onPress={() => setAgreePrivacy(!agreePrivacy)}
              disabled={isLoading}
              style={styles.checkboxContainer}
            >
              <View style={[styles.checkboxBoxImproved, agreePrivacy && styles.checkboxBoxChecked]}>
                {agreePrivacy && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
            </TouchableOpacity>
            
            <View style={styles.checkboxTextContainer}>
              <Text style={styles.checkboxLabelImproved}>
                I agree to the{' '}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('PrivacyPolicy')}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <Text style={styles.checkboxLinkText}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Loading Indicator with Progress */}
        {isLoading && (
          <View style={styles.loadingContainerImproved}>
            <ActivityIndicator size="large" color="#231828" />
            <Text style={styles.loadingTextImproved}>{loadingMessage}</Text>
            {uploadProgress > 0 && (
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: `${uploadProgress}%` }]} />
              </View>
            )}
            <Text style={styles.progressText}>{uploadProgress}%</Text>
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={[styles.navRowImproved, { alignItems: "center", marginTop: 24 }]}>
          <TouchableOpacity
            style={[
              styles.backButtonLink,
              isLoading && styles.backButtonDisabled,
              { flexDirection: "row", alignItems: "center" },
            ]}
            onPress={handleBack}
            disabled={isLoading}
          >
            <Ionicons
              name="arrow-back"
              size={18}
              color={isLoading ? "#999" : "#231828"}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.backButtonLinkText,
                isLoading && styles.backButtonLinkTextDisabled,
              ]}
            >
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              isLoading && styles.confirmButtonDisabled,
              (!agreeTerms || !agreePrivacy) && styles.confirmButtonDisabled,
              { flexDirection: "row", alignItems: "center", justifyContent: "center" },
            ]}
            onPress={handleConfirm}
            disabled={isLoading || !agreeTerms || !agreePrivacy}
          >
            {isLoading ? (
              <>
                <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} />
              </>
            ) : (
              <>
                <Text style={styles.confirmButtonText}>Confirm</Text>
                <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginLeft: 6 }} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}