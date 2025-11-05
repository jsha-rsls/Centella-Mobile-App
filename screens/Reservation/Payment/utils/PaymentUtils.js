// Payment utility functions for processing booking data

class PaymentUtils {
  /**
   * Convert 24-hour time format to 12-hour format
   * @param {string} time24 - Time in 24-hour format (e.g., "14:30:00" or "14:30")
   * @returns {string} Time in 12-hour format (e.g., "2:30 PM")
   */
  convertTo12Hour(time24) {
    if (!time24) return ""
    
    // Remove seconds if present
    const timeParts = time24.split(':')
    let hours = parseInt(timeParts[0], 10)
    const minutes = timeParts[1] || '00'
    
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12 // Convert 0 to 12 for midnight
    
    return `${hours}:${minutes} ${ampm}`
  }

  /**
   * Format date to short month format
   * @param {string} dateString - Date string (e.g., "2025-10-23")
   * @returns {string} Formatted date (e.g., "Oct 23, 2025")
   */
  formatDate(dateString) {
    if (!dateString) return ""
    
    const date = new Date(dateString)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  /**
   * Calculate duration in hours from start and end time
   * Supports fractional hours (e.g., 1.5 hours for 1 hour 30 minutes)
   * @param {string} startTime - Start time (e.g., "12:00:00" or "12:00")
   * @param {string} endTime - End time (e.g., "17:30:00" or "17:30")
   * @returns {number} Duration in hours (with decimals)
   */
  calculateDuration(startTime, endTime) {
    if (!startTime || !endTime) return 0

    const parseTime = (timeStr) => {
      const parts = timeStr.split(':')
      return {
        hours: parseInt(parts[0], 10),
        minutes: parseInt(parts[1], 10) || 0
      }
    }

    const start = parseTime(startTime)
    const end = parseTime(endTime)

    // Calculate total minutes
    const startMinutes = start.hours * 60 + start.minutes
    const endMinutes = end.hours * 60 + end.minutes

    // Convert back to hours (with decimals)
    const durationHours = (endMinutes - startMinutes) / 60

    return durationHours
  }

  /**
   * Calculate total amount based on duration and pricing
   * Handles per hour, per session, and fractional pricing
   * 15 mins = 0.25x price, 30 mins = 0.5x price, 45 mins = 0.75x price
   * @param {string} startTime - Start time
   * @param {string} endTime - End time
   * @param {number} basePrice - Base price from facility
   * @param {string} priceUnit - "per hour" or "per session"
   * @returns {number} Total amount
   */
  calculateTotalAmount(startTime, endTime, basePrice, priceUnit) {
    if (!priceUnit) return basePrice

    // If it's per session, return base price regardless of duration
    if (priceUnit.toLowerCase().includes('session')) {
      return basePrice
    }

    // If it's per hour, calculate based on duration
    if (priceUnit.toLowerCase().includes('hour')) {
      const durationHours = this.calculateDuration(startTime, endTime)
      
      // Calculate total with fractional pricing
      const totalAmount = basePrice * durationHours
      
      // Round to 2 decimal places
      return Math.round(totalAmount * 100) / 100
    }

    // Default: return base price
    return basePrice
  }

  /**
   * Format duration as human-readable string
   * @param {string} startTime - Start time
   * @param {string} endTime - End time
   * @returns {string} Formatted duration (e.g., "5 hrs 30 mins")
   */
  formatDuration(startTime, endTime) {
    const durationHours = this.calculateDuration(startTime, endTime)
    
    const hours = Math.floor(durationHours)
    const minutes = Math.round((durationHours - hours) * 60)

    if (hours === 0) {
      return `${minutes} mins`
    } else if (minutes === 0) {
      return `${hours} ${hours === 1 ? 'hr' : 'hrs'}`
    } else {
      return `${hours} ${hours === 1 ? 'hr' : 'hrs'} ${minutes} mins`
    }
  }

  /**
   * Process booking data for payment screen
   * Converts all necessary fields and calculates pricing
   * @param {object} bookingData - Raw booking data
   * @param {object} facilityData - Facility information with price and price_unit
   * @returns {object} Processed booking data ready for payment screen
   */
  processBookingData(bookingData, facilityData) {
    const startTime = bookingData.start_time
    const endTime = bookingData.end_time
    const basePrice = facilityData.price
    const priceUnit = facilityData.price_unit

    // Calculate total amount
    const totalAmount = this.calculateTotalAmount(startTime, endTime, basePrice, priceUnit)

    // Format time range in 12-hour format
    const timeRange = `${this.convertTo12Hour(startTime)} - ${this.convertTo12Hour(endTime)}`

    // Format date
    const formattedDate = this.formatDate(bookingData.reservation_date)

    // Format duration
    const duration = this.formatDuration(startTime, endTime)

    return {
      // Original fields
      facility_id: facilityData.id,
      facility: facilityData.name,
      reservation_date: bookingData.reservation_date,
      start_time: startTime,
      end_time: endTime,
      purpose: bookingData.purpose,
      
      // Formatted fields for display
      date: formattedDate,
      time: timeRange,
      duration: duration,
      
      // Pricing fields
      price: totalAmount.toFixed(2), // Always show 2 decimal places
      price_unit: priceUnit,
      base_price: basePrice,
      
      // Additional info
      duration_hours: this.calculateDuration(startTime, endTime),
    }
  }

  /**
   * Format price for display
   * @param {number} price - Price amount
   * @returns {string} Formatted price (e.g., "250.00" or "375.50")
   */
  formatPrice(price) {
    return parseFloat(price).toFixed(2)
  }

  /**
   * Get pricing breakdown for display
   * Useful for showing calculation details to user
   * @param {string} startTime - Start time
   * @param {string} endTime - End time
   * @param {number} basePrice - Base price from facility
   * @param {string} priceUnit - "per hour" or "per session"
   * @returns {object} Breakdown details
   */
  getPricingBreakdown(startTime, endTime, basePrice, priceUnit) {
    const durationHours = this.calculateDuration(startTime, endTime)
    const totalAmount = this.calculateTotalAmount(startTime, endTime, basePrice, priceUnit)

    const hours = Math.floor(durationHours)
    const fractionalHour = durationHours - hours

    return {
      duration: this.formatDuration(startTime, endTime),
      durationHours: durationHours,
      basePrice: basePrice,
      priceUnit: priceUnit,
      totalAmount: totalAmount,
      breakdown: priceUnit.toLowerCase().includes('hour') ? {
        fullHours: hours,
        fullHoursCost: hours * basePrice,
        fractionalHour: fractionalHour,
        fractionalCost: fractionalHour * basePrice,
      } : null
    }
  }
}

export default new PaymentUtils()