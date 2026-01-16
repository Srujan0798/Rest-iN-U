'use client';

import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Button, Input, Avatar, Card } from '@/components/ui';
import { MessageCircle, X, Send, MinusSquare, Maximize2, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  type?: string;
  sender?: {
    firstName: string;
    lastName?: string;
  };
}

interface ChatWidgetProps {
  serverUrl?: string; // Optional, defaults to env or auto-detect
}

export function ChatWidget({ serverUrl }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Initialize socket
  useEffect(() => {
    // In a real app, we'd get the token from auth context/storage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // Auto-detect server URL if not provided
    const url = serverUrl || (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace('/api/v1', '');

    const newSocket = io(url, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      console.log('Chat connected');
      setIsConnected(true);
      // For demo purposes, we might generate a random ID if not auth
      if (!token) {
          // Identify as anon
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Chat disconnected');
      setIsConnected(false);
    });

    newSocket.on('message:new', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    newSocket.on('message:sent', (message: Message) => {
        // Optimistic update might duplicate if we are not careful, but typically backend confirms
        // Here we just append if not already there (by ID if we had one, but we don't generate IDs locally yet)
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
    });

    newSocket.on('message:typing', (data: { senderId: string, isTyping: boolean }) => {
        // Handle typing indicator from others
        // Simplified: just show "Agent is typing..." if sender is not me
    });

    setSocket(newSocket);

    // Persist state check
    const savedState = localStorage.getItem('chatWidgetState');
    if (savedState) {
        const { isOpen: savedIsOpen, isMinimized: savedIsMinimized } = JSON.parse(savedState);
        setIsOpen(savedIsOpen);
        setIsMinimized(savedIsMinimized);
    }

    return () => {
      newSocket.disconnect();
    };
  }, [serverUrl]);

  // Persist state
  useEffect(() => {
      localStorage.setItem('chatWidgetState', JSON.stringify({ isOpen, isMinimized }));
  }, [isOpen, isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !socket) return;

    // Send to a default "Agent" or "Support" for now if no specific recipient
    // In a real app, we'd select a chat thread.
    // For this widget, let's assume we are chatting with "Support" (ID: 'support' or similar)
    // Or we broadcast to admins.

    // For this implementation, we'll emit 'message:send'
    // We need a recipient. Let's assume a default agent ID for the demo.
    const recipientId = 'agent-001';

    socket.emit('message:send', {
      recipientId,
      content: inputValue,
      type: 'TEXT'
    });

    // Optimistically add message (optional, but good UX)
    // Actually, we wait for 'message:sent' to be safe with IDs

    setInputValue('');
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (socket) {
        socket.emit('message:typing', { recipientId: 'agent-001', isTyping: true });
        // Debounce stop typing
        setTimeout(() => {
            socket.emit('message:typing', { recipientId: 'agent-001', isTyping: false });
        }, 1000);
    }
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-xl z-50 p-0 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="w-8 h-8 text-white" />
        {/* Online Indicator Badge */}
        {isConnected && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
        )}
      </Button>
    );
  }

  if (isMinimized) {
      return (
        <div className="fixed bottom-6 right-6 z-50 bg-white rounded-t-xl shadow-xl w-72 border border-gray-200">
            <div
                className="bg-indigo-600 text-white p-3 rounded-t-xl flex justify-between items-center cursor-pointer"
                onClick={() => setIsMinimized(false)}
            >
                <div className="font-semibold flex items-center gap-2">
                    <MessageCircle size={18} />
                    <span>Support Chat</span>
                </div>
                <div className="flex gap-2">
                    <Maximize2 size={16} className="cursor-pointer hover:text-indigo-200" onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }} />
                    <X size={16} className="cursor-pointer hover:text-indigo-200" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} />
                </div>
            </div>
        </div>
      );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] shadow-2xl flex flex-col z-50 border-0 p-0 overflow-hidden bg-white">
      {/* Header */}
      <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className="relative">
                <Avatar size="sm" className="bg-indigo-400 text-indigo-900" name="Agent" />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-indigo-600 ${isConnected ? 'bg-green-400' : 'bg-gray-400'}`}></span>
            </div>
            <div>
                <h3 className="font-bold text-sm">Rest-iN-U Support</h3>
                <p className="text-xs text-indigo-200">{isConnected ? 'Agent is Online' : 'Connecting...'}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <MinusSquare size={18} className="cursor-pointer hover:text-indigo-200" onClick={() => setIsMinimized(true)} />
            <X size={18} className="cursor-pointer hover:text-indigo-200" onClick={() => setIsOpen(false)} />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-10 text-sm">
                <p>Welcome to Rest-iN-U!</p>
                <p>How can we help you find your soul property today?</p>
            </div>
        )}
        {messages.map((msg, idx) => {
            const isMe = msg.senderId !== 'agent-001' && !msg.senderId?.includes('agent'); // Simplified logic
            return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                        isMe
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                    }`}>
                        {msg.content}
                    </div>
                </div>
            );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
        <Input
            className="flex-1 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-full px-4 py-2 text-sm"
            placeholder="Type a message..."
            value={inputValue}
            onChange={handleTyping}
        />
        <Button
            type="submit"
            size="sm"
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700"
            disabled={!inputValue.trim() || !isConnected}
        >
            <Send size={18} className="ml-0.5" />
        </Button>
      </form>
    </Card>
  );
}
