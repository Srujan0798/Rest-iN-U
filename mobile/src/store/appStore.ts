import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { User, Property } from '../types/navigation';

interface AppState {
    // Auth
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;

    // Favorites
    favorites: string[];

    // Search History
    recentSearches: string[];

    // Viewed Properties
    recentlyViewed: string[];

    // Settings
    settings: {
        notifications: boolean;
        darkMode: boolean;
        minVastuScore: number;
        doshaPreference: string | null;
    };

    // Actions
    setUser: (user: User | null, token?: string | null) => void;
    logout: () => void;
    addFavorite: (propertyId: string) => void;
    removeFavorite: (propertyId: string) => void;
    isFavorite: (propertyId: string) => boolean;
    addRecentSearch: (query: string) => void;
    addRecentlyViewed: (propertyId: string) => void;
    updateSettings: (settings: Partial<AppState['settings']>) => void;
}

// Secure storage adapter for Zustand
const secureStorage = {
    getItem: async (name: string) => {
        const value = await SecureStore.getItemAsync(name);
        return value ?? null;
    },
    setItem: async (name: string, value: string) => {
        await SecureStore.setItemAsync(name, value);
    },
    removeItem: async (name: string) => {
        await SecureStore.deleteItemAsync(name);
    },
};

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial State
            user: null,
            token: null,
            isAuthenticated: false,
            favorites: [],
            recentSearches: [],
            recentlyViewed: [],
            settings: {
                notifications: true,
                darkMode: true,
                minVastuScore: 70,
                doshaPreference: null,
            },

            // Actions
            setUser: (user, token) => set({
                user,
                token: token ?? get().token,
                isAuthenticated: !!user,
            }),

            logout: () => set({
                user: null,
                token: null,
                isAuthenticated: false,
            }),

            addFavorite: (propertyId) => set(state => ({
                favorites: state.favorites.includes(propertyId)
                    ? state.favorites
                    : [...state.favorites, propertyId],
            })),

            removeFavorite: (propertyId) => set(state => ({
                favorites: state.favorites.filter(id => id !== propertyId),
            })),

            isFavorite: (propertyId) => get().favorites.includes(propertyId),

            addRecentSearch: (query) => set(state => ({
                recentSearches: [query, ...state.recentSearches.filter(q => q !== query)].slice(0, 10),
            })),

            addRecentlyViewed: (propertyId) => set(state => ({
                recentlyViewed: [propertyId, ...state.recentlyViewed.filter(id => id !== propertyId)].slice(0, 20),
            })),

            updateSettings: (newSettings) => set(state => ({
                settings: { ...state.settings, ...newSettings },
            })),
        }),
        {
            name: 'restinu-storage',
            storage: createJSONStorage(() => secureStorage),
            partialize: (state) => ({
                favorites: state.favorites,
                recentSearches: state.recentSearches,
                recentlyViewed: state.recentlyViewed,
                settings: state.settings,
            }),
        }
    )
);

