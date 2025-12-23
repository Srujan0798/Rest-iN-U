import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');
const colors = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#0f0f23',
    surface: '#1a1a2e',
    text: '#ffffff',
    textSecondary: '#a1a1aa',
    success: '#22c55e',
    accent: '#f59e0b',
    error: '#ef4444',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type DetailRouteProp = RouteProp<RootStackParamList, 'PropertyDetail'>;

const property = {
    id: '1',
    title: 'Vastu-Compliant Luxury Villa',
    description: 'Experience harmonious living in this stunning villa designed according to ancient Vastu principles. North-East entrance ensures prosperity and positive energy flow.',
    price: 2500000,
    bedrooms: 5,
    bathrooms: 4.5,
    squareFeet: 4500,
    yearBuilt: 2020,
    lotSize: 0.5,
    city: 'Beverly Hills',
    state: 'CA',
    zipCode: '90210',
    vastuScore: 92,
    vastuGrade: 'A+',
    climateRiskScore: 15,
    images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    ],
    features: ['Pool', 'Smart Home', 'Solar Panels', 'Meditation Room', 'Organic Garden'],
};

export default function PropertyDetailScreen() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<DetailRouteProp>();
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const formatPrice = (price: number) => `$${price.toLocaleString()}`;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Image Gallery */}
            <View style={styles.gallery}>
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={(e) => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width))}>
                    {property.images.map((img, idx) => (
                        <Image key={idx} source={{ uri: img }} style={styles.image} />
                    ))}
                </ScrollView>
                <View style={styles.pagination}>
                    {property.images.map((_, idx) => (
                        <View key={idx} style={[styles.dot, activeImage === idx && styles.dotActive]} />
                    ))}
                </View>
                <TouchableOpacity style={styles.heartBtn} onPress={() => setIsFavorite(!isFavorite)}>
                    <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color={isFavorite ? colors.error : colors.text} />
                </TouchableOpacity>
            </View>

            {/* Scores */}
            <View style={styles.scores}>
                <View style={styles.scoreCard}>
                    <LinearGradient colors={[colors.success, '#16a34a']} style={styles.scoreGradient}>
                        <Text style={styles.scoreValue}>{property.vastuScore}</Text>
                    </LinearGradient>
                    <Text style={styles.scoreLabel}>Vastu Score</Text>
                </View>
                <View style={styles.scoreCard}>
                    <LinearGradient colors={[colors.accent, '#d97706']} style={styles.scoreGradient}>
                        <Text style={styles.scoreValue}>{property.vastuGrade}</Text>
                    </LinearGradient>
                    <Text style={styles.scoreLabel}>Grade</Text>
                </View>
                <View style={styles.scoreCard}>
                    <LinearGradient colors={['#06b6d4', '#0891b2']} style={styles.scoreGradient}>
                        <Text style={styles.scoreValue}>{property.climateRiskScore}</Text>
                    </LinearGradient>
                    <Text style={styles.scoreLabel}>Climate Risk</Text>
                </View>
            </View>

            {/* Price & Address */}
            <View style={styles.section}>
                <Text style={styles.price}>{formatPrice(property.price)}</Text>
                <Text style={styles.title}>{property.title}</Text>
                <Text style={styles.address}>{property.city}, {property.state} {property.zipCode}</Text>
            </View>

            {/* Details Grid */}
            <View style={styles.details}>
                <View style={styles.detail}><Ionicons name="bed-outline" size={20} color={colors.primary} /><Text style={styles.detailValue}>{property.bedrooms}</Text><Text style={styles.detailLabel}>Beds</Text></View>
                <View style={styles.detail}><Ionicons name="water-outline" size={20} color={colors.primary} /><Text style={styles.detailValue}>{property.bathrooms}</Text><Text style={styles.detailLabel}>Baths</Text></View>
                <View style={styles.detail}><Ionicons name="resize-outline" size={20} color={colors.primary} /><Text style={styles.detailValue}>{property.squareFeet.toLocaleString()}</Text><Text style={styles.detailLabel}>Sq Ft</Text></View>
                <View style={styles.detail}><Ionicons name="calendar-outline" size={20} color={colors.primary} /><Text style={styles.detailValue}>{property.yearBuilt}</Text><Text style={styles.detailLabel}>Built</Text></View>
            </View>

            {/* Description */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.description}>{property.description}</Text>
            </View>

            {/* Features */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Features</Text>
                <View style={styles.features}>
                    {property.features.map((feature, idx) => (
                        <View key={idx} style={styles.featureTag}>
                            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Vastu Analysis Button */}
            <TouchableOpacity style={styles.vastuBtn} onPress={() => navigation.navigate('VastuAnalysis', { propertyId: property.id })}>
                <Ionicons name="compass" size={20} color={colors.text} />
                <Text style={styles.vastuBtnText}>View Full Vastu Analysis</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </TouchableOpacity>

            {/* Contact Button */}
            <TouchableOpacity style={styles.contactBtn}>
                <Text style={styles.contactBtnText}>Contact Agent</Text>
            </TouchableOpacity>

            <View style={{ height: 32 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    gallery: { position: 'relative' },
    image: { width, height: 280 },
    pagination: { position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
    dotActive: { backgroundColor: colors.text, width: 20 },
    heartBtn: { position: 'absolute', top: 12, right: 12, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    scores: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: -30, paddingHorizontal: 16 },
    scoreCard: { alignItems: 'center' },
    scoreGradient: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
    scoreValue: { fontSize: 18, fontWeight: 'bold', color: colors.text },
    scoreLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 6 },
    section: { paddingHorizontal: 16, marginTop: 20 },
    price: { fontSize: 28, fontWeight: 'bold', color: colors.primary },
    title: { fontSize: 18, fontWeight: '600', color: colors.text, marginTop: 4 },
    address: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    details: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.surface, marginHorizontal: 16, marginTop: 16, padding: 16, borderRadius: 12 },
    detail: { alignItems: 'center' },
    detailValue: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginTop: 6 },
    detailLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
    description: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
    features: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    featureTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, gap: 6 },
    featureText: { fontSize: 13, color: colors.text },
    vastuBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.secondary, marginHorizontal: 16, marginTop: 20, padding: 16, borderRadius: 12, gap: 8 },
    vastuBtnText: { fontSize: 15, fontWeight: '600', color: colors.text },
    contactBtn: { backgroundColor: colors.primary, marginHorizontal: 16, marginTop: 12, padding: 16, borderRadius: 12, alignItems: 'center' },
    contactBtnText: { fontSize: 16, fontWeight: 'bold', color: colors.text },
});

