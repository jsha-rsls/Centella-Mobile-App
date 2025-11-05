import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { styles } from "../styles/FacilitySelector-Styles"

export default function FacilitySelector({ facilities, selectedFacility, onFacilitySelect }) {
  return (
    <View style={styles.facilitySelector}>
      <Text style={styles.helperText}>
        Choose a facility to view its reservations
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.facilityScrollContainer}
      >
        {facilities.map((facility) => (
          <TouchableOpacity
            key={facility.id}
            style={[
              styles.facilityButton,
              selectedFacility === facility.name && styles.facilityButtonSelected
            ]}
            onPress={() => onFacilitySelect(facility.name)}
          >
            <Text
              style={[
                styles.facilityButtonText,
                selectedFacility === facility.name && styles.facilityButtonTextSelected,
              ]}
            >
              {facility.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}