import { View, Text, TouchableOpacity } from 'react-native'
import { styles } from "../styles/aAnnouncement"

export default function EmptyState({ searchQuery, activeFilter, onClearFilters }) {
  if (searchQuery.trim() || activeFilter !== 'all') {
    return (
      <View style={styles.emptyStateCard}>
        <Text style={styles.emptyIcon}>📖</Text>
        <Text style={styles.emptyText}>No matching announcements</Text>
        <Text style={styles.emptySubtext}>
          {searchQuery.trim() 
            ? `No results found for "${searchQuery}"` 
            : `No ${activeFilter} announcements available`}
        </Text>
        <TouchableOpacity 
          onPress={onClearFilters}
          style={styles.clearSearchButton}
        >
          <Text style={styles.clearSearchButtonText}>Clear search and filters</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.emptyStateCard}>
      <Text style={styles.emptyIcon}>📢</Text>
      <Text style={styles.emptyText}>No announcements available</Text>
      <Text style={styles.emptySubtext}>New updates will appear here</Text>
    </View>
  )
}