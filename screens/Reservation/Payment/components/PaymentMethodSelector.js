import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { methodStyles } from "../styles/MethodStyles"

export default function PaymentMethodSelector({ 
  methods, 
  selectedMethod, 
  onSelectMethod, 
  onMethodInfo, 
  processing 
}) {
  return (
    <View style={methodStyles.section}>
      <View style={methodStyles.sectionHeader}>
        <Ionicons name="wallet-outline" size={20} color="#2d1b2e" />
        <Text style={methodStyles.sectionTitle}>Choose Payment Option</Text>
      </View>
      
      <View style={methodStyles.paymentMethods}>
        {methods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              methodStyles.paymentMethod,
              selectedMethod === method.id && methodStyles.paymentMethodSelected
            ]}
            onPress={() => onSelectMethod(method.id)}
            disabled={processing}
            activeOpacity={0.7}
          >
            {method.recommended && (
              <View style={methodStyles.recommendedBadge}>
                <Text style={methodStyles.recommendedText}>Recommended</Text>
              </View>
            )}
            
            <View style={[
              methodStyles.paymentIconContainer,
              { backgroundColor: method.color + '15' }
            ]}>
              <Ionicons 
                name={method.icon} 
                size={24} 
                color={method.color}
              />
            </View>
            
            <View style={methodStyles.paymentInfo}>
              <Text style={methodStyles.paymentName}>{method.name}</Text>
              <Text style={methodStyles.paymentDescription}>{method.description}</Text>
              
              {/* Show available payment methods for online */}
              {method.id === 'online' && (
                <View style={methodStyles.paymentLogos}>
                  <View style={methodStyles.logoItem}>
                    <Ionicons name="phone-portrait" size={16} color="#007DFF" />
                    <Text style={methodStyles.logoText}>GCash</Text>
                  </View>
                  <View style={methodStyles.logoItem}>
                    <Ionicons name="card" size={16} color="#00C853" />
                    <Text style={methodStyles.logoText}>PayMaya</Text>
                  </View>
                  <View style={methodStyles.logoItem}>
                    <Ionicons name="card-outline" size={16} color="#666" />
                    <Text style={methodStyles.logoText}>Cards</Text>
                  </View>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={methodStyles.infoButton}
              onPress={() => onMethodInfo(method.id)}
            >
              <Ionicons name="information-circle-outline" size={20} color="#999" />
            </TouchableOpacity>
            
            <View style={[
              methodStyles.radioButton,
              selectedMethod === method.id && methodStyles.radioButtonSelected
            ]}>
              {selectedMethod === method.id && (
                <View style={methodStyles.radioButtonInner} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}