import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
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
    danger: '#dc2626',
};

type ClimateRouteProp = RouteProp<RootStackParamList, 'ClimateAnalysis'>;

const fallbackAnalysis = {
    overallRiskScore: 25,
    riskGrade: 'LOW',
    floodRisk: 15,
    floodRisk2030: 18,
    floodRisk2050: 25,
    floodRisk2100: 35,
    wildfireRisk: 10,
    hurricaneRisk: 5,
    heatRisk: 30,
    droughtRisk: 20,
    seismicRisk: 12,
    insuranceImpact: 'LOW',
    summary: 'This property has relatively low climate risk for the next 30 years, with moderate heat risk being the primary concern.',
};

const getRiskColor = (risk: number) => {
    if (risk < 20) return colors.success;
    if (risk < 40) return colors.warning;
    if (risk < 70) return colors.error;
    return colors.danger;
};

const getRiskLabel = (risk: number) => {
    if (risk < 20) return 'Low Risk';
    if (risk < 40) return 'Moderate';
    if (risk < 70) return 'High Risk';
    return 'Extreme';
};

const getGradeColor = (grade: string) => {
    if (grade === 'LOW') return colors.success;
    if (grade === 'MODERATE') return colors.warning;
    if (grade === 'HIGH') return colors.error;
    return colors.danger;
};

export default function ClimateAnalysisScreen() {
    const route = useRoute<ClimateRouteProp>();
    const { propertyId } = route.params;
    const [climateAnalysis, setClimateAnalysis] = useState<any>(fallbackAnalysis);
    const [loading, setLoading] = useState(true);

    const fetchClimateAnalysis = useCallback(async () => {
        try {
            const data = await api.getClimateAnalysis(propertyId);
            if (data) setClimateAnalysis(data);
        } catch (err) {
            console.log('Using fallback climate analysis');
            showToast.info('Using sample climate data');
        } finally {
            setLoading(false);
        }
    }, [propertyId]);

    useEffect(() => {
        fetchClimateAnalysis();
    }, [fetchClimateAnalysis]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Analyzing Climate Risks...</Text>
            </View>
        );
    }

    const risks = [
        { name: 'Flood', icon: 'water', value: climateAnalysis.floodRisk || 0 },
        { name: 'Wildfire', icon: 'flame', value: climateAnalysis.wildfireRisk || 0 },
        { name: 'Hurricane', icon: 'thunderstorm', value: climateAnalysis.hurricaneRisk || 0 },
        { name: 'Heat', icon: 'sunny', value: climateAnalysis.heatRisk || 0 },
        { name: 'Drought', icon: 'leaf', value: climateAnalysis.droughtRisk || 0 },
        { name: 'Seismic', icon: 'pulse', value: climateAnalysis.seismicRisk || 0 },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Overall Risk Score */}
            <LinearGradient
                colors={[getGradeColor(climateAnalysis.riskGrade), getGradeColor(climateAnalysis.riskGrade) + '80']}
                style={styles.scoreCard}
            >
                <View style={styles.scoreCircle}>
                    <Text style={styles.scoreValue}>{climateAnalysis.overallRiskScore}</Text>
                    <Text style={styles.scoreLabel}>/ 100</Text>
                </View>
                <View style={styles.scoreInfo}>
                    <Text style={styles.gradeText}>Risk Grade: {climateAnalysis.riskGrade}</Text>
                    <Text style={styles.gradeDesc}>{getRiskLabel(climateAnalysis.overallRiskScore)}</Text>
                    <View style={styles.insuranceBadge}>
                        <Ionicons name="shield-checkmark" size={14} color={colors.text} />
                        <Text style={styles.insuranceText}>Insurance Impact: {climateAnalysis.insuranceImpact || 'MODERATE'}</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Summary */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Summary</Text>
                <Text style={styles.summaryText}>{climateAnalysis.summary || 'Climate risk analysis completed.'}</Text>
            </View>

            {/* Individual Risks */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Risk Breakdown</Text>
                {risks.map((risk, idx) => (
                    <View key={idx} style={styles.riskCard}>
                        <View style={styles.riskHeader}>
                            <View style={styles.riskIcon}>
                                <Ionicons name={risk.icon as any} size={20} color={getRiskColor(risk.value)} />
                            </View>
                            <Text style={styles.riskName}>{risk.name}</Text>
                        </View>
                        <View style={styles.riskProgress}>
                            <View style={styles.progressBar}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        {
                                            width: `${risk.value}%`,
                                            backgroundColor: getRiskColor(risk.value),
                                        },
                                    ]}
                                />
                            </View>
                            <Text style={[styles.riskValue, { color: getRiskColor(risk.value) }]}>{risk.value}%</Text>
                        </View>
                        <Text style={styles.riskLabel}>{getRiskLabel(risk.value)}</Text>
                    </View>
                ))}
            </View>

            {/* Flood Projections */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Flood Risk Projections</Text>
                <View style={styles.projectionCard}>
                    <View style={styles.projectionRow}>
                        <Text style={styles.projectionYear}>Current</Text>
                        <View style={styles.projectionBar}>
                            <View style={[styles.projectionFill, { width: `${climateAnalysis.floodRisk}%`, backgroundColor: getRiskColor(climateAnalysis.floodRisk) }]} />
                        </View>
                        <Text style={styles.projectionValue}>{climateAnalysis.floodRisk}%</Text>
                    </View>
                    <View style={styles.projectionRow}>
                        <Text style={styles.projectionYear}>2030</Text>
                        <View style={styles.projectionBar}>
                            <View style={[styles.projectionFill, { width: `${climateAnalysis.floodRisk2030}%`, backgroundColor: getRiskColor(climateAnalysis.floodRisk2030) }]} />
                        </View>
                        <Text style={styles.projectionValue}>{climateAnalysis.floodRisk2030}%</Text>
                    </View>
                    <View style={styles.projectionRow}>
                        <Text style={styles.projectionYear}>2050</Text>
                        <View style={styles.projectionBar}>
                            <View style={[styles.projectionFill, { width: `${climateAnalysis.floodRisk2050}%`, backgroundColor: getRiskColor(climateAnalysis.floodRisk2050) }]} />
                        </View>
                        <Text style={styles.projectionValue}>{climateAnalysis.floodRisk2050}%</Text>
                    </View>
                    <View style={styles.projectionRow}>
                        <Text style={styles.projectionYear}>2100</Text>
                        <View style={styles.projectionBar}>
                            <View style={[styles.projectionFill, { width: `${climateAnalysis.floodRisk2100}%`, backgroundColor: getRiskColor(climateAnalysis.floodRisk2100) }]} />
                        </View>
                        <Text style={styles.projectionValue}>{climateAnalysis.floodRisk2100}%</Text>
                    </View>
                </View>
            </View>

            {/* Recommendations */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recommendations</Text>
                <View style={styles.recommendationCard}>
                    <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
                    <View style={styles.recommendationContent}>
                        <Text style={styles.recommendationTitle}>Insurance Coverage</Text>
                        <Text style={styles.recommendationText}>
                            Consider flood insurance and review your policy annually for coverage updates.
                        </Text>
                    </View>
                </View>
                <View style={styles.recommendationCard}>
                    <Ionicons name="leaf" size={24} color={colors.success} />
                    <View style={styles.recommendationContent}>
                        <Text style={styles.recommendationTitle}>Sustainable Features</Text>
                        <Text style={styles.recommendationText}>
                            Invest in drought-resistant landscaping and energy-efficient cooling systems.
                        </Text>
                    </View>
                </View>
                <View style={styles.recommendationCard}>
                    <Ionicons name="eye" size={24} color={colors.warning} />
                    <View style={styles.recommendationContent}>
                        <Text style={styles.recommendationTitle}>Stay Informed</Text>
                        <Text style={styles.recommendationText}>
                            Monitor local climate updates and emergency preparedness guidelines.
                        </Text>
                    </View>
                </View>
            </View>

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
    gradeDesc: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
    insuranceBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 },
    insuranceText: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
    section: { paddingHorizontal: 16, marginTop: 20 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
    summaryText: { fontSize: 14, color: colors.textSecondary, lineHeight: 22, backgroundColor: colors.surface, padding: 14, borderRadius: 12 },
    riskCard: { backgroundColor: colors.surface, padding: 14, borderRadius: 12, marginBottom: 12 },
    riskHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
    riskIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
    riskName: { fontSize: 15, fontWeight: '600', color: colors.text },
    riskProgress: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    progressBar: { flex: 1, height: 8, backgroundColor: colors.background, borderRadius: 4, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 4 },
    riskValue: { fontSize: 14, fontWeight: 'bold', minWidth: 40, textAlign: 'right' },
    riskLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
    projectionCard: { backgroundColor: colors.surface, padding: 16, borderRadius: 12 },
    projectionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
    projectionYear: { fontSize: 13, fontWeight: '600', color: colors.text, width: 60 },
    projectionBar: { flex: 1, height: 8, backgroundColor: colors.background, borderRadius: 4, overflow: 'hidden' },
    projectionFill: { height: '100%', borderRadius: 4 },
    projectionValue: { fontSize: 13, fontWeight: 'bold', color: colors.text, minWidth: 40, textAlign: 'right' },
    recommendationCard: { flexDirection: 'row', backgroundColor: colors.surface, padding: 14, borderRadius: 12, marginBottom: 10, gap: 12 },
    recommendationContent: { flex: 1 },
    recommendationTitle: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 },
    recommendationText: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
});
