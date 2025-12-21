'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: 'BUYER' | 'SELLER' | 'AGENT' | 'ADMIN';
    profilePhoto?: string;
    agent?: any;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: { email: string; password: string; firstName: string; lastName: string; userType?: string }) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isAgent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }

                const token = localStorage.getItem('token');
                if (token) {
                    const { user: userData } = await api.getMe();
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                }
            } catch (error) {
                console.error('Failed to load user:', error);
                api.clearToken();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        const { user: userData } = await api.login(email, password);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        if (userData.userType === 'AGENT') {
            router.push('/dashboard/agent');
        } else {
            router.push('/dashboard');
        }
    };

    const register = async (data: { email: string; password: string; firstName: string; lastName: string; userType?: string }) => {
        const { user: userData } = await api.register(data);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/dashboard');
    };

    const logout = () => {
        api.clearToken();
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            isAuthenticated: !!user,
            isAgent: user?.userType === 'AGENT',
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

export default AuthProvider;
