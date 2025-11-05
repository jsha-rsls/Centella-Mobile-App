import { View, ScrollView, Animated, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import { useState, useRef, useEffect } from "react"
import styles from "./styles/ProfileStyles"

// Import components
import ProfileHeader from "./components/ProfileHeader"
import ProfileAvatar from "./components/ProfileAvatar"
import EditButton from "./components/EditButton"
import PersonalInfoSection from "./components/PersonalInfoSection"
import SettingsSection from "./components/SettingsSection"
import SkeletonLoader from "./components/SkeletonLoader"

// Import services
import { getResidentProfile, updateResidentProfile, getCurrentUser } from "../../../../services/residentService"

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const [isEditing, setIsEditing] = useState(false)
  const [showAccountId, setShowAccountId] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current
  const slideAnim = useRef(new Animated.Value(0)).current

  const [userData, setUserData] = useState({
    firstName: "",
    middleInitial: "",
    lastName: "",
    birthdate: "",
    age: 0,
    block: "",
    lot: "",
    phase: "",
    email: "",
    accountId: "",
    contactNumber: "",
    status: "unverified",
    verifiedAt: null,
    verifiedBy: null
  })

  // Separate state for editing - changes here won't affect displayed data until saved
  const [editData, setEditData] = useState({ ...userData })

  // Fetch user data on component mount
  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get current authenticated user
      const user = await getCurrentUser()
      if (!user) {
        setError("No authenticated user found")
        setIsLoading(false)
        return
      }

      // Fetch resident profile
      const profile = await getResidentProfile(user.id)
      if (!profile) {
        setError("Failed to load profile data")
        setIsLoading(false)
        return
      }

      setUserData(profile)
      setEditData(profile)
      setIsLoading(false)
    } catch (err) {
      console.error("Error loading profile:", err)
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  const updateField = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  const handleEdit = () => {
    // Copy current userData to editData when starting to edit
    setEditData({ ...userData })
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) {
        console.error("No authenticated user found")
        return
      }

      // Save to Supabase
      const updatedProfile = await updateResidentProfile(user.id, editData)
      
      if (updatedProfile) {
        // Apply changes from editData to userData
        setUserData(updatedProfile)
        setIsEditing(false)
        console.log("Profile updated successfully")
      } else {
        console.error("Failed to update profile")
        // Optionally show an error message to the user
      }
    } catch (err) {
      console.error("Error saving profile:", err)
      // Optionally show an error message to the user
    }
  }

  const handleCancel = () => {
    // Discard changes - reset editData to current userData
    setEditData({ ...userData })
    setIsEditing(false)
  }

  const toggleSettings = () => {
    if (isEditing) {
      // If currently editing, cancel edit mode first
      handleCancel()
    }
    
    // Animate transition
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSettings(!showSettings)
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    })
  }

  // Error state
  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <ExpoStatusBar style="auto" translucent={true} />
        <Text style={{ color: '#d32f2f', fontSize: 16, textAlign: 'center', marginBottom: 16 }}>
          {error}
        </Text>
        <TouchableOpacity 
          onPress={loadUserProfile}
          style={{ 
            backgroundColor: '#2d1b2e', 
            paddingHorizontal: 24, 
            paddingVertical: 12, 
            borderRadius: 8 
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { borderWidth: 0 }]}>
        <ExpoStatusBar style="dark" translucent={true} />
        
        <ProfileHeader 
          navigation={navigation} 
          insets={insets}
          showSettings={showSettings}
          onToggleSettings={toggleSettings}
        />

        <ScrollView 
          style={[styles.scrollView, { backgroundColor: '#eeeff0ff' }]}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 16 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <>
              <ProfileAvatar 
                userData={userData}
                showAccountId={showAccountId}
                onToggleAccountId={() => setShowAccountId(!showAccountId)}
              />

              {!showSettings && (
                <>
                  <EditButton
                    isEditing={isEditing}
                    onEdit={handleEdit}
                    onCancel={handleCancel}
                    onSave={handleSave}
                  />

                  <Animated.View 
                    style={{
                      opacity: fadeAnim,
                      transform: [{ translateY: slideAnim }]
                    }}
                  >
                    <PersonalInfoSection 
                      userData={isEditing ? editData : userData}
                      isEditing={isEditing}
                      updateField={updateField}
                    />
                  </Animated.View>
                </>
              )}

              {showSettings && (
                <Animated.View 
                  style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                  }}
                >
                  <SettingsSection />
                </Animated.View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}