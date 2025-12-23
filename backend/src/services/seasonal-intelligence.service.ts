import { v4 as uuidv4 } from 'uuid';

/**
 * Seasonal Intelligence Service
 * Climate-aware recommendations based on Ayurvedic seasons
 */
class SeasonalIntelligenceService {

    async getCurrentSeasonAnalysis(propertyId: string, doshas: any): Promise<any> {
        const season = this.getCurrentSeason();
        const impact = this.calculateSeasonalImpact(season, doshas);

        return {
            propertyId,
            current: season,
            propertyImpact: impact.description,
            priority: impact.priority,
            recommendations: this.getSeasonalRecommendations(season, doshas),
            nextCritical: this.getNextCriticalPeriod(doshas),
            generatedAt: new Date().toISOString()
        };
    }

    private getCurrentSeason(): any {
        const month = new Date().getMonth();
        const seasons = [
            { name: 'Hemant (Winter)', months: [11, 0], dosha: 'Kapha/Vata' },
            { name: 'Shishir (Late Winter)', months: [1, 2], dosha: 'Kapha' },
            { name: 'Vasant (Spring)', months: [3, 4], dosha: 'Kapha' },
            { name: 'Grishma (Summer)', months: [5, 6], dosha: 'Pitta' },
            { name: 'Varsha (Monsoon)', months: [7, 8], dosha: 'Vata' },
            { name: 'Sharad (Autumn)', months: [9, 10], dosha: 'Pitta/Vata' }
        ];

        return seasons.find(s => s.months.includes(month)) || seasons[0];
    }

    private calculateSeasonalImpact(season: any, doshas: any): any {
        if (season.dosha.includes('Pitta') && doshas?.pitta?.percentage > 40) {
            return { description: 'CRITICAL - Double fire alignment', priority: 'high' };
        }
        if (season.dosha.includes('Vata') && doshas?.vata?.percentage > 40) {
            return { description: 'Elevated Vata risk', priority: 'medium' };
        }
        return { description: 'Balanced seasonal alignment', priority: 'low' };
    }

    private getSeasonalRecommendations(season: any, doshas: any): any[] {
        const recs = [];

        if (season.dosha.includes('Pitta')) {
            recs.push({ action: 'Maximize cooling interventions', urgency: 'high' });
            recs.push({ action: 'Ensure water features are active', urgency: 'high' });
        }
        if (season.dosha.includes('Kapha')) {
            recs.push({ action: 'Increase air circulation', urgency: 'medium' });
        }
        if (season.dosha.includes('Vata')) {
            recs.push({ action: 'Add warm, grounding elements', urgency: 'medium' });
        }

        return recs;
    }

    private getNextCriticalPeriod(doshas: any): any {
        const pittaHigh = doshas?.pitta?.percentage > 35;
        return {
            season: 'Summer (April-June)',
            alert: pittaHigh ? 'CRITICAL PERIOD' : 'Monitor',
            description: pittaHigh ? 'Double fire: Hot climate + Pitta property' : 'Standard monitoring',
            deadline: 'Complete cooling interventions by March 31, 2025'
        };
    }
}

export const seasonalIntelligenceService = new SeasonalIntelligenceService();
export default SeasonalIntelligenceService;

