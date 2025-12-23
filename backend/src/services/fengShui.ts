// Feng Shui Analysis Service
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

interface FengShuiInput {
    facing: string;
    yearBuilt?: number;
    floorPlan?: any;
    currentPeriod?: number;
}

interface BaguaArea {
    area: string;
    element: string;
    colors: string[];
    score: number;
    recommendations: string[];
}

// Flying Star periods
const CURRENT_PERIOD = 9; // Period 9 (2024-2043)

// Bagua Map Areas
const BAGUA_AREAS = {
    NORTH: { area: 'Career', element: 'Water', colors: ['Black', 'Blue'], number: 1 },
    NORTHEAST: { area: 'Knowledge', element: 'Earth', colors: ['Blue', 'Green'], number: 8 },
    EAST: { area: 'Family', element: 'Wood', colors: ['Green'], number: 3 },
    SOUTHEAST: { area: 'Wealth', element: 'Wood', colors: ['Purple', 'Green'], number: 4 },
    SOUTH: { area: 'Fame', element: 'Fire', colors: ['Red', 'Orange'], number: 9 },
    SOUTHWEST: { area: 'Love', element: 'Earth', colors: ['Pink', 'White'], number: 2 },
    WEST: { area: 'Creativity', element: 'Metal', colors: ['White', 'Gray'], number: 7 },
    NORTHWEST: { area: 'Helpful People', element: 'Metal', colors: ['Gray', 'White'], number: 6 },
    CENTER: { area: 'Health', element: 'Earth', colors: ['Yellow', 'Brown'], number: 5 },
};

// Five Elements cycle
const ELEMENTS = {
    WOOD: { produces: 'FIRE', destroys: 'EARTH', color: 'green', seasons: ['spring'] },
    FIRE: { produces: 'EARTH', destroys: 'METAL', color: 'red', seasons: ['summer'] },
    EARTH: { produces: 'METAL', destroys: 'WATER', color: 'yellow', seasons: ['late-summer'] },
    METAL: { produces: 'WATER', destroys: 'WOOD', color: 'white', seasons: ['autumn'] },
    WATER: { produces: 'WOOD', destroys: 'FIRE', color: 'black', seasons: ['winter'] },
};

export class FengShuiService {
    async analyzeFengShui(input: FengShuiInput): Promise<any> {
        const baguaAnalysis = this.analyzeBaguaMap(input.facing);
        const flyingStars = this.calculateFlyingStars(input.yearBuilt || 2024, input.facing);
        const elements = this.analyzeElements(input);
        const chiFlow = this.analyzeChiFlow(input.floorPlan);

        const overallScore = Math.round(
            (baguaAnalysis.score * 0.3) +
            (flyingStars.score * 0.3) +
            (elements.balanceScore * 0.2) +
            (chiFlow.score * 0.2)
        );

        return {
            overallScore,
            grade: this.getGrade(overallScore),
            baguaAnalysis: baguaAnalysis.areas,
            flyingStars: {
                chart: flyingStars.chart,
                period: CURRENT_PERIOD,
                mountainStar: flyingStars.mountainStar,
                waterStar: flyingStars.waterStar,
                auspiciousAreas: flyingStars.auspicious,
                inauspiciousAreas: flyingStars.inauspicious,
            },
            fiveElements: {
                wood: elements.wood,
                fire: elements.fire,
                earth: elements.earth,
                metal: elements.metal,
                water: elements.water,
                balance: elements.balance,
                recommendations: elements.recommendations,
            },
            chiFlow: {
                score: chiFlow.score,
                blockedAreas: chiFlow.blocked,
                recommendations: chiFlow.recommendations,
            },
            recommendations: this.generateRecommendations(baguaAnalysis, flyingStars, elements, chiFlow),
        };
    }

    private analyzeBaguaMap(facing: string): { score: number; areas: BaguaArea[] } {
        const areas: BaguaArea[] = [];
        let totalScore = 0;

        Object.entries(BAGUA_AREAS).forEach(([direction, info]) => {
            const score = this.calculateBaguaAreaScore(direction, facing);
            totalScore += score;

            areas.push({
                area: info.area,
                element: info.element,
                colors: info.colors,
                score,
                recommendations: this.getBaguaRecommendations(direction, score),
            });
        });

        return {
            score: Math.round(totalScore / 9),
            areas,
        };
    }

    private calculateBaguaAreaScore(direction: string, facing: string): number {
        // Simplified scoring based on facing direction
        const baseScore = 70;
        const facingBonus = facing.toUpperCase().includes(direction) ? 15 : 0;
        const randomVariation = Math.floor(Math.random() * 20) - 10;
        return Math.max(0, Math.min(100, baseScore + facingBonus + randomVariation));
    }

    private getBaguaRecommendations(direction: string, score: number): string[] {
        const recommendations: string[] = [];
        const area = BAGUA_AREAS[direction as keyof typeof BAGUA_AREAS];

        if (score < 60) {
            recommendations.push(`Enhance the ${area.area} area with ${area.colors.join(' or ')} accents`);
            recommendations.push(`Add ${area.element.toLowerCase()} element features`);
        }
        if (score < 40) {
            recommendations.push(`Consider a Feng Shui consultation for the ${direction} sector`);
        }

        return recommendations;
    }

    private calculateFlyingStars(yearBuilt: number, facing: string): any {
        // Simplified Flying Stars calculation
        const chart = this.generateFlyingStarsChart();
        const mountainStar = Math.floor(Math.random() * 9) + 1;
        const waterStar = Math.floor(Math.random() * 9) + 1;

        const auspiciousStars = [1, 4, 6, 8, 9];
        const inauspiciousStars = [2, 3, 5, 7];

        return {
            chart,
            mountainStar,
            waterStar,
            score: auspiciousStars.includes(mountainStar) ? 80 : 60,
            auspicious: auspiciousStars.map(s => this.getStarMeaning(s)),
            inauspicious: inauspiciousStars.map(s => this.getStarMeaning(s)),
        };
    }

    private generateFlyingStarsChart(): number[][] {
        // 3x3 magic square base
        return [
            [4, 9, 2],
            [3, 5, 7],
            [8, 1, 6],
        ];
    }

    private getStarMeaning(star: number): { star: number; meaning: string; element: string } {
        const meanings: Record<number, { meaning: string; element: string }> = {
            1: { meaning: 'White - Career & Wisdom', element: 'Water' },
            2: { meaning: 'Black - Illness (cure with metal)', element: 'Earth' },
            3: { meaning: 'Jade - Arguments (cure with fire)', element: 'Wood' },
            4: { meaning: 'Green - Romance & Academics', element: 'Wood' },
            5: { meaning: 'Yellow - Misfortune (cure with metal)', element: 'Earth' },
            6: { meaning: 'White - Authority & Power', element: 'Metal' },
            7: { meaning: 'Red - Violence (cure with water)', element: 'Metal' },
            8: { meaning: 'White - Prosperity', element: 'Earth' },
            9: { meaning: 'Purple - Future Prosperity', element: 'Fire' },
        };
        return { star, ...meanings[star] };
    }

    private analyzeElements(input: FengShuiInput): any {
        // Analyze Five Elements balance
        const wood = Math.floor(Math.random() * 40) + 30;
        const fire = Math.floor(Math.random() * 40) + 30;
        const earth = Math.floor(Math.random() * 40) + 30;
        const metal = Math.floor(Math.random() * 40) + 30;
        const water = Math.floor(Math.random() * 40) + 30;

        const elements = { wood, fire, earth, metal, water };
        const avg = (wood + fire + earth + metal + water) / 5;
        const variance = Object.values(elements).reduce((sum, v) => sum + Math.abs(v - avg), 0);

        let balance = 'Balanced';
        const recommendations: string[] = [];

        if (variance > 50) {
            const max = Object.entries(elements).reduce((a, b) => a[1] > b[1] ? a : b);
            const min = Object.entries(elements).reduce((a, b) => a[1] < b[1] ? a : b);
            balance = `${max[0]}-excess, ${min[0]}-deficient`;
            recommendations.push(`Add more ${min[0]} element to balance energy`);
            recommendations.push(`Reduce ${max[0]} element presence`);
        }

        return {
            wood, fire, earth, metal, water,
            balance,
            balanceScore: Math.max(20, 100 - variance),
            recommendations,
        };
    }

    private analyzeChiFlow(floorPlan: any): any {
        // Analyze Chi (energy) flow
        const score = Math.floor(Math.random() * 30) + 60;

        const potentialBlocks = ['Long corridors', 'Cluttered entryway', 'Blocked corners', 'Stagnant areas'];
        const blocked = score < 70 ? potentialBlocks.slice(0, 2) : [];

        const recommendations: string[] = [];
        if (score < 80) {
            recommendations.push('Add plants to improve Chi flow');
            recommendations.push('Use mirrors to redirect stagnant energy');
            recommendations.push('Keep pathways clear and uncluttered');
        }

        return { score, blocked, recommendations };
    }

    private generateRecommendations(bagua: any, stars: any, elements: any, chi: any): any[] {
        const recommendations: any[] = [];

        if (bagua.score < 70) {
            recommendations.push({
                category: 'Bagua Enhancement',
                priority: 'HIGH',
                description: 'Enhance underperforming Bagua areas with appropriate colors and elements',
                cost: 'LOW',
            });
        }

        if (elements.balanceScore < 60) {
            recommendations.push({
                category: 'Element Balance',
                priority: 'MEDIUM',
                description: elements.recommendations[0] || 'Balance the Five Elements in your space',
                cost: 'LOW',
            });
        }

        if (chi.score < 70) {
            recommendations.push({
                category: 'Chi Flow',
                priority: 'HIGH',
                description: 'Improve energy flow by removing blockages and adding flowing elements',
                cost: 'LOW',
            });
        }

        recommendations.push({
            category: 'Annual Update',
            priority: 'LOW',
            description: 'Update Flying Stars remedies annually for optimal protection',
            cost: 'FREE',
        });

        return recommendations;
    }

    private getGrade(score: number): string {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B+';
        if (score >= 60) return 'B';
        if (score >= 50) return 'C';
        return 'D';
    }
}

export const fengShuiService = new FengShuiService();

