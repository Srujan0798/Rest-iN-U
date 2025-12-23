import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const colors = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#0f0f23',
    surface: '#1a1a2e',
    text: '#ffffff',
    textSecondary: '#a1a1aa',
    accent: '#f59e0b',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const menuItems = [
    { id: '1', icon: 'person-outline', title: 'Edit Profile', screen: null },
    { id: '2', icon: 'notifications-outline', title: 'Notifications', screen: null },
    { id: '3', icon: 'compass-outline', title: 'Vastu Preferences', screen: null },
    { id: '4', icon: 'fitness-outline', title: 'Dosha Profile', screen: null },
    { id: '5', icon: 'shield-checkmark-outline', title: 'Privacy & Security', screen: null },
    { id: '6', icon: 'help-circle-outline', title: 'Help & Support', screen: null },
    { id: '7', icon: 'information-circle-outline', title: 'About', screen: null },
];

export default function ProfileScreen() {
    const navigation = useNavigation<NavigationProp>();

    const user = {
        name: 'Guest User',
        email: 'guest@restinu.com',
        doshaType: 'Vata-Pitta',
        preferredScore: 85,
        savedCount: 2,
        viewedCount: 15,
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Profile Header */}
            <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.header}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={40} color={colors.text} />
                </View>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
                <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>Sign In</Text>
                </TouchableOpacity>
            </LinearGradient>

            {/* Stats */}
            <View style={styles.stats}>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{user.savedCount}</Text>
                    <Text style={styles.statLabel}>Saved</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{user.viewedCount}</Text>
                    <Text style={styles.statLabel}>Viewed</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{user.preferredScore}+</Text>
                    <Text style={styles.statLabel}>Min Vastu</Text>
                </View>
            </View>

            {/* Dosha Badge */}
            <View style={styles.doshaCard}>
                <Ionicons name="fitness" size={24} color={colors.accent} />
                <View style={{ marginLeft: 12 }}>
                    <Text style={styles.doshaTitle}>Your Dosha Type</Text>
                    <Text style={styles.doshaValue}>{user.doshaType}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} style={{ marginLeft: 'auto' }} />
            </View>

            {/* Menu Items */}
            <View style={styles.menu}>
                {menuItems.map((item) => (
                    <TouchableOpacity key={item.id} style={styles.menuItem}>
                        <Ionicons name={item.icon as any} size={22} color={colors.text} />
                        <Text style={styles.menuText}>{item.title}</Text>
                        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutBtn}>
                <Ionicons name="log-out-outline" size={20} color={colors.primary} />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <View style={{ height: 32 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { alignItems: 'center', padding: 24, paddingTop: 40, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    name: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginTop: 12 },
    email: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
    loginBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20, marginTop: 16 },
    loginText: { color: colors.text, fontWeight: '600' },
    stats: { flexDirection: 'row', backgroundColor: colors.surface, margin: 16, borderRadius: 16, padding: 16 },
    stat: { flex: 1, alignItems: 'center' },
    statValue: { fontSize: 20, fontWeight: 'bold', color: colors.primary },
    statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
    divider: { width: 1, backgroundColor: colors.background, marginVertical: 4 },
    doshaCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, marginHorizontal: 16, padding: 16, borderRadius: 12 },
    doshaTitle: { fontSize: 12, color: colors.textSecondary },
    doshaValue: { fontSize: 16, fontWeight: '600', color: colors.accent },
    menu: { backgroundColor: colors.surface, margin: 16, borderRadius: 16, overflow: 'hidden' },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.background },
    menuText: { flex: 1, marginLeft: 14, fontSize: 15, color: colors.text },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 16, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.primary },
    logoutText: { marginLeft: 8, fontSize: 15, fontWeight: '600', color: colors.primary },
});
