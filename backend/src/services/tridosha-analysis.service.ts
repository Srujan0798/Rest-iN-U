import { v4 as uuidv4 } from 'uuid';

/**
 * Tridosha Property Analysis Service
 * Vata, Pitta, Kapha balance analysis for properties
 * Based on Ayurvedic principles
 */
class TridoshaAnalysisService {

    async analyzeProperty(propertyId: string, propertyData: any): Promise<any> {
        const doshas = this.calculateDoshaBalance(propertyData);
        const recommendations = this.generateRecommendations(doshas);

        return {
            analysisId: uuidv4(),
            propertyId,
            doshas,
            dominantDosha: this.getDominantDosha(doshas),
            healthScore: this.calculateHealthScore(doshas),
            balance: this.assessBalance(doshas),
            recommendations,
            seasonalImpact: this.getSeasonalImpact(doshas),
            generatedAt: new Date().toISOString()
        };
    }

    private calculateDoshaBalance(data: any): any {
        // Property factors affecting doshas
        const direction = data.direction || 'east';
        const elements = data.elements || {};

        let vata = 33, pitta = 33, kapha = 34;

        // Direction affects doshas
        if (direction === 'south' || direction === 'southeast') pitta += 15;
        if (direction === 'north' || direction === 'northeast') vata += 10;
        if (direction === 'west' || direction === 'southwest') kapha += 10;

        // Normalize to 100%
        const total = vata + pitta + kapha;
        return {
            vata: { percentage: Math.round((vata / total) * 100), level: this.getLevel(vata) },
            pitta: { percentage: Math.round((pitta / total) * 100), level: this.getLevel(pitta) },
            kapha: { percentage: Math.round((kapha / total) * 100), level: this.getLevel(kapha) }
        };
    }

    private getLevel(value: number): string {
        if (value < 30) return 'low';
        if (value < 40) return 'balanced';
        return 'elevated';
    }

    private getDominantDosha(doshas: any): string {
        const values = [
            { name: 'Vata', value: doshas.vata.percentage },
            { name: 'Pitta', value: doshas.pitta.percentage },
            { name: 'Kapha', value: doshas.kapha.percentage }
        ];
        return values.sort((a, b) => b.value - a.value)[0].name;
    }

    private calculateHealthScore(doshas: any): number {
        const ideal = 33;
        const deviation = Math.abs(doshas.vata.percentage - ideal) +
            Math.abs(doshas.pitta.percentage - ideal) +
            Math.abs(doshas.kapha.percentage - ideal);
        return Math.max(0, 100 - deviation);
    }

    private assessBalance(doshas: any): string {
        const healthScore = this.calculateHealthScore(doshas);
        if (healthScore >= 80) return 'Excellent balance';
        if (healthScore >= 60) return 'Good balance with minor imbalances';
        return 'Significant imbalance detected';
    }

    private generateRecommendations(doshas: any): any[] {
        const recs = [];

        if (doshas.pitta.percentage > 40) {
            recs.push({ dosha: 'Pitta', action: 'Add cooling water features', priority: 'high' });
            recs.push({ dosha: 'Pitta', action: 'Use blue/green colors', priority: 'medium' });
        }
        if (doshas.vata.percentage > 40) {
            recs.push({ dosha: 'Vata', action: 'Add grounding earth elements', priority: 'high' });
            recs.push({ dosha: 'Vata', action: 'Reduce open spaces', priority: 'medium' });
        }
        if (doshas.kapha.percentage > 40) {
            recs.push({ dosha: 'Kapha', action: 'Increase ventilation', priority: 'high' });
            recs.push({ dosha: 'Kapha', action: 'Add stimulating colors', priority: 'medium' });
        }

        return recs;
    }

    private getSeasonalImpact(doshas: any): any {
        const month = new Date().getMonth();
        let season, impact;

        if (month >= 3 && month <= 5) {
            season = 'Summer (Grishma)';
            impact = doshas.pitta.percentage > 35 ? 'CRITICAL - Double fire' : 'Monitor Pitta';
        } else if (month >= 6 && month <= 8) {
            season = 'Monsoon (Varsha)';
            impact = doshas.vata.percentage > 35 ? 'Elevated Vata risk' : 'Balanced';
        } else if (month >= 9 && month <= 11) {
            season = 'Autumn (Sharad)';
            impact = 'Transition period';
        } else {
            season = 'Winter (Hemant)';
            impact = doshas.kapha.percentage > 35 ? 'Monitor Kapha' : 'Most balanced';
        }

        return { season, impact };
    }

    async getHistoricalProgress(propertyId: string): Promise<any> {
        return {
            propertyId,
            timeline: [
                { month: 'Jul', vata: 38, pitta: 72, kapha: 38, health: 65 },
                { month: 'Aug', vata: 37, pitta: 70, kapha: 39, health: 68 },
                { month: 'Sep', vata: 36, pitta: 68, kapha: 40, health: 70 },
                { month: 'Oct', vata: 35, pitta: 66, kapha: 41, health: 72 },
                { month: 'Nov', vata: 35, pitta: 65, kapha: 40, health: 74 },
                { month: 'Dec', vata: 35, pitta: 65, kapha: 40, health: 76 }
            ],
            improvement: '+11 points health score in 6 months'
        };
    }
}

export const tridoshaAnalysisService = new TridoshaAnalysisService();
export default TridoshaAnalysisService;
