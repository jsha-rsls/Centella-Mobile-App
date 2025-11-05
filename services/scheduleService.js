import { supabase } from '../utils/supabase'

class ScheduleService {
  /**
   * Get all reservations for a specific date range
   * Mobile: Shows only confirmed/pending (upcoming/ongoing) - excludes past dates and completed events
   * Desktop: Shows ALL statuses
   */
  static async getReservationsForDateRange(startDate, endDate, facilityId = null) {
    try {
      const todayString = this.getTodayString()
      const currentTime = this.getCurrentTime()

      let query = supabase
        .from('reservations')
        .select(`
          id,
          user_id,
          facility_id,
          reservation_date,
          start_time,
          end_time,
          duration_hours,
          purpose,
          total_amount,
          status,
          payment_status,
          created_at,
          updated_at,
          facilities (
            id,
            name,
            price,
            capacity,
            description
          ),
          residents!reservations_user_id_fkey (
            id,
            first_name,
            last_name,
            block_number,
            lot_number,
            phase_number
          )
        `)
        .gte('reservation_date', startDate)
        .lte('reservation_date', endDate)
        .in('status', ['pending', 'confirmed'])  // Only show upcoming/ongoing for mobile users
        .order('reservation_date', { ascending: true })
        .order('start_time', { ascending: true })

      if (facilityId) {
        query = query.eq('facility_id', facilityId)
      }

      const { data: reservationsData, error } = await query

      if (error) {
        console.error('Error fetching reservations:', error)
        return { success: false, data: [], error: error.message }
      }

      const combinedData = (reservationsData || []).map(reservation => {
        const resident = reservation.residents || null
        return {
          ...reservation,
          bookedBy: resident
            ? `${resident.first_name} ${resident.last_name}`
            : 'Unknown User'
        }
      })

      // Filter out past dates and completed events
      const filteredData = combinedData.filter(reservation => {
        const reservationDate = reservation.reservation_date
        
        // If reservation date is in the past, exclude it
        if (reservationDate < todayString) {
          return false
        }
        
        // If reservation date is today, check if end time has passed
        if (reservationDate === todayString) {
          const endTime = reservation.end_time
          if (endTime && endTime < currentTime) {
            return false
          }
        }
        
        // Exclude completed events
        if (reservation.status === 'completed') {
          return false
        }
        
        return true
      })

      return { success: true, data: filteredData, error: null }
    } catch (error) {
      console.error('Unexpected error fetching reservations:', error)
      return { success: false, data: [], error: 'Unexpected error occurred' }
    }
  }

  /**
   * Get reservations grouped by date for calendar display
   */
  static async getReservationsGroupedByDate(startDate, endDate, facilityId = null) {
    try {
      const todayString = this.getTodayString()
      const currentTime = this.getCurrentTime()
      
      const result = await this.getReservationsForDateRange(startDate, endDate, facilityId)
      if (!result.success) return result

      const groupedReservations = {}
      const reservations = result.data || []

      for (const reservation of reservations) {
        if (!reservation) continue
        
        const dateKey = reservation.reservation_date
        
        // Additional check: skip past dates
        if (dateKey < todayString) continue
        
        // Additional check: skip today's past events
        if (dateKey === todayString && reservation.end_time && reservation.end_time < currentTime) {
          continue
        }
        
        if (!groupedReservations[dateKey]) {
          groupedReservations[dateKey] = []
        }

        const resident = reservation.residents || {}
        const facility = reservation.facilities || {}

        groupedReservations[dateKey].push({
          id: reservation.id,
          facilityId: reservation.facility_id,
          facilityName: facility.name || 'Unknown Facility',
          facilityPrice: facility.price || 0,
          startTime: reservation.start_time,
          endTime: reservation.end_time,
          duration: reservation.duration_hours,
          purpose: reservation.purpose,
          status: reservation.status,
          paymentStatus: reservation.payment_status,
          bookedBy: reservation.bookedBy,
          address: resident.block_number && resident.lot_number && resident.phase_number
            ? `Block ${resident.block_number}, Lot ${resident.lot_number}, Phase ${resident.phase_number}`
            : 'N/A',
          totalAmount: reservation.total_amount,
          createdAt: reservation.created_at,
          updatedAt: reservation.updated_at
        })
      }

      return { success: true, data: groupedReservations, error: null }
    } catch (error) {
      console.error('Unexpected error grouping reservations:', error)
      return { success: false, data: {}, error: 'Unexpected error occurred' }
    }
  }

  static async getAllFacilities() {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('id, name, price, capacity, description')
        .order('name', { ascending: true })

      if (error) {
        console.error('Error fetching facilities:', error)
        return { success: false, data: [], error: error.message }
      }

      return { success: true, data: data || [], error: null }
    } catch (error) {
      console.error('Unexpected error fetching facilities:', error)
      return { success: false, data: [], error: 'Unexpected error occurred' }
    }
  }

  static subscribeToReservations(callback) {
    console.log('Setting up real-time subscription for reservations...')
    
    const channel = supabase
      .channel('reservations-realtime-' + Date.now())
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        (payload) => {
          console.log('Real-time change received:', payload)
          if (callback && typeof callback === 'function') {
            callback(payload)
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status)
      })

    return channel
  }

  static unsubscribeFromReservations(subscription) {
    if (subscription) {
      console.log('Unsubscribing from real-time updates...')
      supabase.removeChannel(subscription)
    }
  }

  static async updatePastReservationsStatus() {
    try {
      const todayString = this.getTodayString()
      const currentTime = this.getCurrentTime()

      const { error } = await supabase
        .from('reservations')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('status', 'confirmed')
        .or(`reservation_date.lt.${todayString},and(reservation_date.eq.${todayString},end_time.lt.${currentTime})`)

      if (error) {
        console.error('Error updating past reservations:', error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Unexpected error updating past reservations:', error)
      return { success: false, error: 'Unexpected error occurred' }
    }
  }

  static async forceRefreshReservations() {
    try {
      await supabase
        .from('reservations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', -1)
      return { success: true }
    } catch (error) {
      console.error('Error forcing refresh:', error)
      return { success: false, error: error.message }
    }
  }

  static getTodayString() {
    const today = new Date()
    return today.toISOString().slice(0, 10)
  }

  static getCurrentTime() {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  static formatDateForDisplay(dateString) {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  static formatTimeForDisplay(timeString) {
    if (!timeString) return 'N/A'
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }
}

export default ScheduleService