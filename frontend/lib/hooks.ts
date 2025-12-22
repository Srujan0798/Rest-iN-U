// React Hooks for Dharma Realty API
'use client';

import { useState, useEffect, useCallback } from 'react';
import api from './api';

// Generic fetch hook
function useFetch<T>(fetcher: () => Promise<T>, deps: any[] = []) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetcher();
            setData(result);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, deps);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { data, loading, error, refetch };
}

// Auth hooks
export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('dharma_token');
        if (token) {
            api.getMe()
                .then(res => setUser(res.data))
                .catch(() => {
                    localStorage.removeItem('dharma_token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const response = await api.login(email, password);
        setUser(response.data.user);
        return response;
    };

    const register = async (data: any) => {
        const response = await api.register(data);
        setUser(response.data.user);
        return response;
    };

    const logout = async () => {
        await api.logout();
        setUser(null);
    };

    return { user, loading, login, register, logout, isAuthenticated: !!user };
}

// Property hooks
export function useProperties(params?: Record<string, any>) {
    return useFetch(() => api.getProperties(params), [JSON.stringify(params)]);
}

export function useProperty(id: string) {
    return useFetch(() => api.getProperty(id), [id]);
}

export function usePropertySearch() {
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const search = async (filters: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.searchProperties(filters);
            setResults(response.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const naturalSearch = async (query: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.naturalSearch(query);
            setResults(response.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { results, loading, error, search, naturalSearch };
}

// Vastu hooks
export function useVastuAnalysis(propertyId: string) {
    return useFetch(() => api.getVastuAnalysis(propertyId), [propertyId]);
}

export function useVastuRules() {
    return useFetch(() => api.getVastuRules(), []);
}

export function useAuspiciousTiming() {
    const [timing, setTiming] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calculate = async (eventType: string, birthDetails?: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.getAuspiciousTiming(eventType, birthDetails);
            setTiming(response.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { timing, loading, error, calculate };
}

// Climate hooks
export function useClimateAnalysis(propertyId: string) {
    return useFetch(() => api.getClimateAnalysis(propertyId), [propertyId]);
}

export function useClimateProjections() {
    const [projections, setProjections] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const getProjections = async (lat: number, lng: number) => {
        setLoading(true);
        try {
            const response = await api.getClimateProjections(lat, lng);
            setProjections(response.data);
        } finally {
            setLoading(false);
        }
    };

    return { projections, loading, getProjections };
}

// Valuation hooks
export function useValuation(propertyId: string) {
    return useFetch(() => api.getValuation(propertyId), [propertyId]);
}

export function useMarketTrends(city: string, state: string) {
    return useFetch(() => api.getMarketTrends(city, state), [city, state]);
}

// Agent hooks
export function useAgents(params?: Record<string, any>) {
    return useFetch(() => api.getAgents(params), [JSON.stringify(params)]);
}

export function useAgent(id: string) {
    return useFetch(() => api.getAgent(id), [id]);
}

// Favorite toggle hook
export function useFavorite(propertyId: string, initialFavorited: boolean = false) {
    const [isFavorited, setIsFavorited] = useState(initialFavorited);
    const [loading, setLoading] = useState(false);

    const toggle = async () => {
        setLoading(true);
        try {
            const response = await api.favoriteProperty(propertyId);
            setIsFavorited(response.favorited);
        } finally {
            setLoading(false);
        }
    };

    return { isFavorited, loading, toggle };
}

// Inquiry submission hook
export function useInquiry(propertyId: string) {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async (data: { name: string; email: string; phone?: string; message?: string }) => {
        setLoading(true);
        setError(null);
        try {
            await api.submitInquiry(propertyId, data);
            setSubmitted(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { submitted, loading, error, submit };
}
