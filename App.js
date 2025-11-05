import { useState, useEffect, useRef } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { Platform, StatusBar as RNStatusBar, View, StyleSheet, Animated, BackHandler } from "react-native"
import { StatusBar } from "expo-status-bar"
import * as Notifications from "expo-notifications"

import SplashScreen from "./screens/initialization/SplashScreen"
import LoginScreen from "./screens/Login/LoginScreen"
import RegistrationScreen from "./screens/Registration/RegistrationScreen"
import ResetPasswordScreen from "./screens/Login/ForgotPassword/ResetPassword"
import TermsConditionsScreen from "./screens/Registration/process/TermsConditionsScreen"
import PrivacyPolicyScreen from "./screens/Registration/process/PrivacyPolicyScreen"

import AppNavigator from "./navigation/AppNavigator"
import { useAutoLogin } from "./utils/AutoLoginHandler"
import ExitAppModal from "./screens/Home/components/modals/ExitAppModal"
import { pushNotificationService } from "./services/pushNotificationService"

const Stack = createStackNavigator()

// Configure notification handler for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

// Fade animation config
const fadeAnimation = {
  transitionSpec: {
    open: {
      animation: 'timing',
      config: { duration: 300, useNativeDriver: true },
    },
    close: {
      animation: 'timing',
      config: { duration: 300, useNativeDriver: true },
    },
  },
  cardStyleInterpolator: ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  }),
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState(null)
  const [splashDone, setSplashDone] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [autoLoginStatus, setAutoLoginStatus] = useState('checking') // 'checking' | 'success' | 'default'

  const fadeAnim = useRef(new Animated.Value(1)).current
  const navigationRef = useRef(null)
  const routeNameRef = useRef()
  const notificationListener = useRef()
  const responseListener = useRef()
  const currentPushToken = useRef(null)

  useEffect(() => {
    if (Platform.OS === "android") {
      RNStatusBar.setTranslucent(true)
      RNStatusBar.setBackgroundColor("transparent")
    }
  }, [])

  // Setup push notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated && userData?.id) {
      setupPushNotifications()
    }

    return () => {
      // Cleanup notification listeners
      if (notificationListener.current) {
        notificationListener.current.remove()
      }
      if (responseListener.current) {
        responseListener.current.remove()
      }
    }
  }, [isAuthenticated, userData])

  const setupPushNotifications = async () => {
    try {
      console.log('🔧 Setting up push notifications...');
      console.log('👤 User data:', userData);
      
      // CRITICAL: Use auth_user_id, not the residents table id
      const authUserId = userData.auth_user_id || userData.authUserId;
      
      if (!authUserId) {
        console.error('❌ No auth_user_id found in userData!');
        console.error('Available userData keys:', Object.keys(userData));
        return;
      }

      console.log('🔑 Using auth_user_id:', authUserId);

      // Register for push notifications with the correct UUID
      const token = await pushNotificationService.registerForPushNotifications(authUserId);
      
      if (token) {
        currentPushToken.current = token;
        console.log('✅ Push notifications registered successfully');
      } else {
        console.warn('⚠️ Push notification registration returned null');
      }

      // Listen for notifications received while app is in foreground
      notificationListener.current = pushNotificationService.addNotificationReceivedListener(
        (notification) => {
          console.log('📬 Notification received:', notification);
        }
      );

      // Listen for notification taps
      responseListener.current = pushNotificationService.addNotificationResponseListener(
        (response) => {
          console.log('📱 Notification tapped:', response);
          
          const data = response.notification.request.content.data;
          
          // Handle navigation based on notification data
          if (data.type === 'announcement' && data.announcementId) {
            if (navigationRef.current) {
              navigationRef.current.navigate('App', {
                screen: 'Announcements',
                params: {
                  screen: 'AnnouncementDetail',
                  params: { announcementId: data.announcementId }
                }
              });
            }
          } else if (data.screen) {
            if (navigationRef.current) {
              navigationRef.current.navigate(data.screen, data.params || {});
            }
          }
        }
      );
    } catch (error) {
      console.error('❌ Error setting up push notifications:', error);
      console.error('Error details:', error.message);
    }
  };

  // Hardware back button handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (!isAuthenticated || !splashDone) {
          return false // Allow default behavior during splash or login
        }

        // Get current route name
        const currentRouteName = routeNameRef.current

        console.log('Current route:', currentRouteName) // Debug log

        // Main tab screens where we should show exit modal
        const mainTabScreens = ['Home', 'Announcements', 'Reserve', 'Schedule']
        
        if (mainTabScreens.includes(currentRouteName)) {
          setShowExitModal(true)
          return true // Prevent default back behavior
        }
        
        return false // Allow default back behavior (navigate back)
      }
    )

    return () => backHandler.remove()
  }, [isAuthenticated, splashDone])

  // Handle auto-login (runs in background, doesn't block splash)
  useAutoLogin(
    // On auto-login success
    (autoLoginUserData) => {
      setAutoLoginStatus('success')
      setUserData(autoLoginUserData)
      setIsAuthenticated(true)
    },
    // On auto-login fail or not enabled
    () => {
      setAutoLoginStatus('default')
      // Do nothing, user will see login screen
    }
  )

  const handleSplashComplete = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      setSplashDone(true)
    })
  }

  const handleAuthenticate = (authStatus, userData = null) => {
    setIsAuthenticated(authStatus)
    setUserData(userData)
  }

  const handleLogout = async () => {
    // Remove push token before logout
    if (currentPushToken.current) {
      try {
        await pushNotificationService.removePushToken(currentPushToken.current)
        currentPushToken.current = null
      } catch (error) {
        console.error('Error removing push token:', error)
      }
    }

    setIsAuthenticated(false)
    setUserData(null)
    setAutoLoginStatus('default')
  }

  const handleExitApp = () => {
    setShowExitModal(false)
    BackHandler.exitApp()
  }

  const handleCancelExit = () => {
    setShowExitModal(false)
  }

  return (
    <View style={styles.container}>
      <NavigationContainer 
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current
          const currentRouteName = navigationRef.current?.getCurrentRoute()?.name

          if (previousRouteName !== currentRouteName) {
            console.log('Route changed to:', currentRouteName) // Debug log
          }

          // Save the current route name for later comparison
          routeNameRef.current = currentRouteName
        }}
      >
        <StatusBar style="light" translucent={true} />
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            animationEnabled: true,
          }}
        >
          {!isAuthenticated ? (
            <>
              <Stack.Screen 
                name="Login"
                options={{
                  animationTypeForReplace: 'pop',
                }}
              >
                {(props) => (
                  <LoginScreen {...props} onAuthenticate={handleAuthenticate} />
                )}
              </Stack.Screen>

              <Stack.Screen 
                name="Register" 
                component={RegistrationScreen}
                options={{
                  ...fadeAnimation,
                  presentation: 'card',
                }}
              />

              <Stack.Screen 
                name="ResetPassword" 
                component={ResetPasswordScreen}
                options={{
                  ...fadeAnimation,
                  presentation: 'card',
                }}
              />

              {/* Add Terms & Privacy screens to unauthenticated stack */}
              <Stack.Screen 
                name="TermsConditions" 
                component={TermsConditionsScreen}
                options={{
                  ...fadeAnimation,
                  presentation: 'card',
                }}
              />

              <Stack.Screen 
                name="PrivacyPolicy" 
                component={PrivacyPolicyScreen}
                options={{
                  ...fadeAnimation,
                  presentation: 'card',
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="App">
                {(props) => (
                  <AppNavigator 
                    {...props} 
                    userData={userData} 
                    onLogout={handleLogout}
                  />
                )}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>

      {/* Splash Screen Overlay */}
      {!splashDone && (
        <Animated.View style={[styles.splashOverlay, { opacity: fadeAnim }]}>
          <SplashScreen
            onTransitionComplete={handleSplashComplete}
            loadingDuration={3500}
            transitionDuration={500}
            autoLoginStatus={autoLoginStatus}
          />
        </Animated.View>
      )}

      {/* Exit App Confirmation Modal */}
      <ExitAppModal
        visible={showExitModal}
        onConfirm={handleExitApp}
        onCancel={handleCancelExit}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#231828",
  },
  splashOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: "#231828",
  },
})