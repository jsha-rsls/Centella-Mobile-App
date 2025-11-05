import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Skeleton shimmer animation component
const SkeletonItem = ({ width, height, borderRadius = 8, style }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#e0e0e0',
          opacity,
        },
        style,
      ]}
    />
  );
};

// Selection Summary Skeleton
const SelectionSummarySkeleton = () => {
  return (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryTitleContainer}>
        <SkeletonItem width={120} height={18} borderRadius={4} />
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryItem}>
          <SkeletonItem width={60} height={14} borderRadius={3} />
          <SkeletonItem width={100} height={14} borderRadius={3} />
        </View>

        <View style={styles.summaryItem}>
          <SkeletonItem width={80} height={14} borderRadius={3} />
          <SkeletonItem width={120} height={14} borderRadius={3} />
        </View>

        <View style={styles.summaryItem}>
          <SkeletonItem width={50} height={14} borderRadius={3} />
          <SkeletonItem width={90} height={14} borderRadius={3} />
        </View>
      </View>
    </View>
  );
};

// Facility Picker Header Skeleton
const FacilityPickerHeaderSkeleton = () => {
  return (
    <View style={styles.facilityHeaderContainer}>
      <View style={styles.facilityHeaderContent}>
        <SkeletonItem width={160} height={20} borderRadius={4} style={{ marginBottom: 6 }} />
        <SkeletonItem width={120} height={14} borderRadius={3} />
      </View>
      <LinearGradient
        colors={['rgba(248,249,250,0.8)', 'rgba(248,249,250,0)']}
        style={styles.fadeGradient}
        pointerEvents="none"
      />
    </View>
  );
};

// Facility Grid Skeleton
const FacilityGridSkeleton = () => {
  return (
    <View style={styles.facilityGrid}>
      {[1, 2].map((item) => (
        <View key={item} style={styles.facilityCard}>
          <SkeletonItem width={30} height={30} borderRadius={20} style={{ marginBottom: 12 }} />
          <SkeletonItem width="80%" height={16} borderRadius={3} style={{ marginBottom: 6 }} />
          <SkeletonItem width="60%" height={14} borderRadius={3} />
        </View>
      ))}
    </View>
  );
};

// Main Skeleton Component (without StepIndicator and SafeAreaView)
export default function SelectionSkeleton() {
  return (
    <View style={styles.wrapper}>
      <SelectionSummarySkeleton />
      <FacilityPickerHeaderSkeleton />
      <View style={styles.contentContainer}>
        <FacilityGridSkeleton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Selection Summary Styles
  summaryContainer: {
    backgroundColor: '#ffffff',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(45, 27, 46, 0.08)',
    minHeight: 100,
    shadowColor: '#2d1b2e',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryTitleContainer: {
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryGrid: {
    gap: 4,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 20,
    paddingVertical: 2,
  },

  // Facility Header Styles
  facilityHeaderContainer: {
    position: 'relative',
    zIndex: 1,
  },
  facilityHeaderContent: {
    alignItems: 'center',
    marginBottom: 6,
    marginHorizontal: 36,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fadeGradient: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    height: 20,
    zIndex: 2,
  },

  // Content Container
  contentContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Facility Grid Styles
  facilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
    paddingBottom: 20,
    paddingTop: 38,
  },
  facilityCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    width: '47%',
    marginBottom: 16,
  },
});