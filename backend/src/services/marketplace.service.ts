import { v4 as uuidv4 } from 'uuid';

/**
 * Ayurvedic Marketplace Service
 * Products, experts, and wellness services
 */
class MarketplaceService {

    // Products
    async getProducts(category?: string): Promise<any[]> {
        const products = [
            { id: '1', name: 'Vastu Yantra', category: 'vastu', price: 2999, rating: 4.8 },
            { id: '2', name: 'Copper Pyramid', category: 'vastu', price: 4500, rating: 4.6 },
            { id: '3', name: 'Sacred Tulsi Plant', category: 'plants', price: 599, rating: 4.9 },
            { id: '4', name: 'Feng Shui Wind Chime', category: 'feng_shui', price: 1299, rating: 4.5 },
            { id: '5', name: 'Himalayan Salt Lamp', category: 'wellness', price: 1899, rating: 4.7 },
            { id: '6', name: 'Ayurvedic Diffuser Set', category: 'aromatherapy', price: 2499, rating: 4.8 }
        ];
        return category ? products.filter(p => p.category === category) : products;
    }

    async createOrder(userId: string, items: any[], address: any): Promise<any> {
        const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
        return {
            orderId: uuidv4(),
            userId,
            items,
            subtotal,
            tax: subtotal * 0.18,
            total: subtotal * 1.18,
            status: 'confirmed',
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
        };
    }

    // Experts
    async getExperts(specialty?: string): Promise<any[]> {
        const experts = [
            { id: '1', name: 'Vaidya Ramesh Kumar', specialty: 'vastu', rating: 4.9, fee: 2500, experience: 25 },
            { id: '2', name: 'Dr. Priya Sharma', specialty: 'ayurveda', rating: 4.8, fee: 2000, experience: 15 },
            { id: '3', name: 'Master Li Wei', specialty: 'feng_shui', rating: 4.7, fee: 3000, experience: 20 },
            { id: '4', name: 'Pandit Suresh', specialty: 'jyotish', rating: 4.9, fee: 1500, experience: 30 }
        ];
        return specialty ? experts.filter(e => e.specialty === specialty) : experts;
    }

    async bookConsultation(expertId: string, userId: string, datetime: string): Promise<any> {
        return {
            bookingId: uuidv4(),
            expertId,
            userId,
            datetime,
            status: 'confirmed',
            meetingLink: `https://meet.platform.com/${uuidv4()}`,
            fee: 2500
        };
    }

    // Reviews
    async addReview(productId: string, userId: string, rating: number, comment: string): Promise<any> {
        return {
            reviewId: uuidv4(),
            productId,
            userId,
            rating,
            comment,
            verified: true,
            createdAt: new Date().toISOString()
        };
    }

    // Analytics
    async getMarketplaceStats(): Promise<any> {
        return {
            totalProducts: 150,
            totalExperts: 24,
            totalOrders: 1847,
            revenue: { monthly: 1290000, yearly: 15500000 },
            topCategories: ['vastu', 'ayurveda', 'plants']
        };
    }
}

export const marketplaceService = new MarketplaceService();
export default MarketplaceService;
