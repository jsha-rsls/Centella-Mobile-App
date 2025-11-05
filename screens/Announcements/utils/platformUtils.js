import { Platform } from 'react-native'

export const getTabBarHeight = (insets) => {
  let tabBarHeight = 0
  
  try {
    const { useBottomTabBarHeight } = require('@react-navigation/bottom-tabs')
    tabBarHeight = useBottomTabBarHeight()
  } catch (error) {
    // Fallback heights when hook fails
    tabBarHeight = Platform.OS === 'ios' ? 82 : 68
  }

  // Calculate proper bottom padding that accounts for tab bar
  return Platform.OS === 'ios' 
    ? Math.max(tabBarHeight - insets.bottom, 20) 
    : tabBarHeight + 20
}