import { Modal, View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native"
import { WebView } from 'react-native-webview'
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from 'expo-linear-gradient'

export default function PaymentWebView({ 
  visible, 
  paymentUrl, 
  onClose,
  onLoadStart,
  onLoadEnd 
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={["#F9E6E6", "#F2D5D5", "#F9E6E6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
          >
            <View style={styles.closeButtonCircle}>
              <Ionicons name="close" size={24} color="#2d1b2e" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <View style={styles.securityBadge}>
              <Ionicons name="lock-closed" size={16} color="#00C853" />
              <Text style={styles.headerTitle}>Secure Payment</Text>
            </View>
            <Text style={styles.headerSubtitle}>Powered by PayMongo</Text>
          </View>
          
          <View style={styles.headerSpacer} />
        </LinearGradient>

        {/* WebView */}
        {paymentUrl ? (
          <WebView
            source={{ uri: paymentUrl }}
            style={styles.webview}
            onLoadStart={onLoadStart}
            onLoadEnd={onLoadEnd}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2d1b2e" />
                <Text style={styles.loadingText}>Loading payment page...</Text>
              </View>
            )}
            // Allow navigation within PayMongo domain
            onShouldStartLoadWithRequest={(request) => {
              return true
            }}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2d1b2e" />
            <Text style={styles.loadingText}>Preparing payment...</Text>
          </View>
        )}

        {/* Processing Indicator */}
        <View style={styles.footer}>
          <View style={styles.processingIndicator}>
            <View style={styles.pulseContainer}>
              <View style={styles.pulse} />
              <Ionicons name="shield-checkmark" size={16} color="#00C853" />
            </View>
            <Text style={styles.processingText}>
              Checking payment status...
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    width: 40,
  },
  closeButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d1b2e',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 16,
    backgroundColor: '#fafafa',
  },
  processingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pulseContainer: {
    position: 'relative',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00C853',
    opacity: 0.3,
  },
  processingText: {
    fontSize: 13,
    color: '#666',
  },
})