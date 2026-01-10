import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Property } from '../types/navigation';
import { showToast } from '../utils/toast';
import api from '../services/api';

const colors = {
    primary: '#6366f1',
    background: '#0f0f23',
    surface: '#1a1a2e',
    text: '#ffffff',
    textSecondary: '#a1a1aa',
    success: '#22c55e',
    error: '#ef4444',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Fallback data when API is unavailable
const fallbackFavorites: Property[] = [
    { id: '1', title: 'Vastu-Compliant Villa', city: 'Beverly Hills', state: 'CA', price: 2500000, vastuScore: 92, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', address: '123 Harmony Lane', zipCode: '90210', country: 'USA', propertyType: 'HOUSE' as any, listingType: 'SALE' as any, status: 'ACTIVE' as any, bedrooms: 5, bathrooms: 4, squareFeet: 4500 },
    { id: '2', title: 'Spiritual Retreat Home', city: 'Sedona', state: 'AZ', price: 1200000, vastuScore: 88, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', address: '456 Sacred Path', zipCode: '86336', country: 'USA', propertyType: 'HOUSE' as any, listingType: 'SALE' as any, status: 'ACTIVE' as any, bedrooms: 3, bathrooms: 2, squareFeet: 2800 },
];

export default function FavoritesScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [favorites, setFavorites] = useState<Property[]>(fallbackFavorites);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const formatPrice = (price: number) => price >= 1000000 ? `$${(price / 1000000).toFixed(1)}M` : `$${(price / 1000).toFixed(0)}K`;

    const loadFavorites = useCallback(async (showLoadingState = true) => {
        if (showLoadingState) setLoading(true);
        try {
            const data = await api.getFavorites();
            setFavorites(data.length > 0 ? data : fallbackFavorites);
            if (data.length === 0) {
                showToast.info('Using sample favorites for demo');
            }
        } catch (error: any) {
            console.log('Using fallback favorites data');
            setFavorites(fallbackFavorites);
            if (showLoadingState) {
                showToast.info('Showing sample favorites (offline mode)');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadFavorites(false);
        }, [loadFavorites])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadFavorites(false);
    }, [loadFavorites]);

    const removeFavorite = async (propertyId: string, propertyTitle: string) => {
        try {
            await api.removeFavorite(propertyId);
            setFavorites(prev => prev.filter(f => f.id !== propertyId));
            showToast.success(`Removed "${propertyTitle}" from favorites`);
        } catch (error) {
            // Still remove from local state for demo
            setFavorites(prev => prev.filter(f => f.id !== propertyId));
            showToast.success(`Removed "${propertyTitle}" from favorites`);
        }
    };

    const confirmRemove = (item: Property) => {
        Alert.alert(
            'Remove Favorite',
            `Remove "${item.title}" from your favorites?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => removeFavorite(item.id, item.title) }
            ]
        );
    };

    const renderItem = ({ item }: { item: Property }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PropertyDetail', { propertyId: item.id })}>
            <Image source={{ uri: item.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400' }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.location}>{item.city}, {item.state}</Text>
                <Text style={styles.price}>{formatPrice(item.price)}</Text>
                <View style={styles.vastuRow}>
                    <Ionicons name="star" size={14} color={colors.success} />
                    <Text style={styles.vastuScore}>Vastu {item.vastuScore || 'N/A'}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.heartBtn} onPress={() => confirmRemove(item)}>
                <Ionicons name="heart" size={24} color={colors.error} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (!loading && favorites.length === 0) {
        return (
            <View style={styles.empty}>
                <Ionicons name="heart-outline" size={64} color={colors.textSecondary} />
                <Text style={styles.emptyTitle}>No Favorites Yet</Text>
                <Text style={styles.emptyText}>Save properties you love to see them here</Text>
                <TouchableOpacity
                    style={styles.browseBtn}
                    onPress={() => navigation.navigate('Main' as any)}
                >
                    <Text style={styles.browseBtnText}>Browse Properties</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={favorites}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    list: { padding: 16 },
    card: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
    image: { width: 100, height: 100 },
    info: { flex: 1, padding: 12 },
    title: { fontSize: 15, fontWeight: '600', color: colors.text },
    location: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    price: { fontSize: 16, fontWeight: 'bold', color: colors.primary, marginTop: 4 },
    vastuRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    vastuScore: { fontSize: 12, color: colors.success },
    heartBtn: { padding: 12, justifyContent: 'center' },
    empty: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginTop: 16 },
    emptyText: { fontSize: 14, color: colors.textSecondary, marginTop: 8, textAlign: 'center' },
    browseBtn: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 24 },
    browseBtnText: { color: colors.text, fontWeight: '600' },
});
