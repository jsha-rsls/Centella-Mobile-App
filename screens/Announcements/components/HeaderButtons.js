import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { viewStyles } from '../styles/viewStyles'

export default function HeaderButtons({ onBackPress, onMenuPress }) {
  return (
    <>
      {/* Back Button */}
      <TouchableOpacity 
        style={viewStyles.backButton} 
        onPress={onBackPress}
        activeOpacity={0.7}
      >
        <View style={viewStyles.backButtonBackground}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </View>
      </TouchableOpacity>

      {/* Menu Button */}
      <TouchableOpacity 
        style={viewStyles.menuButton} 
        onPress={onMenuPress}
        activeOpacity={0.7}
      >
        <View style={viewStyles.menuButtonBackground}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#000" />
        </View>
      </TouchableOpacity>
    </>
  )
}