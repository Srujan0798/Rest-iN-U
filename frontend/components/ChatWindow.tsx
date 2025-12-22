'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Circle } from 'lucide-react';

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
        <div className="bg-white rounded-xl shadow-md flex h-[500px]">
            {/* Conversations List */}
            <div className="w-72 border-r border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900">Messages</h2>
                </div>
                <div className="overflow-y-auto h-[calc(100%-60px)]">
                    {conversations.map((convo) => (
                        <div
                            key={convo.partner.id}
                            onClick={() => setSelectedConvo(convo.partner.id)}
                            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 ${selectedConvo === convo.partner.id ? 'bg-blue-50' : ''
                                }`}
                        >
                            <div className="relative">
                                <img
                                    src={convo.partner.profilePhoto}
                                    alt={convo.partner.firstName}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                {convo.unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <p className={`text-sm ${convo.unreadCount > 0 ? 'font-semibold' : ''} text-gray-900`}>
                                        {convo.partner.firstName} {convo.partner.lastName}
                                    </p>
                                    {convo.unreadCount > 0 && (
                                        <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                                            {convo.unreadCount}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 truncate">{convo.lastMessage?.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedConvo ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                            <img
                                src={conversations.find(c => c.partner.id === selectedConvo)?.partner.profilePhoto}
                                alt=""
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-gray-900">
                                    {conversations.find(c => c.partner.id === selectedConvo)?.partner.firstName}
                                </p>
                                <div className="flex items-center gap-1">
                                    <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                                    <span className="text-xs text-gray-500">Online</span>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`max-w-[70%] ${msg.senderId === 'current' ? 'self-end' : 'self-start'}`}
                                >
                                    <div className={`px-4 py-2 rounded-2xl ${msg.senderId === 'current'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                        }`}>
                                        <p className="text-sm">{msg.content}</p>
                                    </div>
                                    <p className="text-xs text-gray-400 px-2 mt-1">{msg.createdAt}</p>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="self-start max-w-[70%]">
                                    <div className="px-4 py-2 bg-gray-100 rounded-2xl">
                                        <p className="text-sm text-gray-500">typing...</p>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-200 flex gap-2">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500">Select a conversation to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}
