// Property Valuation Service with AI
import { prisma } from '../utils/prisma';
import { cacheGet, cacheSet, CACHE_KEYS, CACHE_TTL } from '../utils/redis';
import { logger } from '../utils/logger';

interface ValuationInput {
    propertyId?: string;
    address?: string;
    city: string;
    state: string;
    zipCode: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    lotSizeAcres?: number;
    yearBuilt?: number;
    features?: string[];
    condition?: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    vastuScore?: number;
}

interface ValuationResult {
    estimatedValue: number;
    lowEstimate: number;
    highEstimate: number;
    confidenceLevel: number;
    pricePerSqft: number;
    comparables: any[];
    factors: any[];
    marketTrend: any;
    vastuAdjustment?: number;
}

export class PropertyValuationService {

    /**
     * Generate AI-powered property valuation
     */
    async valuateProperty(input: ValuationInput): Promise<ValuationResult> {
        // Get comparable properties
        const comparables = await this.findComparables(input);

        // Calculate base value from comparables
        const baseValue = this.calculateBaseValue(comparables, input);

        // Get market trends
        const marketTrend = await this.getMarketTrend(input.city, input.state);

        // Calculate adjustments
        const adjustments = this.calculateAdjustments(input, comparables, marketTrend);

        // Vastu adjustment (unique to Dharma Realty)
        let vastuAdjustment = 0;
        if (input.vastuScore) {
            vastuAdjustment = this.calculateVastuAdjustment(input.vastuScore, baseValue);
        }

        // Final valuation
        const totalAdjustment = adjustments.reduce((sum, adj) => sum + adj.amount, 0) + vastuAdjustment;
        const estimatedValue = Math.round(baseValue + totalAdjustment);

        // Confidence level based on comparable quality
        const confidenceLevel = this.calculateConfidence(comparables, input);

        // Price range (±5-15% based on confidence)
        const marginPercent = (100 - confidenceLevel) / 100 * 0.15 + 0.05;
        const lowEstimate = Math.round(estimatedValue * (1 - marginPercent));
        const highEstimate = Math.round(estimatedValue * (1 + marginPercent));

        const result: ValuationResult = {
            estimatedValue,
            lowEstimate,
            highEstimate,
            confidenceLevel,
            pricePerSqft: Math.round(estimatedValue / input.squareFeet),
            comparables: comparables.slice(0, 5),
            factors: [
                ...adjustments,
                ...(vastuAdjustment ? [{
                    type: 'vastu_score',
                    description: `Vastu compliance (${input.vastuScore}/100)`,
                    amount: vastuAdjustment,
                }] : []),
            ],
            marketTrend,
            vastuAdjustment: vastuAdjustment || undefined,
        };

        // Save valuation if we have a propertyId
        if (input.propertyId) {
            await prisma.propertyValuation.create({
                data: {
                    propertyId: input.propertyId,
                    estimatedValue,
                    lowEstimate,
                    highEstimate,
                    confidenceLevel,
                    methodology: 'AI_COMPARABLE_HYBRID',
                    comparablesUsed: comparables.length,
                    adjustments: adjustments,
                    marketConditions: marketTrend,
                    vastuAdjustment,
                },
            });
        }

        logger.info(`Valuation completed: $${estimatedValue.toLocaleString()}`);

        return result;
    }

    /**
     * Find comparable properties
     */
    private async findComparables(input: ValuationInput) {
        const sqftRange = input.squareFeet * 0.2;
        const bedRange = 1;

        const comparables = await prisma.property.findMany({
            where: {
                city: { equals: input.city, mode: 'insensitive' },
                propertyType: input.propertyType as any,
                status: { in: ['SOLD', 'ACTIVE'] },
                squareFeet: {
                    gte: input.squareFeet - sqftRange,
                    lte: input.squareFeet + sqftRange,
                },
                bedrooms: {
                    gte: input.bedrooms - bedRange,
                    lte: input.bedrooms + bedRange,
                },
            },
            orderBy: { soldDate: 'desc' },
            take: 20,
            select: {
                id: true,
                streetAddress: true,
                city: true,
                price: true,
                squareFeet: true,
                bedrooms: true,
                bathrooms: true,
                yearBuilt: true,
                soldDate: true,
                status: true,
                features: true,
                vastuAnalysis: {
                    select: { overallScore: true },
                },
            },
        });

        // Score comparables for relevance
        return comparables.map(comp => ({
            ...comp,
            pricePerSqft: Math.round(Number(comp.price) / (comp.squareFeet || 1)),
            similarityScore: this.calculateSimilarityScore(input, comp),
        })).sort((a, b) => b.similarityScore - a.similarityScore);
    }

    private calculateSimilarityScore(input: ValuationInput, comp: any): number {
        let score = 100;

        // Square footage difference (max 25 points)
        const sqftDiff = Math.abs((input.squareFeet - (comp.squareFeet || 0)) / input.squareFeet);
        score -= Math.min(25, sqftDiff * 100);

        // Bedroom difference (max 15 points)
        const bedDiff = Math.abs(input.bedrooms - comp.bedrooms);
        score -= bedDiff * 7.5;

        // Bathroom difference (max 10 points)
        const bathDiff = Math.abs(input.bathrooms - comp.bathrooms);
        score -= bathDiff * 5;

        // Age difference (max 15 points)
        if (input.yearBuilt && comp.yearBuilt) {
            const ageDiff = Math.abs(input.yearBuilt - comp.yearBuilt);
            score -= Math.min(15, ageDiff / 2);
        }

        // Recency bonus (max 15 points)
        if (comp.soldDate) {
            const monthsAgo = (Date.now() - new Date(comp.soldDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
            score -= Math.min(15, monthsAgo);
        }

        // Feature overlap (max 10 points)
        if (input.features && comp.features) {
            const overlap = input.features.filter(f => comp.features.includes(f)).length;
            score += Math.min(10, overlap * 2);
        }

        return Math.max(0, score);
    }

    private calculateBaseValue(comparables: any[], input: ValuationInput): number {
        if (comparables.length === 0) {
            // Fallback: estimate based on regional averages
            return input.squareFeet * 200; // $200/sqft default
        }

        // Weighted average based on similarity score
        let totalWeight = 0;
        let weightedSum = 0;

        for (const comp of comparables.slice(0, 10)) {
            const weight = comp.similarityScore / 100;
            weightedSum += Number(comp.price) * weight;
            totalWeight += weight;
        }

        return Math.round(weightedSum / totalWeight);
    }

    private calculateAdjustments(input: ValuationInput, comparables: any[], marketTrend: any) {
        const adjustments: any[] = [];

        if (comparables.length === 0) return adjustments;

        const avgComp = {
            squareFeet: comparables.reduce((s, c) => s + (c.squareFeet || 0), 0) / comparables.length,
            bedrooms: comparables.reduce((s, c) => s + c.bedrooms, 0) / comparables.length,
            bathrooms: comparables.reduce((s, c) => s + c.bathrooms, 0) / comparables.length,
            yearBuilt: comparables.reduce((s, c) => s + (c.yearBuilt || 2000), 0) / comparables.length,
            pricePerSqft: comparables.reduce((s, c) => s + c.pricePerSqft, 0) / comparables.length,
        };

        // Square footage adjustment
        const sqftDiff = input.squareFeet - avgComp.squareFeet;
        if (sqftDiff !== 0) {
            adjustments.push({
                type: 'square_footage',
                description: `${sqftDiff > 0 ? 'Larger' : 'Smaller'} by ${Math.abs(Math.round(sqftDiff))} sqft`,
                amount: Math.round(sqftDiff * avgComp.pricePerSqft * 0.8), // 80% of avg price/sqft
            });
        }

        // Bedroom adjustment
        const bedDiff = input.bedrooms - avgComp.bedrooms;
        if (Math.abs(bedDiff) >= 0.5) {
            adjustments.push({
                type: 'bedrooms',
                description: `${bedDiff > 0 ? 'More' : 'Fewer'} bedrooms`,
                amount: Math.round(bedDiff * 15000),
            });
        }

        // Year built adjustment
        if (input.yearBuilt) {
            const ageDiff = input.yearBuilt - avgComp.yearBuilt;
            if (Math.abs(ageDiff) >= 5) {
                adjustments.push({
                    type: 'age',
                    description: `${ageDiff > 0 ? 'Newer' : 'Older'} by ${Math.abs(Math.round(ageDiff))} years`,
                    amount: Math.round(ageDiff * 1000),
                });
            }
        }

        // Condition adjustment
        if (input.condition) {
            const conditionMultipliers: Record<string, number> = {
                'EXCELLENT': 0.05,
                'GOOD': 0,
                'FAIR': -0.05,
                'POOR': -0.15,
            };
            const multiplier = conditionMultipliers[input.condition] || 0;
            if (multiplier !== 0) {
                const baseForCalc = avgComp.pricePerSqft * input.squareFeet;
                adjustments.push({
                    type: 'condition',
                    description: `${input.condition} condition`,
                    amount: Math.round(baseForCalc * multiplier),
                });
            }
        }

        // Feature adjustments
        const premiumFeatures: Record<string, number> = {
            'pool': 25000, 'smart_home': 10000, 'solar_panels': 15000,
            'renovated_kitchen': 20000, 'hardwood_floors': 8000,
            'waterfront': 50000, 'view': 30000,
        };

        if (input.features) {
            for (const feature of input.features) {
                const featureKey = feature.toLowerCase().replace(/\s/g, '_');
                if (premiumFeatures[featureKey]) {
                    adjustments.push({
                        type: 'feature',
                        description: feature,
                        amount: premiumFeatures[featureKey],
                    });
                }
            }
        }

        // Market trend adjustment
        if (marketTrend.trend !== 0) {
            const baseForCalc = avgComp.pricePerSqft * input.squareFeet;
            adjustments.push({
                type: 'market_trend',
                description: `Market ${marketTrend.trend > 0 ? 'appreciation' : 'depreciation'}`,
                amount: Math.round(baseForCalc * (marketTrend.trend / 100)),
            });
        }

        return adjustments;
    }

    private calculateVastuAdjustment(vastuScore: number, baseValue: number): number {
        // Vastu can add 2-5% premium for high scores, or reduce 1-3% for low scores
        if (vastuScore >= 80) {
            return Math.round(baseValue * 0.05);
        } else if (vastuScore >= 70) {
            return Math.round(baseValue * 0.03);
        } else if (vastuScore >= 60) {
            return Math.round(baseValue * 0.01);
        } else if (vastuScore < 40) {
            return Math.round(baseValue * -0.02);
        }
        return 0;
    }

    private async getMarketTrend(city: string, state: string) {
        const cacheKey = `market_trend:${city}:${state}`;
        let trend = await cacheGet(cacheKey);

        if (!trend) {
            // Calculate from recent sales
            const recentSales = await prisma.property.findMany({
                where: {
                    city: { equals: city, mode: 'insensitive' },
                    state,
                    status: 'SOLD',
                    soldDate: { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
                },
                select: { price: true, soldDate: true, squareFeet: true },
                orderBy: { soldDate: 'asc' },
            });

            if (recentSales.length >= 10) {
                const firstHalf = recentSales.slice(0, Math.floor(recentSales.length / 2));
                const secondHalf = recentSales.slice(Math.floor(recentSales.length / 2));

                const avgFirst = firstHalf.reduce((s, p) => s + Number(p.price) / (p.squareFeet || 1), 0) / firstHalf.length;
                const avgSecond = secondHalf.reduce((s, p) => s + Number(p.price) / (p.squareFeet || 1), 0) / secondHalf.length;

                trend = {
                    trend: Math.round(((avgSecond - avgFirst) / avgFirst) * 100),
                    direction: avgSecond > avgFirst ? 'UP' : avgSecond < avgFirst ? 'DOWN' : 'STABLE',
                    avgDaysOnMarket: 30,
                    inventory: recentSales.length,
                };
            } else {
                trend = { trend: 0, direction: 'STABLE', avgDaysOnMarket: 45, inventory: 0 };
            }

            await cacheSet(cacheKey, trend, CACHE_TTL.DAY);
        }

        return trend;
    }

    private calculateConfidence(comparables: any[], input: ValuationInput): number {
        let confidence = 50; // Base confidence

        // More comparables = higher confidence (up to 20 points)
        confidence += Math.min(20, comparables.length * 2);

        // High similarity scores = higher confidence (up to 20 points)
        if (comparables.length > 0) {
            const avgSimilarity = comparables.slice(0, 5).reduce((s, c) => s + c.similarityScore, 0) / Math.min(5, comparables.length);
            confidence += avgSimilarity / 5;
        }

        // Recent sales = higher confidence (up to 10 points)
        const recentComps = comparables.filter(c => {
            if (!c.soldDate) return false;
            return (Date.now() - new Date(c.soldDate).getTime()) < 180 * 24 * 60 * 60 * 1000;
        });
        confidence += Math.min(10, recentComps.length * 2);

        return Math.min(95, Math.round(confidence));
    }
}

export const propertyValuationService = new PropertyValuationService();
