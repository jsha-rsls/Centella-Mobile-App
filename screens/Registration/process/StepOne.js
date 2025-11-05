import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styles from "../RegistrationStyles";
import IncompleteAlert from "../components/incompleteAlert";

export default function StepOne({
  lastName, setLastName,
  firstName, setFirstName,
  middleInitial, setMiddleInitial,
  birthDate, setBirthDate,
  age, setAge,
  showDatePicker, setShowDatePicker,
  contactNumber, setContactNumber,
  blockNumber, setBlockNumber,
  lotNumber, setLotNumber,
  phaseNumber, setPhaseNumber,
  calculateAge,
  handleNext,
  navigation
}) {
  const [showAlert, setShowAlert] = useState(false);

  const validateAndNext = () => {
    const isValid = firstName?.trim() &&
      lastName?.trim() &&
      birthDate &&
      contactNumber?.trim() &&
      blockNumber?.trim() &&
      lotNumber?.trim() &&
      phaseNumber?.trim();

    if (!isValid) {
      setShowAlert(true);
      return;
    }

    handleNext();
  };

  const handleDateConfirm = (selectedDate) => {
    setBirthDate(selectedDate);
    setAge(calculateAge(selectedDate).toString());
    setShowDatePicker(false);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
  };

  const formatDisplayDate = (date) => {
    if (!date) return "Select Birth Date";
    
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate date limits
  const getMaxDate = () => {
    return new Date(); // Today
  };

  const getMinDate = () => {
    const today = new Date();
    return new Date(today.getFullYear() - 100, 0, 1); // 100 years ago
  };

  const getDefaultDate = () => {
    if (birthDate) return birthDate;
    
    // Default to 25 years ago for better UX
    const today = new Date();
    return new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
  };

  return (
    <>
      <Text style={styles.cardTitle}>Basic Information</Text>

      {/* Full Name */}
      <Text style={styles.sectionLabel}>Full Name</Text>
      <View style={styles.fullNameRow}>
        <TextInput
          style={[styles.input, styles.flexInput]}
          placeholder="Last Name"
          placeholderTextColor="#8C8585"
          value={lastName}
          onChangeText={(text) => setLastName(text.replace(/[^a-zA-Z]/g, ""))}
        />
        <TextInput
          style={[styles.input, styles.flexInput]}
          placeholder="First Name"
          placeholderTextColor="#8C8585"
          value={firstName}
          onChangeText={(text) => setFirstName(text.replace(/[^a-zA-Z]/g, ""))}
        />
        <TextInput
          style={[styles.input, styles.middleInitialInput]}
          placeholder="M.I."
          placeholderTextColor="#8C8585"
          value={middleInitial}
          onChangeText={(text) =>
            setMiddleInitial(
              text.replace(/[^a-zA-Z]/g, "").slice(0, 1).toUpperCase()
            )
          }
          maxLength={1}
        />
      </View>

      {/* Birth Date & Age - Combined Row */}
      <View style={styles.birthDateAgeRow}>
        <View style={styles.birthDateColumn}>
          <Text style={styles.sectionLabel}>Birth Date</Text>
          <TouchableOpacity
            style={[styles.input, { justifyContent: "center" }]}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <Text style={{ 
              color: birthDate ? '#333' : '#8C8585',
              fontSize: 14,
              fontWeight: birthDate ? '500' : '400'
            }}>
              {formatDisplayDate(birthDate)}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ageColumn}>
          <Text style={styles.sectionLabel}>Age</Text>
          <TextInput
            style={[styles.input, styles.ageInputCompact]}
            placeholder="Age"
            placeholderTextColor="#8C8585"
            value={age}
            editable={false}
          />
        </View>
      </View>

      {/* Modern Date Picker Modal */}
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        locale="en_US"
        date={getDefaultDate()}
        maximumDate={getMaxDate()}
        minimumDate={getMinDate()}
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
        headerTextIOS="Select Birth Date"
        confirmTextIOS="Confirm"
        cancelTextIOS="Cancel"
        buttonTextColorIOS="#231828"
        pickerContainerStyleIOS={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
        }}
        modalStyleIOS={{
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
        customHeaderIOS={() => (
          <View style={{
            backgroundColor: '#ffffff',
            paddingVertical: 15,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0'
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              textAlign: 'center',
              color: '#231828'
            }}>
              Select Birth Date
            </Text>
          </View>
        )}
        display="spinner"
        themeVariant="light"
      />

      {/* Contact & Address - Combined Section */}
      <Text style={styles.sectionLabel}>Contact & Address</Text>
      <TextInput
        style={[styles.input, styles.inputCompact]}
        placeholder="Contact Number (e.g., 09123456789)"
        placeholderTextColor="#8C8585"
        value={contactNumber}
        onChangeText={(text) => {
          const cleaned = text.replace(/[^0-9]/g, "").slice(0, 11);
          setContactNumber(cleaned);
        }}
        keyboardType="phone-pad"
        maxLength={11}
      />

      <View style={styles.homeAddressRow}>
        <TextInput
          style={[styles.input, styles.homeAddressInput, styles.inputCompact]}
          placeholder="Block #"
          placeholderTextColor="#8C8585"
          value={blockNumber}
          onChangeText={setBlockNumber}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.homeAddressInput, styles.inputCompact]}
          placeholder="Lot #"
          placeholderTextColor="#8C8585"
          value={lotNumber}
          onChangeText={setLotNumber}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.homeAddressInputLast, styles.inputCompact]}
          placeholder="Phase #"
          placeholderTextColor="#8C8585"
          value={phaseNumber}
          onChangeText={setPhaseNumber}
          keyboardType="numeric"
        />
      </View>

      {/* Navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.stepButton, styles.fullButton]}
          onPress={validateAndNext}
          activeOpacity={0.8}
        >
          <Text style={styles.stepButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Already registered link - Match Login style */}
      <View style={styles.loginLinkContainer}>
        <Text style={styles.loginLinkText}>Already have an account?</Text>
        <TouchableOpacity 
          onPress={() => navigation.pop()}
          activeOpacity={0.5}
          style={{ paddingHorizontal: 8, paddingVertical: 4 }}
        >
          <Text style={styles.loginLink}>Login here</Text>
          <View style={styles.loginLinkUnderline} />
        </TouchableOpacity>
      </View>

      {/* Custom Alert */}
      <IncompleteAlert
        visible={showAlert}
        onClose={() => setShowAlert(false)}
        title="Incomplete Form"
        message="Please fill in all required fields to continue."
      />
    </>
  );
}