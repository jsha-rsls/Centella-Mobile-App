// TermsConditionsScreen.js
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRef, useCallback } from 'react';

export default function TermsConditionsScreen({ navigation }) {
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
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
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
            <Ionicons name="document-text" size={32} color="#2196F3" />
          </View>
          <Text style={styles.lastUpdated}>Last updated: November 5, 2025</Text>
        </View>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            These terms and conditions apply to the Centella App (hereby referred to as "Application") 
            for mobile devices that was created by the Service Provider as a free service.
          </Text>

          <View style={styles.importantBox}>
            <Ionicons name="information-circle" size={20} color="#2196F3" style={styles.infoIcon} />
            <Text style={styles.importantText}>
              By downloading or using the Application, you automatically agree to these terms. 
              Please read them carefully before proceeding.
            </Text>
          </View>
        </View>

        {/* Intellectual Property */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intellectual Property</Text>
          <Text style={styles.paragraph}>
            Unauthorized copying, modification of the Application, any part of the Application, or our 
            trademarks is strictly prohibited. Any attempts to extract the source code, translate the 
            Application into other languages, or create derivative versions are not permitted.
          </Text>
          <Text style={styles.paragraph}>
            All trademarks, copyrights, database rights, and other intellectual property rights related to 
            the Application remain the property of the Service Provider.
          </Text>
        </View>

        {/* Service Modifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Modifications</Text>
          <Text style={styles.paragraph}>
            The Service Provider is dedicated to ensuring that the Application is as beneficial and efficient 
            as possible. We reserve the right to modify the Application or charge for services at any time 
            and for any reason. Any charges will be clearly communicated to you in advance.
          </Text>
        </View>

        {/* Data & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Security</Text>
          <Text style={styles.paragraph}>
            The Application stores and processes personal data that you have provided to deliver our services. 
            You are responsible for maintaining the security of your phone and access to the Application.
          </Text>
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={20} color="#ff9800" style={styles.warningIcon} />
            <Text style={styles.warningText}>
              We strongly advise against jailbreaking or rooting your phone, as this could expose your device 
              to security vulnerabilities and may cause the Application to malfunction.
            </Text>
          </View>
        </View>

        {/* Third-Party Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Third-Party Services</Text>
          <Text style={styles.paragraph}>
            The Application utilizes third-party services that have their own Terms and Conditions:
          </Text>
          <TouchableOpacity style={styles.linkCard}>
            <Ionicons name="link" size={18} color="#2196F3" />
            <Text style={styles.linkText}>Expo Terms of Service</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Internet Connection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Internet Connection & Charges</Text>
          <Text style={styles.paragraph}>
            Some functions require an active internet connection (Wi-Fi or mobile data). The Service Provider 
            cannot be held responsible if the Application does not function at full capacity due to lack of 
            connectivity or exhausted data allowance.
          </Text>
          <Text style={styles.paragraph}>
            When using the Application outside of a Wi-Fi area, your mobile network provider's terms still apply. 
            You may incur charges for data usage, including roaming charges if used outside your home territory. 
            By using the Application, you accept responsibility for such charges.
          </Text>
        </View>

        {/* Liability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            The Service Provider cannot always assume responsibility for your usage of the Application. 
            For instance, you are responsible for ensuring your device remains charged. We cannot be held 
            responsible if your device runs out of battery and you cannot access the Service.
          </Text>
          <Text style={styles.paragraph}>
            While we strive to ensure the Application is updated and accurate, we rely on third parties 
            for certain information. The Service Provider accepts no liability for any loss, direct or 
            indirect, resulting from reliance on the Application's functionality.
          </Text>
        </View>

        {/* Updates & Termination */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Updates & Termination</Text>
          <Text style={styles.paragraph}>
            The Service Provider may update the Application periodically. You will need to download updates 
            to continue using the Application. We do not guarantee that updates will always be compatible 
            with your device's operating system version, but you agree to accept updates when offered.
          </Text>
          <Text style={styles.paragraph}>
            The Service Provider may also cease providing the Application and terminate its use at any time 
            without notice. Upon termination, your rights and licenses will end, and you must cease using 
            and delete the Application from your device.
          </Text>
        </View>

        {/* Changes to Terms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Changes to These Terms</Text>
          <Text style={styles.paragraph}>
            We may periodically update these Terms and Conditions. You are advised to review this page 
            regularly for any changes. We will notify you by posting the new Terms and Conditions on this page.
          </Text>
        </View>

        {/* Contact Section */}
        <View style={[styles.section, styles.contactSection]}>
          <View style={styles.contactHeader}>
            <Ionicons name="mail" size={24} color="#2196F3" />
            <Text style={styles.sectionTitle}>Need Help?</Text>
          </View>
          <Text style={styles.paragraph}>
            If you have any questions or suggestions about these Terms and Conditions, please contact us:
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
    backgroundColor: '#E3F2FD',
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#231828',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  paragraph: {
    fontSize: 15,
    color: '#4a4a4a',
    lineHeight: 24,
    marginBottom: 12,
  },
  importantBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  importantText: {
    flex: 1,
    fontSize: 14,
    color: '#1565C0',
    lineHeight: 22,
    fontWeight: '500',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
  },
  warningIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#E65100',
    lineHeight: 22,
    fontWeight: '500',
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
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