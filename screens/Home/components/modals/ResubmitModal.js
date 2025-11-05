import React, { useState, useEffect, useRef, useMemo, useCallback, useReducer, memo } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import DropDownPicker from 'react-native-dropdown-picker'
import { CameraCapture } from '../../../Registration/process/coreFunction/camera.js'
import { resubmitVerification } from '../../../../services/resubmitService.js'
import { getCurrentUser } from '../../../../services/residentService.js'

const { width: screenWidth } = Dimensions.get('window')

const analyzeRejectionReason = (reason) => {
  if (!reason) return 'both'
  
  const lowerReason = reason.toLowerCase()
  
  const idKeywords = [
    'id', 'photo', 'image', 'picture', 'blurry', 'unclear', 
    'illegible', 'expired', 'invalid id', 'fake', 'damaged',
    'front id', 'back id', 'identification', 'document'
  ]
  
  const infoKeywords = [
    'name', 'address', 'block', 'lot', 'phase', 'contact',
    'phone', 'number', 'birth', 'age', 'information',
    'details', 'incorrect', 'mismatch', 'wrong', 'missing'
  ]
  
  const hasIdIssue = idKeywords.some(keyword => lowerReason.includes(keyword))
  const hasInfoIssue = infoKeywords.some(keyword => lowerReason.includes(keyword))
  
  if (hasIdIssue && hasInfoIssue) return 'both'
  if (hasIdIssue) return 'id'
  if (hasInfoIssue) return 'info'
  
  return 'both'
}

const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ALL':
      return { ...state, ...action.payload }
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value }
    case 'RESET':
      return action.payload
    default:
      return state
  }
}

const RejectionReasonCard = memo(({ rejectionReason }) => (
  <View style={styles.rejectionCard}>
    <View style={styles.rejectionHeader}>
      <Ionicons name="alert-circle" size={18} color="#dc2626" />
      <Text style={styles.rejectionTitle}>Previous Rejection Reason</Text>
    </View>
    <Text style={styles.rejectionText}>
      {rejectionReason || 'Your submission did not meet our verification requirements.'}
    </Text>
  </View>
))

RejectionReasonCard.displayName = 'RejectionReasonCard'

const InstructionCard = memo(({ resubmitType }) => {
  const instructionText = useMemo(() => {
    switch (resubmitType) {
      case 'id':
        return 'Please recapture your ID photos with better quality.'
      case 'info':
        return 'Please update your personal information.'
      case 'both':
        return 'Please update your information and recapture your ID photos.'
      default:
        return 'Please complete the required fields.'
    }
  }, [resubmitType])

  return (
    <View style={styles.instructionCard}>
      <Ionicons name="information-circle" size={20} color="#2563eb" />
      <Text style={styles.instructionText}>{instructionText}</Text>
    </View>
  )
})

InstructionCard.displayName = 'InstructionCard'

const FormTextInput = memo(({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  required = false,
  keyboardType = 'default',
  maxLength,
  editable = true,
  errorMessage,
}) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.label}>
      {label} {required && <Text style={styles.requiredStar}>*</Text>}
    </Text>
    <TextInput
      style={[styles.input, errorMessage && styles.inputError, !editable && styles.inputDisabled]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#999"
      keyboardType={keyboardType}
      maxLength={maxLength}
      editable={editable}
    />
    {errorMessage && (
      <Text style={styles.errorText}>
        <Ionicons name="alert-circle" size={12} color="#dc2626" /> {errorMessage}
      </Text>
    )}
  </View>
))

FormTextInput.displayName = 'FormTextInput'

const PersonalInfoSection = memo(({ 
  formState, 
  dispatch,
  errors,
}) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Ionicons name="person-outline" size={20} color="#2d1b2e" />
      <Text style={styles.sectionTitle}>Personal Information</Text>
    </View>
    
    <FormTextInput
      label="First Name"
      value={formState.firstName}
      onChangeText={(text) => dispatch({ type: 'UPDATE_FIELD', field: 'firstName', value: text })}
      placeholder="Enter first name"
      required
      errorMessage={errors.firstName}
    />
    
    <FormTextInput
      label="Middle Initial"
      value={formState.middleInitial}
      onChangeText={(text) => dispatch({ type: 'UPDATE_FIELD', field: 'middleInitial', value: text.slice(0, 2) })}
      placeholder="M.I. (optional)"
      maxLength={2}
    />
    
    <FormTextInput
      label="Last Name"
      value={formState.lastName}
      onChangeText={(text) => dispatch({ type: 'UPDATE_FIELD', field: 'lastName', value: text })}
      placeholder="Enter last name"
      required
      errorMessage={errors.lastName}
    />
    
    <FormTextInput
      label="Contact Number"
      value={formState.contactNumber}
      onChangeText={(text) => dispatch({ type: 'UPDATE_FIELD', field: 'contactNumber', value: text })}
      placeholder="09xxxxxxxxx"
      keyboardType="phone-pad"
      required
      errorMessage={errors.contactNumber}
    />
    
    <View style={styles.addressRow}>
      <View style={[styles.addressField, { flex: 0.6 }]}>
        <FormTextInput
          label="Block"
          value={formState.blockNumber}
          onChangeText={(text) => dispatch({ type: 'UPDATE_FIELD', field: 'blockNumber', value: text })}
          placeholder="Block"
          required
          errorMessage={errors.blockNumber}
        />
      </View>
      
      <View style={[styles.addressField, { flex: 0.5 }]}>
        <FormTextInput
          label="Lot"
          value={formState.lotNumber}
          onChangeText={(text) => dispatch({ type: 'UPDATE_FIELD', field: 'lotNumber', value: text })}
          placeholder="Lot"
          required
          errorMessage={errors.lotNumber}
        />
      </View>
      
      <View style={[styles.addressField, { flex: 0.5 }]}>
        <FormTextInput
          label="Phase"
          value={formState.phaseNumber}
          onChangeText={(text) => dispatch({ type: 'UPDATE_FIELD', field: 'phaseNumber', value: text })}
          placeholder="Phase"
          required
          errorMessage={errors.phaseNumber}
        />
      </View>
    </View>
  </View>
))

PersonalInfoSection.displayName = 'PersonalInfoSection'

const IdVerificationSection = memo(({ 
  formState, 
  dispatch,
  idOptions,
  errors,
}) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(null)

  useEffect(() => {
    setValue(formState.selectedId)
  }, [formState.selectedId])

  const selectedLabel = useMemo(() => {
    if (!formState.selectedId) return null
    const item = idOptions.find(opt => opt.value === formState.selectedId)
    return item ? item.label : null
  }, [formState.selectedId, idOptions])

  const handleSelectId = useCallback((callback) => {
    setValue(callback)
    const newValue = typeof callback === 'function' ? callback(value) : callback
    dispatch({ type: 'UPDATE_FIELD', field: 'selectedId', value: newValue })
  }, [dispatch, value])

  const handleClearId = useCallback(() => {
    setValue(null)
    dispatch({ type: 'UPDATE_FIELD', field: 'selectedId', value: null })
  }, [dispatch])

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="card-outline" size={20} color="#2d1b2e" />
        <Text style={styles.sectionTitle}>ID Verification</Text>
      </View>
      
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          Select ID Type <Text style={styles.requiredStar}>*</Text>
        </Text>
        
        {selectedLabel ? (
          <View style={styles.selectedIdBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
            <Text style={styles.selectedIdText}>{selectedLabel}</Text>
            <TouchableOpacity 
              onPress={handleClearId}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        ) : (
          <DropDownPicker
            open={open}
            value={value}
            items={idOptions}
            setOpen={setOpen}
            setValue={handleSelectId}
            placeholder="Select ID Type"
            style={styles.picker}
            dropDownContainerStyle={styles.pickerDropdown}
            listMode="SCROLLVIEW"
            zIndex={3000}
            zIndexInverse={1000}
            scrollViewProps={{
              scrollIndicatorInsets: { right: 1 },
              showsVerticalScrollIndicator: true,
            }}
          />
        )}
        
        {errors.selectedId && (
          <Text style={styles.errorText}>
            <Ionicons name="alert-circle" size={12} color="#dc2626" /> {errors.selectedId}
          </Text>
        )}
      </View>
      
      <Text style={[styles.label, { marginTop: 16 }]}>
        Capture ID Photos <Text style={styles.requiredStar}>*</Text>
      </Text>
      <Text style={styles.helperText}>
        Ensure your ID is clear, readable, and not expired
      </Text>
      
      <View style={styles.uploadRow}>
        <CameraCapture
          frontId={formState.frontId}
          setFrontId={(id) => dispatch({ type: 'UPDATE_FIELD', field: 'frontId', value: id })}
          backId={formState.backId}
          setBackId={(id) => dispatch({ type: 'UPDATE_FIELD', field: 'backId', value: id })}
          selectedId={formState.selectedId}
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
      {errors.frontId && (
        <Text style={styles.errorText}>
          <Ionicons name="alert-circle" size={12} color="#dc2626" /> {errors.frontId}
        </Text>
      )}
    </View>
  )
})

IdVerificationSection.displayName = 'IdVerificationSection'

const HeaderSection = memo(({ userName }) => (
  <View style={styles.header}>
    <View style={styles.iconContainer}>
      <Ionicons name="refresh-circle" size={48} color="#2d1b2e" />
    </View>
    <Text style={styles.title}>Resubmit Verification</Text>
    <Text style={styles.subtitle}>Hi {userName},</Text>
  </View>
))

HeaderSection.displayName = 'HeaderSection'

const ButtonSection = memo(({ isSubmitting, onCancel, onSubmit }) => (
  <View style={styles.buttonContainer}>
    <TouchableOpacity
      style={[styles.button, styles.cancelButton]}
      onPress={onCancel}
      activeOpacity={0.8}
      disabled={isSubmitting}
    >
      <Text style={styles.cancelButtonText}>Cancel</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[
        styles.button, 
        styles.submitButton,
        isSubmitting && styles.submitButtonDisabled
      ]}
      onPress={onSubmit}
      activeOpacity={0.8}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={18} color="#ffffff" />
          <Text style={styles.submitButtonText}>Submitting...</Text>
        </View>
      ) : (
        <Text style={styles.submitButtonText}>Submit</Text>
      )}
    </TouchableOpacity>
  </View>
))

ButtonSection.displayName = 'ButtonSection'

const initialFormState = {
  firstName: '',
  middleInitial: '',
  lastName: '',
  contactNumber: '',
  blockNumber: '',
  lotNumber: '',
  phaseNumber: '',
  selectedId: null,
  frontId: null,
  backId: null,
  resubmitType: 'both',
}

const idOptions = [
  { label: 'National ID', value: 'national_id' },
  { label: 'Driver\'s License', value: 'drivers_license' },
  { label: 'Passport', value: 'passport' },
  { label: 'SSS ID', value: 'sss_id' },
  { label: 'UMID', value: 'umid' },
  { label: 'PhilHealth ID', value: 'philhealth_id' },
  { label: 'Postal ID', value: 'postal_id' },
  { label: 'Voter\'s ID', value: 'voters_id' },
]

export default function ResubmitModal({ 
  visible, 
  onDismiss,
  onSuccess,
  userName = 'Resident',
  rejectionReason = null,
  currentProfile = null,
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current
  const [formState, dispatch] = useReducer(formReducer, initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (visible) {
      const type = analyzeRejectionReason(rejectionReason)
      
      dispatch({
        type: 'SET_ALL',
        payload: {
          ...initialFormState,
          resubmitType: type,
          firstName: currentProfile?.firstName || '',
          middleInitial: currentProfile?.middleInitial || '',
          lastName: currentProfile?.lastName || '',
          contactNumber: currentProfile?.contactNumber || '',
          blockNumber: currentProfile?.block || '',
          lotNumber: currentProfile?.lot || '',
          phaseNumber: currentProfile?.phase || '',
          selectedId: currentProfile?.idType || null,
        }
      })

      setErrors({})
      scaleAnim.setValue(0)
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start()
    }
  }, [visible, currentProfile, rejectionReason, scaleAnim])

  const validateForm = useCallback(() => {
    const newErrors = {}
    
    if (formState.resubmitType === 'info' || formState.resubmitType === 'both') {
      if (!formState.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formState.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!formState.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required'
      if (!formState.blockNumber.trim()) newErrors.blockNumber = 'Block is required'
      if (!formState.lotNumber.trim()) newErrors.lotNumber = 'Lot is required'
      if (!formState.phaseNumber.trim()) newErrors.phaseNumber = 'Phase is required'
    }
    
    if (formState.resubmitType === 'id' || formState.resubmitType === 'both') {
      if (!formState.selectedId) newErrors.selectedId = 'Please select an ID type'
      if (!formState.frontId || !formState.backId) newErrors.frontId = 'Both ID photos are required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formState])

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      Alert.alert(
        'Validation Error',
        'Please correct the errors below before submitting.'
      )
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const user = await getCurrentUser()
      if (!user) {
        throw new Error('User not authenticated')
      }
      
      const updateData = {
        resubmitType: formState.resubmitType,
      }
      
      if (formState.resubmitType === 'info' || formState.resubmitType === 'both') {
        updateData.personalInfo = {
          firstName: formState.firstName.trim(),
          middleInitial: formState.middleInitial.trim(),
          lastName: formState.lastName.trim(),
          contactNumber: formState.contactNumber.trim(),
          blockNumber: formState.blockNumber.trim(),
          lotNumber: formState.lotNumber.trim(),
          phaseNumber: formState.phaseNumber.trim(),
        }
      }
      
      if (formState.resubmitType === 'id' || formState.resubmitType === 'both') {
        updateData.idInfo = {
          idType: formState.selectedId,
          frontIdUri: formState.frontId,
          backIdUri: formState.backId,
        }
      }
      
      const result = await resubmitVerification(user.id, updateData)
      
      if (result.success) {
        // First dismiss the modal
        onDismiss()
        
        // Then show success alert after a short delay
        setTimeout(() => {
          Alert.alert(
            'Resubmission Successful',
            'Your updated information has been submitted for review. You will be notified once the verification is complete.',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (onSuccess) onSuccess()
                }
              }
            ]
          )
        }, 300)
      } else {
        throw new Error(result.error || 'Resubmission failed')
      }
    } catch (error) {
      console.error('Resubmission error:', error)
      Alert.alert(
        'Resubmission Failed',
        error.message || 'Failed to submit your updated information. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }, [formState, validateForm, onSuccess, onDismiss])

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <StatusBar
        backgroundColor="rgba(0, 0, 0, 0.5)"
        barStyle="light-content"
        translucent
      />
      <View style={styles.overlay}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill}>
          <View style={styles.modalContainer}>
            <Animated.View 
              style={[
                styles.modalContent,
                {
                  transform: [{ scale: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  })}],
                }
              ]}
            >
              <HeaderSection userName={userName} />
              <RejectionReasonCard rejectionReason={rejectionReason} />
              <InstructionCard resubmitType={formState.resubmitType} />

              <ScrollView 
                style={styles.formScroll}
                contentContainerStyle={styles.formScrollContent}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {(formState.resubmitType === 'info' || formState.resubmitType === 'both') && (
                  <PersonalInfoSection 
                    formState={formState}
                    dispatch={dispatch}
                    errors={errors}
                  />
                )}
                
                {(formState.resubmitType === 'id' || formState.resubmitType === 'both') && (
                  <IdVerificationSection 
                    formState={formState}
                    dispatch={dispatch}
                    idOptions={idOptions}
                    errors={errors}
                  />
                )}
              </ScrollView>

              <ButtonSection 
                isSubmitting={isSubmitting}
                onCancel={onDismiss}
                onSubmit={handleSubmit}
              />
            </Animated.View>
          </View>
        </BlurView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: Math.min(screenWidth - 40, 420),
    maxHeight: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 15,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
  rejectionCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  rejectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rejectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#991b1b',
    marginLeft: 6,
  },
  rejectionText: {
    fontSize: 13,
    color: '#7f1d1d',
    lineHeight: 18,
  },
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  instructionText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    marginLeft: 8,
    lineHeight: 18,
  },
  formScroll: {
    maxHeight: 380,
    marginBottom: 16,
  },
  formScrollContent: {
    paddingBottom: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d1b2e',
    marginLeft: 8,
  },
  inputWrapper: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  requiredStar: {
    color: '#dc2626',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
  },
  inputError: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    opacity: 0.6,
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
    fontWeight: '500',
  },
  addressRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addressField: {
    flex: 1,
  },
  picker: {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
    borderRadius: 8,
    minHeight: 44,
    borderWidth: 1,
  },
  pickerDropdown: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderRadius: 8,
    maxHeight: 300,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  uploadRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  cameraButton: {
    flex: 1,
    height: 120,
    backgroundColor: '#f0fdfa',
    borderWidth: 2,
    borderColor: '#2a9d8f',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  cameraButtonDisabled: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  cameraButtonText: {
    fontSize: 12,
    color: '#2a9d8f',
    marginTop: 6,
    fontWeight: '500',
    textAlign: 'center',
  },
  cameraButtonTextDisabled: {
    color: '#9ca3af',
  },
  photoPreviewContainer: {
    flex: 1,
    height: 120,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoActions: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    gap: 6,
  },
  retakeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(42, 157, 143, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(220, 38, 38, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoLabel: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4b5563',
  },
  submitButton: {
    backgroundColor: '#2d1b2e',
    shadowColor: '#2d1b2e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectedIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  selectedIdText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#15803d',
    flex: 1,
  },
  clearButton: {
    padding: 4,
  },
})