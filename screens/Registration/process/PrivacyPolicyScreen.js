// PrivacyPolicyScreen.js
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRef, useCallback } from 'react';

export default function PrivacyPolicyScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const DataItem = ({ text }) => (
    <View style={styles.dataItem}>
      <View style={styles.bulletDot} />
      <Text style={styles.dataText}>{text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header with Safe Area */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#231828" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
        
        {/* Animated shadow */}
        <Animated.View 
          style={[
            styles.headerShadow, 
            { opacity: headerOpacity }
          ]} 
        />
      </View>

      {/* Content */}
      <Animated.ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 40 }
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={32} color="#4CAF50" />
          </View>
          <Text style={styles.lastUpdated}>Last updated: November 5, 2025</Text>
        </View>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            This privacy policy applies to the Centella App (hereby referred to as "Application") 
            for mobile devices that was created by the Service Provider as a free service.
          </Text>

          <View style={styles.trustBox}>
            <Ionicons name="lock-closed" size={20} color="#4CAF50" style={styles.trustIcon} />
            <Text style={styles.trustText}>
              Your privacy is important to us. This policy explains how we collect, use, and protect 
              your personal information.
            </Text>
          </View>
        </View>

        {/* Information Collection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={24} color="#2196F3" />
            <Text style={styles.sectionTitle}>Information We Collect</Text>
          </View>
          
          <Text style={styles.paragraph}>
            The Application collects information when you download and use it, including:
          </Text>

          <View style={styles.dataCard}>
            <Text style={styles.dataCardTitle}>Automatically Collected Data</Text>
            <DataItem text="Your device's IP address" />
            <DataItem text="Pages visited and time spent" />
            <DataItem text="Application usage duration" />
            <DataItem text="Device operating system" />
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="location-outline" size={18} color="#666" />
            <Text style={styles.infoText}>
              We do not collect precise location information from your device.
            </Text>
          </View>

          <View style={styles.dataCard}>
            <Text style={styles.dataCardTitle}>Personal Information You Provide</Text>
            <DataItem text="Full Name" />
            <DataItem text="Phone Number" />
            <DataItem text="Home Address" />
            <DataItem text="Email Address" />
            <DataItem text="ID Photo" />
          </View>

          <Text style={styles.paragraph}>
            This information is retained and used as described in this privacy policy to provide 
            and improve our services.
          </Text>
        </View>

        {/* How We Use Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="construct" size={24} color="#2196F3" />
            <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          </View>
          
          <Text style={styles.paragraph}>
            The Service Provider may use your information to:
          </Text>
          
          <View style={styles.usageCard}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.usageText}>Contact you with important information and notices</Text>
          </View>
          <View style={styles.usageCard}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.usageText}>Provide marketing promotions (with your consent)</Text>
          </View>
          <View style={styles.usageCard}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.usageText}>Improve the Application and our services</Text>
          </View>
        </View>

        {/* Third Party Access */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={24} color="#2196F3" />
            <Text style={styles.sectionTitle}>Third-Party Services</Text>
          </View>
          
          <Text style={styles.paragraph}>
            Only aggregated, anonymized data is transmitted to external services to help improve 
            the Application. We utilize third-party services with their own Privacy Policies:
          </Text>

          <TouchableOpacity style={styles.linkCard}>
            <Ionicons name="link" size={18} color="#2196F3" />
            <Text style={styles.linkText}>Expo Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>

          <View style={styles.disclosureBox}>
            <Text style={styles.disclosureTitle}>We may disclose information:</Text>
            <DataItem text="As required by law or legal process" />
            <DataItem text="To protect rights and safety" />
            <DataItem text="To trusted service providers bound by this policy" />
          </View>
        </View>

        {/* Your Rights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="hand-right" size={24} color="#2196F3" />
            <Text style={styles.sectionTitle}>Your Rights</Text>
          </View>

          <View style={styles.rightCard}>
            <View style={styles.rightHeader}>
              <Ionicons name="close-circle" size={24} color="#f44336" />
              <Text style={styles.rightTitle}>Opt-Out Rights</Text>
            </View>
            <Text style={styles.rightText}>
              You can stop all data collection by uninstalling the Application using your device's 
              standard uninstall process.
            </Text>
          </View>

          <View style={styles.rightCard}>
            <View style={styles.rightHeader}>
              <Ionicons name="trash" size={24} color="#ff9800" />
              <Text style={styles.rightTitle}>Data Deletion</Text>
            </View>
            <Text style={styles.rightText}>
              We retain your data while you use the Application and for a reasonable time after. 
              To request deletion, contact us and we'll respond promptly.
            </Text>
          </View>
        </View>

        {/* Children's Privacy */}
        <View style={styles.section}>
          <View style={styles.childrenBox}>
            <Ionicons name="people-outline" size={28} color="#9C27B0" />
            <View style={styles.childrenContent}>
              <Text style={styles.childrenTitle}>Children's Privacy</Text>
              <Text style={styles.childrenText}>
                We do not knowingly collect data from children under 13. If you're a parent and 
                believe your child has provided us with information, please contact us immediately 
                so we can delete it.
              </Text>
            </View>
          </View>
        </View>

        {/* Security */}
        <View style={styles.section}>
          <View style={styles.securityCard}>
            <Ionicons name="lock-closed" size={32} color="#4CAF50" />
            <Text style={styles.securityTitle}>Security</Text>
            <Text style={styles.securityText}>
              We take your privacy seriously and provide physical, electronic, and procedural 
              safeguards to protect the information we process and maintain.
            </Text>
          </View>
        </View>

        {/* Updates */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="refresh" size={24} color="#2196F3" />
            <Text style={styles.sectionTitle}>Policy Updates</Text>
          </View>
          
          <Text style={styles.paragraph}>
            This Privacy Policy may be updated periodically. We'll notify you of changes by posting 
            the updated policy on this page. Continued use of the Application constitutes acceptance 
            of all changes.
          </Text>
        </View>

        {/* Contact Section */}
        <View style={[styles.section, styles.contactSection]}>
          <View style={styles.contactHeader}>
            <Ionicons name="mail" size={24} color="#2196F3" />
            <Text style={styles.sectionTitle}>Questions?</Text>
          </View>
          <Text style={styles.paragraph}>
            If you have any questions about our privacy practices or this policy, we're here to help:
          </Text>
          <TouchableOpacity style={styles.emailButton}>
            <Ionicons name="mail-outline" size={20} color="#2196F3" />
            <Text style={styles.emailText}>hoa.centellahomes@gmail.com</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  headerShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#231828',
    letterSpacing: -0.3,
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingBottom: 24,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#231828',
    letterSpacing: -0.5,
  },
  paragraph: {
    fontSize: 15,
    color: '#4a4a4a',
    lineHeight: 24,
    marginBottom: 12,
  },
  trustBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  trustIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  trustText: {
    flex: 1,
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 22,
    fontWeight: '500',
  },
  dataCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dataCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#231828',
    marginBottom: 12,
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2196F3',
    marginTop: 8,
    marginRight: 12,
  },
  dataText: {
    flex: 1,
    fontSize: 14,
    color: '#4a4a4a',
    lineHeight: 22,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  usageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 12,
  },
  usageText: {
    flex: 1,
    fontSize: 14,
    color: '#4a4a4a',
    lineHeight: 20,
    fontWeight: '500',
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  linkText: {
    flex: 1,
    fontSize: 15,
    color: '#2196F3',
    fontWeight: '600',
    marginLeft: 12,
  },
  disclosureBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  disclosureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F57C00',
    marginBottom: 12,
  },
  rightCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  rightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#231828',
  },
  rightText: {
    fontSize: 14,
    color: '#4a4a4a',
    lineHeight: 22,
  },
  childrenBox: {
    flexDirection: 'row',
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  childrenContent: {
    flex: 1,
  },
  childrenTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7B1FA2',
    marginBottom: 8,
  },
  childrenText: {
    fontSize: 14,
    color: '#6A1B9A',
    lineHeight: 22,
  },
  securityCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 12,
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 22,
    textAlign: 'center',
  },
  contactSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  emailText: {
    fontSize: 15,
    color: '#2196F3',
    fontWeight: '600',
    marginLeft: 12,
  },
});