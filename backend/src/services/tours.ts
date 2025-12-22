// Property Tour and Scheduling Service
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { notificationService, NotificationType } from './notifications';

interface TourSlot {
    date: string;
    time: string;
    available: boolean;
    type: 'IN_PERSON' | 'VIRTUAL' | 'SELF_GUIDED';
}

interface TourRequest {
    propertyId: string;
    userId: string;
    agentId?: string;
    date: string;
    time: string;
    tourType: 'IN_PERSON' | 'VIRTUAL' | 'SELF_GUIDED';
    notes?: string;
    muhuratPreferred?: boolean;
}

export class TourService {
    // Get available tour slots for a property
    async getAvailableSlots(propertyId: string, startDate: Date, endDate: Date): Promise<TourSlot[]> {
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            include: {
                listingAgent: {
                    include: { availability: true },
                },
            },
        });

        if (!property) throw new Error('Property not found');

        const existingTours = await prisma.propertyTour.findMany({
            where: {
                propertyId,
                scheduledAt: {
                    gte: startDate,
                    lte: endDate,
                },
                status: { in: ['SCHEDULED', 'CONFIRMED'] },
            },
        });

        const slots: TourSlot[] = [];
        const current = new Date(startDate);

        while (current <= endDate) {
            const dayOfWeek = current.getDay();
            const dateStr = current.toISOString().split('T')[0];

            // Business hours
            const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

            for (const time of timeSlots) {
                const slotKey = `${dateStr}T${time}`;
                const isBooked = existingTours.some(t =>
                    t.scheduledAt.toISOString().startsWith(slotKey)
                );

                // Skip weekends for in-person tours
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    slots.push({ date: dateStr, time, available: false, type: 'VIRTUAL' });
                    continue;
                }

                slots.push({
                    date: dateStr,
                    time,
                    available: !isBooked,
                    type: 'IN_PERSON',
                });
            }

            current.setDate(current.getDate() + 1);
        }

        return slots;
    }

    // Schedule a tour
    async scheduleTour(request: TourRequest): Promise<any> {
        const { propertyId, userId, agentId, date, time, tourType, notes, muhuratPreferred } = request;

        // Check property exists
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            include: { listingAgent: { include: { user: true } } },
        });

        if (!property) throw new Error('Property not found');

        const scheduledAt = new Date(`${date}T${time}:00`);

        // Check for conflicts
        const existing = await prisma.propertyTour.findFirst({
            where: {
                propertyId,
                scheduledAt,
                status: { in: ['SCHEDULED', 'CONFIRMED'] },
            },
        });

        if (existing) throw new Error('Time slot already booked');

        // Check muhurat if preferred
        let muhuratScore = null;
        if (muhuratPreferred) {
            muhuratScore = this.calculateMuhuratScore(scheduledAt);
        }

        // Create tour
        const tour = await prisma.propertyTour.create({
            data: {
                propertyId,
                userId,
                agentId: agentId || property.listingAgent?.id,
                scheduledAt,
                tourType,
                notes,
                muhuratScore,
                status: 'SCHEDULED',
            },
            include: {
                property: true,
                user: true,
            },
        });

        // Send notifications
        await notificationService.send({
            userId,
            type: NotificationType.PROPERTY_ALERT,
            title: '📅 Tour Scheduled!',
            message: `Your ${tourType.toLowerCase()} tour of ${property.title} is scheduled for ${date} at ${time}`,
            data: { tourId: tour.id, propertyId },
        });

        // Notify agent
        if (property.listingAgent?.userId) {
            await notificationService.send({
                userId: property.listingAgent.userId,
                type: NotificationType.INQUIRY_RECEIVED,
                title: '📅 New Tour Request',
                message: `New ${tourType.toLowerCase()} tour scheduled for ${property.title}`,
                data: { tourId: tour.id, propertyId },
            });
        }

        logger.info(`Tour scheduled: ${tour.id} for ${propertyId}`);
        return tour;
    }

    // Calculate muhurat score for a given time
    private calculateMuhuratScore(date: Date): number {
        const day = date.getDay();
        const hour = date.getHours();

        let score = 50;

        // Auspicious days for property viewing
        if (day === 1 || day === 4 || day === 5) score += 20; // Monday, Thursday, Friday
        if (day === 2 || day === 6) score -= 10; // Tuesday, Saturday

        // Auspicious hours (simplified)
        if (hour >= 6 && hour < 8) score += 15; // Brahma Muhurta
        if (hour >= 10 && hour < 12) score += 10; // Late morning
        if (hour >= 12 && hour < 14) score -= 5; // Afternoon dip

        return Math.max(0, Math.min(100, score));
    }

    // Cancel a tour
    async cancelTour(tourId: string, userId: string, reason?: string): Promise<any> {
        const tour = await prisma.propertyTour.findUnique({
            where: { id: tourId },
            include: { property: true },
        });

        if (!tour) throw new Error('Tour not found');
        if (tour.userId !== userId) throw new Error('Unauthorized');

        const updated = await prisma.propertyTour.update({
            where: { id: tourId },
            data: {
                status: 'CANCELLED',
                cancelledAt: new Date(),
                cancellationReason: reason,
            },
        });

        logger.info(`Tour cancelled: ${tourId}`);
        return updated;
    }

    // Get user's upcoming tours
    async getUserTours(userId: string): Promise<any[]> {
        return prisma.propertyTour.findMany({
            where: {
                userId,
                scheduledAt: { gte: new Date() },
                status: { in: ['SCHEDULED', 'CONFIRMED'] },
            },
            include: {
                property: {
                    include: { photos: { take: 1, where: { isPrimary: true } } },
                },
            },
            orderBy: { scheduledAt: 'asc' },
        });
    }

    // Confirm tour (agent action)
    async confirmTour(tourId: string, agentId: string): Promise<any> {
        const tour = await prisma.propertyTour.findUnique({
            where: { id: tourId },
        });

        if (!tour) throw new Error('Tour not found');
        if (tour.agentId !== agentId) throw new Error('Unauthorized');

        const updated = await prisma.propertyTour.update({
            where: { id: tourId },
            data: { status: 'CONFIRMED', confirmedAt: new Date() },
        });

        // Notify user
        await notificationService.send({
            userId: tour.userId,
            type: NotificationType.PROPERTY_ALERT,
            title: '✅ Tour Confirmed!',
            message: 'Your property tour has been confirmed by the agent',
            data: { tourId },
        });

        return updated;
    }

    // Get auspicious tour times (muhurat-based)
    async getAuspiciousTourTimes(startDate: Date, days: number = 7): Promise<any[]> {
        const times: any[] = [];
        const current = new Date(startDate);

        for (let i = 0; i < days; i++) {
            const score = this.calculateMuhuratScore(current);
            const dateStr = current.toISOString().split('T')[0];

            if (score >= 60) {
                times.push({
                    date: dateStr,
                    day: current.toLocaleDateString('en-US', { weekday: 'long' }),
                    score,
                    quality: score >= 80 ? 'Excellent' : 'Good',
                    recommendedTimes: ['10:00 AM', '11:00 AM'],
                });
            }

            current.setDate(current.getDate() + 1);
        }

        return times.sort((a, b) => b.score - a.score);
    }
}

export const tourService = new TourService();
