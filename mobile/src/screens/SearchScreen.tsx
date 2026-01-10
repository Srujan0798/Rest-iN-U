import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList, Image, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Property } from '../types/navigation';
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

// Fallback sample data
const sampleProperties = [
    { id: '1', title: 'Modern Villa', city: 'Los Angeles', state: 'CA', price: 1500000, bedrooms: 4, bathrooms: 3, vastuScore: 89, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400' },
    { id: '2', title: 'Zen Garden Home', city: 'San Diego', state: 'CA', price: 980000, bedrooms: 3, bathrooms: 2, vastuScore: 92, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400' },
    { id: '3', title: 'Spiritual Retreat', city: 'Sedona', state: 'AZ', price: 750000, bedrooms: 2, bathrooms: 2, vastuScore: 95, image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400' },
    { id: '4', title: 'Eco-Friendly Condo', city: 'Austin', state: 'TX', price: 450000, bedrooms: 2, bathrooms: 1, vastuScore: 85, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400' },
];

const filters = ['All', 'Vastu A+', 'Low Risk', 'Under $1M', 'New'];

export default function SearchScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [properties, setProperties] = useState<any[]>(sampleProperties);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

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
                setProperties(response.properties);
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
            setRefreshing(false);
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

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        searchProperties(false);
    }, [searchProperties]);

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        showToast.info(`Filter: ${filter}`);
    };

    const renderProperty = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.propertyCard} onPress={() => navigation.navigate('PropertyDetail', { propertyId: item.id })}>
            <Image source={{ uri: item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400' }} style={styles.propertyImage} />
            <View style={styles.vastuBadge}>
                <Ionicons name="star" size={10} color="#fff" />
                <Text style={styles.vastuText}>{item.vastuScore || 'N/A'}</Text>
            </View>
            <View style={styles.propertyInfo}>
                <Text style={styles.price}>{formatPrice(item.price)}</Text>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.location}>{item.city}, {item.state}</Text>
                <Text style={styles.meta}>{item.bedrooms} bed • {item.bathrooms} bath</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
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

            <Text style={styles.resultsCount}>{properties.length} properties found</Text>

            <FlatList
                data={properties}
                renderItem={renderProperty}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
                        <Text style={styles.emptyText}>No properties found</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, margin: 16, borderRadius: 12, paddingHorizontal: 14, gap: 10 },
    searchInput: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 14 },
    filterButton: { padding: 8, borderRadius: 8, backgroundColor: colors.primary + '20' },
    filters: { paddingHorizontal: 16, marginBottom: 12 },
    filterTag: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.surface, borderRadius: 20, marginRight: 10 },
    filterTagActive: { backgroundColor: colors.primary },
    filterText: { color: colors.textSecondary, fontSize: 13 },
    filterTextActive: { color: colors.text, fontWeight: '600' },
    resultsCount: { color: colors.textSecondary, fontSize: 13, paddingHorizontal: 16, marginBottom: 8 },
    list: { paddingHorizontal: 12, paddingBottom: 20 },
    row: { justifyContent: 'space-between' },
    propertyCard: { width: (width - 40) / 2, backgroundColor: colors.surface, borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
    propertyImage: { width: '100%', height: 100 },
    vastuBadge: { position: 'absolute', top: 8, right: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.success, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 10, gap: 3 },
    vastuText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    propertyInfo: { padding: 10 },
    price: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
    title: { fontSize: 13, fontWeight: '600', color: colors.text, marginTop: 2 },
    location: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
    meta: { fontSize: 10, color: colors.textSecondary, marginTop: 4 },
    empty: { alignItems: 'center', paddingTop: 60 },
    emptyText: { color: colors.textSecondary, marginTop: 12 },
});
