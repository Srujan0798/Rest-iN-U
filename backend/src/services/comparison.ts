// Property Comparison Service
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

interface ComparisonMetric {
    property1: any;
    property2: any;
    property3?: any;
    winner: string;
    difference?: number;
}

interface PropertyComparison {
    properties: any[];
    metrics: {
        price: ComparisonMetric;
        pricePerSqft: ComparisonMetric;
        vastuScore: ComparisonMetric;
        climateRisk: ComparisonMetric;
        energyScore: ComparisonMetric;
        smartHomeScore: ComparisonMetric;
        size: ComparisonMetric;
        yearBuilt: ComparisonMetric;
    };
    summary: {
        bestValue: string;
        bestVastu: string;
        lowestRisk: string;
        recommendation: string;
    };
    vastuComparison: any;
    climateComparison: any;
}

export class PropertyComparisonService {
    async compareProperties(propertyIds: string[]): Promise<PropertyComparison> {
        if (propertyIds.length < 2 || propertyIds.length > 3) {
            throw new Error('Can compare 2-3 properties at a time');
        }

        const properties = await prisma.property.findMany({
            where: { id: { in: propertyIds } },
            include: {
                vastuAnalysis: true,
                climateAnalysis: true,
                energyAnalysis: true,
                photos: { take: 1, where: { isPrimary: true } },
            },
        });

        if (properties.length !== propertyIds.length) {
            throw new Error('One or more properties not found');
        }

        const metrics = this.calculateMetrics(properties);
        const summary = this.generateSummary(properties, metrics);
        const vastuComparison = this.compareVastu(properties);
        const climateComparison = this.compareClimate(properties);

        return {
            properties: properties.map(p => ({
                id: p.id,
                title: p.title,
                address: `${p.streetAddress}, ${p.city}`,
                price: p.price,
                bedrooms: p.bedrooms,
                bathrooms: p.bathrooms,
                squareFeet: p.squareFeet,
                yearBuilt: p.yearBuilt,
                photo: p.photos[0]?.url,
                vastuScore: p.vastuAnalysis?.overallScore,
                climateRisk: p.climateAnalysis?.overallRiskScore,
                energyScore: p.energyAnalysis?.energyEfficiencyScore,
            })),
            metrics,
            summary,
            vastuComparison,
            climateComparison,
        };
    }

    private calculateMetrics(properties: any[]): PropertyComparison['metrics'] {
        const getValue = (p: any, path: string) => {
            const parts = path.split('.');
            let value = p;
            for (const part of parts) {
                value = value?.[part];
            }
            return value;
        };

        const compareMetric = (path: string, lowerIsBetter: boolean = false): ComparisonMetric => {
            const values = properties.map(p => ({
                id: p.id,
                title: p.title,
                value: getValue(p, path),
            }));

            const validValues = values.filter(v => v.value != null);
            if (validValues.length === 0) {
                return {
                    property1: values[0]?.value,
                    property2: values[1]?.value,
                    property3: values[2]?.value,
                    winner: 'N/A',
                };
            }

            const sorted = [...validValues].sort((a, b) =>
                lowerIsBetter ? a.value - b.value : b.value - a.value
            );

            const winner = sorted[0];
            const second = sorted[1];
            const diff = second ? Math.abs(winner.value - second.value) : 0;

            return {
                property1: values[0]?.value,
                property2: values[1]?.value,
                property3: values[2]?.value,
                winner: winner.id,
                difference: diff,
            };
        };

        return {
            price: compareMetric('price', true),
            pricePerSqft: compareMetric('pricePerSqft', true),
            vastuScore: compareMetric('vastuAnalysis.overallScore'),
            climateRisk: compareMetric('climateAnalysis.overallRiskScore', true),
            energyScore: compareMetric('energyAnalysis.energyEfficiencyScore'),
            smartHomeScore: compareMetric('smartHomeScore'),
            size: compareMetric('squareFeet'),
            yearBuilt: compareMetric('yearBuilt'),
        };
    }

    private generateSummary(properties: any[], metrics: PropertyComparison['metrics']): PropertyComparison['summary'] {
        const getTitle = (id: string) => properties.find(p => p.id === id)?.title || 'Unknown';

        // Calculate value score (combination of price and features)
        const valueScores = properties.map(p => ({
            id: p.id,
            score: (
                ((p.vastuAnalysis?.overallScore || 50) * 0.3) +
                ((100 - (p.climateAnalysis?.overallRiskScore || 50)) * 0.2) +
                ((p.energyAnalysis?.energyEfficiencyScore || 50) * 0.2) +
                (Math.min(100, (p.squareFeet || 1000) / 30) * 0.3)
            ) / Number(p.price) * 100000,
        }));

        const bestValue = valueScores.reduce((a, b) => a.score > b.score ? a : b);

        return {
            bestValue: getTitle(bestValue.id),
            bestVastu: getTitle(metrics.vastuScore.winner),
            lowestRisk: getTitle(metrics.climateRisk.winner),
            recommendation: this.generateRecommendation(properties, metrics, bestValue.id),
        };
    }

    private generateRecommendation(properties: any[], metrics: any, bestValueId: string): string {
        const bestValue = properties.find(p => p.id === bestValueId);
        const bestVastu = properties.find(p => p.id === metrics.vastuScore.winner);
        const lowestRisk = properties.find(p => p.id === metrics.climateRisk.winner);

        if (bestValueId === metrics.vastuScore.winner && bestValueId === metrics.climateRisk.winner) {
            return `${bestValue?.title} offers the best overall value with excellent Vastu compliance and lowest climate risk. Highly recommended!`;
        }

        if (bestValueId === metrics.vastuScore.winner) {
            return `${bestValue?.title} offers best value and Vastu scores. Consider ${lowestRisk?.title} if climate resilience is a priority.`;
        }

        return `${bestValue?.title} offers the best value. ${bestVastu?.title} has better Vastu alignment. Consider your priorities carefully.`;
    }

    private compareVastu(properties: any[]): any {
        return properties.map(p => ({
            id: p.id,
            title: p.title,
            overallScore: p.vastuAnalysis?.overallScore || 0,
            grade: p.vastuAnalysis?.grade || 'N/A',
            entranceDirection: p.vastuAnalysis?.entranceDirection || 'Unknown',
            criticalDefects: p.vastuAnalysis?.criticalDefects || 0,
            zoneScores: {
                north: p.vastuAnalysis?.northScore,
                south: p.vastuAnalysis?.southScore,
                east: p.vastuAnalysis?.eastScore,
                west: p.vastuAnalysis?.westScore,
                northeast: p.vastuAnalysis?.northEastScore,
                center: p.vastuAnalysis?.centerScore,
            },
        }));
    }

    private compareClimate(properties: any[]): any {
        return properties.map(p => ({
            id: p.id,
            title: p.title,
            overallRisk: p.climateAnalysis?.overallRiskScore || 0,
            riskGrade: p.climateAnalysis?.riskGrade || 'N/A',
            risks: {
                flood: p.climateAnalysis?.floodRisk2050,
                wildfire: p.climateAnalysis?.wildfireRisk,
                hurricane: p.climateAnalysis?.hurricaneRisk,
                seismic: p.climateAnalysis?.seismicRisk,
                heat: p.climateAnalysis?.heatRisk,
            },
            insuranceProjection: {
                current: p.climateAnalysis?.insuranceCurrent,
                future2050: p.climateAnalysis?.insurance2050,
            },
        }));
    }

    // Save comparison for user
    async saveComparison(userId: string, propertyIds: string[]): Promise<any> {
        return prisma.propertyComparison.create({
            data: {
                userId,
                propertyIds,
            },
        });
    }

    // Get user's saved comparisons
    async getSavedComparisons(userId: string): Promise<any[]> {
        return prisma.propertyComparison.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
    }
}

export const propertyComparisonService = new PropertyComparisonService();

