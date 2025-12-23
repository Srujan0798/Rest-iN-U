'use client';
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: string;
    read: boolean;
    sender: {
        id: string;
        firstName: string;
        lastName: string;
        profilePhoto?: string;
    };
}

interface SocketContextType {
    socket: Socket | null;
    connected: boolean;
    sendMessage: (receiverId: string, content: string, propertyId?: string) => void;
    markAsRead: (senderId: string) => void;
    startTyping: (receiverId: string) => void;
    stopTyping: (receiverId: string) => void;
    onlineUsers: Set<string>;
    typingUsers: Map<string, boolean>;
    newMessages: Message[];
    clearNewMessages: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const [typingUsers, setTypingUsers] = useState<Map<string, boolean>>(new Map());
    const [newMessages, setNewMessages] = useState<Message[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
            auth: { token },
        });

        socketInstance.on('connect', () => {
            console.log('Socket connected');
            setConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('Socket disconnected');
            setConnected(false);
        });

        socketInstance.on('user_online', ({ userId }: { userId: string }) => {
            setOnlineUsers((prev) => new Set(Array.from(prev).concat(userId)));
        });

        socketInstance.on('user_offline', ({ userId }: { userId: string }) => {
            setOnlineUsers((prev) => {
                const next = new Set(Array.from(prev));
                next.delete(userId);
                return next;
            });
        });

        socketInstance.on('new_message', ({ message }: { message: Message }) => {
            setNewMessages((prev) => [...prev, message]);
        });

        socketInstance.on('user_typing', ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
            setTypingUsers((prev) => {
                const next = new Map(prev);
                if (isTyping) {
                    next.set(userId, true);
                } else {
                    next.delete(userId);
                }
                return next;
            });
        });

        socketInstance.on('lead_received', ({ leadId }: { leadId: string }) => {
            // Show notification for new lead
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('New Lead Received!', {
                    body: 'You have a new property inquiry',
                    icon: '/favicon.ico',
                });
            }
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const sendMessage = useCallback((receiverId: string, content: string, propertyId?: string) => {
        socket?.emit('send_message', { receiverId, content, propertyId });
    }, [socket]);

    const markAsRead = useCallback((senderId: string) => {
        socket?.emit('mark_read', { senderId });
    }, [socket]);

    const startTyping = useCallback((receiverId: string) => {
        socket?.emit('typing_start', { receiverId });
    }, [socket]);

    const stopTyping = useCallback((receiverId: string) => {
        socket?.emit('typing_stop', { receiverId });
    }, [socket]);

    const clearNewMessages = useCallback(() => {
        setNewMessages([]);
    }, []);

    return (
        <SocketContext.Provider value={{
            socket,
            connected,
            sendMessage,
            markAsRead,
            startTyping,
            stopTyping,
            onlineUsers,
            typingUsers,
            newMessages,
            clearNewMessages,
        }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
}

export default SocketProvider;

