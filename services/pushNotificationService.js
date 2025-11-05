import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from '../utils/supabase'

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const pushNotificationService = {
  // Register for push notifications and save token to Supabase
  async registerForPushNotifications(userId) {
    try {
      // Check if running on physical device
      if (!Device.isDevice) {
        console.log('Push notifications only work on physical devices');
        return null;
      }

      // Check existing permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permissions if not granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }

      // Get the Expo push token
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      
      if (!projectId) {
        console.error('Project ID not found in app.json');
        return null;
      }

      const pushToken = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      console.log('📱 Got push token:', pushToken.data);

      // Configure Android channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });

        // Create announcement channel
        await Notifications.setNotificationChannelAsync('announcements', {
          name: 'Announcements',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          sound: 'default',
        });
      }

      // Save token to Supabase
      if (userId) {
        await this.savePushToken(userId, pushToken.data);
      }

      return pushToken.data;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  },

  // Save push token to Supabase
  async savePushToken(userId, token) {
    try {
      const deviceInfo = {
        platform: Platform.OS,
        osVersion: Platform.Version,
        deviceName: Device.deviceName,
        modelName: Device.modelName,
      };

      // Check if token already exists
      const { data: existing, error: checkError } = await supabase
        .from('push_tokens')
        .select('id')
        .eq('expo_push_token', token)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is fine
        console.error('Error checking existing token:', checkError);
      }

      if (existing) {
        // Update existing token
        const { error: updateError } = await supabase
          .from('push_tokens')
          .update({
            user_id: userId,
            device_info: deviceInfo,
            updated_at: new Date().toISOString(),
          })
          .eq('expo_push_token', token);

        if (updateError) {
          console.error('Error updating push token:', updateError);
          throw updateError;
        }

        console.log('✅ Updated push token in database');
      } else {
        // Insert new token
        const { error: insertError } = await supabase
          .from('push_tokens')
          .insert({
            user_id: userId,
            expo_push_token: token,
            device_info: deviceInfo,
          });

        if (insertError) {
          console.error('Error saving push token:', insertError);
          throw insertError;
        }

        console.log('✅ Saved push token to database');
      }
    } catch (error) {
      console.error('Error in savePushToken:', error);
      throw error;
    }
  },

  // Remove push token when user logs out
  async removePushToken(token) {
    try {
      const { error } = await supabase
        .from('push_tokens')
        .delete()
        .eq('expo_push_token', token);

      if (error) {
        console.error('Error removing push token:', error);
        throw error;
      }

      console.log('✅ Removed push token from database');
    } catch (error) {
      console.error('Error in removePushToken:', error);
      throw error;
    }
  },

  // Add notification response listener
  addNotificationResponseListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  },

  // Add notification received listener (when app is in foreground)
  addNotificationReceivedListener(callback) {
    return Notifications.addNotificationReceivedListener(callback);
  },

  // Schedule a local notification (for testing)
  async scheduleLocalNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  },

  // Get notification permissions status
  async getPermissionStatus() {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  },

  // Request notification permissions
  async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status;
  },
};