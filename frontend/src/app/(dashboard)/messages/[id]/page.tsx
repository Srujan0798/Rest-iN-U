'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  read: boolean;
  attachments?: Array<{
    type: 'image' | 'document' | 'property';
    url: string;
    name: string;
  }>;
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    photo: string;
    role: 'AGENT' | 'BUYER' | 'SELLER';
    online: boolean;
  };
  property?: {
    id: string;
    title: string;
    image: string;
  };
  lastMessage: Message;
  unreadCount: number;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    participant: {
      id: 'agent1',
      name: 'Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      role: 'AGENT',
      online: true
    },
    property: {
      id: 'prop1',
      title: 'Luxurious 4BHK Villa with Vastu',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=100'
    },
    lastMessage: {
      id: 'm1',
      content: 'I can arrange a showing for you tomorrow at 10 AM. Does that work?',
      timestamp: '2024-12-19T14:30:00',
      senderId: 'agent1',
      read: false
    },
    unreadCount: 2,
    messages: [
      { id: 'm0', content: 'Hi! I\'m interested in the 4BHK Villa in Koramangala. Is it still available?', timestamp: '2024-12-19T10:00:00', senderId: 'user', read: true },
      { id: 'm1', content: 'Hello! Yes, the property is still available. It\'s one of our finest Vastu-compliant homes.', timestamp: '2024-12-19T10:15:00', senderId: 'agent1', read: true },
      { id: 'm2', content: 'Great! What\'s the Vastu score?', timestamp: '2024-12-19T11:00:00', senderId: 'user', read: true },
      { id: 'm3', content: 'It has a 95% Vastu score with excellent east-facing entrance and proper room placements according to Vastu principles.', timestamp: '2024-12-19T11:30:00', senderId: 'agent1', read: true },
      { id: 'm4', content: 'That sounds perfect! Can I schedule a visit?', timestamp: '2024-12-19T14:00:00', senderId: 'user', read: true },
      { id: 'm5', content: 'I can arrange a showing for you tomorrow at 10 AM. Does that work?', timestamp: '2024-12-19T14:30:00', senderId: 'agent1', read: false }
    ]
  },
  {
    id: '2',
    participant: {
      id: 'agent2',
      name: 'Rahul Verma',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      role: 'AGENT',
      online: false
    },
    property: {
      id: 'prop2',
      title: 'Modern 3BHK Apartment',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100'
    },
    lastMessage: {
      id: 'm2',
      content: 'The seller has accepted your offer! Congratulations! ðŸŽ‰',
      timestamp: '2024-12-18T16:00:00',
      senderId: 'agent2',
      read: true
    },
    unreadCount: 0,
    messages: [
      { id: 'm0', content: 'Hi Rahul, any update on my offer?', timestamp: '2024-12-18T14:00:00', senderId: 'user', read: true },
      { id: 'm1', content: 'Hi! I\'m following up with the seller right now.', timestamp: '2024-12-18T14:30:00', senderId: 'agent2', read: true },
      { id: 'm2', content: 'The seller has accepted your offer! Congratulations! ðŸŽ‰', timestamp: '2024-12-18T16:00:00', senderId: 'agent2', read: true }
    ]
  },
  {
    id: '3',
    participant: {
      id: 'seller1',
      name: 'Vikram Mehta',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      role: 'SELLER',
      online: true
    },
    property: {
      id: 'prop3',
      title: 'Premium Penthouse in Indiranagar',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=100'
    },
    lastMessage: {
      id: 'm3',
      content: 'I\'ve uploaded the Vastu certificate to the documents section.',
      timestamp: '2024-12-17T11:00:00',
      senderId: 'seller1',
      read: true
    },
    unreadCount: 0,
    messages: [
      { id: 'm0', content: 'Could you share the Vastu certification for the property?', timestamp: '2024-12-17T09:00:00', senderId: 'user', read: true },
      { id: 'm1', content: 'Sure! Let me get that for you.', timestamp: '2024-12-17T09:30:00', senderId: 'seller1', read: true },
      { id: 'm2', content: 'I\'ve uploaded the Vastu certificate to the documents section.', timestamp: '2024-12-17T11:00:00', senderId: 'seller1', read: true }
    ]
  },
  {
    id: '4',
    participant: {
      id: 'agent3',
      name: 'Anita Reddy',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      role: 'AGENT',
      online: false
    },
    lastMessage: {
      id: 'm4',
      content: 'I have some new listings that match your criteria. Would you like me to share them?',
      timestamp: '2024-12-15T09:00:00',
      senderId: 'agent3',
      read: true
    },
    unreadCount: 0,
    messages: [
      { id: 'm0', content: 'I have some new listings that match your criteria. Would you like me to share them?', timestamp: '2024-12-15T09:00:00', senderId: 'agent3', read: true }
    ]
  }
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileList, setShowMobileList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setConversations(mockConversations);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-IN', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'AGENT': return 'bg-purple-100 text-purple-700';
      case 'BUYER': return 'bg-blue-100 text-blue-700';
      case 'SELLER': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: `m${Date.now()}`,
      content: newMessage,
      timestamp: new Date().toISOString(),
      senderId: 'user',
      read: true
    };

    setConversations(prev => prev.map(conv =>
      conv.id === selectedConversation.id
        ? { ...conv, messages: [...conv.messages, newMsg], lastMessage: newMsg }
        : conv
    ));

    setSelectedConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMsg],
      lastMessage: newMsg
    } : null);

    setNewMessage('');
  };

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setShowMobileList(false);
    
    // Mark messages as read
    if (conv.unreadCount > 0) {
      setConversations(prev => prev.map(c =>
        c.id === conv.id ? { ...c, unreadCount: 0 } : c
      ));
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.property?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          {totalUnread > 0 && (
            <p className="text-gray-600">{totalUnread} unread message{totalUnread !== 1 ? 's' : ''}</p>
          )}
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Conversations List */}
        <div className={`w-full md:w-96 border-r border-gray-200 flex flex-col ${!showMobileList && selectedConversation ? 'hidden md:flex' : 'flex'}`}>
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-500">No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <motion.button
                  key={conv.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                    selectedConversation?.id === conv.id ? 'bg-orange-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={conv.participant.photo}
                        alt={conv.participant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {conv.participant.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 truncate">{conv.participant.name}</span>
                          <span className={`px-1.5 py-0.5 text-xs rounded ${getRoleBadgeColor(conv.participant.role)}`}>
                            {conv.participant.role}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatTime(conv.lastMessage.timestamp)}
                        </span>
                      </div>
                      {conv.property && (
                        <div className="flex items-center gap-2 mb-1">
                          <img
                            src={conv.property.image}
                            alt=""
                            className="w-5 h-5 rounded object-cover"
                          />
                          <span className="text-xs text-gray-500 truncate">{conv.property.title}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                          {conv.lastMessage.senderId === 'user' && 'You: '}
                          {conv.lastMessage.content}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="ml-2 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${showMobileList && !selectedConversation ? 'hidden md:flex' : 'flex'}`}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowMobileList(true)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="relative">
                    <img
                      src={selectedConversation.participant.photo}
                      alt={selectedConversation.participant.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {selectedConversation.participant.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={selectedConversation.participant.role === 'AGENT' ? `/agent/${selectedConversation.participant.id}` : '#'}
                        className="font-medium text-gray-900 hover:text-orange-600"
                      >
                        {selectedConversation.participant.name}
                      </Link>
                      <span className={`px-1.5 py-0.5 text-xs rounded ${getRoleBadgeColor(selectedConversation.participant.role)}`}>
                        {selectedConversation.participant.role}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {selectedConversation.participant.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedConversation.property && (
                    <Link
                      href={`/property/${selectedConversation.property.id}`}
                      className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <img
                        src={selectedConversation.property.image}
                        alt=""
                        className="w-6 h-6 rounded object-cover"
                      />
                      <span className="text-sm text-gray-700 max-w-[150px] truncate">
                        {selectedConversation.property.title}
                      </span>
                    </Link>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.reduce((acc: JSX.Element[], msg, index, arr) => {
                  const currentDate = formatMessageDate(msg.timestamp);
                  const prevDate = index > 0 ? formatMessageDate(arr[index - 1].timestamp) : null;

                  if (currentDate !== prevDate) {
                    acc.push(
                      <div key={`date-${msg.id}`} className="flex items-center justify-center my-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                          {currentDate}
                        </span>
                      </div>
                    );
                  }

                  const isUser = msg.senderId === 'user';
                  acc.push(
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] ${isUser ? 'order-2' : 'order-1'}`}>
                        {!isUser && (
                          <img
                            src={selectedConversation.participant.photo}
                            alt=""
                            className="w-6 h-6 rounded-full mb-1"
                          />
                        )}
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isUser
                              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-md'
                              : 'bg-gray-100 text-gray-900 rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <div className={`mt-1 text-xs text-gray-400 ${isUser ? 'text-right' : 'text-left'}`}>
                          {formatMessageTime(msg.timestamp)}
                          {isUser && msg.read && (
                            <span className="ml-2">âœ“âœ“</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );

                  return acc;
                }, [])}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
