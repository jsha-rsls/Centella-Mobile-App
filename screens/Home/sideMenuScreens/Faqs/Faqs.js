import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import styles from "./styles/FStyles"
import { faqData } from "./data/faqData"

export default function Faqs({ navigation }) {
  const insets = useSafeAreaInsets()
  const [expandedId, setExpandedId] = useState(null)

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="dark" />
      
      {/* Header */}
      <LinearGradient
        colors={["#F9E6E6", "#F2D5D5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 11 }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#2d1b2e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>FAQs</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={24} color="#2196f3" />
          <Text style={styles.infoBannerText}>
            Can't find what you're looking for? Contact our support team for assistance.
          </Text>
        </View>

        {/* FAQ Categories */}
        {faqData.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: `${category.color}15` }]}>
                <Ionicons name={category.icon} size={20} color={category.color} />
              </View>
              <Text style={styles.categoryTitle}>{category.category}</Text>
            </View>

            <View style={styles.faqList}>
              {category.faqs.map((faq) => (
                <View key={faq.id} style={styles.faqCard}>
                  <TouchableOpacity
                    style={styles.faqHeader}
                    onPress={() => toggleExpand(faq.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Ionicons 
                      name={expandedId === faq.id ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                  
                  {expandedId === faq.id && (
                    <View style={styles.faqAnswer}>
                      <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Contact Support */}
        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Still need help?</Text>
          <Text style={styles.supportText}>
            Our support team is here to assist you with any questions or concerns.
          </Text>
          <TouchableOpacity style={styles.supportButton}>
            <Ionicons name="chatbubbles" size={20} color="#fff" />
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}