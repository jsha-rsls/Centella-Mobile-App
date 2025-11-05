// screens/Home/sideMenuScreens/ReservationHistory/index.js
import { View, ScrollView, RefreshControl } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import { useState } from "react"
import Header from "./components/Header"
import TabSelector from "./components/TabSelector"
import StatsCards from "./components/StatsCards"
import ReservationsList from "./components/ReservationsList"
import EmptyState from "./components/EmptyState"
import LoadingState from "./components/LoadingState"
import ErrorState from "./components/ErrorState"
import useReservations from "./hooks/useReservations"
import styles from "./styles"

export default function ReservationHistory({ navigation }) {
  const insets = useSafeAreaInsets()
  const [activeTab, setActiveTab] = useState('current')
  
  const {
    currentReservations,
    pastReservations,
    stats,
    loading,
    refreshing,
    error,
    onRefresh,
    retry
  } = useReservations()

  if (loading) {
    return (
      <LoadingState 
        insets={insets} 
        navigation={navigation} 
        activeTab={activeTab}
      />
    )
  }

  if (error) {
    return (
      <ErrorState 
        insets={insets}
        navigation={navigation}
        error={error}
        onRetry={retry}
        activeTab={activeTab}
      />
    )
  }

  const isCurrentTab = activeTab === 'current'
  const displayedReservations = isCurrentTab ? currentReservations : pastReservations

  const handleReservationCancelled = () => {
    onRefresh()
  }

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="dark" />
      
      <Header 
        navigation={navigation}
        activeTab={activeTab}
        insets={insets}
      />

      <TabSelector 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentCount={currentReservations.length}
        historyCount={pastReservations.length}
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2d1b2e"
            colors={["#2d1b2e"]}
          />
        }
      >
        {displayedReservations.length > 0 && (
          <StatsCards 
            activeTab={activeTab}
            stats={stats}
          />
        )}

        {displayedReservations.length === 0 ? (
          <EmptyState 
            isCurrentTab={isCurrentTab}
            navigation={navigation}
          />
        ) : (
          <ReservationsList 
            reservations={displayedReservations}
            isCurrentTab={isCurrentTab}
            onReservationCancelled={handleReservationCancelled}
          />
        )}
      </ScrollView>
    </View>
  )
}