import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { showToast } from '../utils/toast';
import api from '../services/api';

const { width } = Dimensions.get('window');

const colors = {
    primary: '#6366f1',
    background: '#0f0f23',
    surface: '#1a1a2e',
    text: '#ffffff',
    textSecondary: '#a1a1aa',
    success: '#22c55e',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Fallback sample data with coordinates
const sampleProperties = [
    { id: '1', title: 'Modern Villa', city: 'Los Angeles', state: 'CA', price: 1500000, bedrooms: 4, bathrooms: 3, vastuScore: 89, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', latitude: 34.0522, longitude: -118.2437 },
    { id: '2', title: 'Zen Garden Home', city: 'San Diego', state: 'CA', price: 980000, bedrooms: 3, bathrooms: 2, vastuScore: 92, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', latitude: 32.7157, longitude: -117.1611 },
    { id: '3', title: 'Spiritual Retreat', city: 'Sedona', state: 'AZ', price: 750000, bedrooms: 2, bathrooms: 2, vastuScore: 95, image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400', latitude: 34.8697, longitude: -111.7610 },
    { id: '4', title: 'Eco-Friendly Condo', city: 'Austin', state: 'TX', price: 450000, bedrooms: 2, bathrooms: 1, vastuScore: 85, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400', latitude: 30.2672, longitude: -97.7431 },
];

const filters = ['All', 'Vastu A+', 'Low Risk', 'Under $1M', 'New'];

export default function SearchScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [properties, setProperties] = useState<any[]>(sampleProperties);
    const [loading, setLoading] = useState(false);

    const formatPrice = (price: number) => price >= 1000000 ? `$${(price / 1000000).toFixed(1)}M` : `$${(price / 1000).toFixed(0)}K`;

    const searchProperties = useCallback(async (showLoader = true) => {
        if (showLoader) setLoading(true);
        try {
            const filters: any = {};
            if (searchQuery.trim()) {
                filters.query = searchQuery;
            }
            if (activeFilter === 'Vastu A+') {
                filters.minVastuScore = 90;
            } else if (activeFilter === 'Under $1M') {
                filters.maxPrice = 1000000;
            }

            const response = await api.searchProperties(filters);
            if (response.properties && response.properties.length > 0) {
                // Ensure properties have coordinates for map
                const mappedProps = response.properties.map((p: any) => ({
                    ...p,
                    latitude: p.address?.lat || p.latitude || sampleProperties[0].latitude + (Math.random() - 0.5) * 0.1,
                    longitude: p.address?.lng || p.longitude || sampleProperties[0].longitude + (Math.random() - 0.5) * 0.1,
                    image: p.image || p.images?.[0] || sampleProperties[0].image
                }));
                setProperties(mappedProps);
            } else if (response.properties && response.properties.length === 0) {
                showToast.info('No properties found matching your criteria');
                setProperties(sampleProperties);
            }
        } catch (error) {
            // Use fallback data
            if (showLoader) {
                showToast.info('Showing sample properties (demo mode)');
            }
            setProperties(sampleProperties);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, activeFilter]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchQuery.length >= 2 || searchQuery.length === 0) {
                searchProperties(false);
            }
        }, 500);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery, activeFilter, searchProperties]);

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        showToast.info(`Filter: ${filter}`);
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 34.0522,
                    longitude: -118.2437,
                    latitudeDelta: 15,
                    longitudeDelta: 15,
                }}
            >
                {properties.map((property) => (
                    <Marker
                        key={property.id}
                        coordinate={{
                            latitude: property.latitude,
                            longitude: property.longitude,
                        }}
                        onCalloutPress={() => navigation.navigate('PropertyDetail', { propertyId: property.id })}
                    >
                        <View style={styles.markerContainer}>
                            <Text style={styles.markerText}>{formatPrice(property.price)}</Text>
                        </View>
                        <Callout tooltip>
                            <View style={styles.calloutContainer}>
                                <Text style={styles.calloutTitle}>{property.title}</Text>
                                <Text style={styles.calloutPrice}>{formatPrice(property.price)}</Text>
                                <Text style={styles.calloutVastu}>Vastu: {property.vastuScore || 'N/A'}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            <View style={styles.overlayContainer}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={colors.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by city, state, or keyword..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {loading && <ActivityIndicator size="small" color={colors.primary} />}
                    <TouchableOpacity style={styles.filterButton}>
                        <Ionicons name="options" size={20} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[styles.filterTag, activeFilter === filter && styles.filterTagActive]}
                            onPress={() => handleFilterChange(filter)}
                        >
                            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    map: { width: '100%', height: '100%' },
    overlayContainer: { position: 'absolute', top: 50, left: 0, right: 0 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, marginHorizontal: 16, marginBottom: 12, borderRadius: 12, paddingHorizontal: 14, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
    searchInput: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 14 },
    filterButton: { padding: 8, borderRadius: 8, backgroundColor: colors.primary + '20' },
    filters: { paddingHorizontal: 16 },
    filterTag: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.surface, borderRadius: 20, marginRight: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
    filterTagActive: { backgroundColor: colors.primary },
    filterText: { color: colors.textSecondary, fontSize: 13 },
    filterTextActive: { color: colors.text, fontWeight: '600' },
    markerContainer: { backgroundColor: colors.primary, padding: 6, borderRadius: 8, borderColor: '#fff', borderWidth: 1 },
    markerText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    calloutContainer: { width: 160, backgroundColor: colors.surface, padding: 10, borderRadius: 8, borderColor: colors.primary, borderWidth: 1, alignItems: 'center' },
    calloutTitle: { color: colors.text, fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
    calloutPrice: { color: colors.primary, fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
    calloutVastu: { color: colors.success, fontSize: 12 },
});
