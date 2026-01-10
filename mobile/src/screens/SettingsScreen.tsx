import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAppStore } from '../store/appStore';
import { showToast } from '../utils/toast';

const colors = {
    primary: '#6366f1',
    background: '#0f0f23',
    surface: '#1a1a2e',
    text: '#ffffff',
    textSecondary: '#a1a1aa',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { settings, updateSettings, clearRecentSearches, logout, user } = useAppStore();
    const [localSettings, setLocalSettings] = useState(settings);

    const handleToggle = (key: string, value: boolean) => {
        const newSettings = { ...localSettings, [key]: value };
        setLocalSettings(newSettings);
        updateSettings({ [key]: value });
        showToast.success('Setting updated');
    };

    const handleVastuScoreChange = (score: number) => {
        const newSettings = { ...localSettings, minVastuScore: score };
        setLocalSettings(newSettings);
        updateSettings({ minVastuScore: score });
        showToast.success(`Minimum Vastu score set to ${score}`);
    };

    const handleDoshaChange = (dosha: string | null) => {
        const newSettings = { ...localSettings, doshaPreference: dosha };
        setLocalSettings(newSettings);
        updateSettings({ doshaPreference: dosha });
        showToast.success(dosha ? `Dosha set to ${dosha}` : 'Dosha preference cleared');
    };

    const handleClearHistory = () => {
        Alert.alert(
            'Clear Search History',
            'This will remove all your recent searches. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => {
                        clearRecentSearches();
                        showToast.success('Search history cleared');
                    },
                },
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        logout();
                        showToast.success('Logged out successfully');
                        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    },
                },
            ]
        );
    };

    const openLink = (url: string) => {
        Linking.openURL(url).catch(() => showToast.error('Could not open link'));
    };

    const vastuScores = [50, 60, 70, 80, 90];
    const doshas = ['VATA', 'PITTA', 'KAPHA', 'VATA_PITTA', 'PITTA_KAPHA', 'KAPHA_VATA', 'TRIDOSHA'];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* General Settings */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>General</Text>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Ionicons name="notifications-outline" size={22} color={colors.text} />
                        <View style={styles.settingText}>
                            <Text style={styles.settingLabel}>Push Notifications</Text>
                            <Text style={styles.settingDesc}>Receive alerts for new properties</Text>
                        </View>
                    </View>
                    <Switch
                        value={localSettings.notifications}
                        onValueChange={(val) => handleToggle('notifications', val)}
                        trackColor={{ false: colors.surface, true: colors.primary }}
                        thumbColor={colors.text}
                    />
                </View>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Ionicons name="moon-outline" size={22} color={colors.text} />
                        <View style={styles.settingText}>
                            <Text style={styles.settingLabel}>Dark Mode</Text>
                            <Text style={styles.settingDesc}>Use dark theme (always on)</Text>
                        </View>
                    </View>
                    <Switch
                        value={localSettings.darkMode}
                        onValueChange={(val) => handleToggle('darkMode', val)}
                        trackColor={{ false: colors.surface, true: colors.primary }}
                        thumbColor={colors.text}
                    />
                </View>
            </View>

            {/* Vastu Preferences */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vastu Preferences</Text>
                <Text style={styles.sectionDesc}>Minimum Vastu score to show in search results</Text>

                <View style={styles.scoreGrid}>
                    {vastuScores.map((score) => (
                        <TouchableOpacity
                            key={score}
                            style={[
                                styles.scoreChip,
                                localSettings.minVastuScore === score && styles.scoreChipActive,
                            ]}
                            onPress={() => handleVastuScoreChange(score)}
                        >
                            <Text
                                style={[
                                    styles.scoreChipText,
                                    localSettings.minVastuScore === score && styles.scoreChipTextActive,
                                ]}
                            >
                                {score}+
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Ayurvedic Preferences */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ayurvedic Dosha Type</Text>
                <Text style={styles.sectionDesc}>Select your dominant dosha for personalized recommendations</Text>

                <View style={styles.doshaGrid}>
                    {doshas.map((dosha) => (
                        <TouchableOpacity
                            key={dosha}
                            style={[
                                styles.doshaChip,
                                localSettings.doshaPreference === dosha && styles.doshaChipActive,
                            ]}
                            onPress={() => handleDoshaChange(dosha)}
                        >
                            <Text
                                style={[
                                    styles.doshaChipText,
                                    localSettings.doshaPreference === dosha && styles.doshaChipTextActive,
                                ]}
                            >
                                {dosha.replace('_', '-')}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={[
                            styles.doshaChip,
                            localSettings.doshaPreference === null && styles.doshaChipActive,
                        ]}
                        onPress={() => handleDoshaChange(null)}
                    >
                        <Text
                            style={[
                                styles.doshaChipText,
                                localSettings.doshaPreference === null && styles.doshaChipTextActive,
                            ]}
                        >
                            Not Set
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Data & Privacy */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data & Privacy</Text>

                <TouchableOpacity style={styles.menuItem} onPress={() => showToast.info('Download started, check your email')}>
                    <Ionicons name="download-outline" size={20} color={colors.text} />
                    <Text style={styles.menuText}>Download My Data</Text>
                    <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleClearHistory}>
                    <Ionicons name="trash-outline" size={20} color={colors.error} />
                    <Text style={styles.menuText}>Clear Search History</Text>
                    <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => openLink('https://restinu.com/privacy')}>
                    <Ionicons name="shield-checkmark-outline" size={20} color={colors.text} />
                    <Text style={styles.menuText}>Privacy Policy</Text>
                    <Ionicons name="open-outline" size={18} color={colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => openLink('https://restinu.com/terms')}>
                    <Ionicons name="document-text-outline" size={20} color={colors.text} />
                    <Text style={styles.menuText}>Terms of Service</Text>
                    <Ionicons name="open-outline" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* About */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>

                <View style={styles.menuItem}>
                    <Ionicons name="information-circle-outline" size={20} color={colors.text} />
                    <Text style={styles.menuText}>App Version</Text>
                    <Text style={styles.versionText}>1.0.0</Text>
                </View>

                <TouchableOpacity style={styles.menuItem} onPress={() => openLink('https://restinu.com/help')}>
                    <Ionicons name="help-circle-outline" size={20} color={colors.text} />
                    <Text style={styles.menuText}>Help & Support</Text>
                    <Ionicons name="open-outline" size={18} color={colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => openLink('https://apps.apple.com/app/restinu')}>
                    <Ionicons name="star-outline" size={20} color={colors.warning} />
                    <Text style={styles.menuText}>Rate Us</Text>
                    <Ionicons name="open-outline" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Logout */}
            {user && (
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color={colors.error} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            )}

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    section: { paddingHorizontal: 16, marginTop: 24 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
    sectionDesc: { fontSize: 13, color: colors.textSecondary, marginBottom: 12, lineHeight: 18 },
    settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 10 },
    settingInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 14 },
    settingText: { flex: 1 },
    settingLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
    settingDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    scoreGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    scoreChip: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 2, borderColor: colors.surface },
    scoreChipActive: { backgroundColor: colors.primary + '20', borderColor: colors.primary },
    scoreChipText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
    scoreChipTextActive: { color: colors.primary },
    doshaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    doshaChip: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 2, borderColor: colors.surface },
    doshaChipActive: { backgroundColor: colors.warning + '20', borderColor: colors.warning },
    doshaChipText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
    doshaChipTextActive: { color: colors.warning },
    menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 8, gap: 14 },
    menuText: { flex: 1, fontSize: 15, color: colors.text },
    versionText: { fontSize: 14, color: colors.textSecondary },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, marginHorizontal: 16, marginTop: 24, padding: 16, borderRadius: 12, gap: 10, borderWidth: 1, borderColor: colors.error },
    logoutText: { fontSize: 16, fontWeight: '600', color: colors.error },
});
