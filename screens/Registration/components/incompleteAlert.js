import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  useEffect,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import styles from './incompleteAlertStyle';

const IncompleteAlert = ({ visible, onClose, title, message }) => {
  // Shared values
  const overlayOpacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const cardOpacity = useSharedValue(0);

    React.useEffect(() => {
    if (visible) {
        // OPEN animation
        overlayOpacity.value = withTiming(1, { duration: 180 }); // faster fade-in
        cardOpacity.value = withTiming(1, { duration: 220 });
        scale.value = withSpring(1, { damping: 15, stiffness: 180 }); // snappy
    } else {
        // CLOSE animation
        overlayOpacity.value = withTiming(0, { duration: 300 }); // slower fade-out
        cardOpacity.value = withTiming(0, { duration: 280 });
        scale.value = withTiming(0.9, { duration: 220 }); // shrink before fade-out
    }
    }, [visible]);

  // Animated styles
  const overlayStyle = useAnimatedStyle(() => ({
    backgroundColor: 'rgba(0,0,0,0.6)',
    opacity: overlayOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="none" // handled by Reanimated
    >
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Animated.View style={[styles.alertContainer, cardStyle]}>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>{title}</Text>

            <View style={styles.iconContainer}>
              <Ionicons
                name="alert-circle-outline"
                size={50}
                color="#F59E0B"
              />
            </View>

            <Text style={styles.alertMessage}>{message}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default IncompleteAlert;
