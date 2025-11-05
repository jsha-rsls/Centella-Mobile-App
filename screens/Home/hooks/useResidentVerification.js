import { useState, useEffect, useRef, useCallback } from 'react'
import { getCurrentUser } from '../../../services/residentService'
import { 
  getResidentVerificationStatus,
  shouldShowWelcomeModal,
  markWelcomeModalShown
} from '../../../services/residentVerificationService'

export const useResidentVerification = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [showVerifiedModal, setShowVerifiedModal] = useState(false)
  const [showRejectedModal, setShowRejectedModal] = useState(false)
  const [residentProfile, setResidentProfile] = useState(null)
  const [isVerified, setIsVerified] = useState(false)
  const [rejectionReason, setRejectionReason] = useState(null)
  const previousVerificationStatus = useRef(null)
  const isRefreshing = useRef(false) // Flag to prevent modal re-trigger on manual refresh

  useEffect(() => {
    checkVerificationAndModals()
    
    // Set up polling to check verification status every 10 seconds
    const intervalId = setInterval(() => {
      checkVerificationStatus()
    }, 10000) // Check every 10 seconds

    return () => clearInterval(intervalId)
  }, [])

  const checkVerificationAndModals = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) return

      // Check if welcome modal should be shown
      const shouldShowWelcome = await shouldShowWelcomeModal(user.id)
      
      // Get verification status
      const verificationData = await getResidentVerificationStatus(user.id)
      const { status, isVerified: verified, rejectionReason: reason, profile } = verificationData
      
      setResidentProfile(profile)
      setIsVerified(verified)
      
      // Set rejection reason directly from profile if available
      const finalReason = reason || profile?.rejectionReason || null
      setRejectionReason(finalReason)
      
      // Initialize previous status
      if (previousVerificationStatus.current === null) {
        previousVerificationStatus.current = status
      }

      // Show welcome modal for unverified users who haven't seen it
      if (shouldShowWelcome && !verified && status === 'unverified') {
        setShowWelcomeModal(true)
      }
    } catch (error) {
      console.error('Error checking verification and modals:', error)
    }
  }

  const checkVerificationStatus = async () => {
    // Skip checking if we're in the middle of a manual refresh
    if (isRefreshing.current) {
      return
    }

    try {
      const user = await getCurrentUser()
      if (!user) return

      const verificationData = await getResidentVerificationStatus(user.id)
      const { status, isVerified: verified, rejectionReason: reason, profile } = verificationData
      
      setResidentProfile(profile)

      // Check if verification status changed from unverified/pending to verified
      if ((previousVerificationStatus.current === 'unverified' || previousVerificationStatus.current === 'pending') 
          && status === 'verified') {
        setIsVerified(true)
        setShowVerifiedModal(true)
      }

      // Check if verification status changed to rejected
      if ((previousVerificationStatus.current === 'unverified' || previousVerificationStatus.current === 'pending')
          && status === 'rejected') {
        // Get rejection reason from multiple possible sources
        const finalReason = reason || profile?.rejectionReason || 'Your submission did not meet our verification requirements.'
        
        setIsVerified(false)
        setRejectionReason(finalReason)
        setShowRejectedModal(true)
      }

      // Update previous status
      previousVerificationStatus.current = status
      setIsVerified(verified)
    } catch (error) {
      console.error('Error checking verification status:', error)
    }
  }

  // Manual refresh function for after resubmission
  const refreshProfile = useCallback(async () => {
    try {
      // Set flag to prevent modal re-trigger
      isRefreshing.current = true

      const user = await getCurrentUser()
      if (!user) {
        isRefreshing.current = false
        return
      }

      const verificationData = await getResidentVerificationStatus(user.id)
      const { status, isVerified: verified, rejectionReason: reason, profile } = verificationData
      
      setResidentProfile(profile)
      setIsVerified(verified)
      
      const finalReason = reason || profile?.rejectionReason || null
      setRejectionReason(finalReason)
      
      // Update previous status to prevent showing modals again
      previousVerificationStatus.current = status
      
      console.log('✅ Profile refreshed:', { status, verified })
      
      // Clear the flag after a short delay to allow state updates to complete
      setTimeout(() => {
        isRefreshing.current = false
      }, 1000)
    } catch (error) {
      console.error('Error refreshing profile:', error)
      isRefreshing.current = false
    }
  }, [])

  const handleDismissWelcomeModal = useCallback(async () => {
    try {
      const user = await getCurrentUser()
      if (user) {
        await markWelcomeModalShown(user.id)
      }
      setShowWelcomeModal(false)
    } catch (error) {
      console.error('Error dismissing welcome modal:', error)
      setShowWelcomeModal(false)
    }
  }, [])

  const handleDismissVerifiedModal = useCallback(() => {
    setShowVerifiedModal(false)
  }, [])

  const handleDismissRejectedModal = useCallback(() => {
    setShowRejectedModal(false)
  }, [])

  return {
    showWelcomeModal,
    showVerifiedModal,
    showRejectedModal,
    handleDismissWelcomeModal,
    handleDismissVerifiedModal,
    handleDismissRejectedModal,
    residentProfile,
    isVerified,
    rejectionReason,
    refreshProfile,
  }
}