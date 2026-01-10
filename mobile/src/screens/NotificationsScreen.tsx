import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { showToast } from '../utils/toast';

const colors = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#0f0f23',
    surface: '#1a1a2e',
    text: '#ffffff',
    textSecondary: '#a1a1aa',
    accent: '#f59e0b',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface NotificationSetting {
    id: string;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    enabled: boolean;
}

interface NotificationItem {
    id: string;
    type: 'property' | 'vastu' | 'climate' | 'agent' | 'system';
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const initialSettings: NotificationSetting[] = [
    { id: '1', title: 'Property Alerts', description: 'New listings matching your criteria', icon: 'home', enabled: true },
    { id: '2', title: 'Vastu Updates', description: 'Analysis reports and recommendations', icon: 'compass', enabled: true },
    { id: '3', title: 'Climate Warnings', description: 'Risk alerts for saved properties', icon: 'thunderstorm', enabled: true },
    { id: '4', title: 'Agent Messages', description: 'Messages from real estate agents', icon: 'chatbubbles', enabled: true },
    { id: '5', title: 'Price Changes', description: 'Price updates on watched properties', icon: 'trending-down', enabled: false },
    { id: '6', title: 'Newsletter', description: 'Weekly market insights and tips', icon: 'newspaper', enabled: false },
];

const mockNotifications: NotificationItem[] = [
    { id: '1', type: 'property', title: 'New Property Match!', message: '3 BHK in Andheri West matches your criteria. Vastu Score: 87%', time: '2 hours ago', read: false },
    { id: '2', type: 'vastu', title: 'Vastu Report Ready', message: 'Your Vastu analysis for Sunshine Apartments is complete', time: '5 hours ago', read: false },
    { id: '3', type: 'climate', title: 'Climate Alert', message: 'Moderate flood risk detected for your saved property in Bandra', time: '1 day ago', read: true },
    { id: '4', type: 'agent', title: 'Message from Agent', message: 'Priya Sharma: "The property is available for viewing tomorrow"', time: '2 days ago', read: true },
    { id: '5', type: 'system', title: 'Welcome to REST-iN-U!', message: 'Complete your Dosha profile for personalized recommendations', time: '1 week ago', read: true },
];

const getNotificationIcon = (type: NotificationItem['type']): keyof typeof Ionicons.glyphMap => {
    switch (type) {
        case 'property': return 'home';
        case 'vastu': return 'compass';
        case 'climate': return 'thunderstorm';
        case 'agent': return 'person';
        case 'system': return 'information-circle';
        default: return 'notifications';
    }
};

const getNotificationColor = (type: NotificationItem['type']): string => {
    switch (type) {
        case 'property': return colors.primary;
        case 'vastu': return colors.accent;
        case 'climate': return colors.warning;
        case 'agent': return colors.success;
        case 'system': return colors.textSecondary;
        default: return colors.primary;
    }
};

export default function NotificationsScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [settings, setSettings] = useState<NotificationSetting[]>(initialSettings);
    const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications');
    const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

    const toggleSetting = (id: string) => {
        setSettings(prev => prev.map(s =>
            s.id === id ? { ...s, enabled: !s.enabled } : s
        ));
        const setting = settings.find(s => s.id === id);
        if (setting) {
            showToast.success(`${setting.title} ${!setting.enabled ? 'enabled' : 'disabled'}`);
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        showToast.success('All notifications marked as read');
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Ionicons name="notifications" size={32} color={colors.text} />
                    <Text style={styles.headerTitle}>Notifications</Text>
                    {unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>
            </LinearGradient>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'notifications' && styles.activeTab]}
                    onPress={() => setActiveTab('notifications')}
                >
                    <Text style={[styles.tabText, activeTab === 'notifications' && styles.activeTabText]}>
                        Inbox
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
                    onPress={() => setActiveTab('settings')}
                >
                    <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
                        Settings
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {activeTab === 'notifications' ? (
                    <>
                        {/* Mark All Read */}
                        {unreadCount > 0 && (
                            <TouchableOpacity style={styles.markAllBtn} onPress={markAllAsRead}>
                                <Ionicons name="checkmark-done" size={18} color={colors.primary} />
                                <Text style={styles.markAllText}>Mark all as read</Text>
                            </TouchableOpacity>
                        )}

                        {/* Notifications List */}
                        {notifications.map((notification) => (
                            <TouchableOpacity
                                key={notification.id}
                                style={[styles.notificationItem, !notification.read && styles.unread]}
                                onPress={() => markAsRead(notification.id)}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(notification.type) + '20' }]}>
                                    <Ionicons
                                        name={getNotificationIcon(notification.type)}
                                        size={22}
                                        color={getNotificationColor(notification.type)}
                                    />
                                </View>
                                <View style={styles.notificationContent}>
                                    <View style={styles.notificationHeader}>
                                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                                        {!notification.read && <View style={styles.unreadDot} />}
                                    </View>
                                    <Text style={styles.notificationMessage} numberOfLines={2}>
                                        {notification.message}
                                    </Text>
                                    <Text style={styles.notificationTime}>{notification.time}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        {notifications.length === 0 && (
                            <View style={styles.emptyState}>
                                <Ionicons name="notifications-off" size={64} color={colors.textSecondary} />
                                <Text style={styles.emptyTitle}>No Notifications</Text>
                                <Text style={styles.emptyText}>You're all caught up!</Text>
                            </View>
                        )}
                    </>
                ) : (
                    <>
                        {/* Notification Settings */}
                        <Text style={styles.sectionTitle}>Notification Preferences</Text>
                        <View style={styles.settingsCard}>
                            {settings.map((setting, index) => (
                                <View
                                    key={setting.id}
                                    style={[styles.settingItem, index < settings.length - 1 && styles.settingBorder]}
                                >
                                    <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
                                        <Ionicons name={setting.icon} size={20} color={colors.primary} />
                                    </View>
                                    <View style={styles.settingContent}>
                                        <Text style={styles.settingTitle}>{setting.title}</Text>
                                        <Text style={styles.settingDescription}>{setting.description}</Text>
                                    </View>
                                    <Switch
                                        value={setting.enabled}
                                        onValueChange={() => toggleSetting(setting.id)}
                                        trackColor={{ false: colors.background, true: colors.primary + '60' }}
                                        thumbColor={setting.enabled ? colors.primary : colors.textSecondary}
                                    />
                                </View>
                            ))}
                        </View>

                        {/* Push Notifications Info */}
                        <View style={styles.infoCard}>
                            <Ionicons name="information-circle" size={24} color={colors.accent} />
                            <Text style={styles.infoText}>
                                Push notifications require permission. Enable them in your device settings for real-time alerts.
                            </Text>
                        </View>
                    </>
                )}

                <View style={{ height: 32 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { padding: 20, paddingTop: 50, flexDirection: 'row', alignItems: 'center' },
    backBtn: { marginRight: 16 },
    headerContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginLeft: 12 },
    badge: { backgroundColor: colors.danger, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
    badgeText: { color: colors.text, fontSize: 12, fontWeight: 'bold' },
    tabs: { flexDirection: 'row', backgroundColor: colors.surface, marginHorizontal: 16, marginTop: 16, borderRadius: 12, padding: 4 },
    tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
    activeTab: { backgroundColor: colors.primary },
    tabText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
    activeTabText: { color: colors.text },
    content: { flex: 1, padding: 16 },
    markAllBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 12 },
    markAllText: { fontSize: 14, color: colors.primary, marginLeft: 6 },
    notificationItem: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 12 },
    unread: { borderLeftWidth: 3, borderLeftColor: colors.primary },
    iconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    notificationContent: { flex: 1, marginLeft: 12 },
    notificationHeader: { flexDirection: 'row', alignItems: 'center' },
    notificationTitle: { fontSize: 15, fontWeight: '600', color: colors.text, flex: 1 },
    unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
    notificationMessage: { fontSize: 13, color: colors.textSecondary, marginTop: 4, lineHeight: 18 },
    notificationTime: { fontSize: 12, color: colors.textSecondary, marginTop: 6 },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginTop: 16 },
    emptyText: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 },
    settingsCard: { backgroundColor: colors.surface, borderRadius: 16, overflow: 'hidden' },
    settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    settingBorder: { borderBottomWidth: 1, borderBottomColor: colors.background },
    settingIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    settingContent: { flex: 1, marginLeft: 12 },
    settingTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
    settingDescription: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    infoCard: { flexDirection: 'row', backgroundColor: colors.accent + '15', borderRadius: 12, padding: 16, marginTop: 16, alignItems: 'flex-start' },
    infoText: { flex: 1, fontSize: 13, color: colors.textSecondary, marginLeft: 12, lineHeight: 18 },
});
