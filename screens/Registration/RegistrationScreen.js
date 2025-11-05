import { useState } from "react"
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Modal, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import styles from "./RegistrationStyles"

import { MaterialCommunityIcons } from "@expo/vector-icons"

// Fixed imports - they were all importing StepOne
import StepOne from "./process/StepOne";
import StepTwo from "./process/StepTwo";
import StepThree from "./process/StepThree";

export default function RegistrationScreen({ navigation }) {
  const insets = useSafeAreaInsets()

  // Step handling
  const [step, setStep] = useState(1)

  // Alert Modal State
  const [alertModal, setAlertModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "error" // 'error', 'success', 'info'
  })

  // Step 1 state
  const [firstName, setFirstName] = useState("")
  const [middleInitial, setMiddleInitial] = useState("")
  const [lastName, setLastName] = useState("")
  const [birthDate, setBirthDate] = useState(null)
  const [age, setAge] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [contactNumber, setContactNumber] = useState("")
  const [blockNumber, setBlockNumber] = useState("")
  const [lotNumber, setLotNumber] = useState("")
  const [phaseNumber, setPhaseNumber] = useState("")

  // Step 2 state
  const [modalVisible, setModalVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [idOptions, setIdOptions] = useState([
    { label: "National ID", value: "national_id" },
    { label: "Driver's License", value: "drivers_license" },
    { label: "Passport", value: "passport" },
    { label: "PhilHealth ID", value: "philhealth" },
    { label: "SSS ID", value: "sss_id" },
  ])

  const idLabels = {
    national_id: "National ID",
    drivers_license: "Driver's License",
    passport: "Passport",
    philhealth: "PhilHealth ID",
    sss_id: "SSS ID",
  }
  
  const [frontId, setFrontId] = useState(null)
  const [backId, setBackId] = useState(null)
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(30);
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // ✅ NEW: Persistent verification state
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [verifiedEmail, setVerifiedEmail] = useState("")

  // Step 3 state
  const [accountId, setAccountId] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)

  // Show alert modal function
  const showAlert = (title, message, type = "error") => {
    setAlertModal({
      visible: true,
      title,
      message,
      type
    })
  }

  const closeAlert = () => {
    setAlertModal({
      visible: false,
      title: "",
      message: "",
      type: "error"
    })
  }

  const calculateAge = (date) => {
    if (!date) return 0;
    const today = new Date()
    let age = today.getFullYear() - date.getFullYear()
    const monthDiff = today.getMonth() - date.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      age--
    }
    return age
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendCode = () => {
    // Mock sending verification code
    showAlert("Verification Code Sent", `A code has been sent to ${email}`, "success");

    setIsCooldown(true);
    setCooldownTime(30);

    const interval = setInterval(() => {
      setCooldownTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCooldown(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleNext = () => {
    if (step === 1) {
      if (
        !lastName ||
        !firstName ||
        !middleInitial ||
        !birthDate ||
        !contactNumber ||
        !blockNumber ||
        !lotNumber ||
        !phaseNumber
      ) {
        showAlert("Incomplete Information", "Please fill all required fields.");
        return;
      }
      if (!/^09\d{9}$/.test(contactNumber)) {
        showAlert(
          "Invalid Contact Number",
          "Contact number must be 11 digits and start with 09."
        );
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (
        !selectedId ||
        !frontId ||
        !backId ||
        !email ||
        !verificationCode ||
        !password ||
        !confirmPassword
      ) {
        showAlert("Incomplete Verification", "Please complete all verification details.");
        return;
      }
      if (password !== confirmPassword) {
        showAlert("Password Mismatch", "Passwords do not match.");
        return;
      }
      if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password)) {
        showAlert("Weak Password", "Password must meet the requirements.");
        return;
      }

      setStep(3);
    } else if (step === 3) {
      // Handle final step completion - navigate to login or main app
      navigation.navigate("Login");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // Get icon and color based on alert type
  const getAlertIcon = () => {
    switch (alertModal.type) {
      case "success":
        return { name: "check-circle", color: "#4CAF50" }
      case "info":
        return { name: "information", color: "#2196F3" }
      default:
        return { name: "alert-circle", color: "#f44336" }
    }
  }
  
  return (
    <LinearGradient colors={["#231828", "#F9E6E6", "#231828"]} style={styles.gradient}>
      <ExpoStatusBar style="light" translucent />
      <View style={[styles.statusBarSpacer, { height: insets.top }]} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text style={styles.stepText}>Step {step} of 3</Text>
            <View style={styles.stepBarRow}>
              <View style={[styles.stepBar, step >= 1 && styles.stepBarActive]} />
              <View style={[styles.stepBar, step >= 2 && styles.stepBarActive]} />
              <View style={[styles.stepBar, step >= 3 && styles.stepBarActive]} />
            </View>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <View style={styles.avatarWrapper}>
              {step === 1 && (
                <MaterialCommunityIcons
                  name="account-details"
                  size={64}
                  color="#231828"
                />
              )}
              {step === 2 && (
                <MaterialCommunityIcons
                  name="card-account-details"
                  size={64}
                  color="#231828"
                />
              )}
              {step === 3 && (
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={64}
                  color="#231828"
                />
              )}
            </View>

            {step === 1 && (
              <StepOne
                lastName={lastName} setLastName={setLastName}
                firstName={firstName} setFirstName={setFirstName}
                middleInitial={middleInitial} setMiddleInitial={setMiddleInitial}
                birthDate={birthDate} setBirthDate={setBirthDate}
                age={age} setAge={setAge}
                showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker}
                contactNumber={contactNumber} setContactNumber={setContactNumber}
                blockNumber={blockNumber} setBlockNumber={setBlockNumber}
                lotNumber={lotNumber} setLotNumber={setLotNumber}
                phaseNumber={phaseNumber} setPhaseNumber={setPhaseNumber}
                calculateAge={calculateAge}
                handleNext={handleNext} handleBack={handleBack}
                navigation={navigation}
              />
            )}

            {step === 2 && (
              <StepTwo
                step={step}
                open={open} setOpen={setOpen}
                selectedId={selectedId} setSelectedId={setSelectedId}
                idOptions={idOptions} setIdOptions={setIdOptions}
                frontId={frontId} setFrontId={setFrontId}
                backId={backId} setBackId={setBackId}
                modalVisible={modalVisible} setModalVisible={setModalVisible}
                email={email} setEmail={setEmail}
                verificationCode={verificationCode} setVerificationCode={setVerificationCode}
                isValidEmail={isValidEmail}
                isCooldown={isCooldown} cooldownTime={cooldownTime} handleSendCode={handleSendCode}
                password={password} setPassword={setPassword}
                confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                showPassword={showPassword} setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword}
                handleNext={handleNext} handleBack={handleBack}
                isEmailVerified={isEmailVerified}
                setIsEmailVerified={setIsEmailVerified}
                verifiedEmail={verifiedEmail}
                setVerifiedEmail={setVerifiedEmail}
              />
            )}

            {step === 3 && (
              <StepThree
                navigation={navigation}  // ⬅️ ADD THIS LINE
                step={step}
                accountId={accountId}
                setAccountId={setAccountId}
                firstName={firstName}
                middleInitial={middleInitial}
                lastName={lastName}
                birthDate={birthDate}
                calculateAge={calculateAge}
                contactNumber={contactNumber}
                blockNumber={blockNumber}
                lotNumber={lotNumber}
                phaseNumber={phaseNumber}
                email={email}
                selectedId={selectedId}
                idLabels={idLabels}
                password={password}
                frontId={frontId}
                backId={backId}
                agreeTerms={agreeTerms}
                setAgreeTerms={setAgreeTerms}
                agreePrivacy={agreePrivacy}
                setAgreePrivacy={setAgreePrivacy}
                handleNext={handleNext}
                handleBack={handleBack}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Alert Modal */}
      <Modal
        visible={alertModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAlert}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalContainer}>
            <View style={modalStyles.iconContainer}>
              <MaterialCommunityIcons
                name={getAlertIcon().name}
                size={56}
                color={getAlertIcon().color}
              />
            </View>
            
            <Text style={modalStyles.title}>{alertModal.title}</Text>
            <Text style={modalStyles.message}>{alertModal.message}</Text>
            
            <TouchableOpacity 
              style={modalStyles.button}
              onPress={closeAlert}
              activeOpacity={0.8}
            >
              <Text style={modalStyles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  )
}

// Modal Styles
const modalStyles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
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
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#231828',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}