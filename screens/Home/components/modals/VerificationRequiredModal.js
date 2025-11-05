import React, { useState, useEffect, useCallback, useMemo, memo } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { getCurrentUser } from '../../../../services/residentService'
import { getResidentVerificationStatus } from '../../../../services/residentVerificationService'
import RejectedModal from './RejectedModal'
import ResubmitModal from './ResubmitModal'

const { width: screenWidth } = Dimensions.get('window')

// Memoized status card component
const StatusCard = memo(({ status, rejectionReason, onViewReason }) => {
  const statusCardStyle = useMemo(() => {
    if (status === 'rejected') {
      return {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
      }
    }
    return {
      backgroundColor: '#fef3c7',
      borderColor: '#fde68a',
    }
  }, [status])

  const statusDotColor = useMemo(() => {
    if (status === 'rejected') return '#dc2626'
    return '#f59e0b'
  }, [status])

  const statusTextColor = useMemo(() => {
    if (status === 'rejected') return '#991b1b'
    return '#92400e'
  }, [status])

  const statusText = useMemo(() => {
    if (status === 'rejected') return 'Verification Declined'
    return 'Pending Verification'
  }, [status])

  const statusSubtext = useMemo(() => {
    if (status === 'rejected') {
      return 'Your verification was declined by the HOA administrators.'
    }
    return 'Your account is currently being reviewed by our HOA administrators.'
  }, [status])

  return (
    <View style={[styles.statusCard, statusCardStyle]}>
      <View style={styles.statusHeader}>
        <View style={[styles.statusDot, { backgroundColor: statusDotColor }]} />
        <Text style={styles.statusTitle}>Account Status</Text>
      </View>
      <Text style={[styles.statusText, { color: statusTextColor }]}>
        {statusText}
      </Text>
      <Text style={[styles.statusSubtext, { color: statusTextColor }]}>
        {statusSubtext}
      </Text>

      {status === 'rejected' && (
        <TouchableOpacity
          style={styles.viewReasonButton}
          onPress={onViewReason}
          activeOpacity={0.7}
        >
          <Ionicons name="alert-circle-outline" size={16} color="#991b1b" />
          <Text style={styles.viewReasonText}>View Decline Reason</Text>
          <Ionicons name="chevron-forward" size={16} color="#991b1b" />
        </TouchableOpacity>
      )}
    </View>
  )
})

StatusCard.displayName = 'StatusCard'

// Memoized info box for pending status
const InfoBox = memo(({ status }) => {
  if (status === 'rejected') return null

  return (
    <View style={styles.infoBox}>
      <Ionicons name="time-outline" size={20} color="#6b7280" />
    <Text style={styles.infoText}>
      Verification usually takes around 5–30 minutes. Please wait while we review your account.
    </Text>
    </View>
  )
})

InfoBox.displayName = 'InfoBox'

// Memoized button and help link
const ActionSection = memo(({ onClose }) => (
  <>
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={onClose}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>I Understand</Text>
      </TouchableOpacity>
    </View>
  </>
))

ActionSection.displayName = 'ActionSection'

export default function VerificationRequiredModal({ 
  visible, 
  onClose,
  featureName = 'Facility Reservations'
}) {
  const [status, setStatus] = useState('unverified')
  const [rejectionReason, setRejectionReason] = useState(null)
  const [userName, setUserName] = useState('Resident')
  const [currentProfile, setCurrentProfile] = useState(null)
  const [showRejectedModal, setShowRejectedModal] = useState(false)
  const [showResubmitModal, setShowResubmitModal] = useState(false)
  const [isLoadingStatus, setIsLoadingStatus] = useState(false)

  // Memoize feature message to prevent recalculation
  const featureMessage = useMemo(
    () => `${featureName} is only available to verified residents.`,
    [featureName]
  )

  const fetchVerificationStatus = useCallback(async () => {
    try {
      setIsLoadingStatus(true)
      const user = await getCurrentUser()
      if (!user) {
        setIsLoadingStatus(false)
        return
      }

      const { status: verificationStatus, rejectionReason: reason, profile } = await getResidentVerificationStatus(user.id)
      
      // Batch state updates using a single setState call pattern
      setStatus(verificationStatus)
      setRejectionReason(reason)
      setUserName(profile?.firstName || 'Resident')
      setCurrentProfile(profile)
      setIsLoadingStatus(false)
    } catch (error) {
      console.error('Error fetching verification status:', error)
      setIsLoadingStatus(false)
    }
  }, [])

  useEffect(() => {
    if (visible) {
      fetchVerificationStatus()
    }
  }, [visible, fetchVerificationStatus])

  // Memoize modal transition handlers to prevent recreation
  const handleViewRejectionReason = useCallback(() => {
    onClose()
    setTimeout(() => {
      setShowRejectedModal(true)
    }, 300)
  }, [onClose])

  const handleCloseRejectedModal = useCallback(() => {
    setShowRejectedModal(false)
  }, [])

  const handleOpenResubmit = useCallback(() => {
    setShowRejectedModal(false)
    setTimeout(() => {
      setShowResubmitModal(true)
    }, 300)
  }, [])

  const handleCloseResubmit = useCallback(() => {
    setShowResubmitModal(false)
  }, [])

  const handleResubmitSuccess = useCallback(async () => {
    await fetchVerificationStatus()
  }, [fetchVerificationStatus])

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
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
              <View style={styles.modalContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="lock-closed" size={40} color="#dc2626" />
                </View>

                <Text style={styles.title}>Verification Required</Text>

                <Text style={styles.message}>
                  {featureMessage}
                </Text>

                {/* Status card - memoized */}
                <StatusCard 
                  status={status}
                  rejectionReason={rejectionReason}
                  onViewReason={handleViewRejectionReason}
                />

                {/* Info box - memoized, only shows for pending status */}
                <InfoBox status={status} />

                {/* Action section - memoized */}
                <ActionSection onClose={onClose} />
              </View>
            </View>
          </BlurView>
        </View>
      </Modal>

      {/* Child modals */}
      <RejectedModal
        visible={showRejectedModal}
        onDismiss={handleCloseRejectedModal}
        onResubmit={handleOpenResubmit}
        userName={userName}
        rejectionReason={rejectionReason}
      />

      <ResubmitModal
        visible={showResubmitModal}
        onDismiss={handleCloseResubmit}
        onSuccess={handleResubmitSuccess}
        userName={userName}
        rejectionReason={rejectionReason}
        currentProfile={currentProfile}
      />
    </>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: Math.min(screenWidth - 40, 380),
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  statusCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusSubtext: {
    fontSize: 13,
    lineHeight: 18,
  },
  viewReasonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  viewReasonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#991b1b',
    marginLeft: 6,
    marginRight: 4,
    flex: 1,
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  buttonContainer: {
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#2d1b2e',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#2d1b2e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  helpLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
})