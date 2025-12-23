import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PropertyService {
    private prisma = new PrismaClient();
    private redis: any; // Mock redis for now

    constructor() {
        // Initialize redis mock or connection
    }

    async findOne(id: string) {
        return this.prisma.property.findUnique({
            where: { property_id: id }
        });
    }

    async findOneWithRelations(id: string) {
        return this.prisma.property.findUnique({
            where: { property_id: id },
            include: {
                vastu_analyses: {
                    orderBy: { analyzed_at: 'desc' },
                    take: 1
                },
                climate_reports: {
                    where: {
                        expires_at: { gt: new Date() }
                    },
                    orderBy: { created_at: 'desc' },
                    take: 1
                },
                iot_sensors: {
                    where: {
                        status: 'active'
                    }
                },
                photos: {
                    orderBy: { order: 'asc' }
                },
                owner: true,
                listing_agent: true
            }
        });
    }

    async findAllWithRelations(options: { skip: number; take: number }) {
        return this.prisma.property.findMany({
            skip: options.skip,
            take: options.take,
            where: {
                status: 'active'
            },
            include: {
                vastu_analyses: {
                    orderBy: { analyzed_at: 'desc' },
                    take: 1
                },
                climate_reports: {
                    where: {
                        expires_at: { gt: new Date() }
                    },
                    orderBy: { created_at: 'desc' },
                    take: 1
                },
                iot_sensors: {
                    where: {
                        status: 'active'
                    }
                },
                photos: {
                    orderBy: { order: 'asc' }
                }
            }
        });
    }

    async findModifiedSince(since: Date) {
        return this.prisma.property.findMany({
            where: {
                updated_at: { gte: since }
            },
            include: {
                vastu_analyses: {
                    orderBy: { analyzed_at: 'desc' },
                    take: 1
                },
                climate_reports: {
                    where: {
                        expires_at: { gt: new Date() }
                    },
                    orderBy: { created_at: 'desc' },
                    take: 1
                }
            }
        });
    }

    async findWithRecentVastuAnalysis(since: Date) {
        return this.prisma.property.findMany({
            where: {
                vastu_analyses: {
                    some: {
                        analyzed_at: { gte: since }
                    }
                }
            },
            include: {
                vastu_analyses: {
                    orderBy: { analyzed_at: 'desc' },
                    take: 1
                }
            }
        });
    }

    async findWithRecentClimateReport(since: Date) {
        return this.prisma.property.findMany({
            where: {
                climate_reports: {
                    some: {
                        created_at: { gte: since }
                    }
                }
            },
            include: {
                climate_reports: {
                    orderBy: { created_at: 'desc' },
                    take: 1
                }
            }
        });
    }

    async findPropertiesWithEngagementChanges() {
        // This would query a separate tracking table or Redis
        // Simplified version here
        // const properties = await this.redis.smembers('properties:engagement_changed');
        return [];
    }

    async getViewCounts(ids: string[]) {
        // Mock implementation
        const counts: Record<string, number> = {};
        ids.forEach(id => counts[id] = Math.floor(Math.random() * 1000));
        return counts;
    }

    async getFavoriteCounts(ids: string[]) {
        // Mock implementation
        const counts: Record<string, number> = {};
        ids.forEach(id => counts[id] = Math.floor(Math.random() * 100));
        return counts;
    }

    async getUserFavorites(userId: string, propertyIds: string[]) {
        const favorites = await this.prisma.favorite.findMany({
            where: {
                user_id: userId,
                property_id: { in: propertyIds }
            }
        });

        const result: Record<string, boolean> = {};
        favorites.forEach(fav => result[fav.property_id] = true);
        return result;
    }

    async getUserProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { user_id: userId }
        });

        // Return mock profile/preferences if not in DB schema yet
        return {
            ...user,
            preferences: {
                vastu_importance: 8,
                climate_concern: 7,
                tech_enthusiast: true
            },
            typical_budget: {
                min: 500000,
                max: 1000000
            }
        };
    }

    async getBrowsingHistory(userId: string) {
        // Mock implementation
        return [];
    }
}

