import { Modal, View, Text, TouchableOpacity, Animated } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import styles from "./RegistrationSuccessModalStyle";

export default function RegistrationSuccessModal({ visible, onContinue }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (visible) {
      // Reset animations and countdown
      scaleAnim.setValue(0);
      checkmarkAnim.setValue(0);
      setCountdown(5);
      
      // Animate modal entrance
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Animate checkmark with delay
      setTimeout(() => {
        Animated.spring(checkmarkAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();
      }, 200);

      // Start countdown
      let counter = 5;
      const interval = setInterval(() => {
        counter -= 1;
        setCountdown(counter);
        
        if (counter <= 0) {
          clearInterval(interval);
          onContinue();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [visible]);

  const checkmarkScale = checkmarkAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.2, 1],
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Success Icon */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: checkmarkScale }],
              },
            ]}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={48} color="#fff" />
            </View>
          </Animated.View>

          {/* Success Message */}
          <Text style={styles.title}>Success! 🎉</Text>
          <Text style={styles.message}>
            Registration completed successfully!{"\n"}
            You are now logged in and can start using the app.
          </Text>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={onContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" style={styles.buttonIcon} />
          </TouchableOpacity>

          {/* Auto-close indicator with ACTUAL countdown */}
          <Text style={styles.autoCloseText}>
            Auto-closing in {countdown} {countdown === 1 ? 'second' : 'seconds'}...
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}