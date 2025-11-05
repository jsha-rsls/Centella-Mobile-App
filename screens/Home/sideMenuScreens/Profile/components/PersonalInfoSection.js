import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useState } from "react"
import styles from "../styles/ProfileStyles"

function FullNameField({ userData, isEditing, updateField }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.labelWithIcon}>
        <Ionicons name="person-outline" size={14} color="#666" />
        <Text style={styles.labelText}>Full Name</Text>
      </View>
      {isEditing ? (
        <View style={styles.fullNameInputContainer}>
          <TextInput
            style={[styles.input, styles.nameInput]}
            value={userData.firstName}
            onChangeText={(text) => updateField("firstName", text)}
            placeholder="First"
          />
          <TextInput
            style={[styles.input, styles.miInput]}
            value={userData.middleInitial}
            onChangeText={(text) => updateField("middleInitial", text)}
            placeholder="M.I."
            maxLength={1}
          />
          <TextInput
            style={[styles.input, styles.nameInput]}
            value={userData.lastName}
            onChangeText={(text) => updateField("lastName", text)}
            placeholder="Last"
          />
        </View>
      ) : (
        <Text style={styles.infoValue}>
          {userData.firstName} {userData.middleInitial}. {userData.lastName}
        </Text>
      )}
    </View>
  )
}

function BirthdateAgeField({ userData, isEditing, updateField }) {
  const [showPicker, setShowPicker] = useState(false)
  const [showAgeInfo, setShowAgeInfo] = useState(false)

  const parseBirthdate = (dateString) => {
    if (!dateString) return new Date()
    const yyyymmdd = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
    if (yyyymmdd) {
      const [, year, month, day] = yyyymmdd
      return new Date(year, month - 1, day)
    }
    const date = new Date(dateString)
    if (!isNaN(date.getTime())) return date
    return new Date()
  }

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === "ios")
    if (event.type === "dismissed") {
      setShowPicker(false)
      return
    }
    if (selectedDate) {
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0")
      const day = String(selectedDate.getDate()).padStart(2, "0")
      const formatted = `${year}-${month}-${day}`
      updateField("birthdate", formatted)

      const today = new Date()
      let age = today.getFullYear() - selectedDate.getFullYear()
      const m = today.getMonth() - selectedDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < selectedDate.getDate())) age--
      updateField("age", age.toString())
    }
  }

  const displayBirthdate = (dateString) => {
    if (!dateString) return "Not set"
    const date = parseBirthdate(dateString)
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
    return dateString
  }

  const handleAgeInfoPress = () => {
    setShowAgeInfo(true)
    setTimeout(() => setShowAgeInfo(false), 3000)
  }

  return (
    <View style={styles.infoRow}>
      <View style={styles.twoColumnRow}>
        <View style={styles.columnLeft}>
          <View style={styles.labelWithIcon}>
            <Ionicons name="calendar-outline" size={14} color="#666" />
            <Text style={styles.labelText}>Birthdate</Text>
          </View>
          {isEditing ? (
            <>
              <TouchableOpacity onPress={() => setShowPicker(true)}>
                <Text style={styles.input}>
                  {userData.birthdate ? displayBirthdate(userData.birthdate) : "Select date"}
                </Text>
              </TouchableOpacity>
              {showPicker && (
                <DateTimePicker
                  value={parseBirthdate(userData.birthdate)}
                  mode="date"
                  display={Platform.OS === "android" ? "spinner" : "default"}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </>
          ) : (
            <Text style={styles.infoValue}>
              {userData.birthdate ? displayBirthdate(userData.birthdate) : "Not set"}
            </Text>
          )}
        </View>

        <View style={styles.columnDivider} />

        <View style={styles.columnRight}>
          <View style={styles.labelWithIcon}>
            <Ionicons name="hourglass-outline" size={14} color="#666" />
            <Text style={styles.labelText}>Age</Text>
          </View>
          {isEditing ? (
            <View style={styles.ageEditContainer}>
              <View style={[styles.input, styles.ageDisplayInput]}>
                <Text style={styles.ageDisplayText}>
                  {userData.age ? `${userData.age}` : "Auto"}
                </Text>
              </View>
              <View style={styles.infoIconContainer}>
                <TouchableOpacity
                  onPress={handleAgeInfoPress}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="information-circle-outline" size={16} color="#666" />
                </TouchableOpacity>
                {showAgeInfo && (
                  <View style={styles.tooltipContainer}>
                    <Text style={styles.tooltipText}>
                      Age auto-updates when you select a birthdate
                    </Text>
                    <View style={styles.tooltipArrow} />
                  </View>
                )}
              </View>
            </View>
          ) : (
            <Text style={styles.infoValue}>
              {userData.age ? `${userData.age} years old` : "Not set"}
            </Text>
          )}
        </View>
      </View>
    </View>
  )
}

function AddressField({ userData, isEditing, updateField }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.labelWithIcon}>
        <Ionicons name="home-outline" size={14} color="#666" />
        <Text style={styles.labelText}>Home Address</Text>
      </View>
      {isEditing ? (
        <View style={styles.addressInputContainer}>
          <View style={styles.addressInputRow}>
            <Text style={styles.addressPrefix}>Block</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              value={userData.block}
              onChangeText={(text) => updateField("block", text)}
              placeholder="#"
            />
          </View>
          <View style={styles.addressInputRow}>
            <Text style={styles.addressPrefix}>Lot</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              value={userData.lot}
              onChangeText={(text) => updateField("lot", text)}
              placeholder="#"
            />
          </View>
          <View style={styles.addressInputRow}>
            <Text style={styles.addressPrefix}>Phase</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              value={userData.phase}
              onChangeText={(text) => updateField("phase", text)}
              placeholder="#"
            />
          </View>
        </View>
      ) : (
        <Text style={styles.infoValue}>
          Block {userData.block}, Lot {userData.lot}, Phase {userData.phase}
        </Text>
      )}
    </View>
  )
}

function InfoField({ label, value, isEditing, onChangeText, placeholder, iconName, ...inputProps }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.labelWithIcon}>
        {iconName && <Ionicons name={iconName} size={14} color="#666" />}
        <Text style={styles.labelText}>{label}</Text>
      </View>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          {...inputProps}
        />
      ) : (
        <Text style={styles.infoValue}>{value}</Text>
      )}
    </View>
  )
}

export default function PersonalInfoSection({ userData, isEditing, updateField }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="information-circle-outline" size={18} color="#2d1b2e" />
        <Text style={styles.sectionTitle}>Personal Information</Text>
      </View>

      <View style={styles.card}>
        <FullNameField userData={userData} isEditing={isEditing} updateField={updateField} />
        <View style={styles.divider} />

        <BirthdateAgeField userData={userData} isEditing={isEditing} updateField={updateField} />
        <View style={styles.divider} />

        <AddressField userData={userData} isEditing={isEditing} updateField={updateField} />
        <View style={styles.divider} />

        {isEditing && (
          <>
            <InfoField
              label="Email Address"
              value={userData.email}
              isEditing={isEditing}
              onChangeText={(text) => updateField("email", text)}
              placeholder="Enter email"
              iconName="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.divider} />
          </>
        )}

        <InfoField
          label="Contact Number"
          value={userData.contactNumber}
          isEditing={isEditing}
          onChangeText={(text) => updateField("contactNumber", text)}
          placeholder="Enter contact number"
          iconName="call-outline"
          keyboardType="phone-pad"
        />
      </View>
    </View>
  )
}