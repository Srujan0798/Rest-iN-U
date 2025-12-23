// Sacred Geometry & Land Energy Analysis Service
import { logger } from '../utils/logger';

interface SacredGeometryInput {
    roomDimensions?: { width: number; length: number; height?: number }[];
    plotDimensions?: { width: number; length: number };
    architecturalFeatures?: string[];
}

interface LandEnergyInput {
    latitude: number;
    longitude: number;
    historicalUse?: string[];
    soilType?: string;
    waterSources?: boolean;
    ancientTrees?: number;
}

// Golden Ratio constant
const PHI = 1.618033988749895;

// Fibonacci sequence
const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];

export class SacredGeometryService {
    async analyze(input: SacredGeometryInput): Promise<any> {
        const goldenRatio = this.analyzeGoldenRatio(input);
        const fibonacci = this.analyzeFibonacci(input);
        const mandala = this.analyzeMandalaAlignment(input);
        const yantras = this.recommendYantras(input);
        const harmony = this.analyzeGeometricHarmony(input);

        const overallScore = Math.round(
            (goldenRatio.score * 0.3) +
            (fibonacci.score * 0.2) +
            (mandala.score * 0.2) +
            (harmony.score * 0.3)
        );

        return {
            overallScore,
            grade: this.getGrade(overallScore),
            goldenRatio: {
                score: goldenRatio.score,
                details: goldenRatio.details,
                recommendations: goldenRatio.recommendations,
            },
            fibonacci: {
                score: fibonacci.score,
                elements: fibonacci.elements,
                recommendations: fibonacci.recommendations,
            },
            mandala: {
                score: mandala.score,
                centerEnergy: mandala.centerEnergy,
                alignment: mandala.alignment,
            },
            yantras: {
                recommended: yantras.recommended,
                placement: yantras.placement,
            },
            geometricHarmony: {
                score: harmony.score,
                analysis: harmony.analysis,
            },
            recommendations: this.generateRecommendations(goldenRatio, fibonacci, mandala),
        };
    }

    private analyzeGoldenRatio(input: SacredGeometryInput): any {
        const details: any[] = [];
        let totalDeviation = 0;
        let count = 0;

        if (input.roomDimensions) {
            input.roomDimensions.forEach((room, i) => {
                const ratio = room.length / room.width;
                const deviation = Math.abs(ratio - PHI) / PHI * 100;
                totalDeviation += deviation;
                count++;

                details.push({
                    room: `Room ${i + 1}`,
                    dimensions: `${room.width} x ${room.length}`,
                    ratio: ratio.toFixed(3),
                    goldenRatio: PHI.toFixed(3),
                    deviation: `${deviation.toFixed(1)}%`,
                    isHarmonious: deviation < 15,
                });
            });
        }

        if (input.plotDimensions) {
            const ratio = input.plotDimensions.length / input.plotDimensions.width;
            const deviation = Math.abs(ratio - PHI) / PHI * 100;
            totalDeviation += deviation;
            count++;

            details.push({
                element: 'Plot',
                dimensions: `${input.plotDimensions.width} x ${input.plotDimensions.length}`,
                ratio: ratio.toFixed(3),
                goldenRatio: PHI.toFixed(3),
                deviation: `${deviation.toFixed(1)}%`,
                isHarmonious: deviation < 15,
            });
        }

        const avgDeviation = count > 0 ? totalDeviation / count : 50;
        const score = Math.max(0, Math.min(100, 100 - avgDeviation));

        const recommendations: string[] = [];
        if (score < 70) {
            recommendations.push('Consider furniture placement that creates golden ratio proportions');
            recommendations.push('Add architectural elements that incorporate 1:1.618 ratios');
        }

        return { score: Math.round(score), details, recommendations };
    }

    private analyzeFibonacci(input: SacredGeometryInput): any {
        const elements: any[] = [];
        let score = 70; // Base score

        if (input.architecturalFeatures) {
            const spiralFeatures = input.architecturalFeatures.filter(f =>
                f.toLowerCase().includes('spiral') ||
                f.toLowerCase().includes('curve') ||
                f.toLowerCase().includes('arch')
            );

            if (spiralFeatures.length > 0) {
                score += 15;
                elements.push({
                    type: 'Spiral/Curve Elements',
                    count: spiralFeatures.length,
                    harmony: 'Excellent - Fibonacci spirals enhance energy flow',
                });
            }
        }

        // Check room counts
        if (input.roomDimensions) {
            const roomCount = input.roomDimensions.length;
            if (FIBONACCI.includes(roomCount)) {
                score += 10;
                elements.push({
                    type: 'Room Count',
                    value: roomCount,
                    harmony: 'Good - Fibonacci number of rooms',
                });
            }
        }

        const recommendations: string[] = [];
        if (score < 70) {
            recommendations.push('Add spiral staircase or curved architectural elements');
            recommendations.push('Incorporate Fibonacci numbers in design (3, 5, 8, 13 elements)');
        }

        return { score: Math.min(100, score), elements, recommendations };
    }

    private analyzeMandalaAlignment(input: SacredGeometryInput): any {
        // Analyze how well the property aligns with mandala principles
        const centerEnergy = Math.floor(Math.random() * 30) + 60;

        let alignment = 'Good';
        if (centerEnergy >= 85) alignment = 'Excellent';
        else if (centerEnergy < 60) alignment = 'Needs Improvement';

        const score = centerEnergy;

        return {
            score,
            centerEnergy,
            alignment,
            recommendations: score < 70
                ? ['Keep the center of the home open and clutter-free', 'Consider a central skylight or atrium']
                : [],
        };
    }

    private recommendYantras(input: SacredGeometryInput): any {
        const yantras = [
            {
                name: 'Sri Yantra',
                purpose: 'Abundance and spiritual growth',
                placement: 'Northeast corner, prayer room or meditation space',
                material: 'Copper or gold',
            },
            {
                name: 'Kubera Yantra',
                purpose: 'Wealth and prosperity',
                placement: 'North wall, safe or treasury area',
                material: 'Silver or brass',
            },
            {
                name: 'Vastu Yantra',
                purpose: 'Correct Vastu defects',
                placement: 'Center of the home (Brahmasthan)',
                material: 'Copper plate',
            },
        ];

        return {
            recommended: yantras,
            placement: {
                generalGuidelines: [
                    'Place yantras at eye level or above',
                    'Face East or North while meditating on yantras',
                    'Energize yantras during auspicious muhurtas',
                    'Keep yantras clean and free from dust',
                ],
            },
        };
    }

    private analyzeGeometricHarmony(input: SacredGeometryInput): any {
        // Overall geometric harmony analysis
        let score = 65;
        const analysis: string[] = [];

        if (input.plotDimensions) {
            const { width, length } = input.plotDimensions;
            if (Math.abs(width - length) / width < 0.1) {
                score += 15;
                analysis.push('Square plot - excellent for Vastu and sacred geometry');
            } else if (length / width > 0.8 && length / width < 1.3) {
                score += 10;
                analysis.push('Near-square proportions - good geometric harmony');
            }
        }

        if (input.architecturalFeatures?.includes('dome')) {
            score += 10;
            analysis.push('Dome structure enhances cosmic energy reception');
        }

        if (input.architecturalFeatures?.includes('pyramid')) {
            score += 10;
            analysis.push('Pyramid elements channel focused energy');
        }

        return { score: Math.min(100, score), analysis };
    }

    private generateRecommendations(golden: any, fib: any, mandala: any): any[] {
        const recommendations: any[] = [];

        if (golden.score < 70) {
            recommendations.push({
                category: 'Golden Ratio',
                action: 'Incorporate 1:1.618 proportions in furniture and decor',
                priority: 'MEDIUM',
                cost: 'LOW',
            });
        }

        if (fib.score < 70) {
            recommendations.push({
                category: 'Fibonacci',
                action: 'Add spiral or curved design elements',
                priority: 'LOW',
                cost: 'MEDIUM',
            });
        }

        if (mandala.score < 70) {
            recommendations.push({
                category: 'Mandala Alignment',
                action: 'Create an open, sacred center space',
                priority: 'HIGH',
                cost: 'LOW',
            });
        }

        recommendations.push({
            category: 'Yantra Installation',
            action: 'Install Sri Yantra in the Northeast for prosperity',
            priority: 'MEDIUM',
            cost: 'LOW',
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

export class LandEnergyService {
    async analyze(input: LandEnergyInput): Promise<any> {
        const historical = this.analyzeHistoricalEnergy(input);
        const geological = this.analyzeGeological(input);
        const water = this.analyzeWater(input);
        const soil = this.analyzeSoil(input);
        const trees = this.analyzeTrees(input);
        const cosmic = this.analyzeCosmicAlignment(input);

        const overallScore = Math.round(
            (historical.score * 0.2) +
            (geological.score * 0.15) +
            (water.score * 0.2) +
            (soil.score * 0.15) +
            (trees.score * 0.15) +
            (cosmic.score * 0.15)
        );

        return {
            overallScore,
            grade: this.getGrade(overallScore),
            historical: {
                score: historical.score,
                uses: historical.uses,
                impact: historical.impact,
                purification: historical.purification,
            },
            geological: {
                score: geological.score,
                leyLineProximity: geological.leyLine,
                energyVortex: geological.vortex,
                formations: geological.formations,
            },
            water: {
                score: water.score,
                tableDepth: water.depth,
                quality: water.quality,
                springs: water.springs,
            },
            soil: {
                score: soil.score,
                composition: soil.composition,
                fertility: soil.fertility,
                contamination: soil.contamination,
            },
            trees: {
                score: trees.score,
                ancientTrees: trees.ancient,
                species: trees.species,
                energy: trees.energy,
            },
            cosmicAlignment: {
                score: cosmic.score,
                cardinalAlignment: cosmic.cardinal,
                celestialEvents: cosmic.celestial,
            },
            purificationRituals: this.recommendPurification(historical, soil),
            recommendations: this.generateRecommendations(overallScore),
        };
    }

    private analyzeHistoricalEnergy(input: LandEnergyInput): any {
        const negativeUses = ['cemetery', 'burial', 'hospital', 'slaughterhouse', 'prison', 'battlefield'];
        const positiveUses = ['temple', 'monastery', 'garden', 'farm', 'forest'];

        let score = 75;
        const uses = input.historicalUse || ['unknown'];
        let impact = 'Neutral';
        const purification: string[] = [];

        uses.forEach(use => {
            if (negativeUses.some(neg => use.toLowerCase().includes(neg))) {
                score -= 25;
                impact = 'Negative residual energy detected';
                purification.push(`Bhumi Shuddhi (land purification) ritual recommended`);
                purification.push(`Vastu Homa (fire ceremony) for energy cleansing`);
            }
            if (positiveUses.some(pos => use.toLowerCase().includes(pos))) {
                score += 15;
                impact = 'Positive spiritual energy present';
            }
        });

        return { score: Math.max(0, Math.min(100, score)), uses, impact, purification };
    }

    private analyzeGeological(input: LandEnergyInput): any {
        // Simulate ley line and geological analysis
        const leyLine = Math.random() * 10; // km to nearest ley line
        const vortex = Math.random() > 0.9; // 10% chance of energy vortex

        let score = 70;
        if (leyLine < 1) score += 20;
        else if (leyLine < 5) score += 10;
        if (vortex) score += 15;

        const formations = [];
        if (Math.random() > 0.7) formations.push('Crystal deposits nearby');
        if (Math.random() > 0.8) formations.push('Natural spring source');

        return {
            score: Math.min(100, score),
            leyLine: `${leyLine.toFixed(1)} km`,
            vortex,
            formations,
        };
    }

    private analyzeWater(input: LandEnergyInput): any {
        const depth = 15 + Math.random() * 50; // meters
        const quality = Math.random() > 0.7 ? 'Good' : 'Average';
        const springs = input.waterSources || Math.random() > 0.8;

        let score = 70;
        if (depth < 30) score += 10;
        if (quality === 'Good') score += 10;
        if (springs) score += 10;

        return { score, depth: `${depth.toFixed(0)}m`, quality, springs };
    }

    private analyzeSoil(input: LandEnergyInput): any {
        const types = ['Loamy', 'Sandy', 'Clay', 'Silty', 'Peaty'];
        const composition = input.soilType || types[Math.floor(Math.random() * types.length)];
        const fertility = 50 + Math.floor(Math.random() * 50);
        const contamination = Math.random() < 0.1;

        let score = 70;
        if (composition === 'Loamy') score += 15;
        if (fertility > 75) score += 10;
        if (contamination) score -= 30;

        return { score, composition, fertility, contamination };
    }

    private analyzeTrees(input: LandEnergyInput): any {
        const ancient = input.ancientTrees || 0;
        const species = ['Banyan', 'Peepal', 'Neem', 'Oak', 'Cedar'];
        const selectedSpecies = species.slice(0, Math.floor(Math.random() * 3) + 1);

        let score = 60;
        score += ancient * 10; // Each ancient tree adds 10 points

        let energy = 'Moderate';
        if (selectedSpecies.includes('Banyan') || selectedSpecies.includes('Peepal')) {
            score += 15;
            energy = 'Highly Positive - Sacred trees present';
        }

        return { score: Math.min(100, score), ancient, species: selectedSpecies, energy };
    }

    private analyzeCosmicAlignment(input: LandEnergyInput): any {
        const cardinal = Math.floor(Math.random() * 30) + 70;
        const celestial = {
            summerSolstice: Math.random() > 0.5 ? 'Aligned with sunrise' : 'Partially aligned',
            winterSolstice: Math.random() > 0.5 ? 'Aligned with sunrise' : 'Partially aligned',
        };

        return { score: cardinal, cardinal: `${cardinal}% aligned`, celestial };
    }

    private recommendPurification(historical: any, soil: any): any[] {
        const rituals: any[] = [];

        if (historical.score < 60) {
            rituals.push({
                name: 'Bhumi Shuddhi',
                description: 'Land purification through sacred mantras and offerings',
                duration: '3-7 days',
                timing: 'During Shukla Paksha (waxing moon)',
            });
        }

        if (soil.contamination) {
            rituals.push({
                name: 'Agni Hotra',
                description: 'Fire ceremony to purify land and atmosphere',
                duration: '1-3 days',
                timing: 'Sunrise and sunset',
            });
        }

        rituals.push({
            name: 'Griha Pravesh Puja',
            description: 'Traditional house warming ceremony for positive energy',
            duration: '1 day',
            timing: 'Auspicious muhurta',
        });

        return rituals;
    }

    private generateRecommendations(score: number): any[] {
        const recommendations = [];

        if (score < 60) {
            recommendations.push({
                category: 'Land Purification',
                action: 'Perform Bhumi Shuddhi before construction',
                priority: 'HIGH',
            });
        }

        recommendations.push({
            category: 'Tree Planting',
            action: 'Plant Tulsi, Neem, or Peepal for positive energy',
            priority: 'MEDIUM',
        });

        recommendations.push({
            category: 'Water Feature',
            action: 'Install water feature in Northeast for prosperity',
            priority: 'MEDIUM',
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

export const sacredGeometryService = new SacredGeometryService();
export const landEnergyService = new LandEnergyService();

