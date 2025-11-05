import React, { useState, useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Platform, Dimensions } from 'react-native';

// Screens
import HomeScreen from '../screens/Home/HomeScreen';
import ScheduleScreen from '../screens/Schedule/Schedule';
import AllAnnouncements from '../screens/Announcements/AllAnnouncements';
import SelectionScreen from '../screens/Reservation/Selection/Selection';

// Components
import TabChangeConfirmationModal from '../screens/Reservation/Selection/components/TabChangeConfirmationModal';
import VerificationRequiredModal from '../screens/Home/components/modals/VerificationRequiredModal';

// Context
import { SelectionContext } from './SelectionContext';

// Services
import { getCurrentUser } from '../services/residentService';
import { getResidentVerificationStatus } from '../services/residentVerificationService';

const Tab = createBottomTabNavigator();
const { width: screenWidth } = Dimensions.get('window');

const TabBarBackground = () => (
  <LinearGradient
    colors={["#F9E6E6", "#F2D5D5", "#F9E6E6"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '100%',
    }}
  />
);

export default function TabNavigator() {
  const [hasSelections, setHasSelections] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [targetRoute, setTargetRoute] = useState(null);
  const [navigationAction, setNavigationAction] = useState(null);
  const [isVerified, setIsVerified] = useState(true); // Default to true to avoid blocking on load
  const navigationRef = useRef(null);

  // Check verification status on mount and periodically
  useEffect(() => {
    checkVerificationStatus();
    
    // Poll verification status every 10 seconds
    const intervalId = setInterval(() => {
      checkVerificationStatus();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        const { isVerified: verified } = await getResidentVerificationStatus(user.id);
        setIsVerified(verified);
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  const getTabDisplayName = (routeName) => {
    const nameMap = {
      'Home': 'Home',
      'Announcements': 'News',
      'Reserve': 'Reserve',
      'Schedule': 'Schedule',
    };
    return nameMap[routeName] || routeName;
  };

  const handleTabPress = (e, routeName, navigation) => {
    // Check if trying to access Reserve tab without verification
    if (routeName === 'Reserve' && !isVerified) {
      e.preventDefault();
      setShowVerificationModal(true);
      return;
    }

    // Check for unsaved selections when leaving Reserve tab
    if (hasSelections && routeName !== 'Reserve') {
      e.preventDefault();
      setTargetRoute(routeName);
      setNavigationAction(() => () => navigation.navigate(routeName));
      setShowModal(true);
    }
  };

  const handleConfirmNavigation = () => {
    setShowModal(false);
    setHasSelections(false); // reset selection flag
    if (navigationAction) {
      navigationAction();
      setNavigationAction(null);
    }
    setTargetRoute(null);
  };

  const handleCancelNavigation = () => {
    setShowModal(false);
    setTargetRoute(null);
    setNavigationAction(null);
  };

  const handleCloseVerificationModal = () => {
    setShowVerificationModal(false);
  };

  return (
    <SelectionContext.Provider value={{ hasSelections, setHasSelections }}>
      <>
        <Tab.Navigator
          ref={navigationRef}
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color }) => {
              let iconName;
              switch (route.name) {
                case 'Home':
                  iconName = focused ? 'home' : 'home-outline';
                  break;
                case 'Announcements':
                  iconName = focused ? 'megaphone' : 'megaphone-outline';
                  break;
                case 'Reserve':
                  iconName = focused ? 'calendar' : 'calendar-outline';
                  break;
                case 'Schedule':
                  iconName = focused ? 'time' : 'time-outline';
                  break;
                default:
                  iconName = 'circle';
              }
              return <Ionicons name={iconName} size={20} color={color} />;
            },
            tabBarActiveTintColor: '#2d1b2e',
            tabBarInactiveTintColor: '#8a7a8b',
            tabBarStyle: {
              height: Platform.OS === 'ios' ? 82 : 68,
              paddingBottom: Platform.OS === 'ios' ? 24 : 16,
              paddingTop: 6,
              paddingHorizontal: 8,
              borderTopWidth: 0.5,
              borderTopColor: 'rgba(45, 27, 46, 0.15)',
              elevation: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.12,
              shadowRadius: 6,
              position: 'absolute',
            },
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: '600',
              marginTop: 2,
              marginBottom: 0,
              letterSpacing: 0.2,
              textAlign: 'center',
            },
            tabBarItemStyle: {
              paddingVertical: 2,
              paddingHorizontal: 4,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: screenWidth / 4 - 16,
            },
            tabBarIconStyle: {
              marginBottom: -2,
            },
            tabBarBackground: () => <TabBarBackground />,
            tabBarAllowFontScaling: false,
            tabBarHideOnKeyboard: true,
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ tabBarLabel: 'Home' }}
            listeners={({ navigation }) => ({
              tabPress: (e) => handleTabPress(e, 'Home', navigation),
            })}
          />
          <Tab.Screen
            name="Announcements"
            component={AllAnnouncements}
            options={{ tabBarLabel: 'News' }}
            listeners={({ navigation }) => ({
              tabPress: (e) => handleTabPress(e, 'Announcements', navigation),
            })}
          />
          <Tab.Screen
            name="Reserve"
            component={SelectionScreen}
            options={{ tabBarLabel: 'Reserve' }}
            listeners={({ navigation }) => ({
              tabPress: (e) => handleTabPress(e, 'Reserve', navigation),
            })}
          />
          <Tab.Screen
            name="Schedule"
            component={ScheduleScreen}
            options={{ tabBarLabel: 'Schedule' }}
            listeners={({ navigation }) => ({
              tabPress: (e) => handleTabPress(e, 'Schedule', navigation),
            })}
          />
        </Tab.Navigator>

        {/* Tab Change Confirmation Modal */}
        <TabChangeConfirmationModal
          visible={showModal}
          onConfirm={handleConfirmNavigation}
          onCancel={handleCancelNavigation}
          targetTabName={targetRoute ? getTabDisplayName(targetRoute) : ''}
        />

        {/* Verification Required Modal */}
        <VerificationRequiredModal
          visible={showVerificationModal}
          onClose={handleCloseVerificationModal}
          featureName="Facility Reservations"
        />
      </>
    </SelectionContext.Provider>
  );
}