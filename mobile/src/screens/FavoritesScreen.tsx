import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

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

const favorites = [
    { id: '1', title: 'Vastu-Compliant Villa', city: 'Beverly Hills', state: 'CA', price: 2500000, vastuScore: 92, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400' },
    { id: '2', title: 'Spiritual Retreat Home', city: 'Sedona', state: 'AZ', price: 1200000, vastuScore: 88, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400' },
];

export default function FavoritesScreen() {
    const navigation = useNavigation<NavigationProp>();

    const formatPrice = (price: number) => price >= 1000000 ? `$${(price / 1000000).toFixed(1)}M` : `$${(price / 1000).toFixed(0)}K`;

    const renderItem = ({ item }: { item: typeof favorites[0] }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PropertyDetail', { propertyId: item.id })}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.location}>{item.city}, {item.state}</Text>
                <Text style={styles.price}>{formatPrice(item.price)}</Text>
                <View style={styles.vastuRow}>
                    <Ionicons name="star" size={14} color={colors.success} />
                    <Text style={styles.vastuScore}>Vastu {item.vastuScore}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.heartBtn}>
                <Ionicons name="heart" size={24} color={colors.error} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (favorites.length === 0) {
        return (
            <View style={styles.empty}>
                <Ionicons name="heart-outline" size={64} color={colors.textSecondary} />
                <Text style={styles.emptyTitle}>No Favorites Yet</Text>
                <Text style={styles.emptyText}>Save properties you love to see them here</Text>
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
    heartBtn: { padding: 12 },
    empty: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginTop: 16 },
    emptyText: { fontSize: 14, color: colors.textSecondary, marginTop: 8, textAlign: 'center' },
});
