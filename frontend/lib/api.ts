const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

class ApiClient {
    private token: string | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('token');
        }
    }

    setToken(token: string) {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
    }

    clearToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options.headers as Record<string, string>,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const res = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    }

    // Auth
    async register(userData: { email: string; password: string; firstName: string; lastName: string; phone?: string; userType?: string }) {
        const data = await this.request<{ user: any; token: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        this.setToken(data.token);
        return data;
    }

    async login(email: string, password: string) {
        const data = await this.request<{ user: any; token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.setToken(data.token);
        return data;
    }

    async getMe() {
        return this.request<{ user: any }>('/auth/me');
    }

    async updateProfile(data: { firstName?: string; lastName?: string; phone?: string }) {
        return this.request<{ user: any }>('/auth/me', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    // Properties
    async searchProperties(params: Record<string, any>) {
        const query = new URLSearchParams(params).toString();
        return this.request<{ properties: any[]; total: number; page: number; total_pages: number }>(`/properties/search?${query}`);
    }

    async getProperty(id: string) {
        return this.request<{ property: any }>(`/properties/${id}`);
    }

    async createProperty(data: any) {
        return this.request<{ property: any }>('/properties', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateProperty(id: string, data: any) {
        return this.request<{ property: any }>(`/properties/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    // Agents
    async searchAgents(params?: { area?: string; specialty?: string; page?: number }) {
        const query = params ? new URLSearchParams(params as any).toString() : '';
        return this.request<{ agents: any[]; total: number }>(`/agents/search?${query}`);
    }

    async getAgent(id: string) {
        return this.request<{ agent: any }>(`/agents/${id}`);
    }

    async submitReview(agentId: string, data: { rating: number; comment: string }) {
        return this.request<{ review: any }>(`/agents/${agentId}/reviews`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Leads
    async createLead(data: { propertyId: string; agentId: string; message: string; name?: string; email?: string; phone?: string }) {
        return this.request<{ lead_id: string }>('/leads', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getAgentLeads(params?: { status?: string; page?: number }) {
        const query = params ? new URLSearchParams(params as any).toString() : '';
        return this.request<{ leads: any[]; total: number }>(`/leads/agent?${query}`);
    }

    async updateLeadStatus(id: string, status: string) {
        return this.request<{ lead: any }>(`/leads/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    }

    // Favorites
    async getFavorites() {
        return this.request<{ favorites: any[] }>('/favorites');
    }

    async addFavorite(propertyId: string) {
        return this.request<{ favorite: any }>('/favorites', {
            method: 'POST',
            body: JSON.stringify({ propertyId }),
        });
    }

    async removeFavorite(propertyId: string) {
        return this.request<void>(`/favorites/${propertyId}`, {
            method: 'DELETE',
        });
    }

    // Saved Searches
    async getSavedSearches() {
        return this.request<{ saved_searches: any[] }>('/saved-searches');
    }

    async createSavedSearch(data: { name: string; filters: any; alertFrequency?: string }) {
        return this.request<{ saved_search: any }>('/saved-searches', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async deleteSavedSearch(id: string) {
        return this.request<void>(`/saved-searches/${id}`, {
            method: 'DELETE',
        });
    }

    // Valuation
    async getEstimate(data: { address: string; bedrooms: number; bathrooms: number; squareFeet: number; yearBuilt?: number }) {
        return this.request<{ estimate: number; confidence_low: number; confidence_high: number }>('/valuation/estimate', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async calculateMortgage(data: { price: number; downPayment?: number; interestRate?: number; loanTerm?: number }) {
        return this.request<{ monthly_payment: any; loan_amount: number }>('/valuation/mortgage', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

export const api = new ApiClient();
export default api;
