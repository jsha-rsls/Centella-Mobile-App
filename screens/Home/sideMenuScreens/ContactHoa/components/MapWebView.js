import React from "react"
import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from "react-native"
import { WebView } from "react-native-webview"
import { Ionicons } from "@expo/vector-icons"
import styles from "../styles/styles"

export default function MapWebView({ visible, onClose, address, coordinates }) {
  const [loading, setLoading] = React.useState(true)

  // Generate HTML with embedded iframe
  const getMapHTML = () => {
    const embedUrl = "https://www.google.com/maps/embed?pb=!4v1761216568077!6m8!1m7!1syXQYVBOh-oRfXXzTQhnnuw!2m2!1d14.7410951274403!2d121.1517015868963!3f28.68860423730888!4f6.104418890266899!5f0.9696702619984923"
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body, html {
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
            iframe {
              width: 100%;
              height: 100%;
              border: 0;
            }
          </style>
        </head>
        <body>
          <iframe 
            src="${embedUrl}" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </body>
      </html>
    `
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.mapContainer}>
        {/* Header */}
        <View style={styles.mapHeader}>
          <TouchableOpacity 
            onPress={onClose}
            style={styles.mapCloseButton}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color="#2d1b2e" />
          </TouchableOpacity>
          <View style={styles.mapHeaderContent}>
            <Text style={styles.mapHeaderTitle}>Office Location</Text>
            <Text style={styles.mapHeaderSubtitle}>{address}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Map WebView */}
        <View style={styles.mapWebViewContainer}>
          {loading && (
            <View style={styles.mapLoadingContainer}>
              <ActivityIndicator size="large" color="#2d1b2e" />
              <Text style={styles.mapLoadingText}>Loading map...</Text>
            </View>
          )}
          <WebView
            source={{ html: getMapHTML() }}
            style={styles.mapWebView}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </View>

        {/* Footer Actions */}
        <View style={styles.mapFooter}>
          <TouchableOpacity 
            style={styles.mapActionButton}
            activeOpacity={0.7}
            onPress={() => {
              // Open in native maps app
              const Linking = require('react-native').Linking
              if (coordinates) {
                const { latitude, longitude } = coordinates
                Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`)
              } else {
                const encodedAddress = encodeURIComponent(address)
                Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`)
              }
            }}
          >
            <Ionicons name="navigate" size={20} color="#fff" />
            <Text style={styles.mapActionButtonText}>Open in Maps</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}