import React, { useState } from "react"
import { View, Text, ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import Header from "./components/Header"
import ContactMethodCard from "./components/ContactMethodCard"
import OfficeHoursCard from "./components/OfficeHoursCard"
import MapWebView from "./components/MapWebView"
import { useContactActions } from "./hooks/useContactActions"
import { contactMethods, officeHours, officeCoordinates } from "./utils/contactData"
import styles from "./styles/styles"

export default function ContactHoa({ navigation }) {
  const insets = useSafeAreaInsets()
  const { handleContactPress } = useContactActions()
  const [mapVisible, setMapVisible] = useState(false)

  const handleCardPress = (method) => {
    if (method.type === "address") {
      setMapVisible(true)
    } else {
      handleContactPress(method)
    }
  }

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="dark" />
      
      <Header navigation={navigation} insets={insets} />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <Text style={styles.sectionSubtitle}>
            Choose your preferred way to reach us
          </Text>
          
          {contactMethods.map((method, index) => (
            <ContactMethodCard
              key={index}
              method={method}
              onPress={() => handleCardPress(method)}
            />
          ))}
        </View>

        {/* Office Hours */}
        <OfficeHoursCard schedules={officeHours} />
      </ScrollView>

      {/* Map WebView Modal */}
      <MapWebView
        visible={mapVisible}
        onClose={() => setMapVisible(false)}
        address={contactMethods[2].value}
        coordinates={officeCoordinates}
      />
    </View>
  )
}