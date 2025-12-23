import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Property, PropertyFilters, VastuAnalysis, User } from '../types/navigation';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'https://rest-in-u-backend.onrender.com';

class ApiService {
    private client: AxiosInstance;
    private token: string | null = null;

    constructor() {
        this.client = axios.create({
            baseURL: `${API_URL}/api`,
            timeout: 15000,
            headers: { 'Content-Type': 'application/json' },
        });

        this.client.interceptors.request.use(async (config) => {
            if (!this.token) {
                this.token = await SecureStore.getItemAsync('auth_token');
            }
            if (this.token) {
                config.headers.Authorization = `Bearer ${this.token}`;
            }
            return config;
        });

        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    await this.logout();
                }
                return Promise.reject(error);
            }
        );
    }

    // Auth
    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        const { data } = await this.client.post('/auth/login', { email, password });
        this.token = data.token;
        await SecureStore.setItemAsync('auth_token', data.token);
        return data;
    }

    async register(userData: { email: string; password: string; firstName: string; lastName: string }): Promise<{ user: User; token: string }> {
        const { data } = await this.client.post('/auth/register', userData);
        this.token = data.token;
        await SecureStore.setItemAsync('auth_token', data.token);
        return data;
    }

    async logout(): Promise<void> {
        this.token = null;
        await SecureStore.deleteItemAsync('auth_token');
    }

    async getProfile(): Promise<User> {
        const { data } = await this.client.get('/users/me');
        return data.data;
    }

    // Properties
    async searchProperties(filters: PropertyFilters): Promise<{ properties: Property[]; total: number }> {
        const { data } = await this.client.post('/search/advanced', filters);
        return data.data;
    }

    async getProperty(id: string): Promise<Property> {
        const { data } = await this.client.get(`/properties/${id}`);
        return data.data;
    }

    async getFeaturedProperties(): Promise<Property[]> {
        const { data } = await this.client.get('/properties/featured');
        return data.data;
    }

    async getNearbyProperties(lat: number, lng: number, radiusMiles: number = 25): Promise<Property[]> {
        const { data } = await this.client.get('/properties/nearby', { params: { lat, lng, radiusMiles } });
        return data.data;
    }

    // Favorites
    async getFavorites(): Promise<Property[]> {
        const { data } = await this.client.get('/users/me/favorites');
        return data.data.map((f: any) => f.property);
    }

    async addFavorite(propertyId: string): Promise<void> {
        await this.client.post('/users/me/favorites', { propertyId });
    }

    async removeFavorite(propertyId: string): Promise<void> {
        await this.client.delete(`/users/me/favorites/${propertyId}`);
    }

    // Vastu Analysis
    async getVastuAnalysis(propertyId: string): Promise<VastuAnalysis> {
        const { data } = await this.client.get(`/vastu/analysis/${propertyId}`);
        return data.data;
    }

    async requestVastuAnalysis(propertyId: string, entranceDirection: string): Promise<VastuAnalysis> {
        const { data } = await this.client.post('/vastu/analyze', { propertyId, entranceDirection });
        return data.data;
    }

    // Climate Risk
    async getClimateAnalysis(propertyId: string): Promise<any> {
        const { data } = await this.client.get(`/climate/${propertyId}`);
        return data.data;
    }

    // Ayurvedic Analysis
    async getAyurvedicAnalysis(propertyId: string): Promise<any> {
        const { data } = await this.client.get(`/ayurveda/${propertyId}`);
        return data.data;
    }

    // Jyotish Analysis
    async getJyotishAnalysis(propertyId: string, userId?: string): Promise<any> {
        const { data } = await this.client.get(`/jyotish/${propertyId}`, { params: { userId } });
        return data.data;
    }
}

export const api = new ApiService();
export default api;

