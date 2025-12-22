'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
    profilePhotoUrl?: string;
    agent?: {
        id: string;
        subscriptionTier: string;
        verified: boolean;
    };
    karmicScores?: {
        overallScore: number;
        badges: string[];
    };
    tokenBalance?: {
        balance: number;
    };
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    birthTime?: string;
    birthPlace?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('dharma_token');
        if (token) {
            refreshUser().finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const refreshUser = async () => {
        try {
            const response = await api.getMe();
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('dharma_token');
            setUser(null);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await api.login(email, password);
        setUser(response.data.user);
    };

    const register = async (data: RegisterData) => {
        const response = await api.register(data);
        setUser(response.data.user);
    };

    const logout = async () => {
        try {
            await api.logout();
        } catch (e) {
            // Ignore logout errors
        }
        localStorage.removeItem('dharma_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
}

// Alias for backward compatibility - many pages import useAuth
export const useAuth = useAuthContext;
