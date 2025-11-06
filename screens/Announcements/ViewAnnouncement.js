import { View, Text, StatusBar, Animated, TouchableOpacity, Modal, useWindowDimensions } from 'react-native'
import { useState, useRef, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import RenderHTML from 'react-native-render-html'
import { WebView } from 'react-native-webview'
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
  const { width } = useWindowDimensions()
  const [imageError, setImageError] = useState(false)
  const [showFormatting, setShowFormatting] = useState(false)
  const [webViewUrl, setWebViewUrl] = useState(null)
  const [showWebView, setShowWebView] = useState(false)
  
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

  // Custom link handler - Open in WebView
  const handleLinkPress = (event, href, htmlAttribs) => {
    // Open link in WebView modal
    setWebViewUrl(href)
    setShowWebView(true)
  }

  // Theme colors
  const themes = {
    light: { bg: '#ffffff', text: '#36454F', card: '#f8f9fa', border: '#e5e7eb' },
    sepia: { bg: '#f4ecd8', text: '#5c4d3c', card: '#ede4d3', border: '#d4c5b0' },
    dark: { bg: '#1a1a1a', text: '#e0e0e0', card: '#2d2d2d', border: '#404040' }
  }

  const currentTheme = themes[theme]

  // HTML styles configuration - More accurate to web version
  const tagsStyles = {
    body: {
      fontSize: fontSize,
      lineHeight: fontSize * lineHeight,
      color: currentTheme.text,
      textAlign: alignment,
      fontFamily: 'System',
    },
    p: {
      marginTop: 0,
      marginBottom: 16,
      color: currentTheme.text,
    },
    div: {
      color: currentTheme.text,
    },
    span: {
      color: currentTheme.text,
    },
    strong: {
      fontWeight: '700',
      color: currentTheme.text,
    },
    b: {
      fontWeight: '700',
      color: currentTheme.text,
    },
    em: {
      fontStyle: 'italic',
      color: currentTheme.text,
    },
    i: {
      fontStyle: 'italic',
      color: currentTheme.text,
    },
    u: {
      textDecorationLine: 'underline',
      color: currentTheme.text,
    },
    h1: {
      fontSize: Math.round(fontSize * 2),
      fontWeight: '700',
      marginTop: 20,
      marginBottom: 16,
      color: currentTheme.text,
      lineHeight: Math.round(fontSize * 2 * 1.2),
    },
    h2: {
      fontSize: Math.round(fontSize * 1.75),
      fontWeight: '700',
      marginTop: 18,
      marginBottom: 14,
      color: currentTheme.text,
      lineHeight: Math.round(fontSize * 1.75 * 1.2),
    },
    h3: {
      fontSize: Math.round(fontSize * 1.5),
      fontWeight: '700',
      marginTop: 16,
      marginBottom: 12,
      color: currentTheme.text,
      lineHeight: Math.round(fontSize * 1.5 * 1.2),
    },
    h4: {
      fontSize: Math.round(fontSize * 1.25),
      fontWeight: '700',
      marginTop: 14,
      marginBottom: 10,
      color: currentTheme.text,
      lineHeight: Math.round(fontSize * 1.25 * 1.2),
    },
    h5: {
      fontSize: Math.round(fontSize * 1.125),
      fontWeight: '700',
      marginTop: 12,
      marginBottom: 8,
      color: currentTheme.text,
      lineHeight: Math.round(fontSize * 1.125 * 1.2),
    },
    h6: {
      fontSize: fontSize,
      fontWeight: '700',
      marginTop: 10,
      marginBottom: 6,
      color: currentTheme.text,
      lineHeight: Math.round(fontSize * 1.2),
    },
    a: {
      color: '#2563eb',
      textDecorationLine: 'underline',
      textDecorationColor: '#2563eb',
    },
    ul: {
      marginTop: 0,
      marginBottom: 16,
      paddingLeft: 20,
      color: currentTheme.text,
    },
    ol: {
      marginTop: 0,
      marginBottom: 16,
      paddingLeft: 20,
      color: currentTheme.text,
    },
    li: {
      marginBottom: 8,
      color: currentTheme.text,
    },
    blockquote: {
      marginTop: 16,
      marginBottom: 16,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 8,
      paddingBottom: 8,
      borderLeftWidth: 4,
      borderLeftColor: currentTheme.border,
      fontStyle: 'italic',
      color: currentTheme.text,
      backgroundColor: currentTheme.card,
    },
    code: {
      fontFamily: 'Courier',
      backgroundColor: currentTheme.card,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      color: '#e11d48',
      fontSize: fontSize * 0.9,
    },
    pre: {
      fontFamily: 'Courier',
      backgroundColor: currentTheme.card,
      padding: 16,
      borderRadius: 8,
      marginTop: 16,
      marginBottom: 16,
      color: currentTheme.text,
      borderWidth: 1,
      borderColor: currentTheme.border,
      fontSize: fontSize * 0.9,
    },
    table: {
      marginTop: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: currentTheme.border,
      borderRadius: 8,
      overflow: 'hidden',
    },
    thead: {
      backgroundColor: currentTheme.card,
    },
    th: {
      fontWeight: '700',
      padding: 12,
      borderWidth: 1,
      borderColor: currentTheme.border,
      backgroundColor: currentTheme.card,
      color: currentTheme.text,
      textAlign: 'left',
    },
    td: {
      padding: 12,
      borderWidth: 1,
      borderColor: currentTheme.border,
      color: currentTheme.text,
    },
    tr: {
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.border,
    },
    img: {
      marginTop: 16,
      marginBottom: 16,
      borderRadius: 8,
    },
    hr: {
      marginTop: 16,
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.border,
    },
  }

  // Class styles for better web compatibility
  const classesStyles = {
    'text-center': {
      textAlign: 'center',
    },
    'text-right': {
      textAlign: 'right',
    },
    'text-left': {
      textAlign: 'left',
    },
    'font-bold': {
      fontWeight: '700',
    },
    'italic': {
      fontStyle: 'italic',
    },
    'underline': {
      textDecorationLine: 'underline',
    },
  }

  // Custom renderers props
  const renderersProps = {
    a: {
      onPress: handleLinkPress,
    },
    img: {
      enableExperimentalPercentWidth: true,
    },
  }

  return (
    <View style={[viewStyles.container, { backgroundColor: currentTheme.bg }]}>
      {/* Status bar */}
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
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
          { paddingTop: HEADER_MAX_HEIGHT + 30, paddingBottom: 40 }
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={[viewStyles.contentContainer, { backgroundColor: currentTheme.bg }]}>
          <RenderHTML
            contentWidth={width - 40}
            source={{ html: announcement.content || '<p>No content available</p>' }}
            tagsStyles={tagsStyles}
            classesStyles={classesStyles}
            renderersProps={renderersProps}
            defaultTextProps={{
              selectable: true,
            }}
            enableExperimentalMarginCollapsing={true}
            enableCSSInlineProcessing={true}
            systemFonts={['System']}
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

      {/* WebView Modal for Links */}
      <Modal
        visible={showWebView}
        animationType="slide"
        statusBarTranslucent={true}
        onRequestClose={() => setShowWebView(false)}
      >
        <View style={{ flex: 1, backgroundColor: currentTheme.bg }}>
          {/* WebView Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: StatusBar.currentHeight || 44,
            paddingHorizontal: 16,
            paddingBottom: 12,
            backgroundColor: currentTheme.card,
            borderBottomWidth: 1,
            borderBottomColor: currentTheme.border,
          }}>
            <TouchableOpacity 
              onPress={() => setShowWebView(false)}
              style={{
                padding: 8,
                borderRadius: 8,
              }}
            >
              <MaterialCommunityIcons name="close" size={24} color={currentTheme.text} />
            </TouchableOpacity>
            <Text 
              style={{ 
                flex: 1, 
                marginHorizontal: 16, 
                fontSize: 14, 
                color: currentTheme.text,
                fontWeight: '500',
              }}
              numberOfLines={1}
            >
              {webViewUrl}
            </Text>
          </View>

          {/* WebView */}
          {webViewUrl && (
            <WebView
              source={{ uri: webViewUrl }}
              style={{ flex: 1 }}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: currentTheme.bg,
                }}>
                  <MaterialCommunityIcons 
                    name="loading" 
                    size={40} 
                    color={currentTheme.text} 
                  />
                  <Text style={{ 
                    marginTop: 12, 
                    color: currentTheme.text,
                    fontSize: 14,
                  }}>
                    Loading...
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      </Modal>
    </View>
  )
}