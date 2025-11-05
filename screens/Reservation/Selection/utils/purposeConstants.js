/**
 * Purpose options for different facility types
 */

export const PURPOSE_OPTIONS = {
  "Covered Court": [
    "Basketball",
    "Volleyball", 
    "Badminton",
    "Dance Practice",
    "Sports Training",
    "Physical Education",
    "Tournament/Competition",
    "Other"
  ],
  "Multi-Purpose Hall": [
    "Birthday Party",
    "Wedding Reception",
    "Corporate Meeting",
    "Seminar/Workshop",
    "Community Event",
    "Religious Gathering",
    "Cultural Show",
    "Graduation Ceremony",
    "Other"
  ],
  // Add more facility types as needed
}

/**
 * Get purpose options for a specific facility
 * @param {string|object} facility - Name of the facility or facility object
 * @returns {Array} Array of purpose options for the facility
 */
export const getPurposeOptions = (facility) => {
  // Handle null/undefined
  if (!facility) {
    return []
  }

  let facilityName = facility

  // If facility is an object, extract the name
  if (typeof facility === 'object') {
    facilityName = facility.name || facility.facilityName || facility.facility_name || ''
  }

  // Convert to string and trim
  facilityName = String(facilityName).trim()

  // Return matching options or empty array
  return PURPOSE_OPTIONS[facilityName] || []
}

/**
 * Format selected purposes into a display string
 * @param {Array} selectedPurposes - Array of selected purpose strings
 * @param {string} customPurpose - Custom purpose text
 * @returns {string} Formatted purpose string
 */
export const formatPurposeDisplay = (selectedPurposes, customPurpose) => {
  const filteredPurposes = selectedPurposes.filter(p => p !== "Other")
  
  if (filteredPurposes.length > 0) {
    return filteredPurposes.join(", ") + (customPurpose.trim() ? `, ${customPurpose}` : "")
  }
  
  return customPurpose
}