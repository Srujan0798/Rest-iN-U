import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');

// Theme colors
const colors = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#0f0f23',
    surface: '#1a1a2e',
    surfaceLight: '#252542',
    text: '#ffffff',
    textSecondary: '#a1a1aa',
    accent: '#f59e0b',
    success: '#22c55e',
    error: '#ef4444',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample featured properties
const featuredProperties = [
    {
        id: '1',
        title: 'Vastu-Compliant Villa',
        city: 'Beverly Hills',
        state: 'CA',
        price: 2500000,
        bedrooms: 5,
        bathrooms: 4.5,
        squareFeet: 4500,
        vastuScore: 92,
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    },
    {
        id: '2',
        title: 'Spiritual Retreat Home',
        city: 'Sedona',
        state: 'AZ',
        price: 1200000,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 2800,
        vastuScore: 88,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    },
    {
        id: '3',
        title: 'Modern Ashram Estate',
        city: 'Santa Fe',
        state: 'NM',
        price: 3200000,
        bedrooms: 6,
        bathrooms: 5,
        squareFeet: 6000,
        vastuScore: 95,
        image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    },
];

const quickCategories = [
    { id: '1', name: 'Vastu A+', icon: 'star', color: '#22c55e' },
    { id: '2', name: 'Low Climate Risk', icon: 'leaf', color: '#06b6d4' },
    { id: '3', name: 'Ayurvedic', icon: 'fitness', color: '#f59e0b' },
    { id: '4', name: 'Sacred Sites', icon: 'locate', color: '#ec4899' },
];

export default function HomeScreen() {
    const navigation = useNavigation<NavigationProp>();

    const formatPrice = (price: number) => {
        if (price >= 1000000) {
            return `$${(price / 1000000).toFixed(1)}M`;
        }
        return `$${(price / 1000).toFixed(0)}K`;
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Hero Section */}
            <LinearGradient
                colors={[colors.primary, colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.hero}
            >
                <Text style={styles.heroTitle}>REST-iN-U</Text>
                <Text style={styles.heroSubtitle}>
                    AI-Powered Ayurvedic Real Estate
                </Text>
                <Text style={styles.heroDescription}>
                    Find your perfect home aligned with ancient wisdom
                </Text>

                {/* Search Bar */}
                <TouchableOpacity 
                    style={styles.searchBar}
                    onPress={() => navigation.navigate('Main', { screen: 'Search' } as any)}
                >
                    <Ionicons name="search" size={20} color={colors.textSecondary} />
                    <Text style={styles.searchPlaceholder}>
                        Search by city, Vastu score, or energy...
                    </Text>
                </TouchableOpacity>
            </LinearGradient>

            {/* Quick Categories */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Filters</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {quickCategories.map((category) => (
                        <TouchableOpacity 
                            key={category.id} 
                            style={styles.categoryCard}
                        >
                            <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                                <Ionicons 
                                    name={category.icon as any} 
                                    size={24} 
                                    color={category.color} 
                                />
                            </View>
                            <Text style={styles.categoryName}>{category.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Featured Properties */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Featured Properties</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {featuredProperties.map((property) => (
                        <TouchableOpacity
                            key={property.id}
                            style={styles.propertyCard}
                            onPress={() => navigation.navigate('PropertyDetail', { propertyId: property.id })}
                        >
                            <Image
                                source={{ uri: property.image }}
                                style={styles.propertyImage}
                            />
                            
                            {/* Vastu Badge */}
                            <View style={styles.vastuBadge}>
                                <Ionicons name="star" size={12} color="#fff" />
                                <Text style={styles.vastuScore}>{property.vastuScore}</Text>
                            </View>

                            <View style={styles.propertyInfo}>
                                <Text style={styles.propertyPrice}>
                                    {formatPrice(property.price)}
                                </Text>
                                <Text style={styles.propertyTitle} numberOfLines={1}>
                                    {property.title}
                                </Text>
                                <Text style={styles.propertyLocation}>
                                    {property.city}, {property.state}
                                </Text>
                                <View style={styles.propertyMeta}>
                                    <Text style={styles.metaText}>
                                        {property.bedrooms} bed
                                    </Text>
                                    <Text style={styles.metaDot}>•</Text>
                                    <Text style={styles.metaText}>
                                        {property.bathrooms} bath
                                    </Text>
                                    <Text style={styles.metaDot}>•</Text>
                                    <Text style={styles.metaText}>
                                        {property.squareFeet.toLocaleString()} sqft
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Vastu Insights */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vastu Insights</Text>
                <LinearGradient
                    colors={['#1a1a2e', '#252542']}
                    style={styles.insightCard}
                >
                    <View style={styles.insightIcon}>
                        <Ionicons name="compass" size={32} color={colors.accent} />
                    </View>
                    <View style={styles.insightContent}>
                        <Text style={styles.insightTitle}>
                            North-East Properties
                        </Text>
                        <Text style={styles.insightDescription}>
                            Properties with main entrance in North-East direction 
                            bring prosperity and positive energy.
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
                </LinearGradient>
            </View>

            {/* Bottom Padding */}
            <View style={{ height: 20 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    hero: {
        padding: 24,
        paddingTop: 40,
        paddingBottom: 30,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginTop: 4,
    },
    heroDescription: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        marginTop: 8,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 14,
        marginTop: 20,
        gap: 10,
    },
    searchPlaceholder: {
        color: colors.textSecondary,
        fontSize: 15,
    },
    section: {
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 12,
    },
    seeAll: {
        color: colors.primary,
        fontSize: 14,
    },
    categoryCard: {
        alignItems: 'center',
        marginRight: 16,
        width: 80,
    },
    categoryIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryName: {
        color: colors.text,
        fontSize: 12,
        textAlign: 'center',
    },
    propertyCard: {
        width: width * 0.7,
        marginRight: 16,
        backgroundColor: colors.surface,
        borderRadius: 16,
        overflow: 'hidden',
    },
    propertyImage: {
        width: '100%',
        height: 180,
    },
    vastuBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.success,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    vastuScore: {
        color: colors.text,
        fontSize: 12,
        fontWeight: 'bold',
    },
    propertyInfo: {
        padding: 14,
    },
    propertyPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
    },
    propertyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginTop: 4,
    },
    propertyLocation: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },
    propertyMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    metaText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    metaDot: {
        fontSize: 12,
        color: colors.textSecondary,
        marginHorizontal: 6,
    },
    insightCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.surfaceLight,
    },
    insightIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.accent + '20',
        justifyContent: 'center',
        alignItems: 'center',
    },
    insightContent: {
        flex: 1,
        marginLeft: 14,
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    insightDescription: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 4,
        lineHeight: 18,
    },
});

