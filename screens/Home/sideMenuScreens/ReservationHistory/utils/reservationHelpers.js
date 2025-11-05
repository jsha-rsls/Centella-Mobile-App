// screens/Home/sideMenuScreens/ReservationHistory/utils/reservationHelpers.js

export const getStatusColor = (status) => {
  switch(status) {
    case "completed": return "#4caf50"
    case "upcoming": return "#2196f3"
    case "cancelled": return "#f44336"
    default: return "#999"
  }
}

export const getStatusBg = (status) => {
  switch(status) {
    case "completed": return "#e8f5e9"
    case "upcoming": return "#e3f2fd"
    case "cancelled": return "#ffebee"
    default: return "#f5f5f5"
  }
}

export const getStatusIcon = (status) => {
  switch(status) {
    case "completed": return "checkmark-circle"
    case "upcoming": return "time"
    case "cancelled": return "close-circle"
    default: return "ellipse"
  }
}

export const getFacilityIcon = (facility) => {
  if (facility.includes("Pool") || facility.includes("Swimming")) return "water"
  if (facility.includes("Basketball") || facility.includes("Court")) return "basketball"
  if (facility.includes("Function") || facility.includes("Hall")) return "business"
  if (facility.includes("Gym") || facility.includes("Fitness")) return "fitness"
  if (facility.includes("Tennis")) return "tennisball"
  if (facility.includes("Playground")) return "happy"
  return "home"
}