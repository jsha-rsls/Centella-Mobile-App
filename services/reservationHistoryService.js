// services/reservationHistoryService.js
import { supabase } from '../utils/supabase'

/**
 * Fetch all reservations for a specific user with facility details
 * @param {number} userId - The resident's ID
 * @returns {Promise<Object>} Object containing reservations array and stats
 */
export const getUserReservations = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id,
        reservation_date,
        start_time,
        end_time,
        duration_hours,
        purpose,
        total_amount,
        status,
        payment_status,
        created_at,
        facilities (
          id,
          name,
          icon,
          description,
          capacity
        )
      `)
      .eq('user_id', userId)
      .order('reservation_date', { ascending: false })
      .order('start_time', { ascending: false })

    if (error) throw error

    // Transform the data to match the component's expected format
    const transformedReservations = data.map(reservation => ({
      id: reservation.id,
      facility: reservation.facilities?.name || 'Unknown Facility',
      facilityIcon: reservation.facilities?.icon,
      date: formatDate(reservation.reservation_date),
      time: formatTimeRange(reservation.start_time, reservation.end_time),
      status: mapStatus(reservation.status),
      guests: reservation.facilities?.capacity || 0,
      purpose: reservation.purpose,
      totalAmount: parseFloat(reservation.total_amount),
      paymentStatus: reservation.payment_status,
      rawDate: reservation.reservation_date,
      rawStartTime: reservation.start_time,
      rawEndTime: reservation.end_time,
      durationHours: reservation.duration_hours,
      createdAt: reservation.created_at
    }))

    // Calculate stats
    const stats = calculateStats(transformedReservations)

    return {
      reservations: transformedReservations,
      stats,
      error: null
    }
  } catch (error) {
    console.error('Error fetching user reservations:', error)
    return {
      reservations: [],
      stats: { completed: 0, upcoming: 0, cancelled: 0, total: 0 },
      error: error.message
    }
  }
}

/**
 * Fetch a single reservation by ID with full details
 * @param {number} reservationId - The reservation ID
 * @returns {Promise<Object>} Reservation details or error
 */
export const getReservationById = async (reservationId) => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        facilities (
          id,
          name,
          icon,
          description,
          capacity,
          price
        ),
        residents (
          id,
          first_name,
          last_name,
          contact_number,
          email
        )
      `)
      .eq('id', reservationId)
      .single()

    if (error) throw error

    return {
      data: {
        ...data,
        facility: data.facilities,
        resident: data.residents
      },
      error: null
    }
  } catch (error) {
    console.error('Error fetching reservation details:', error)
    return {
      data: null,
      error: error.message
    }
  }
}

/**
 * Cancel a reservation
 * @param {number} reservationId - The reservation ID to cancel
 * @returns {Promise<Object>} Success status and message
 */
export const cancelReservation = async (reservationId) => {
  try {
    // First, verify the reservation exists and is cancellable
    const { data: existingReservation, error: fetchError } = await supabase
      .from('reservations')
      .select('id, status')
      .eq('id', reservationId)
      .single()

    if (fetchError) throw fetchError

    // Check if reservation is already cancelled or completed
    if (existingReservation.status === 'cancelled') {
      return {
        success: false,
        data: null,
        error: 'This reservation has already been cancelled'
      }
    }

    if (existingReservation.status === 'completed') {
      return {
        success: false,
        data: null,
        error: 'Completed reservations cannot be cancelled'
      }
    }

    // Proceed with cancellation
    const { data, error } = await supabase
      .from('reservations')
      .update({
        status: 'cancelled',
        payment_status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', reservationId)
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data,
      error: null
    }
  } catch (error) {
    console.error('Error cancelling reservation:', error)
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to cancel reservation'
    }
  }
}

// Helper Functions

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (e.g., "March 15, 2025")
 */
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

/**
 * Format time range
 * @param {string} startTime - Start time (HH:MM:SS)
 * @param {string} endTime - End time (HH:MM:SS)
 * @returns {string} Formatted time range (e.g., "2:00 PM - 5:00 PM")
 */
const formatTimeRange = (startTime, endTime) => {
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  return `${formatTime(startTime)} - ${formatTime(endTime)}`
}

/**
 * Map database status to display status
 * @param {string} dbStatus - Status from database
 * @returns {string} Display status
 */
const mapStatus = (dbStatus) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  switch (dbStatus) {
    case 'confirmed':
      // Check if reservation date is in the future
      return 'upcoming'
    case 'completed':
      return 'completed'
    case 'cancelled':
      return 'cancelled'
    case 'pending':
      return 'upcoming' // Show pending as upcoming
    default:
      return 'upcoming'
  }
}

/**
 * Calculate statistics from reservations
 * @param {Array} reservations - Array of reservation objects
 * @returns {Object} Stats object with counts
 */
const calculateStats = (reservations) => {
  const stats = {
    completed: 0,
    upcoming: 0,
    cancelled: 0,
    total: reservations.length
  }

  reservations.forEach(reservation => {
    if (reservation.status === 'completed') {
      stats.completed++
    } else if (reservation.status === 'upcoming') {
      stats.upcoming++
    } else if (reservation.status === 'cancelled') {
      stats.cancelled++
    }
  })

  return stats
}

/**
 * Get reservations filtered by status
 * @param {number} userId - The resident's ID
 * @param {string} status - Status to filter by
 * @returns {Promise<Object>} Filtered reservations
 */
export const getReservationsByStatus = async (userId, status) => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id,
        reservation_date,
        start_time,
        end_time,
        status,
        facilities (name, icon)
      `)
      .eq('user_id', userId)
      .eq('status', status)
      .order('reservation_date', { ascending: false })

    if (error) throw error

    return {
      data,
      error: null
    }
  } catch (error) {
    console.error('Error fetching reservations by status:', error)
    return {
      data: [],
      error: error.message
    }
  }
}