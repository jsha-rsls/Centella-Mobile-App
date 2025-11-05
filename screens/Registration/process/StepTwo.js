import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Modal,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";
import styles from "../RegistrationStyles";
import InfoModal from "../components/infoModal";
import { CameraCapture } from "./coreFunction/camera";
import { sendVerificationCode, verifyCode } from "../../../services/verificationService";
import { supabase } from "../../../utils/supabase";

export default function StepTwo({
  step,
  open,
  setOpen,
  selectedId,
  setSelectedId,
  idOptions,
  setIdOptions,
  frontId,
  setFrontId,
  backId,
  setBackId,
  modalVisible,
  setModalVisible,
  email,
  setEmail,
  verificationCode,
  setVerificationCode,
  isValidEmail,
  isCooldown,
  cooldownTime,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  handleNext,
  handleBack,
  // ✅ NEW: Persistent verification props
  isEmailVerified,
  setIsEmailVerified,
  verifiedEmail,
  setVerifiedEmail,
}) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [sendingProgress, setSendingProgress] = useState("");
  const [localCooldown, setLocalCooldown] = useState(false);
  const [localCooldownTime, setLocalCooldownTime] = useState(60);
  
  // Universal Alert Modal States
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success"); // success, error, info
  
  // Email checking states
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailCheckComplete, setEmailCheckComplete] = useState(false);
  
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const emailCheckTimeout = useRef(null);

  // ✅ Check if returning with verified email
  useEffect(() => {
    if (isEmailVerified && verifiedEmail === email) {
      // Email is already verified, no need to verify again
      setVerificationError(false);
    }
  }, []);

  // Universal Alert Function
  const showAlert = (title, message, type = "info") => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertModalVisible(true);
  };

  // Get alert icon based on type
  const getAlertIcon = () => {
    switch (alertType) {
      case "success":
        return { name: "checkmark-circle", color: "#27a427" };
      case "error":
        return { name: "close-circle", color: "#dc3545" };
      case "info":
      default:
        return { name: "information-circle", color: "#2196F3" };
    }
  };

  // Auto-check email availability
  useEffect(() => {
    if (emailCheckTimeout.current) {
      clearTimeout(emailCheckTimeout.current);
    }

    setEmailCheckComplete(false);
    setEmailExists(false);

    // ✅ Skip check if email is already verified
    if (isEmailVerified && verifiedEmail === email) {
      setEmailCheckComplete(true);
      setEmailExists(false);
      return;
    }

    if (isValidEmail(email)) {
      setIsCheckingEmail(true);
      
      emailCheckTimeout.current = setTimeout(async () => {
        try {
          const { data: existingEmail } = await supabase
            .from("residents")
            .select("email")
            .eq("email", email.toLowerCase())
            .single();

          if (existingEmail) {
            setEmailExists(true);
            // ✅ Clear verification if email changed to existing one
            if (isEmailVerified) {
              setIsEmailVerified(false);
              setVerifiedEmail("");
            }
          } else {
            setEmailExists(false);
          }
          setEmailCheckComplete(true);
        } catch (error) {
          setEmailExists(false);
          setEmailCheckComplete(true);
        } finally {
          setIsCheckingEmail(false);
        }
      }, 800);
    } else {
      setIsCheckingEmail(false);
    }

    return () => {
      if (emailCheckTimeout.current) {
        clearTimeout(emailCheckTimeout.current);
      }
    };
  }, [email]);

  // Auto-verify when code reaches 6 digits (only if not already verified)
  useEffect(() => {
    if (verificationCode.length === 6 && isValidEmail(email) && !emailExists && !isEmailVerified) {
      handleVerifyCode();
    }
  }, [verificationCode, email, emailExists, isEmailVerified]);

  // Reset verification status when code changes (only if not persistently verified)
  useEffect(() => {
    if (verificationCode.length < 6 && !isEmailVerified) {
      setVerificationError(false);
    }
  }, [verificationCode, isEmailVerified]);

  // ✅ Reset verification if email changes from verified one
  useEffect(() => {
    if (isEmailVerified && verifiedEmail !== email) {
      setIsEmailVerified(false);
      setVerifiedEmail("");
      setVerificationCode("");
      setVerificationError(false);
    }
  }, [email, verifiedEmail, isEmailVerified]);

  // Animated loading for send code button
  useEffect(() => {
    if (isSendingCode) {
      const rotation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      rotation.start();

      return () => rotation.stop();
    } else {
      rotateAnim.setValue(0);
    }
  }, [isSendingCode]);

  // Local cooldown timer
  useEffect(() => {
    let interval;
    if (localCooldown && localCooldownTime > 0) {
      interval = setInterval(() => {
        setLocalCooldownTime((prev) => {
          if (prev <= 1) {
            setLocalCooldown(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [localCooldown, localCooldownTime]);

  const handleVerifyCode = async () => {
    setIsVerifying(true);
    setVerificationError(false);

    const result = await verifyCode(email, verificationCode);

    if (result.success) {
      // ✅ Set persistent verification
      setIsEmailVerified(true);
      setVerifiedEmail(email);
      setVerificationError(false);
    } else {
      setVerificationError(true);
      setIsEmailVerified(false);
      showAlert("Verification Failed", result.message, "error");
    }

    setIsVerifying(false);
  };

  const handleSendCode = async () => {
    if (!isValidEmail(email)) {
      showAlert("Invalid Email", "Please enter a valid email address.", "error");
      return;
    }

    if (emailExists) {
      showAlert("Email Already Registered", "This email is already registered. Please use a different email or try logging in.", "error");
      return;
    }

    setIsSendingCode(true);
    setSendingProgress("Sending verification code...");

    const result = await sendVerificationCode(email, (progressMsg) => {
      setSendingProgress(progressMsg);
    });

    if (result.success) {
      showAlert("Code Sent!", result.message, "success");
      setVerificationCode(""); 
      setIsEmailVerified(false);
      setVerifiedEmail("");
      setVerificationError(false);
      
      setLocalCooldown(true);
      setLocalCooldownTime(60);
    } else {
      showAlert("Failed to Send Code", result.message, "error");
    }

    setIsSendingCode(false);
    setSendingProgress("");
  };

  const handleNextStep = () => {
    if (emailExists) {
      showAlert("Email Already Registered", "This email is already registered. Please use a different email.", "error");
      return;
    }
    
    if (!isEmailVerified) {
      showAlert("Email Not Verified", "Please verify your email first.", "error");
      return;
    }
    handleNext();
  };

  // Get email status icon
  const getEmailStatusIcon = () => {
    if (!email || !isValidEmail(email)) return null;
    
    // ✅ Show verified icon if email is verified
    if (isEmailVerified && verifiedEmail === email) {
      return <Ionicons name="checkmark-circle" size={20} color="#27a427" />;
    }
    
    if (isCheckingEmail) {
      return <Ionicons name="refresh" size={20} color="#999" />;
    }
    
    if (emailCheckComplete && emailExists) {
      return <Ionicons name="close-circle" size={20} color="#dc3545" />;
    }
    
    return null;
  };

  // Get email border color
  const getEmailBorderColor = () => {
    if (!email || !isValidEmail(email)) return "#353935";
    
    // ✅ Green border if verified
    if (isEmailVerified && verifiedEmail === email) {
      return "#27a427";
    }
    
    if (emailCheckComplete && emailExists) {
      return "#dc3545";
    }
    
    return "#353935";
  };

  // Get verification icon
  const getVerificationIcon = () => {
    // ✅ Show verified icon if email is verified
    if (isEmailVerified && verifiedEmail === email) {
      return <Ionicons name="checkmark-circle" size={20} color="#27a427" />;
    }
    
    if (verificationCode.length < 6) return null;
    
    if (isVerifying) {
      return <Ionicons name="refresh" size={20} color="#999" />;
    }
    
    if (verificationError) {
      return <Ionicons name="close-circle" size={20} color="#dc3545" />;
    }
    
    return null;
  };

  // Get border color based on verification status
  const getVerificationBorderColor = () => {
    // ✅ Green border if verified
    if (isEmailVerified && verifiedEmail === email) {
      return "#27a427";
    }
    
    if (verificationCode.length < 6) return "#353935";
    
    if (verificationError) return "#dc3545";
    
    return "#353935";
  };

  // Determine if code button should be disabled
  const isCodeButtonDisabled = !isValidEmail(email) || 
                               emailExists ||
                               isCheckingEmail ||
                               localCooldown || 
                               isEmailVerified || // ✅ Disable if already verified
                               isSendingCode;

  // Get button text based on state
  const getButtonText = () => {
    if (isSendingCode) return "Sending...";
    if (isEmailVerified && verifiedEmail === email) return "Verified"; // ✅ Show verified
    if (emailExists) return "Email Taken";
    if (localCooldown) return `${localCooldownTime}s`;
    return "Get Code";
  };

  return (
    <>
      <Text style={styles.cardTitle}>Verification</Text>

      {/* Universal Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={alertModalVisible}
        onRequestClose={() => setAlertModalVisible(false)}
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
              backgroundColor: getAlertIcon().color,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}>
              <Ionicons name={getAlertIcon().name} size={32} color="#fff" />
            </View>
            
            <Text style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#333",
              marginBottom: 8,
              textAlign: "center",
            }}>
              {alertTitle}
            </Text>
            
            <Text style={{
              fontSize: 14,
              color: "#666",
              textAlign: "center",
              marginBottom: 20,
            }}>
              {alertMessage}
            </Text>
            
            <TouchableOpacity
              style={{
                backgroundColor: getAlertIcon().color,
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 32,
                minWidth: 120,
              }}
              onPress={() => setAlertModalVisible(false)}
            >
              <Text style={{
                color: "#fff",
                fontSize: 15,
                fontWeight: "600",
                textAlign: "center",
              }}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ID Type */}
      <Text style={styles.sectionLabel}>Select ID Type</Text>
      <View style={{ marginBottom: 10 }}>
        <DropDownPicker
          open={open}
          value={selectedId}
          items={idOptions}
          setOpen={setOpen}
          setValue={setSelectedId}
          setItems={setIdOptions}
          placeholder="-- Select ID --"
          style={styles.idPicker}
          dropDownContainerStyle={{ borderColor: "#ccc", borderRadius: 6 }}
          listMode="SCROLLVIEW"
        />
      </View>

      {/* Camera Captures */}
      <Text style={styles.sectionLabel}>Capture ID Photos</Text>
      <View style={styles.uploadRow}>
        <CameraCapture
          frontId={frontId}
          setFrontId={setFrontId}
          backId={backId}
          setBackId={setBackId}
          selectedId={selectedId}
          showAlert={showAlert}
          cameraButtonStyle={styles.cameraButton}
          photoPreviewContainerStyle={styles.photoPreviewContainer}
          photoPreviewStyle={styles.photoPreview}
          photoActionsStyle={styles.photoActions}
          retakeButtonStyle={styles.retakeButton}
          removeButtonStyle={styles.removeButton}
          photoLabelStyle={styles.photoLabel}
          cameraButtonDisabledStyle={styles.cameraButtonDisabled}
          cameraButtonTextStyle={styles.cameraButtonText}
          cameraButtonTextDisabledStyle={styles.cameraButtonTextDisabled}
        />
      </View>

      {/* Disclaimer */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <Text style={styles.disclaimerText}>
          For verification purposes only.{" "}
        </Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.4}>
          <Text style={styles.learnMoreText}>Learn more</Text>
        </TouchableOpacity>
      </View>

      {/* Info Modal */}
      <InfoModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      {/* Email with Status Icon */}
      <Text style={styles.sectionLabel}>Email Address</Text>
      <View style={{ position: "relative", width: "100%" }}>
        <TextInput
          style={[
            styles.input, 
            styles.inputCompact,
            { 
              paddingRight: 40,
              borderColor: getEmailBorderColor(),
              width: "100%",
            }
          ]}
          placeholder="example@example.com"
          placeholderTextColor="#8C8585"
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isEmailVerified} // ✅ Disable if verified
        />
        
        {/* Email Status Icon */}
        {getEmailStatusIcon() && (
          <View style={{
            position: "absolute",
            right: 14,
            top: 14,
          }}>
            {isCheckingEmail ? (
              <Animated.View
                style={{
                  transform: [{
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    })
                  }]
                }}
              >
                {getEmailStatusIcon()}
              </Animated.View>
            ) : (
              getEmailStatusIcon()
            )}
          </View>
        )}
      </View>

      {/* Email Status Message */}
      {isEmailVerified && verifiedEmail === email && (
        <View style={{ marginBottom: 10 }}>
          <Text style={{ color: "#27a427", fontSize: 13, textAlign: "center", fontWeight: "600" }}>
            ✓ Email verified
          </Text>
        </View>
      )}
      
      {emailCheckComplete && isValidEmail(email) && emailExists && !isEmailVerified && (
        <View style={{ marginBottom: 10 }}>
          <Text style={{ color: "#dc3545", fontSize: 13, textAlign: "center", fontWeight: "600" }}>
            ✗ Email is already registered
          </Text>
        </View>
      )}

      {/* Verification Code with Icon */}
      <View style={styles.verificationRow}>
        <View style={styles.verificationInputWrapper}>
          <TextInput
            style={[
              styles.input,
              { 
                paddingRight: getVerificationIcon() ? 40 : 14,
                borderColor: getVerificationBorderColor(),
              },
              (!isValidEmail(email) || emailExists || isEmailVerified) && { backgroundColor: "#e0e0e0" },
            ]}
            placeholder="Verification Code"
            placeholderTextColor="#8C8585"
            value={verificationCode}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
              setVerificationCode(numericText);
            }}
            keyboardType="numeric"
            maxLength={6}
            editable={isValidEmail(email) && !emailExists && !isEmailVerified} // ✅ Disable if verified
          />
          
          {/* Verification Icon */}
          {getVerificationIcon() && (
            <View style={{
              position: "absolute",
              right: 14,
              top: 14,
            }}>
              {getVerificationIcon()}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.resendButton,
            isCodeButtonDisabled && { backgroundColor: "#ccc", borderColor: "#999" },
          ]}
          disabled={isCodeButtonDisabled}
          onPress={handleSendCode}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {isSendingCode && (
              <Animated.View
                style={{
                  marginRight: 6,
                  transform: [{
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    })
                  }]
                }}
              >
                <Ionicons 
                  name="refresh" 
                  size={16} 
                  color="#999" 
                />
              </Animated.View>
            )}
            <Text style={[
              styles.resendText,
              isCodeButtonDisabled && { color: "#999" }
            ]}>
              {getButtonText()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Progress Message (when sending takes longer) */}
      {isSendingCode && sendingProgress && (
        <View style={{ marginBottom: 10 }}>
          <Text style={{ 
            color: "#666", 
            fontSize: 13, 
            textAlign: "center",
            fontStyle: "italic"
          }}>
            {sendingProgress}
          </Text>
        </View>
      )}

      {/* Verification Status Text (only if not persistently verified) */}
      {verificationCode.length === 6 && !isSendingCode && !isEmailVerified && (
        <View style={{ marginBottom: 10 }}>
          {isVerifying && (
            <Text style={{ color: "#999", fontSize: 13, textAlign: "center" }}>
              Verifying code...
            </Text>
          )}
          {verificationError && (
            <Text style={{ color: "#dc3545", fontSize: 13, textAlign: "center", fontWeight: "600" }}>
              ✗ Invalid or expired code
            </Text>
          )}
        </View>
      )}

      {/* Password */}
      <Text style={styles.sectionLabel}>Password</Text>
      <View style={[styles.passwordContainer, styles.inputCompact]}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Choose Password"
          placeholderTextColor="#8C8585"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#8C8585" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View style={[styles.passwordContainer, styles.inputCompact]}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          placeholderTextColor="#8C8585"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={22} color="#8C8585" />
        </TouchableOpacity>
      </View>

      <Text style={styles.passwordHint}>
        Password must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character.
      </Text>

      {/* Navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.stepButton} onPress={handleBack}>
          <Text style={styles.stepButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.stepButton, 
            { flex: 1, marginLeft: 10 },
            (!isEmailVerified || emailExists) && { backgroundColor: "#ccc", elevation: 0, shadowOpacity: 0 }
          ]}
          onPress={handleNextStep}
          disabled={!isEmailVerified || emailExists}
        >
          <Text style={[
            styles.stepButtonText,
            (!isEmailVerified || emailExists) && { color: "#999" }
          ]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}