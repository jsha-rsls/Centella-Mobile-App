import { View, Text, StatusBar, Animated, Alert, Linking, TouchableOpacity, Modal } from 'react-native'
import { useState, useRef, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import HTMLRenderer from './HTMLRenderer'
import { formatRelativeDate } from '../../utils/announcementUtils'
import { viewStyles } from './styles/viewStyles'
import { useHeaderAnimations } from './hooks/useHeaderAnimations'
import { useImageHandler } from './hooks/useImageHandler'
import { getGradientColors } from './utils/gradientUtils'
import AnimatedHeader from './components/AnimatedHeader'
import TextFormattingControls from './components/TextFormattingControls'

const FORMATTING_STORAGE_KEY = '@text_formatting_preferences'

export default function ViewAnnouncement({ route, navigation }) {
  const { announcement } = route.params
  const [imageError, setImageError] = useState(false)
  const [showFormatting, setShowFormatting] = useState(false)
  
  // Text formatting state
  const [fontSize, setFontSize] = useState(16)
  const [lineHeight, setLineHeight] = useState(1.6)
  const [theme, setTheme] = useState('light')
  const [alignment, setAlignment] = useState('justify')
  
  // Animation hook
  const scrollY = useRef(new Animated.Value(0)).current
  const {
    headerHeight,
    headerContentOpacity,
    headerContentTranslateY,
    centeredTitleOpacity,
    HEADER_MAX_HEIGHT
  } = useHeaderAnimations(scrollY)

  // Image handling hook
  const { hasImage, handleImageError, handleImageLoad } = useImageHandler(
    announcement.image_url,
    imageError,
    setImageError
  )

  // Load formatting preferences on mount
  useEffect(() => {
    loadFormattingPreferences()
  }, [])

  // Save preferences whenever they change
  useEffect(() => {
    saveFormattingPreferences()
  }, [fontSize, lineHeight, theme, alignment])

  const loadFormattingPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(FORMATTING_STORAGE_KEY)
      if (stored) {
        const prefs = JSON.parse(stored)
        setFontSize(prefs.fontSize || 16)
        setLineHeight(prefs.lineHeight || 1.6)
        setTheme(prefs.theme || 'light')
        setAlignment(prefs.alignment || 'justify')
      }
    } catch (error) {
      console.log('Failed to load formatting preferences:', error)
    }
  }

  const saveFormattingPreferences = async () => {
    try {
      const prefs = { fontSize, lineHeight, theme, alignment }
      await AsyncStorage.setItem(FORMATTING_STORAGE_KEY, JSON.stringify(prefs))
    } catch (error) {
      console.log('Failed to save formatting preferences:', error)
    }
  }

  const handleBackPress = () => {
    navigation.goBack()
  }

  const handleMenuPress = () => {
    setShowFormatting(true)
  }

  // Custom link handler for the HTML content
  const handleLinkPress = async (url, text) => {
    try {
      if (url.startsWith('mailto:')) {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Cannot open email client');
        }
      } else if (url.startsWith('tel:')) {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Cannot make phone call');
        }
      } else {
        Alert.alert(
          'Open Link',
          `Do you want to open this link?\n\n${url}`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open',
              onPress: async () => {
                try {
                  const supported = await Linking.canOpenURL(url);
                  if (supported) {
                    await Linking.openURL(url);
                  } else {
                    Alert.alert('Error', `Cannot open URL: ${url}`);
                  }
                } catch (error) {
                  Alert.alert('Error', 'Failed to open link');
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process link');
    }
  };

  // Theme colors
  const themes = {
    light: { bg: '#ffffff', text: '#36454F', card: '#f8f9fa' },
    sepia: { bg: '#f4ecd8', text: '#5c4d3c', card: '#ede4d3' },
    dark: { bg: '#1a1a1a', text: '#e0e0e0', card: '#2d2d2d' }
  }

  const currentTheme = themes[theme]

  return (
    <View style={[viewStyles.container, { backgroundColor: currentTheme.bg }]}>
      {/* Status bar */}
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'light-content'} 
        backgroundColor="transparent" 
        translucent={true} 
      />
      
      {/* Animated Header */}
      <AnimatedHeader
        announcement={announcement}
        hasImage={hasImage}
        headerHeight={headerHeight}
        headerContentOpacity={headerContentOpacity}
        headerContentTranslateY={headerContentTranslateY}
        centeredTitleOpacity={centeredTitleOpacity}
        onBackPress={handleBackPress}
        onMenuPress={handleMenuPress}
        onImageError={handleImageError}
        onImageLoad={handleImageLoad}
        gradientColors={getGradientColors(announcement.category)}
        formatRelativeDate={formatRelativeDate}
      />

      {/* Scrollable Content */}
      <Animated.ScrollView 
        style={viewStyles.scrollView}
        contentContainerStyle={[
          viewStyles.content,
          { paddingTop: HEADER_MAX_HEIGHT + 30 }
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={[viewStyles.contentContainer, { backgroundColor: currentTheme.bg }]}>
          <HTMLRenderer
            html={announcement.content}
            style={[
              viewStyles.contentText,
              {
                fontSize: fontSize,
                lineHeight: fontSize * lineHeight,
                color: currentTheme.text,
                textAlign: alignment,
              }
            ]}
            selectable={true}
            onLinkPress={handleLinkPress}
          />
        </View>
      </Animated.ScrollView>

      {/* Text Formatting Modal */}
      <Modal
        visible={showFormatting}
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={() => setShowFormatting(false)}
      >
        <TouchableOpacity 
          style={viewStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFormatting(false)}
        >
          <TouchableOpacity 
            style={[viewStyles.modalContent, { backgroundColor: currentTheme.card }]}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={viewStyles.modalHeader}>
              <MaterialCommunityIcons name="format-text" size={24} color={currentTheme.text} />
              <Text style={[viewStyles.modalTitle, { color: currentTheme.text }]}>
                Text Formatting
              </Text>
              <TouchableOpacity onPress={() => setShowFormatting(false)}>
                <MaterialCommunityIcons name="close" size={24} color={currentTheme.text} />
              </TouchableOpacity>
            </View>

            <TextFormattingControls
              fontSize={fontSize}
              setFontSize={setFontSize}
              lineHeight={lineHeight}
              setLineHeight={setLineHeight}
              theme={theme}
              setTheme={setTheme}
              alignment={alignment}
              setAlignment={setAlignment}
              currentTheme={currentTheme}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}