import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { facilityPickerStyles } from "../styles/FacilityPickerStyles";

// Separate header component with fade effect
export function FacilityPickerHeader() {
  return (
    <View style={facilityPickerStyles.headerContainer}>
      <View style={facilityPickerStyles.sectionHeader}>
        <Text style={facilityPickerStyles.sectionTitle}>Available Facilities</Text>
        <Text style={facilityPickerStyles.sectionSubtitle}>Note: Prices may vary</Text>
      </View>
      {/* Fade gradient overlay */}
      <LinearGradient
        colors={['rgba(248,249,250,0.8)', 'rgba(248,249,250,0)']}
        style={facilityPickerStyles.fadeGradient}
        pointerEvents="none"
      />
    </View>
  );
}

// Main picker component without header
export default function FacilityPicker({
  selectedFacility,
  facilities,
  onFacilitySelect,
}) {
  return (
    <View style={facilityPickerStyles.facilityPickerGrid}>
      {facilities.map((facility) => (
      <TouchableOpacity
        key={facility.name}
        style={[
          facilityPickerStyles.facilityPickerOption,
          selectedFacility?.id === facility.id &&  // ✅ Compare IDs instead of names
            facilityPickerStyles.facilityOptionSelected,
        ]}
        onPress={() => onFacilitySelect(facility)}
      >
        <Text style={[facilityPickerStyles.facilityPickerIcon, { opacity: selectedFacility?.id === facility.id ? 1 : 0.5 }]}>
          {facility.icon}
        </Text>
        <Text
          style={[
            facilityPickerStyles.facilityPickerName,
            selectedFacility?.id === facility.id &&  // ✅ Compare IDs
              facilityPickerStyles.facilityNameSelected,
            { opacity: selectedFacility?.id === facility.id ? 1 : 0.5 },
          ]}
        >
          {facility.name}
        </Text>
        <Text
          style={[
            facilityPickerStyles.facilityPickerPrice,
            selectedFacility?.id === facility.id &&
              facilityPickerStyles.facilityPriceSelected,
            { opacity: selectedFacility?.id === facility.id ? 1 : 0.5 },
          ]}
        >
          ₱{facility.price} {facility.price_unit}
        </Text>
      </TouchableOpacity>
      ))}
    </View>
  );
}