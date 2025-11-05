import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function TextFormattingControls({
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  theme,
  setTheme,
  alignment,
  setAlignment,
  currentTheme
}) {
  
  const spacingOptions = [
    { label: 'Compact', value: 1.4 },
    { label: 'Normal', value: 1.6 },
    { label: 'Relaxed', value: 1.8 }
  ]

  const themeOptions = [
    { key: 'light', label: 'Light', icon: 'white-balance-sunny' },
    { key: 'sepia', label: 'Sepia', icon: 'book-open-page-variant' },
    { key: 'dark', label: 'Dark', icon: 'moon-waning-crescent' }
  ]

  return (
    <View style={styles.container}>
      {/* Font Size Control */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: currentTheme.text }]}>Font Size</Text>
        <View style={styles.controlRow}>
          <TouchableOpacity
            onPress={() => setFontSize(Math.max(12, fontSize - 2))}
            disabled={fontSize <= 12}
            style={[
              styles.sizeButton,
              { backgroundColor: currentTheme.card },
              fontSize <= 12 && styles.disabledButton
            ]}
          >
            <Text style={[styles.sizeButtonText, { color: currentTheme.text }]}>A-</Text>
          </TouchableOpacity>

          <View style={[styles.valueDisplay, { backgroundColor: currentTheme.bg }]}>
            <Text style={[styles.valueText, { color: currentTheme.text }]}>{fontSize}</Text>
          </View>

          <TouchableOpacity
            onPress={() => setFontSize(Math.min(24, fontSize + 2))}
            disabled={fontSize >= 24}
            style={[
              styles.sizeButton,
              { backgroundColor: currentTheme.card },
              fontSize >= 24 && styles.disabledButton
            ]}
          >
            <Text style={[styles.sizeButtonTextLarge, { color: currentTheme.text }]}>A+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Line Spacing Control */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: currentTheme.text }]}>Line Spacing</Text>
        <View style={styles.controlRow}>
          {spacingOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setLineHeight(option.value)}
              style={[
                styles.optionButton,
                lineHeight === option.value 
                  ? styles.optionButtonActive 
                  : { backgroundColor: currentTheme.card }
              ]}
            >
              <Text style={[
                styles.optionButtonText,
                lineHeight === option.value 
                  ? styles.optionButtonTextActive 
                  : { color: currentTheme.text }
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Text Alignment Control */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: currentTheme.text }]}>Text Alignment</Text>
        <View style={styles.controlRow}>
          <TouchableOpacity
            onPress={() => setAlignment('left')}
            style={[
              styles.iconButton,
              alignment === 'left' 
                ? styles.optionButtonActive 
                : { backgroundColor: currentTheme.card }
            ]}
          >
            <MaterialCommunityIcons 
              name="format-align-left" 
              size={24} 
              color={alignment === 'left' ? '#fff' : currentTheme.text} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setAlignment('justify')}
            style={[
              styles.iconButton,
              alignment === 'justify' 
                ? styles.optionButtonActive 
                : { backgroundColor: currentTheme.card }
            ]}
          >
            <MaterialCommunityIcons 
              name="format-align-justify" 
              size={24} 
              color={alignment === 'justify' ? '#fff' : currentTheme.text} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Theme Control */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: currentTheme.text }]}>Theme</Text>
        <View style={styles.controlRow}>
          {themeOptions.map(option => (
            <TouchableOpacity
              key={option.key}
              onPress={() => setTheme(option.key)}
              style={[
                styles.themeButton,
                theme === option.key 
                  ? styles.optionButtonActive 
                  : { backgroundColor: currentTheme.card }
              ]}
            >
              <MaterialCommunityIcons 
                name={option.icon} 
                size={20} 
                color={theme === option.key ? '#fff' : currentTheme.text} 
              />
              <Text style={[
                styles.themeButtonText,
                theme === option.key 
                  ? styles.optionButtonTextActive 
                  : { color: currentTheme.text }
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  controlRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  sizeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sizeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sizeButtonTextLarge: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.3,
  },
  valueDisplay: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  optionButtonActive: {
    backgroundColor: '#3b82f6',
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  optionButtonTextActive: {
    color: '#fff',
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
})