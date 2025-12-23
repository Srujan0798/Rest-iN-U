'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, Paperclip, Image as ImageIcon, MapPin, Calendar, X } from 'lucide-react';

interface Message {
    id: string;
    sender: 'user' | 'agent';
    text: string;
    timestamp: Date;
    type?: 'text' | 'property' | 'tour';
    propertyData?: { id: string; title: string; image: string; price: string };
}

interface AgentChatProps {
    agent: { id: string; name: string; image?: string; title?: string; rating?: number };
    propertyId?: string;
    onClose?: () => void;
}

const quickReplies = [
    'Is this property still available?',
    'Can I schedule a viewing?',
    'What is the Vastu score?',
    'Are there any similar properties?',
];

export default function AgentChat({ agent, propertyId, onClose }: AgentChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'agent', text: `Hi! I'm ${agent.name}. How can I help you today?`, timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = { id: Date.now().toString(), sender: 'user', text, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate agent response
        setTimeout(() => {
            setIsTyping(false);
            const agentMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'agent',
                text: getAgentResponse(text),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, agentMessage]);
        }, 1500);
    };

    const getAgentResponse = (userText: string): string => {
        const lower = userText.toLowerCase();
        if (lower.includes('available')) return 'Yes, this property is still available! Would you like to schedule a tour?';
        if (lower.includes('viewing') || lower.includes('tour') || lower.includes('schedule')) return 'I can arrange a tour for you. Would you prefer an in-person visit or a virtual tour? What days work best for you?';
        if (lower.includes('vastu')) return 'This property has an excellent Vastu score of 87/100. The entrance faces east, which is very auspicious. Would you like more details about the Vastu analysis?';
        if (lower.includes('similar')) return 'I have 3 similar properties in this area with great Vastu scores. Would you like me to send you the listings?';
        if (lower.includes('price')) return 'The asking price is negotiable. Would you like to discuss financing options or make an offer?';
        return 'That\'s a great question! Let me look into that for you. Is there anything else you\'d like to know about this property?';
    };

    return (
        <div className="flex flex-col h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                        {agent.image ? <img src={agent.image} alt={agent.name} className="w-10 h-10 rounded-full" /> : agent.name[0]}
                    </div>
                    <div>
                        <h3 className="font-semibold">{agent.name}</h3>
                        <p className="text-xs text-white/80">{agent.title || 'Real Estate Agent'} • Online</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg"><Phone className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-white/10 rounded-lg"><Video className="w-4 h-4" /></button>
                    {onClose && <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-4 h-4" /></button>}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${msg.sender === 'user'
                                ? 'bg-amber-500 text-white rounded-br-sm'
                                : 'bg-white text-gray-900 shadow-sm rounded-bl-sm'
                            }`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white px-4 py-3 rounded-2xl shadow-sm">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-4 py-2 border-t border-gray-100 bg-white">
                <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
                    {quickReplies.map((reply, i) => (
                        <button key={i} onClick={() => sendMessage(reply)}
                            className="flex-shrink-0 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700">
                            {reply}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600"><Paperclip className="w-5 h-5" /></button>
                    <button className="p-2 text-gray-400 hover:text-gray-600"><ImageIcon className="w-5 h-5" /></button>
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && sendMessage(input)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button onClick={() => sendMessage(input)} disabled={!input.trim()}
                        className="p-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-full">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
