import { View, Text, Animated } from 'react-native'
import { styles } from "../styles/aAnnouncement"
import AnnouncementCard from './AnnouncementCard'
import EmptyState from './EmptyState'
import ErrorState from './ErrorState'

export default function AnnouncementList({
  announcements,
  contentReady,
  contentOpacity,
  contentStaggerAnims,
  showSkeleton,
  searchQuery,
  activeFilter,
  error,
  viewingAnnouncement,
  badgeAnimations,
  onAnnouncementPress,
  onRefresh,
  onClearFilters
}) {
  if (!contentReady) {
    return null
  }

  const renderContent = () => {
    if (error) {
      return (
        <ErrorState 
          error={error} 
          onRetry={onRefresh} 
        />
      )
    }

    if (announcements.length === 0) {
      return (
        <EmptyState
          searchQuery={searchQuery}
          activeFilter={activeFilter}
          onClearFilters={onClearFilters}
        />
      )
    }

    return (
      <>
        {announcements.map((announcement, index) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            index={index}
            contentStaggerAnims={contentStaggerAnims}
            searchQuery={searchQuery}
            viewingAnnouncement={viewingAnnouncement}
            badgeAnimations={badgeAnimations}
            onPress={onAnnouncementPress}
          />
        ))}
      </>
    )
  }

  return (
    <Animated.View style={{ 
      opacity: contentOpacity
    }}>
      <View style={styles.subtitleContainer}>
        {(searchQuery.trim() || activeFilter !== 'all') && (
          <Text style={styles.resultCountText}>
            {`${announcements.length} ${announcements.length === 1 ? 'result' : 'results'}`}
          </Text>
        )}
      </View>

      {renderContent()}
    </Animated.View>
  )
}