import { StyleSheet } from "react-native"

// Main container styles that are shared across the payment screen
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
  },
})

// You can also re-export all style modules from here for convenience
export { headerStyles } from "./styles/HeaderStyles"
export { summaryStyles } from "./styles/SummaryStyles"
export { methodStyles } from "./styles/MethodStyles"
export { timelineStyles } from "./styles/TimelineStyles"
export { termsStyles } from "./styles/TermsStyles"
export { buttonStyles } from "./styles/ButtonStyles"
export { modalStyles } from "./styles/ModalStyles"