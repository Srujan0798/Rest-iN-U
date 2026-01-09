import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
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
    success: '#10b981',
    online: '#22c55e',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Conversation {
    id: string;
    agentId: string;
    agentName: string;
    agentAvatar?: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
    online: boolean;
    propertyTitle?: string;
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: string;
}

const mockConversations: Conversation[] = [
    { id: '1', agentId: 'a1', agentName: 'Priya Sharma', lastMessage: 'The property is available for viewing tomorrow at 3 PM', timestamp: '2 min ago', unread: 2, online: true, propertyTitle: 'Sunshine Apartments' },
    { id: '2', agentId: 'a2', agentName: 'Rahul Verma', lastMessage: 'I can arrange a virtual tour if that works better', timestamp: '1 hour ago', unread: 0, online: true },
    { id: '3', agentId: 'a3', agentName: 'Anjali Patel', lastMessage: 'Great choice! Let me know your preferred time for site visit', timestamp: 'Yesterday', unread: 0, online: false, propertyTitle: 'Green Valley Villa' },
    { id: '4', agentId: 'a4', agentName: 'Vikram Singh', lastMessage: 'The Vastu analysis report is ready. Score: 92%!', timestamp: '2 days ago', unread: 0, online: false },
];

const mockMessages: Message[] = [
    { id: '1', text: 'Hi! I\'m interested in Sunshine Apartments', sender: 'user', timestamp: '10:30 AM' },
    { id: '2', text: 'Hello! Great choice. It\'s one of our premium properties with excellent Vastu compliance.', sender: 'agent', timestamp: '10:32 AM' },
    { id: '3', text: 'What\'s the Vastu score?', sender: 'user', timestamp: '10:33 AM' },
    { id: '4', text: 'It has an impressive 87% Vastu score with perfect entrance placement.', sender: 'agent', timestamp: '10:35 AM' },
    { id: '5', text: 'Can I schedule a viewing?', sender: 'user', timestamp: '10:40 AM' },
    { id: '6', text: 'The property is available for viewing tomorrow at 3 PM', sender: 'agent', timestamp: '10:42 AM' },
];

export default function MessagesScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState<Message[]>(mockMessages);

    const sendMessage = () => {
        if (!messageText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            sender: 'user',
            timestamp: 'Just now',
        };
        setMessages([...messages, newMessage]);
        setMessageText('');
    };

    const renderConversationList = () => (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Ionicons name="chatbubbles" size={28} color={colors.text} />
                    <Text style={styles.headerTitle}>Messages</Text>
                </View>
                <TouchableOpacity style={styles.searchBtn}>
                    <Ionicons name="search" size={22} color={colors.text} />
                </TouchableOpacity>
            </LinearGradient>

            {mockConversations.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="chatbubbles-outline" size={80} color={colors.textSecondary} />
                    <Text style={styles.emptyTitle}>No Messages Yet</Text>
                    <Text style={styles.emptyText}>Start a conversation with an agent about a property you're interested in</Text>
                    <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.browseBtnText}>Browse Properties</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={mockConversations}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.conversationItem}
                            onPress={() => setSelectedConversation(item)}
                        >
                            <View style={styles.avatarContainer}>
                                <View style={styles.avatar}>
                                    <Ionicons name="person" size={24} color={colors.text} />
                                </View>
                                {item.online && <View style={styles.onlineDot} />}
                            </View>
                            <View style={styles.conversationContent}>
                                <View style={styles.conversationHeader}>
                                    <Text style={styles.agentName}>{item.agentName}</Text>
                                    <Text style={styles.timestamp}>{item.timestamp}</Text>
                                </View>
                                {item.propertyTitle && (
                                    <View style={styles.propertyTag}>
                                        <Ionicons name="home" size={10} color={colors.primary} />
                                        <Text style={styles.propertyTagText}>{item.propertyTitle}</Text>
                                    </View>
                                )}
                                <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
                            </View>
                            {item.unread > 0 && (
                                <View style={styles.unreadBadge}>
                                    <Text style={styles.unreadText}>{item.unread}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );

    const renderChatView = () => (
        <View style={styles.container}>
            {/* Chat Header */}
            <View style={styles.chatHeader}>
                <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedConversation(null)}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.chatHeaderInfo}>
                    <View style={styles.smallAvatar}>
                        <Ionicons name="person" size={18} color={colors.text} />
                    </View>
                    <View>
                        <Text style={styles.chatAgentName}>{selectedConversation?.agentName}</Text>
                        <Text style={styles.chatStatus}>
                            {selectedConversation?.online ? '● Online' : 'Offline'}
                        </Text>
                    </View>
                </View>
                <View style={styles.chatActions}>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="call" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="videocam" size={20} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Property Context */}
            {selectedConversation?.propertyTitle && (
                <TouchableOpacity style={styles.propertyContext}>
                    <Ionicons name="home" size={20} color={colors.primary} />
                    <View style={styles.propertyContextInfo}>
                        <Text style={styles.propertyContextLabel}>Discussing</Text>
                        <Text style={styles.propertyContextTitle}>{selectedConversation.propertyTitle}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
            )}

            {/* Messages */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageBubble,
                        item.sender === 'user' ? styles.userMessage : styles.agentMessage
                    ]}>
                        <Text style={[
                            styles.messageText,
                            item.sender === 'user' ? styles.userMessageText : styles.agentMessageText
                        ]}>
                            {item.text}
                        </Text>
                        <Text style={styles.messageTime}>{item.timestamp}</Text>
                    </View>
                )}
            />

            {/* Input */}
            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.attachBtn}>
                    <Ionicons name="add-circle" size={28} color={colors.primary} />
                </TouchableOpacity>
                <TextInput
                    style={styles.textInput}
                    placeholder="Type a message..."
                    placeholderTextColor={colors.textSecondary}
                    value={messageText}
                    onChangeText={setMessageText}
                    multiline
                />
                <TouchableOpacity
                    style={[styles.sendBtn, messageText.trim() && styles.sendBtnActive]}
                    onPress={sendMessage}
                >
                    <Ionicons name="send" size={20} color={messageText.trim() ? colors.text : colors.textSecondary} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return selectedConversation ? renderChatView() : renderConversationList();
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { padding: 20, paddingTop: 50, flexDirection: 'row', alignItems: 'center' },
    backBtn: { marginRight: 12 },
    headerContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginLeft: 10 },
    searchBtn: { padding: 8 },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginTop: 20 },
    emptyText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 },
    browseBtn: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 24 },
    browseBtnText: { color: colors.text, fontWeight: '600' },
    conversationItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 12 },
    avatarContainer: { position: 'relative' },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primary + '30', justifyContent: 'center', alignItems: 'center' },
    onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.online, borderWidth: 2, borderColor: colors.surface },
    conversationContent: { flex: 1, marginLeft: 12 },
    conversationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    agentName: { fontSize: 16, fontWeight: '600', color: colors.text },
    timestamp: { fontSize: 12, color: colors.textSecondary },
    propertyTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary + '15', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
    propertyTagText: { fontSize: 11, color: colors.primary, marginLeft: 4 },
    lastMessage: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    unreadBadge: { backgroundColor: colors.primary, borderRadius: 12, minWidth: 24, height: 24, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 },
    unreadText: { color: colors.text, fontSize: 12, fontWeight: 'bold' },
    chatHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 16, paddingTop: 50 },
    chatHeaderInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    smallAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary + '30', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    chatAgentName: { fontSize: 16, fontWeight: '600', color: colors.text },
    chatStatus: { fontSize: 12, color: colors.success },
    chatActions: { flexDirection: 'row' },
    actionBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary + '15', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
    propertyContext: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 12, borderBottomWidth: 1, borderBottomColor: colors.background },
    propertyContextInfo: { flex: 1, marginLeft: 12 },
    propertyContextLabel: { fontSize: 11, color: colors.textSecondary },
    propertyContextTitle: { fontSize: 14, fontWeight: '600', color: colors.primary },
    messagesList: { padding: 16, paddingBottom: 100 },
    messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 8 },
    userMessage: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: 4 },
    agentMessage: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderBottomLeftRadius: 4 },
    messageText: { fontSize: 15, lineHeight: 20 },
    userMessageText: { color: colors.text },
    agentMessageText: { color: colors.text },
    messageTime: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4, alignSelf: 'flex-end' },
    inputContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'flex-end', backgroundColor: colors.surface, padding: 12, paddingBottom: 32 },
    attachBtn: { marginRight: 8 },
    textInput: { flex: 1, backgroundColor: colors.background, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: colors.text, maxHeight: 100 },
    sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
    sendBtnActive: { backgroundColor: colors.primary },
});
