import { View, Text, TouchableOpacity } from 'react-native'
import { styles } from "../styles/aAnnouncement"

export default function ErrorState({ error, onRetry }) {
  return (
    <View style={styles.errorCard}>
      <Text style={styles.errorText}>
        {error}
      </Text>
      <TouchableOpacity onPress={onRetry} style={styles.errorButton}>
        <Text style={styles.errorButtonText}>
          Try Again
        </Text>
      </TouchableOpacity>
    </View>
  )
}