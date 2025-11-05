// screens/Home/sideMenuScreens/ReservationHistory/components/ReservationHistorySkeleton.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ScrollView } from 'react-native';

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

// Tab Selector Skeleton
const TabSelectorSkeleton = () => {
  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabSkeleton}>
        <SkeletonItem width={80} height={16} borderRadius={4} />
      </View>
      <View style={styles.tabSkeleton}>
        <SkeletonItem width={80} height={16} borderRadius={4} />
      </View>
    </View>
  );
};

// Stats Cards Skeleton
const StatsCardsSkeleton = () => {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <SkeletonItem width={40} height={40} borderRadius={20} style={{ marginBottom: 8 }} />
        <SkeletonItem width={40} height={24} borderRadius={4} style={{ marginBottom: 4 }} />
        <SkeletonItem width={60} height={12} borderRadius={3} />
      </View>
      
      <View style={styles.statCard}>
        <SkeletonItem width={40} height={40} borderRadius={20} style={{ marginBottom: 8 }} />
        <SkeletonItem width={40} height={24} borderRadius={4} style={{ marginBottom: 4 }} />
        <SkeletonItem width={60} height={12} borderRadius={3} />
      </View>
    </View>
  );
};

// Reservation Item Skeleton
const ReservationItemSkeleton = () => {
  return (
    <View style={styles.reservationItem}>
      <View style={styles.itemLeft}>
        <SkeletonItem width={40} height={40} borderRadius={20} style={{ marginRight: 12 }} />
        <View style={styles.itemInfo}>
          <SkeletonItem width={120} height={16} borderRadius={3} style={{ marginBottom: 8 }} />
          <View style={styles.itemDetails}>
            <SkeletonItem width={80} height={12} borderRadius={3} />
            <SkeletonItem width={60} height={12} borderRadius={3} />
          </View>
        </View>
      </View>

      <View style={styles.itemRight}>
        <SkeletonItem width={80} height={20} borderRadius={10} style={{ marginBottom: 8 }} />
        <SkeletonItem width={60} height={14} borderRadius={3} />
      </View>
    </View>
  );
};

// Reservations List Skeleton
const ReservationsListSkeleton = () => {
  return (
    <View style={styles.section}>
      <SkeletonItem width={150} height={20} borderRadius={4} style={{ marginBottom: 16 }} />
      <View style={styles.listContainer}>
        {[1, 2, 3, 4].map((item) => (
          <ReservationItemSkeleton key={item} />
        ))}
      </View>
    </View>
  );
};

// Main Skeleton Component (without Header)
export default function ReservationHistorySkeleton({ insets }) {
  return (
    <View style={styles.wrapper}>
      <TabSelectorSkeleton />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <StatsCardsSkeleton />
        <ReservationsListSkeleton />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Tab Container Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabSkeleton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Stats Container Styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  // Section Styles
  section: {
    marginBottom: 24,
  },

  // List Container
  listContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  // Reservation Item Styles
  reservationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
});