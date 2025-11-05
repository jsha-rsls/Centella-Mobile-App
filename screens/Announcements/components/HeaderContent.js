import { View, Text, Animated } from 'react-native'
import HTMLRenderer from '../HTMLRenderer'
import { viewStyles } from '../styles/viewStyles'
import { Ionicons } from '@expo/vector-icons'

export default function HeaderContent({
  announcement,
  headerContentOpacity,
  headerContentTranslateY,
  formatRelativeDate,
  adaptiveFontSize = 28
}) {
  const lineHeightValue = adaptiveFontSize * 1.3

  return (
    <Animated.View
      style={[
        viewStyles.gradientHeaderContent,
        {
          opacity: headerContentOpacity,
          transform: [{ translateY: headerContentTranslateY }]
        }
      ]}
    >
      {/* Title - Limited to 2 lines with ellipsis */}
      <HTMLRenderer
        html={announcement.title}
        style={[
          viewStyles.gradientHeaderTitle,
          { 
            fontSize: adaptiveFontSize, 
            lineHeight: lineHeightValue
          }
        ]}
        numberOfLines={2}
        ellipsizeMode="tail"
      />
      
      <View style={[viewStyles.metadataRow, viewStyles.gradientMetadataRow]}>
        <View style={[
          viewStyles.categoryPill,
          announcement.category.toLowerCase() === 'announcement' 
            ? viewStyles.announcementCategory 
            : viewStyles.updatesCategory
        ]}>
          <Text style={viewStyles.categoryText}>
            {announcement.category}
          </Text>
        </View>

        <Ionicons
          name="ellipse"
          size={6}
          color={viewStyles.gradientMetadataSeparator.color}
          style={viewStyles.metadataSeparator}
        />

        <Text style={[viewStyles.metadataText, viewStyles.gradientMetadataText]}>
          {formatRelativeDate(announcement.created_at)}
        </Text>

        <Ionicons
          name="ellipse"
          size={6}
          color={viewStyles.gradientMetadataSeparator.color}
          style={viewStyles.metadataSeparator}
        />

        <Text style={[viewStyles.metadataText, viewStyles.gradientMetadataText]}>
          {announcement.views} views
        </Text>
      </View>
    </Animated.View>
  )
}