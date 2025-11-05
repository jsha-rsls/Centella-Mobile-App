import {
    StyleSheet
} from "react-native"

export const facilityPickerStyles = StyleSheet.create({
    // Section Layout Styles
    section: {
        marginBottom: 24,
        flex: 1,
    },
    headerContainer: {
        position: 'relative',
        zIndex: 1,
    },
    sectionHeader: {
        alignItems: "center",
        marginBottom: 6,
        marginHorizontal: 36,
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        // iOS shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Android shadow
        elevation: 3,
    },
    fadeGradient: {
        position: 'absolute',
        bottom: -20,
        left: 0,
        right: 0,
        height: 20,
        zIndex: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1a1a1a",
        textAlign: "center",
    },
    sectionSubtitle: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
        marginTop: 4,
    },

    // Facility Grid
    facilityPickerGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: 10, // Add some top padding to account for fade effect
        backgroundColor: "#f8f9fa",
        flex: 1,
    },
    facilityPickerOption: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#e0e0e0",
        alignItems: "center",
        justifyContent: "center",
        width: "47%",
        aspectRatio: 1,
        marginBottom: 16,
    },

    // Selected State
    facilityOptionSelected: {
        borderColor: "#2d1b2e",
        backgroundColor: "#f3f0f4",
    },

    // Facility Icon
    facilityPickerIcon: {
        fontSize: 24,
        marginBottom: 8,
    },

    // Facility Name
    facilityPickerName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1a1a1a",
        textAlign: "center",
        marginBottom: 4,
    },
    facilityNameSelected: {
        color: "#2d1b2e",
    },

    // Facility Price
    facilityPickerPrice: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
    },
    facilityPriceSelected: {
        color: "#2d1b2e",
    },

    scrollContainer: {
        flex: 1,
    },
})