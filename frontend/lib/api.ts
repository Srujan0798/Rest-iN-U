// REST-iN-U API Client
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface ApiOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
}

class ApiClient {
    private baseUrl: string;
    private token: string | null = null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('restinu_token');
        }
    }

    setToken(token: string) {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('restinu_token', token);
        }
    }

    clearToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('restinu_token');
        }
    }

    async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
        const { method = 'GET', body, headers = {} } = options;

        const config: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        };

        if (this.token) {
            (config.headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
        }

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Request failed');
        }

        return data;
    }

    // Auth endpoints
    async login(email: string, password: string) {
        const response = await this.request<any>('/auth/login', {
            method: 'POST',
            body: { email, password },
        });
        if (response.data?.accessToken) {
            this.setToken(response.data.accessToken);
        }
        return response;
    }

    async register(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string;
    }) {
        const response = await this.request<any>('/auth/register', {
            method: 'POST',
            body: data,
        });
        if (response.data?.accessToken) {
            this.setToken(response.data.accessToken);
        }
        return response;
    }

    async getMe() {
        return this.request<any>('/auth/me');
    }

    async logout() {
        await this.request('/auth/logout', { method: 'POST' });
        this.clearToken();
    }

    // Property endpoints
    async getProperties(params?: Record<string, any>) {
        const query = params ? '?' + new URLSearchParams(params).toString() : '';
        return this.request<any>(`/properties${query}`);
    }

    async getProperty(id: string) {
        return this.request<any>(`/properties/${id}`);
    }

    async searchProperties(filters: any) {
        return this.request<any>('/search/advanced', {
            method: 'POST',
            body: filters,
        });
    }

    async naturalSearch(query: string) {
        return this.request<any>('/search/natural-language', {
            method: 'POST',
            body: { query, limit: 20 },
        });
    }

    async favoriteProperty(id: string) {
        return this.request<any>(`/properties/${id}/favorite`, { method: 'POST' });
    }

    async submitInquiry(propertyId: string, data: { name: string; email: string; phone?: string; message?: string }) {
        return this.request<any>(`/properties/${propertyId}/inquiry`, {
            method: 'POST',
            body: data,
        });
    }

    // Vastu endpoints
    async getVastuAnalysis(propertyId: string) {
        return this.request<any>(`/vastu/property/${propertyId}`);
    }

    async getVastuRules() {
        return this.request<any>('/vastu/rules');
    }

    async getAuspiciousTiming(eventType: string, birthDetails?: any) {
        return this.request<any>('/vastu/auspicious-timing', {
            method: 'POST',
            body: { eventType, ...birthDetails },
        });
    }

    // Climate endpoints
    async getClimateAnalysis(propertyId: string) {
        return this.request<any>(`/climate/property/${propertyId}`);
    }

    async getClimateProjections(latitude: number, longitude: number) {
        return this.request<any>('/climate/projections', {
            method: 'POST',
            body: { latitude, longitude },
        });
    }

    // Jyotish endpoints
    async getJyotishAnalysis(propertyId: string) {
        return this.request<any>(`/jyotish/property/${propertyId}`);
    }

    // Puranic endpoints
    async getPuranicAnalysis(propertyId: string) {
        return this.request<any>(`/puranic/property/${propertyId}`);
    }

    // Ayurvedic endpoints
    async getAyurvedicAnalysis(propertyId: string) {
        return this.request<any>(`/ayurveda/property/${propertyId}`);
    }

    // Valuation endpoints
    async getValuation(propertyId: string) {
        return this.request<any>(`/valuation/property/${propertyId}`);
    }

    async estimateValue(data: any) {
        return this.request<any>('/valuation/estimate', {
            method: 'POST',
            body: data,
        });
    }

    async getMarketTrends(city: string, state: string) {
        return this.request<any>(`/valuation/market-trends?city=${city}&state=${state}`);
    }

    // Agent endpoints
    async getAgents(params?: Record<string, any>) {
        const query = params ? '?' + new URLSearchParams(params).toString() : '';
        return this.request<any>(`/agents${query}`);
    }

    async getAgent(id: string) {
        return this.request<any>(`/agents/${id}`);
    }

    async getAgentReviews(agentId: string) {
        return this.request<any>(`/agents/${agentId}/reviews`);
    }
}

export const api = new ApiClient(API_BASE);
export default api;

