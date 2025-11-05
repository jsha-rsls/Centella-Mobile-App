import { supabase } from '../utils/supabase'

class ReservationService {
  // Get all facilities
  async getFacilities() {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('name')

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching facilities:', error)
      return { success: false, error: error.message }
    }
  }

  // Get current user info
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('residents')
        .select('*')
        .eq('auth_user_id', user.id)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching current user:', error)
      return { success: false, error: error.message }
    }
  }

  // Get reservations for a specific date and facility
  async getReservations(facilityId, date) {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          residents!inner(first_name, last_name),
          facilities!inner(name, price_unit)
        `)
        .eq('facility_id', facilityId)
        .eq('reservation_date', date)
        .in('status', ['pending', 'confirmed'])
        .order('start_time')

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching reservations:', error)
      return { success: false, error: error.message }
    }
  }

  // Create a new reservation
  async createReservation(reservationData) {
    try {
      // Get current user
      const userResult = await this.getCurrentUser()
      if (!userResult.success) throw new Error(userResult.error)

      const user = userResult.data

      // --- ✅ Handle time properly (supports both styles) ---
      let startTime, endTime

      if (reservationData.start_time && reservationData.end_time) {
        // Already provided as 24h values (e.g. "08:00")
        startTime = reservationData.start_time.includes(":")
          ? `${reservationData.start_time}:00`
          : reservationData.start_time
        endTime = reservationData.end_time.includes(":")
          ? `${reservationData.end_time}:00`
          : reservationData.end_time
      } else if (reservationData.time) {
        // Provided as "8:00 AM - 10:00 AM"
        const [startTimeStr, endTimeStr] = reservationData.time.split(" - ")
        startTime = this.convertTo24Hour(startTimeStr.trim())
        endTime = this.convertTo24Hour(endTimeStr.trim())
      } else {
        throw new Error("No time provided for reservation")
      }

      // --- ✅ Get facility info with price_unit ---
      let facilityId
      if (reservationData.facility_id) {
        facilityId = reservationData.facility_id
      } else if (reservationData.facility) {
        // If facility was passed as a name or id, try to resolve
        const { data: facility, error: facilityError } = await supabase
          .from("facilities")
          .select("*")
          .eq("id", reservationData.facility)
          .single()

        if (facilityError) throw facilityError
        facilityId = facility.id
      } else {
        throw new Error("No facility provided for reservation")
      }

      // --- ✅ Determine initial status based on payment type ---
      const paymentType = reservationData.payment_type || null
      const initialStatus = paymentType === 'online' ? 'confirmed' : 'pending'

      console.log(`🎯 Creating reservation with payment_type: ${paymentType}, status: ${initialStatus}`)

      // --- ✅ Build reservation object ---
      const reservation = {
        user_id: user.id, // ✅ matches residents.id
        facility_id: facilityId,
        reservation_date: reservationData.date || reservationData.reservation_date,
        start_time: startTime,
        end_time: endTime,
        duration_hours: 2, // default 2 hours
        purpose: reservationData.purpose,
        total_amount: reservationData.price || reservationData.total_amount,
        status: initialStatus, // ✅ Auto-confirm if online payment
        payment_status: "pending",
        payment_type: paymentType, // 'online' or 'cash'
      }

      // Insert into DB with price_unit
      const { data, error } = await supabase
        .from("reservations")
        .insert(reservation)
        .select(`
          *,
          residents!inner(first_name, last_name),
          facilities!inner(name, price, price_unit)
        `)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error("Error creating reservation:", error)
      return { success: false, error: error.message }
    }
  }

  // Update reservation status (for payment confirmation, etc.)
  async updateReservationStatus(reservationId, status, paymentStatus = null) {
    try {
      const updateData = { status, updated_at: new Date().toISOString() }
      if (paymentStatus) {
        updateData.payment_status = paymentStatus
      }

      const { data, error } = await supabase
        .from('reservations')
        .update(updateData)
        .eq('id', reservationId)
        .select(`
          *,
          residents!inner(first_name, last_name),
          facilities!inner(name, price, price_unit)
        `)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error updating reservation:', error)
      return { success: false, error: error.message }
    }
  }

  // Get user's reservations
  async getUserReservations() {
    try {
      const userResult = await this.getCurrentUser()
      if (!userResult.success) throw new Error(userResult.error)

      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          facilities!inner(name, icon, price, price_unit)
        `)
        .eq('user_id', userResult.data.id) // ✅ link to residents.id
        .order('reservation_date', { ascending: false })
        .order('start_time', { ascending: false })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching user reservations:', error)
      return { success: false, error: error.message }
    }
  }

  // Helper function to convert 12-hour time to 24-hour time
  convertTo24Hour(time12h) {
    const [time, modifier] = time12h.split(' ')
    let [hours, minutes] = time.split(':')
    
    if (hours === '12') {
      hours = '00'
    }
    
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12
    }
    
    return `${hours}:${minutes}:00`
  }

  // Helper function to convert 24-hour time to 12-hour time
  convertTo12Hour(time24h) {
    const [hours, minutes] = time24h.split(':')
    const hour12 = hours % 12 || 12
    const ampm = hours < 12 ? 'AM' : 'PM'
    return `${hour12}:${minutes} ${ampm}`
  }

  // Generate time slots based on existing reservations
  generateTimeSlots(existingReservations = []) {
    const baseSlots = [
      "8:00 AM - 10:00 AM",
      "10:00 AM - 12:00 PM", 
      "12:00 PM - 2:00 PM",
      "2:00 PM - 4:00 PM",
      "4:00 PM - 6:00 PM",
      "6:00 PM - 8:00 PM",
      "8:00 PM - 10:00 PM",
    ]

    return baseSlots.map(timeSlot => {
      const [startTimeStr] = timeSlot.split(' - ')
      const startTime = this.convertTo24Hour(startTimeStr.trim())
      
      const isBooked = existingReservations.some(reservation => {
        return reservation.start_time === startTime
      })

      const bookedReservation = existingReservations.find(reservation => 
        reservation.start_time === startTime
      )

      return {
        time: timeSlot,
        status: isBooked ? "booked" : "available",
        bookedBy: bookedReservation ? 
          bookedReservation.purpose || 
          `${bookedReservation.residents?.first_name} ${bookedReservation.residents?.last_name}` 
          : null
      }
    })
  }
}

export default new ReservationService()