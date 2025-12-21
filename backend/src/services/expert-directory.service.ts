import { v4 as uuidv4 } from 'uuid';

/**
 * Expert Directory Service
 * Verified Ayurvedic consultants, Vastu experts, specialists
 */
class ExpertDirectoryService {

    async getExperts(filters?: any): Promise<any[]> {
        const experts = [
            {
                id: '1', name: 'Dr. Ramesh Patel', qualification: 'BAMS, MD (Ayurveda)',
                specialty: 'Property Energy Analysis', experience: 15, rating: 4.9, reviews: 234,
                location: 'Gandhinagar', availability: 'Available', fee: 2000,
                languages: ['Hindi', 'Gujarati', 'English']
            },
            {
                id: '2', name: 'Architect Priya Sharma', qualification: 'B.Arch, Vastu Specialist',
                specialty: 'Vastu Consultation', experience: 12, rating: 4.8, reviews: 189,
                location: 'Ahmedabad', availability: 'Available', fee: 3500,
                languages: ['Hindi', 'Gujarati', 'English']
            },
            {
                id: '3', name: 'Vaidya Anand Kumar', qualification: 'BAMS, Ayurveda Acharya',
                specialty: 'Dosha Balancing & Herbs', experience: 20, rating: 5.0, reviews: 456,
                location: 'Gandhinagar', availability: 'Booked until Jan 5', fee: 2500,
                languages: ['Hindi', 'Sanskrit', 'English']
            },
            {
                id: '4', name: 'Landscape Designer Meera Shah', qualification: 'Certified Ayurvedic Landscaping',
                specialty: 'Medicinal Gardens', experience: 8, rating: 4.7, reviews: 112,
                location: 'Gandhinagar', availability: 'Available', fee: 1800,
                languages: ['Gujarati', 'Hindi', 'English']
            }
        ];

        if (filters?.specialty) {
            return experts.filter(e => e.specialty.toLowerCase().includes(filters.specialty.toLowerCase()));
        }
        return experts;
    }

    async bookConsultation(expertId: string, userId: string, datetime: string, type: string): Promise<any> {
        return {
            bookingId: uuidv4(),
            expertId,
            userId,
            datetime,
            type, // 'video' or 'in-person'
            meetingLink: type === 'video' ? `https://meet.platform.com/${uuidv4()}` : null,
            status: 'confirmed',
            fee: 2500
        };
    }

    async getExpertAvailability(expertId: string): Promise<any> {
        return {
            expertId,
            availableSlots: [
                { date: '2025-01-06', times: ['10:00', '14:00', '16:00'] },
                { date: '2025-01-07', times: ['11:00', '15:00'] },
                { date: '2025-01-08', times: ['10:00', '12:00', '14:00'] }
            ]
        };
    }

    async addReview(expertId: string, userId: string, rating: number, comment: string): Promise<any> {
        return {
            reviewId: uuidv4(),
            expertId,
            userId,
            rating,
            comment,
            verified: true,
            createdAt: new Date().toISOString()
        };
    }
}

export const expertDirectoryService = new ExpertDirectoryService();
export default ExpertDirectoryService;
