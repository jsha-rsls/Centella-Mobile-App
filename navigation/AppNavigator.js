import React, { useMemo, useCallback } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import TabNavigator from './TabNavigator'

// Import modal/overlay screens that should appear over tabs
import SideMenuScreen from '../screens/Home/components/SideMenuScreen'
import ViewAnnouncement from '../screens/Announcements/ViewAnnouncement'
import Payment from '../screens/Reservation/Payment/Payment'
import NotificationsScreen from '../screens/Home/components/NotificationsScreen'

// Import side menu screens
import Profile from '../screens/Home/sideMenuScreens/Profile/ProfileScreen'
import ReservationHistory from '../screens/Home/sideMenuScreens/ReservationHistory/ReservationHistory'
import ContactHoa from '../screens/Home/sideMenuScreens/ContactHoa/ContactHoa'
import Faqs from '../screens/Home/sideMenuScreens/Faqs/Faqs'

// Import settings screens
import ChangePassword from '../screens/Home/sideMenuScreens/Profile/Settings/ChangePassword'
import Notification from '../screens/Home/sideMenuScreens/Profile/Settings/Notification'

const Stack = createStackNavigator()

// âœ… Memoized screen options to prevent recreation
const defaultScreenOptions = { headerShown: false }

const cardScreenOptions = {
  presentation: 'card',
  animationTypeForReplace: 'push',
  headerShown: false,
}

const sideMenuOptions = {
  presentation: 'transparentModal',
  headerShown: false,
  cardStyle: { backgroundColor: 'transparent' },
  cardOverlayEnabled: false,
  gestureEnabled: true,
  animationTypeForReplace: 'push',
  // Faster, more responsive animation
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 1,
        useNativeDriver: true,
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 1,
        useNativeDriver: true,
      },
    },
  },
  cardStyleInterpolator: ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  }),
}

export default function AppNavigator({ userData, onLogout }) {
  // âœ… Memoized SideMenu component wrapper to prevent recreation
  const SideMenuWrapper = useCallback((props) => (
    <SideMenuScreen 
      {...props} 
      route={{
        ...props.route,
        params: {
          ...props.route.params,
          onLogout
        }
      }}
    />
  ), [onLogout])

  return (
    <Stack.Navigator 
      screenOptions={defaultScreenOptions}
      // Add screen listeners to handle navigation state
      screenListeners={{
        state: (e) => {
          // Optional: Add logging for debugging
          // console.log('Navigation state changed:', e.data)
        }
      }}
    >
      {/* Main Tab Navigator */}
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator}
      />
      
      {/* Modal screens that overlay the tabs */}
      <Stack.Screen 
        name="SideMenu"
        options={{
          ...sideMenuOptions,
          // Prevent multiple instances
          getId: () => 'side-menu'
        }}
        children={SideMenuWrapper}
      />
      
      {/* Notifications Screen */}
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={cardScreenOptions}
      />
      
      {/* Side Menu Screens - Using shared options */}
      <Stack.Screen 
        name="Profile" 
        component={Profile}
        options={cardScreenOptions}
      />
      
      <Stack.Screen 
        name="ReservationHistory" 
        component={ReservationHistory}
        options={cardScreenOptions}
      />
      
      <Stack.Screen 
        name="ContactHoa" 
        component={ContactHoa}
        options={cardScreenOptions}
      />
      
      <Stack.Screen 
        name="Faqs" 
        component={Faqs}
        options={cardScreenOptions}
      />
      
      {/* Settings Screens */}
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePassword}
        options={cardScreenOptions}
      />
      
      <Stack.Screen 
        name="Notification" 
        component={Notification}
        options={cardScreenOptions}
      />
      
      {/* Other Screens */}
      <Stack.Screen 
        name="ViewAnnouncement" 
        component={ViewAnnouncement}
        options={cardScreenOptions}
      />
      
      <Stack.Screen 
        name="Payment" 
        component={Payment}
        options={cardScreenOptions}
      />
    </Stack.Navigator>
  )
}