import React, { useState, useRef, useEffect, useCallback } from 'react'
import { View, Text, TouchableOpacity, TextInput, Platform, Dimensions, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { getAnnouncementBadge } from '../../../utils/announcementUtils'
import { styles } from './styles/searchHeaderStyles'

export default function SearchHeader({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  announcements = []
}) {
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)
  const searchInputRef = useRef(null)
  const debounceTimer = useRef(null)

  // Get screen dimensions for dynamic sizing
  const { width: screenWidth } = Dimensions.get('window')
  
  // Calculate dynamic font sizes based on screen width and platform
  const getDynamicFontSizes = () => {
    const baseWidth = 375 // iPhone SE width as base
    const scale = screenWidth / baseWidth
    
    return {
      filterChipText: Platform.OS === 'ios' 
        ? Math.max(12, Math.min(14, 12 * scale))
        : Math.max(11, Math.min(13, 11 * scale)),
      dropdownText: Platform.OS === 'ios'
        ? Math.max(15, Math.min(17, 15 * scale))
        : Math.max(14, Math.min(16, 14 * scale)),
      searchPlaceholder: Platform.OS === 'ios'
        ? Math.max(15, Math.min(17, 15 * scale))
        : Math.max(14, Math.min(16, 14 * scale))
    }
  }

  const fontSizes = getDynamicFontSizes()

  // Debounced search effect
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [searchQuery])

  const getFilterCounts = useCallback(() => {
    const counts = {
      all: announcements.length,
      new: 0,
      recent: 0,
      today: 0,
      yesterday: 0,
      announcements: 0,
      updates: 0
    }
    
    announcements.forEach(announcement => {
      const badgeInfo = getAnnouncementBadge(announcement.created_at)
      if (badgeInfo) {
        counts[badgeInfo.type]++
      }
      
      // Use the actual category field from database
      if (announcement.category) {
        const category = announcement.category.toLowerCase()
        if (category === 'updates' || category === 'update') {
          counts.updates++
        } else if (category === 'announcements' || category === 'announcement') {
          counts.announcements++
        } else {
          // If category doesn't match expected values, default to announcements
          counts.announcements++
        }
      } else {
        // If no category field, default to announcements
        counts.announcements++
      }
    })
    
    return counts
  }, [announcements])

  const handleFilterPress = (filter) => {
    setActiveFilter(filter)
    if (filter !== 'all') {
      setSearchQuery('') // Clear search when changing filter
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setDebouncedQuery('')
  }

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible)
  }

  const getFilterIcon = (filterKey) => {
    const icons = {
      all: 'apps',
      new: 'star',
      recent: 'time',
      today: 'today',
      yesterday: 'calendar',
      announcements: 'megaphone',
      updates: 'refresh'
    }
    return icons[filterKey] || 'filter'
  }

  const renderFilterChip = (filterKey, label, count, isActive = false) => {
    if (count === 0 && filterKey !== 'all') return null
    
    return (
      <TouchableOpacity
        key={filterKey}
        style={[
          styles.filterChip,
          isActive && styles.filterChipActive
        ]}
        onPress={() => handleFilterPress(filterKey)}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={getFilterIcon(filterKey)} 
          size={14} 
          color={isActive ? '#3B82F6' : '#666'} 
          style={styles.filterChipIcon}
        />
        <Text style={[
          styles.filterChipText,
          isActive && styles.filterChipTextActive,
          { fontSize: fontSizes.filterChipText }
        ]}>
          {label}
        </Text>
        {count > 0 && (
          <View style={[
            styles.filterChipBadge,
            isActive && styles.filterChipBadgeActive
          ]}>
            <Text style={[
              styles.filterChipBadgeText,
              isActive && styles.filterChipBadgeTextActive,
              { fontSize: fontSizes.filterChipText - 1 }
            ]}>
              {count}
            </Text>
          </View>
        )}
        {isActive && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation()
              handleFilterPress('all')
            }}
            style={styles.filterChipClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={12} color="#3B82F6" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    )
  }

  const counts = getFilterCounts()
  
  // All filter chips in order of importance
  const allFilters = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'new', label: 'New', count: counts.new },
    { key: 'recent', label: 'Recent', count: counts.recent },
    { key: 'today', label: 'Today', count: counts.today },
    { key: 'yesterday', label: 'Yesterday', count: counts.yesterday },
    { key: 'announcements', label: 'Announcements', count: counts.announcements },
    { key: 'updates', label: 'Updates', count: counts.updates }
  ]

  return (
    <View style={styles.container}>
      {/* Search Bar with Filter Toggle */}
      <View style={styles.searchRow}>
        <TouchableOpacity
          style={[
            styles.filterToggleButton,
            filtersVisible && styles.filterToggleButtonActive
          ]}
          onPress={toggleFilters}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="options" 
            size={20} 
            color={filtersVisible ? '#3B82F6' : '#666'} 
          />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#666" style={styles.searchIcon} />
          <TextInput
            ref={searchInputRef}
            style={[styles.searchInput, { fontSize: fontSizes.searchPlaceholder }]}
            placeholder="Search something..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <View style={styles.clearButtonContainer}>
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton} activeOpacity={0.7}>
                <Ionicons name="close-circle" size={18} color="#666" />
              </TouchableOpacity>
            </View>
          )}
          {searchQuery !== debouncedQuery && (
            <View style={styles.searchingIndicator}>
              <View style={styles.searchingDot} />
            </View>
          )}
        </View>
      </View>

      {/* Collapsible Filter Chips Row */}
      {filtersVisible && (
        <View style={styles.filterChipsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsScrollContent}
            style={styles.filterChipsScroll}
          >
            {allFilters.map(filter => 
              renderFilterChip(filter.key, filter.label, filter.count, activeFilter === filter.key)
            )}
          </ScrollView>
        </View>
      )}

      {/* Active Search/Filter Indicator */}
      {(searchQuery.trim() || activeFilter !== 'all') && (
        <View style={styles.activeIndicatorContainer}>
          <Text style={styles.activeIndicatorText}>
            {searchQuery.trim() 
              ? `Searching for "${searchQuery}"${activeFilter !== 'all' ? ` in ${activeFilter}` : ''}`
              : `Showing ${activeFilter === 'announcements' ? 'general announcements' : activeFilter === 'updates' ? 'updates' : activeFilter} only`
            }
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSearchQuery('')
              setActiveFilter('all')
            }}
            style={styles.clearAllButton}
          >
            <Text style={styles.clearAllButtonText}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}