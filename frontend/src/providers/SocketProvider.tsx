'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '@/lib/config';
import { useAuthStore } from '@/store/auth-store';
import { useNotificationStore, Notification } from '@/store/notification-store';
import { useToast } from '@/store/ui-store';

// ============================================================================
// Types
// ============================================================================

export interface SocketMessage {
  event: string;
  data: unknown;
  timestamp: string;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface OnlineStatus {
  userId: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'property';
  metadata?: Record<string, unknown>;
  createdAt: string;
  readBy: string[];
}

export interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  
  // Connection management
  connect: () => void;
  disconnect: () => void;
  
  // Event handling
  emit: (event: string, data: unknown) => void;
  on: (event: string, callback: (data: unknown) => void) => void;
  off: (event: string, callback?: (data: unknown) => void) => void;
  
  // Chat functionality
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, content: string, type?: string) => void;
  sendTyping: (conversationId: string, isTyping: boolean) => void;
  markAsRead: (conversationId: string, messageIds: string[]) => void;
  
  // Presence
  typingIndicators: Map<string, TypingIndicator[]>;
  onlineUsers: Map<string, OnlineStatus>;
}

// ============================================================================
// Context
// ============================================================================

const SocketContext = createContext<SocketContextType | null>(null);

// ============================================================================
// Provider
// ============================================================================

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps): JSX.Element {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [typingIndicators, setTypingIndicators] = useState<Map<string, TypingIndicator[]>>(
    new Map()
  );
  const [onlineUsers, setOnlineUsers] = useState<Map<string, OnlineStatus>>(new Map());
  
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  
  const { accessToken, isAuthenticated } = useAuthStore();
  const { addNotification, setConnected } = useNotificationStore();
  const toast = useToast();

  // ============================================================================
  // Connection Management
  // ============================================================================

  const connect = useCallback(() => {
    if (socket?.connected || isConnecting || !isAuthenticated || !accessToken) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    const newSocket = io(API_CONFIG.wsUrl, {
      auth: {
        token: accessToken,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('[Socket] Connected');
      setIsConnected(true);
      setIsConnecting(false);
      setConnected(true);
      reconnectAttempts.current = 0;
    });

    newSocket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
      setIsConnected(false);
      setConnected(false);
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        setTimeout(() => {
          newSocket.connect();
        }, 1000);
      }
    });

    newSocket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err);
      setIsConnecting(false);
      setError(err.message);
      reconnectAttempts.current++;
      
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        setError('Failed to connect after multiple attempts');
      }
    });

    // Notification events
    newSocket.on('notification', (notification: Notification) => {
      addNotification(notification);
      
      // Show toast for high priority notifications
      if (notification.priority === 'high' || notification.priority === 'urgent') {
        toast.info(notification.title, notification.message);
      }
    });

    // Chat events
    newSocket.on('message:new', (message: ChatMessage) => {
      // Dispatch to message store (would be implemented separately)
      console.log('[Socket] New message:', message);
    });

    newSocket.on('message:read', (data: { conversationId: string; messageIds: string[]; userId: string }) => {
      console.log('[Socket] Messages read:', data);
    });

    // Typing indicators
    newSocket.on('typing:start', (data: TypingIndicator) => {
      setTypingIndicators((prev) => {
        const next = new Map(prev);
        const existing = next.get(data.conversationId) || [];
        if (!existing.find((t) => t.userId === data.userId)) {
          next.set(data.conversationId, [...existing, data]);
        }
        return next;
      });
    });

    newSocket.on('typing:stop', (data: TypingIndicator) => {
      setTypingIndicators((prev) => {
        const next = new Map(prev);
        const existing = next.get(data.conversationId) || [];
        next.set(
          data.conversationId,
          existing.filter((t) => t.userId !== data.userId)
        );
        return next;
      });
    });

    // Presence events
    newSocket.on('user:online', (data: OnlineStatus) => {
      setOnlineUsers((prev) => {
        const next = new Map(prev);
        next.set(data.userId, data);
        return next;
      });
    });

    newSocket.on('user:offline', (data: OnlineStatus) => {
      setOnlineUsers((prev) => {
        const next = new Map(prev);
        next.set(data.userId, { ...data, isOnline: false, lastSeen: new Date().toISOString() });
        return next;
      });
    });

    // Property events
    newSocket.on('property:updated', (data: { propertyId: string; changes: unknown }) => {
      console.log('[Socket] Property updated:', data);
    });

    newSocket.on('property:inquiry', (data: { propertyId: string; inquiry: unknown }) => {
      console.log('[Socket] New inquiry:', data);
    });

    setSocket(newSocket);
  }, [accessToken, isAuthenticated, isConnecting, socket?.connected, addNotification, setConnected, toast]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setConnected(false);
    }
  }, [socket, setConnected]);

  // ============================================================================
  // Event Handling
  // ============================================================================

  const emit = useCallback(
    (event: string, data: unknown) => {
      if (socket?.connected) {
        socket.emit(event, data);
      } else {
        console.warn('[Socket] Cannot emit, not connected');
      }
    },
    [socket]
  );

  const on = useCallback(
    (event: string, callback: (data: unknown) => void) => {
      socket?.on(event, callback);
    },
    [socket]
  );

  const off = useCallback(
    (event: string, callback?: (data: unknown) => void) => {
      if (callback) {
        socket?.off(event, callback);
      } else {
        socket?.off(event);
      }
    },
    [socket]
  );

  // ============================================================================
  // Chat Functionality
  // ============================================================================

  const joinConversation = useCallback(
    (conversationId: string) => {
      emit('conversation:join', { conversationId });
    },
    [emit]
  );

  const leaveConversation = useCallback(
    (conversationId: string) => {
      emit('conversation:leave', { conversationId });
    },
    [emit]
  );

  const sendMessage = useCallback(
    (conversationId: string, content: string, type = 'text') => {
      emit('message:send', {
        conversationId,
        content,
        type,
        timestamp: new Date().toISOString(),
      });
    },
    [emit]
  );

  const sendTyping = useCallback(
    (conversationId: string, isTyping: boolean) => {
      emit(isTyping ? 'typing:start' : 'typing:stop', { conversationId });
    },
    [emit]
  );

  const markAsRead = useCallback(
    (conversationId: string, messageIds: string[]) => {
      emit('message:read', { conversationId, messageIds });
    },
    [emit]
  );

  // ============================================================================
  // Auto-connect on auth change
  // ============================================================================

  useEffect(() => {
    if (isAuthenticated && accessToken && !socket) {
      connect();
    } else if (!isAuthenticated && socket) {
      disconnect();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isAuthenticated, accessToken, socket, connect, disconnect]);

  // ============================================================================
  // Visibility change handling
  // ============================================================================

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated && !socket?.connected) {
        connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [connect, isAuthenticated, socket?.connected]);

  // ============================================================================
  // Context Value
  // ============================================================================

  const value: SocketContextType = {
    socket,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    emit,
    on,
    off,
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTyping,
    markAsRead,
    typingIndicators,
    onlineUsers,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

// ============================================================================
// Hooks
// ============================================================================

export function useSocket(): SocketContextType {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

export function useSocketEvent<T = unknown>(
  event: string,
  callback: (data: T) => void
): void {
  const { on, off } = useSocket();

  useEffect(() => {
    const handler = (data: unknown) => callback(data as T);
    on(event, handler);
    return () => off(event, handler);
  }, [event, callback, on, off]);
}

export function useOnlineStatus(userId: string): OnlineStatus | undefined {
  const { onlineUsers } = useSocket();
  return onlineUsers.get(userId);
}

export function useTypingIndicator(conversationId: string): TypingIndicator[] {
  const { typingIndicators } = useSocket();
  return typingIndicators.get(conversationId) || [];
}

export default SocketProvider;
mkdir -p /home/claude/dharma-realty/frontend/src/__tests__/components
