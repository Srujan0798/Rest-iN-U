import { Injectable } from '@nestjs/common';
import { PrismaClient, Property, PropertyStatus } from '@prisma/client';

@Injectable()
export class PropertyService {
    private prisma = new PrismaClient();

    async findOne(id: string): Promise<Property | null> {
        return this.prisma.property.findUnique({
            where: { id }
        });
    }

    async findOneWithRelations(id: string) {
        return this.prisma.property.findUnique({
            where: { id },
            include: {
                vastuAnalysis: true,
                climateAnalysis: true,
                photos: {
                    orderBy: { orderIndex: 'asc' }
                },
                listingAgent: {
                    include: { user: true }
                }
            }
        });
    }

    async findAllWithRelations(options: { skip: number; take: number }) {
        return this.prisma.property.findMany({
            skip: options.skip,
            take: options.take,
            where: {
                status: PropertyStatus.ACTIVE
            },
            include: {
                vastuAnalysis: true,
                climateAnalysis: true,
                photos: {
                    orderBy: { orderIndex: 'asc' }
                }
            }
        });
    }

    async findModifiedSince(since: Date) {
        return this.prisma.property.findMany({
            where: {
                updatedAt: { gte: since }
            },
            include: {
                vastuAnalysis: true,
                climateAnalysis: true
            }
        });
    }

    async findWithVastuAnalysis() {
        return this.prisma.property.findMany({
            where: {
                vastuAnalysis: { isNot: null }
            },
            include: {
                vastuAnalysis: true
            }
        });
    }

    async findWithClimateAnalysis() {
        return this.prisma.property.findMany({
            where: {
                climateAnalysis: { isNot: null }
            },
            include: {
                climateAnalysis: true
            }
        });
    }

    async findPropertiesWithEngagementChanges(): Promise<Property[]> {
        return [];
    }

    async getViewCounts(ids: string[]): Promise<Record<string, number>> {
        const properties = await this.prisma.property.findMany({
            where: { id: { in: ids } },
            select: { id: true, viewCount: true }
        });
        const counts: Record<string, number> = {};
        properties.forEach(p => counts[p.id] = p.viewCount);
        return counts;
    }

    async getFavoriteCounts(ids: string[]): Promise<Record<string, number>> {
        const properties = await this.prisma.property.findMany({
            where: { id: { in: ids } },
            select: { id: true, favoriteCount: true }
        });
        const counts: Record<string, number> = {};
        properties.forEach(p => counts[p.id] = p.favoriteCount);
        return counts;
    }

    async getUserFavorites(userId: string, propertyIds: string[]): Promise<Record<string, boolean>> {
        const favorites = await this.prisma.favorite.findMany({
            where: {
                userId,
                propertyId: { in: propertyIds }
            }
        });

        const result: Record<string, boolean> = {};
        favorites.forEach(fav => result[fav.propertyId] = true);
        return result;
    }

    async getUserProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        return {
            ...user,
            preferences: {
                vastuImportance: 8,
                climateConcern: 7,
                techEnthusiast: true
            },
            typicalBudget: {
                min: 500000,
                max: 1000000
            }
        };
    }

    async getBrowsingHistory(userId: string) {
        return this.prisma.propertyView.findMany({
            where: { userId },
            orderBy: { viewedAt: 'desc' },
            take: 50,
            include: { property: true }
        });
    }
}

