'use client';
import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import SendIcon from '@mui/icons-material/Send';
import CircleIcon from '@mui/icons-material/Circle';

interface Message {
    id: string;
    senderId: string;
    content: string;
    createdAt: string;
    sender: {
        firstName: string;
        lastName: string;
        profilePhoto?: string;
    };
}

interface Conversation {
    partner: {
        id: string;
        firstName: string;
        lastName: string;
        profilePhoto?: string;
    };
    lastMessage?: {
        content: string;
        createdAt: string;
    };
    unreadCount: number;
}

interface ChatWindowProps {
    selectedUserId?: string;
    currentUserId: string;
}

// Mock data
const mockConversations: Conversation[] = [
    {
        partner: { id: '1', firstName: 'Sarah', lastName: 'Agent', profilePhoto: 'https://picsum.photos/50/50?random=1' },
        lastMessage: { content: 'When would you like to schedule a viewing?', createdAt: '2 hours ago' },
        unreadCount: 2,
    },
    {
        partner: { id: '2', firstName: 'Mike', lastName: 'Johnson', profilePhoto: 'https://picsum.photos/50/50?random=2' },
        lastMessage: { content: 'The open house is this Saturday', createdAt: '1 day ago' },
        unreadCount: 0,
    },
];

const mockMessages: Message[] = [
    { id: '1', senderId: '1', content: 'Hi! I saw you were interested in the property on Main St.', createdAt: '10:30 AM', sender: { firstName: 'Sarah', lastName: 'Agent' } },
    { id: '2', senderId: 'current', content: 'Yes! I love the layout. Is it still available?', createdAt: '10:32 AM', sender: { firstName: 'John', lastName: 'Buyer' } },
    { id: '3', senderId: '1', content: 'Absolutely! Would you like to schedule a viewing?', createdAt: '10:35 AM', sender: { firstName: 'Sarah', lastName: 'Agent' } },
    { id: '4', senderId: 'current', content: 'That would be great. Are you free this weekend?', createdAt: '10:38 AM', sender: { firstName: 'John', lastName: 'Buyer' } },
    { id: '5', senderId: '1', content: 'When would you like to schedule a viewing?', createdAt: '10:40 AM', sender: { firstName: 'Sarah', lastName: 'Agent' } },
];

export default function ChatWindow({ selectedUserId, currentUserId }: ChatWindowProps) {
    const [conversations] = useState<Conversation[]>(mockConversations);
    const [selectedConvo, setSelectedConvo] = useState<string | null>(selectedUserId || null);
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConvo) return;

        const message: Message = {
            id: Date.now().toString(),
            senderId: 'current',
            content: newMessage,
            createdAt: 'Just now',
            sender: { firstName: 'You', lastName: '' },
        };

        setMessages([...messages, message]);
        setNewMessage('');

        // Simulate typing response
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages((prev) => [...prev, {
                id: Date.now().toString(),
                senderId: selectedConvo,
                content: 'Thanks for your message! I\'ll get back to you shortly.',
                createdAt: 'Just now',
                sender: conversations.find(c => c.partner.id === selectedConvo)?.partner || { firstName: 'Agent', lastName: '' },
            }]);
        }, 2000);
    };

    return (
        <Paper sx={{ display: 'flex', height: 500 }}>
            {/* Conversations List */}
            <Box sx={{ width: 280, borderRight: 1, borderColor: 'divider' }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" fontWeight={600}>Messages</Typography>
                </Box>
                <List sx={{ overflow: 'auto', height: 'calc(100% - 60px)' }}>
                    {conversations.map((convo) => (
                        <ListItem
                            key={convo.partner.id}
                            button
                            selected={selectedConvo === convo.partner.id}
                            onClick={() => setSelectedConvo(convo.partner.id)}
                            sx={{ '&.Mui-selected': { bgcolor: 'action.selected' } }}
                        >
                            <ListItemAvatar>
                                <Badge color="success" variant="dot" invisible={convo.unreadCount === 0}>
                                    <Avatar src={convo.partner.profilePhoto}>
                                        {convo.partner.firstName[0]}
                                    </Avatar>
                                </Badge>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography fontWeight={convo.unreadCount > 0 ? 600 : 400}>
                                            {convo.partner.firstName} {convo.partner.lastName}
                                        </Typography>
                                        {convo.unreadCount > 0 && (
                                            <Badge badgeContent={convo.unreadCount} color="primary" />
                                        )}
                                    </Box>
                                }
                                secondary={
                                    <Typography variant="body2" noWrap color="text.secondary" sx={{ maxWidth: 160 }}>
                                        {convo.lastMessage?.content}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Chat Area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedConvo ? (
                    <>
                        {/* Chat Header */}
                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar src={conversations.find(c => c.partner.id === selectedConvo)?.partner.profilePhoto} />
                            <Box>
                                <Typography fontWeight={600}>
                                    {conversations.find(c => c.partner.id === selectedConvo)?.partner.firstName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <CircleIcon sx={{ fontSize: 8, color: 'success.main' }} />
                                    <Typography variant="caption" color="text.secondary">Online</Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Messages */}
                        <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {messages.map((msg) => (
                                <Box
                                    key={msg.id}
                                    sx={{
                                        alignSelf: msg.senderId === 'current' ? 'flex-end' : 'flex-start',
                                        maxWidth: '70%',
                                    }}
                                >
                                    <Paper sx={{
                                        p: 1.5,
                                        bgcolor: msg.senderId === 'current' ? 'primary.main' : 'grey.100',
                                        color: msg.senderId === 'current' ? 'white' : 'inherit',
                                        borderRadius: 2,
                                    }}>
                                        <Typography variant="body2">{msg.content}</Typography>
                                    </Paper>
                                    <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                                        {msg.createdAt}
                                    </Typography>
                                </Box>
                            ))}
                            {isTyping && (
                                <Box sx={{ alignSelf: 'flex-start', maxWidth: '70%' }}>
                                    <Paper sx={{ p: 1.5, bgcolor: 'grey.100', borderRadius: 2 }}>
                                        <Typography variant="body2" color="text.secondary">typing...</Typography>
                                    </Paper>
                                </Box>
                            )}
                            <div ref={messagesEndRef} />
                        </Box>

                        {/* Input */}
                        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <IconButton color="primary" onClick={handleSendMessage}>
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </>
                ) : (
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography color="text.secondary">Select a conversation to start messaging</Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
}
