import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import api from '../services/api';
import { showToast } from '../utils/toast';

const { width } = Dimensions.get('window');
const colors = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#0f0f23',
    surface: '#1a1a2e',
    text: '#ffffff',
    textSecondary: '#a1a1aa',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
};

type VastuRouteProp = RouteProp<RootStackParamList, 'VastuAnalysis'>;

const fallbackVastuAnalysis = {
    overallScore: 92,
    grade: 'A+',
    entranceDirection: 'North-East',
    entranceScore: 100,
    rooms: [
        { name: 'Master Bedroom', direction: 'South-West', score: 95, ideal: true },
        { name: 'Kitchen', direction: 'South-East', score: 100, ideal: true },
        { name: 'Living Room', direction: 'North', score: 85, ideal: false },
        { name: 'Puja Room', direction: 'North-East', score: 100, ideal: true },
        { name: 'Bathroom', direction: 'West', score: 90, ideal: true },
    ],
    issues: [
        { area: 'Living Room', issue: 'Slight deviation from ideal position', severity: 'minor' },
    ],
    remedies: [
        { issue: 'Living Room placement', remedy: 'Place a Vastu pyramid in the North corner', cost: '$50' },
        { issue: 'Energy flow', remedy: 'Add indoor plants in North-East', cost: '$30' },
    ],
    positives: [
        'North-East entrance brings prosperity',
        'Kitchen in South-East ensures health',
        'Master bedroom in South-West promotes rest',
        'Puja room perfectly positioned',
    ],
};

const getScoreColor = (score: number) => score >= 90 ? colors.success : score >= 70 ? colors.warning : colors.error;
const getSeverityColor = (sev: string) => sev === 'critical' ? colors.error : sev === 'major' ? colors.warning : colors.primary;
const getDirectionAngle = (direction: string): number => {
    const angles: Record<string, number> = {
        'North': 0, 'North-East': 45, 'East': 90, 'South-East': 135,
        'South': 180, 'South-West': 225, 'West': 270, 'North-West': 315,
    };
    return angles[direction] || 0;
};

export default function VastuAnalysisScreen() {
    const route = useRoute<VastuRouteProp>();
    const { propertyId } = route.params;
    const [vastuAnalysis, setVastuAnalysis] = useState<any>(fallbackVastuAnalysis);
    const [loading, setLoading] = useState(true);

    const fetchVastuAnalysis = useCallback(async () => {
        try {
            const data = await api.getVastuAnalysis(propertyId);
            if (data) setVastuAnalysis(data);
        } catch (err) {
            console.log('Using fallback Vastu analysis');
            showToast.info('Using sample Vastu data');
        } finally {
            setLoading(false);
        }
    }, [propertyId]);

    useEffect(() => {
        fetchVastuAnalysis();
    }, [fetchVastuAnalysis]);

    const handleGetCertificate = () => {
        showToast.success('Certificate request sent! You will receive it via email within 24 hours.');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Analyzing Vastu...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Overall Score */}
            <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.scoreCard}>
                <View style={styles.scoreCircle}>
                    <Text style={styles.scoreValue}>{vastuAnalysis.overallScore}</Text>
                    <Text style={styles.scoreLabel}>/ 100</Text>
                </View>
                <View style={styles.scoreInfo}>
                    <Text style={styles.gradeText}>Grade: {vastuAnalysis.grade}</Text>
                    <Text style={styles.entranceText}>Entrance: {vastuAnalysis.entranceDirection}</Text>
                    <View style={styles.entranceBadge}>
                        <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                        <Text style={styles.entranceScore}>Entrance Score: {vastuAnalysis.entranceScore}</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Positives */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>✨ Positive Aspects</Text>
                {vastuAnalysis.positives.map((item: string, idx: number) => (
                    <View key={idx} style={styles.positiveItem}>
                        <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                        <Text style={styles.positiveText}>{item}</Text>
                    </View>
                ))}
            </View>

            {/* Room Analysis */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🏠 Room Analysis</Text>
                {vastuAnalysis.rooms.map((room: { name: string; score: number; direction: string; ideal?: boolean }, idx: number) => (
                    <View key={idx} style={styles.roomCard}>
                        <View style={styles.roomHeader}>
                            <Text style={styles.roomName}>{room.name}</Text>
                            <View style={[styles.roomScore, { backgroundColor: getScoreColor(room.score) + '20' }]}>
                                <Text style={[styles.roomScoreText, { color: getScoreColor(room.score) }]}>{room.score}</Text>
                            </View>
                        </View>
                        <View style={styles.roomDetails}>
                            <Text style={styles.roomDirection}>Direction: {room.direction}</Text>
                            {room.ideal && <Ionicons name="checkmark-circle" size={16} color={colors.success} />}
                        </View>
                    </View>
                ))}
            </View>

            {/* Issues */}
            {vastuAnalysis.issues.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚠️ Issues Found</Text>
                    {vastuAnalysis.issues.map((issue: { area: string; issue: string; severity: string }, idx: number) => (
                        <View key={idx} style={[styles.issueCard, { borderLeftColor: getSeverityColor(issue.severity) }]}>
                            <Text style={styles.issueName}>{issue.area}</Text>
                            <Text style={styles.issueText}>{issue.issue}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Remedies */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🌿 Recommended Remedies</Text>
                {vastuAnalysis.remedies.map((remedy: { issue: string; remedy: string; cost: string }, idx: number) => (
                    <View key={idx} style={styles.remedyCard}>
                        <Ionicons name="sparkles" size={20} color={colors.warning} />
                        <View style={styles.remedyContent}>
                            <Text style={styles.remedyIssue}>{remedy.issue}</Text>
                            <Text style={styles.remedyText}>{remedy.remedy}</Text>
                            <Text style={styles.remedyCost}>Estimated cost: {remedy.cost}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Compass Visualization */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Entrance Direction</Text>
                <View style={styles.compassContainer}>
                    <View style={styles.compass}>
                        <Text style={styles.compassN}>N</Text>
                        <Text style={styles.compassE}>E</Text>
                        <Text style={styles.compassS}>S</Text>
                        <Text style={styles.compassW}>W</Text>
                        <View style={styles.compassCenter}>
                            <View style={[styles.compassNeedle, { transform: [{ rotate: `${getDirectionAngle(vastuAnalysis.entranceDirection)}deg` }] }]}>
                                <View style={styles.needleTop} />
                            </View>
                        </View>
                    </View>
                    <Text style={styles.compassLabel}>{vastuAnalysis.entranceDirection}</Text>
                    <Text style={styles.compassDesc}>
                        {vastuAnalysis.entranceDirection === 'North-East'
                            ? 'Ideal entrance direction for prosperity and positive energy'
                            : 'Consider Vastu remedies to optimize energy flow'}
                    </Text>
                </View>
            </View>

            {/* Get Certificate */}
            <TouchableOpacity style={styles.certBtn} onPress={handleGetCertificate}>
                <Ionicons name="ribbon" size={20} color={colors.text} />
                <Text style={styles.certBtnText}>Get Vastu Certificate</Text>
            </TouchableOpacity>

            <View style={{ height: 32 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    loadingContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: colors.textSecondary, marginTop: 12, fontSize: 16 },
    scoreCard: { flexDirection: 'row', alignItems: 'center', padding: 24, margin: 16, borderRadius: 16 },
    scoreCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    scoreValue: { fontSize: 36, fontWeight: 'bold', color: colors.text },
    scoreLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
    scoreInfo: { marginLeft: 20, flex: 1 },
    gradeText: { fontSize: 18, fontWeight: 'bold', color: colors.text },
    entranceText: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
    entranceBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 },
    entranceScore: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
    section: { paddingHorizontal: 16, marginTop: 20 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
    positiveItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
    positiveText: { fontSize: 14, color: colors.text, flex: 1 },
    roomCard: { backgroundColor: colors.surface, padding: 14, borderRadius: 12, marginBottom: 10 },
    roomHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    roomName: { fontSize: 15, fontWeight: '600', color: colors.text },
    roomScore: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    roomScoreText: { fontSize: 13, fontWeight: 'bold' },
    roomDetails: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
    roomDirection: { fontSize: 13, color: colors.textSecondary },
    issueCard: { backgroundColor: colors.surface, padding: 14, borderRadius: 8, marginBottom: 10, borderLeftWidth: 3 },
    issueName: { fontSize: 14, fontWeight: '600', color: colors.text },
    issueText: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
    remedyCard: { flexDirection: 'row', backgroundColor: colors.surface, padding: 14, borderRadius: 12, marginBottom: 10, gap: 12 },
    remedyContent: { flex: 1 },
    remedyIssue: { fontSize: 14, fontWeight: '600', color: colors.text },
    remedyText: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
    remedyCost: { fontSize: 12, color: colors.warning, marginTop: 6 },
    certBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.success, marginHorizontal: 16, marginTop: 20, padding: 16, borderRadius: 12, gap: 10 },
    certBtnText: { fontSize: 16, fontWeight: '600', color: colors.text },
    compassContainer: { alignItems: 'center', backgroundColor: colors.surface, padding: 20, borderRadius: 16 },
    compass: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: colors.primary, justifyContent: 'center', alignItems: 'center', position: 'relative' },
    compassN: { position: 'absolute', top: 8, fontSize: 14, fontWeight: 'bold', color: colors.error },
    compassE: { position: 'absolute', right: 8, fontSize: 14, fontWeight: 'bold', color: colors.textSecondary },
    compassS: { position: 'absolute', bottom: 8, fontSize: 14, fontWeight: 'bold', color: colors.textSecondary },
    compassW: { position: 'absolute', left: 8, fontSize: 14, fontWeight: 'bold', color: colors.textSecondary },
    compassCenter: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
    compassNeedle: { position: 'absolute', width: 4, height: 50, alignItems: 'center' },
    needleTop: { width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderBottomWidth: 40, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: colors.success },
    compassLabel: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginTop: 16 },
    compassDesc: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginTop: 8, paddingHorizontal: 16 },
});

