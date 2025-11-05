// screens/Home/sideMenuScreens/ReservationHistory/components/LoadingState.js
import { View } from "react-native"
import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import Header from "./Header"
import ReservationHistorySkeleton from "./ReservationHistorySkeleton"
import styles from "../styles"

export default function LoadingState({ insets, navigation, activeTab }) {
  return (
    <View style={styles.container}>
      <ExpoStatusBar style="dark" />
      
      {/* Fixed Header */}
      <Header 
        navigation={navigation}
        activeTab={activeTab}
        insets={insets}
      />
      
      {/* Skeleton Loading */}
      <ReservationHistorySkeleton insets={insets} />
    </View>
  )
}