import { v4 as uuidv4 } from 'uuid';

/**
 * Puranic Land Analyzer
 * 
 * Ancient Puranic Wisdom for Land Assessment
 * Based on: Matsya Purana, Agni Purana, Vishnu Purana, Brihat Samhita
 * 
 * Evaluates land using 5000+ year old Vedic knowledge
 */
class PuranicLandAnalyzer {

    // ============================================
    // MAIN ANALYSIS
    // ============================================

    async analyzeLandByPuranas(
        latitude: number,
        longitude: number,
        elevation: number,
        propertyData: any
    ): Promise<PuranicAnalysis> {
        console.log(`Performing Puranic analysis for (${latitude}, ${longitude})...`);

        // 1. Bhumi Tattva Analysis (Earth Element)
        const bhumiAnalysis = this.analyzeBhumiTattva(latitude, longitude, elevation);

        // 2. Panchamahabhuta Balance (Five Elements)
        const mahabhutaBalance = this.analyzePanchamahabhuta(latitude, longitude, elevation);

        // 3. Sacred Geography Check
        const sacredProximity = this.checkSacredGeography(latitude, longitude);

        // 4. Puranic Land Classification
        const landClassification = this.classifyLandPuranic(latitude, longitude, elevation);

        // 5. Karmic Land History
        const karmicHistory = this.assessKarmicHistory(latitude, longitude);

        // 6. Dharmic Suitability
        const dharmicScore = this.calculateDharmicSuitability(
            bhumiAnalysis,
            mahabhutaBalance,
            sacredProximity,
            landClassification
        );

        // 7. Puranic Remedies
        const remedies = this.generatePuranicRemedies(bhumiAnalysis, mahabhutaBalance, dharmicScore);

        // 8. Vedic Agricultural Potential
        const agriculture = this.assessVedicAgriculture(latitude, longitude, elevation);

        // 9. Geopathic Stress Analysis
        const geopathic = this.analyzeGeopathicStress(latitude, longitude);

        return {
            id: uuidv4(),
            latitude,
            longitude,
            elevation,
            bhumiTattva: bhumiAnalysis,
            panchamahabhutaBalance: mahabhutaBalance,
            sacredGeography: sacredProximity,
            landClassification,
            karmicHistory,
            dharmicSuitabilityScore: dharmicScore,
            puranicRemedies: remedies,
            vedicAgriculturePotential: agriculture,
            geopathicStress: geopathic,
            overallAssessment: this.generateOverallAssessment(dharmicScore),
            scripturalReferences: this.getScripturalReferences(),
            createdAt: new Date().toISOString()
        };
    }

    // ============================================
    // BHUMI TATTVA (EARTH ELEMENT)
    // ============================================

    private analyzeBhumiTattva(lat: number, lng: number, elevation: number): BhumiTattva {
        const soilData = this.getSoilComposition(lat, lng);
        const waterTable = this.estimateWaterTableDepth(lat, lng, elevation);
        const vegetation = this.getVegetationDensity(lat, lng);

        let bhumiType: string;
        let quality: string;
        let characteristics: string[];
        let score: number;

        if (vegetation > 0.6 && waterTable > 20) {
            bhumiType = 'Jangala';
            quality = 'Excellent for habitation - Vata-Kapha balanced';
            characteristics = [
                'Dry and elevated land',
                'Good air circulation',
                'Suitable for construction',
                'Promotes health and longevity',
                'Reduces Kapha dosha'
            ];
            score = 95;
        } else if (waterTable < 10 && vegetation < 0.3) {
            bhumiType = 'Anupa';
            quality = 'Moderate - Kapha predominant, needs drainage';
            characteristics = [
                'Water-rich land',
                'May have marshy areas',
                'Needs proper drainage',
                'Good for certain crops',
                'Increases Kapha dosha'
            ];
            score = 65;
        } else {
            bhumiType = 'Sadharana';
            quality = 'Good - Balanced tridosha';
            characteristics = [
                'Normal, balanced land',
                'Suitable for all purposes',
                'Good water availability',
                'Moderate vegetation',
                'Tridosha balanced'
            ];
            score = 85;
        }

        return {
            bhumiType,
            qualityAssessment: quality,
            characteristics,
            score,
            soilColor: soilData.color,
            soilColorMeaning: this.interpretSoilColor(soilData.color),
            waterTableDepthFt: waterTable,
            vegetationIndex: vegetation,
            puranicClassification: this.getPuranicSoilClassification(soilData),
            recommendedConstruction: this.getConstructionRecommendations(bhumiType)
        };
    }

    // ============================================
    // PANCHAMAHABHUTA (FIVE ELEMENTS)
    // ============================================

    private analyzePanchamahabhuta(lat: number, lng: number, elevation: number): PanchamahabhutaBalance {
        const elements: Record<string, ElementAnalysis> = {};

        // 1. PRITHVI (Earth)
        let earthScore = 50;
        const soil = this.getSoilComposition(lat, lng);
        if (soil.fertility > 0.7) earthScore += 20;
        if (elevation > 100) earthScore += 15;
        if (soil.rockContent > 0.3) earthScore += 10;

        elements['Prithvi'] = {
            score: Math.min(100, earthScore),
            quality: earthScore > 80 ? 'Excellent' : 'Good',
            characteristics: [
                `Soil fertility: ${(soil.fertility * 100).toFixed(0)}%`,
                `Elevation: ${elevation.toFixed(0)}ft (stability)`,
                'Represents: Stability, nourishment, support'
            ],
            recommendations: this.getElementRecommendations('Prithvi', earthScore)
        };

        // 2. JALA (Water)
        let waterScore = 50;
        const waterTable = this.estimateWaterTableDepth(lat, lng, elevation);
        if (waterTable > 10 && waterTable < 50) waterScore += 25;
        else if (waterTable < 10) waterScore += 10;

        const waterBodies = this.findNearbyWaterBodies(lat, lng);
        if (waterBodies > 0) waterScore += 15;

        elements['Jala'] = {
            score: Math.min(100, waterScore),
            quality: waterScore > 80 ? 'Excellent' : 'Adequate',
            characteristics: [
                `Water table depth: ${waterTable.toFixed(0)}ft`,
                `Nearby water bodies: ${waterBodies}`,
                'Represents: Prosperity, flow, abundance'
            ],
            recommendations: this.getElementRecommendations('Jala', waterScore)
        };

        // 3. AGNI (Fire)
        let fireScore = 50;
        const solarHours = this.getSolarExposure(lat, lng);
        if (solarHours > 2500) fireScore += 20;
        if (lat < 35) fireScore += 15; // Warmer latitudes

        elements['Agni'] = {
            score: Math.min(100, fireScore),
            quality: fireScore > 75 ? 'Strong' : 'Moderate',
            characteristics: [
                `Annual sunshine: ${solarHours} hours`,
                'Solar orientation potential',
                'Represents: Energy, transformation, vitality'
            ],
            recommendations: this.getElementRecommendations('Agni', fireScore)
        };

        // 4. VAYU (Air)
        let airScore = 50;
        const windSpeed = this.getAverageWindSpeed(lat, lng);
        if (windSpeed > 5 && windSpeed < 15) airScore += 20;

        const airQuality = this.getAirQualityIndex(lat, lng);
        if (airQuality < 50) airScore += 25;

        if (elevation > 200) airScore += 10;

        elements['Vayu'] = {
            score: Math.min(100, airScore),
            quality: airScore > 80 ? 'Excellent' : 'Good',
            characteristics: [
                `Wind speed: ${windSpeed.toFixed(1)} km/h`,
                `Air quality index: ${airQuality}`,
                'Represents: Life force (Prana), movement, freshness'
            ],
            recommendations: this.getElementRecommendations('Vayu', airScore)
        };

        // 5. AKASHA (Ether/Space)
        let spaceScore = 50;
        const openSpace = this.calculateOpenSpace(lat, lng);
        if (openSpace > 0.6) spaceScore += 20;

        const lightPollution = this.getLightPollution(lat, lng);
        if (lightPollution < 0.3) spaceScore += 15;

        const noiseLevel = this.getNoiseLevel(lat, lng);
        if (noiseLevel < 45) spaceScore += 15;

        elements['Akasha'] = {
            score: Math.min(100, spaceScore),
            quality: spaceScore > 80 ? 'Expansive' : 'Adequate',
            characteristics: [
                `Open space: ${(openSpace * 100).toFixed(0)}%`,
                `Light pollution: ${(lightPollution * 100).toFixed(0)}%`,
                `Noise level: ${noiseLevel}dB`,
                'Represents: Consciousness, space, potential'
            ],
            recommendations: this.getElementRecommendations('Akasha', spaceScore)
        };

        // Calculate overall balance
        const scores = Object.values(elements).map(e => e.score);
        const std = this.calculateStd(scores);
        const balanceScore = 100 - std;

        let balanceQuality: string;
        if (std < 10) balanceQuality = 'Perfectly Balanced';
        else if (std < 20) balanceQuality = 'Well Balanced';
        else if (std < 30) balanceQuality = 'Moderately Balanced';
        else balanceQuality = 'Imbalanced - Remedies Recommended';

        const dominantElement = Object.entries(elements).reduce((a, b) => a[1].score > b[1].score ? a : b)[0];
        const deficientElement = Object.entries(elements).reduce((a, b) => a[1].score < b[1].score ? a : b)[0];

        return {
            elements,
            overallBalanceScore: balanceScore,
            balanceQuality,
            dominantElement,
            deficientElement,
            puranicInterpretation: this.interpretPanchamahabhutaBalance(elements)
        };
    }

    // ============================================
    // SACRED GEOGRAPHY
    // ============================================

    private checkSacredGeography(lat: number, lng: number): SacredGeography {
        // Simulated sacred sites database
        const sacredSites = this.getSacredSitesNearby(lat, lng);

        let sacredScore = 0;
        if (sacredSites.length > 0) {
            sacredScore = Math.min(100, sacredSites.reduce((sum, site) =>
                sum + 100 / (1 + site.distanceKm / 10), 0));
        }

        return {
            sacredSitesCount: sacredSites.length,
            nearestSacredSites: sacredSites.slice(0, 5),
            sacredEnergyScore: sacredScore,
            spiritualSignificance: this.assessSpiritualSignificance(sacredSites),
            recommendedPractices: this.getSacredSitePractices(sacredSites)
        };
    }

    // ============================================
    // PURANIC LAND CLASSIFICATION
    // ============================================

    private classifyLandPuranic(lat: number, lng: number, elevation: number): LandClassification {
        let score = 0;
        const characteristics: string[] = [];

        const soil = this.getSoilComposition(lat, lng);
        if (['reddish', 'golden'].includes(soil.color)) {
            score += 30;
            characteristics.push('Auspicious soil color (Uttama quality)');
        } else if (['white', 'yellow'].includes(soil.color)) {
            score += 20;
            characteristics.push('Good soil color (Madhyama quality)');
        } else {
            score += 10;
        }

        if (elevation > 500) {
            score += 20;
            characteristics.push('Elevated land (Uttama - closer to divinity)');
        } else if (elevation > 100) {
            score += 15;
            characteristics.push('Moderately elevated (Madhyama)');
        }

        const waterQuality = this.assessWaterQuality(lat, lng);
        if (waterQuality === 'sweet') {
            score += 25;
            characteristics.push('Sweet water (Uttama - mentioned in Puranas as best)');
        }

        const vegetation = this.getVegetationDiversity(lat, lng);
        if (vegetation > 10) {
            score += 15;
            characteristics.push('High vegetation diversity (sign of fertile land)');
        }

        let classification: string;
        let description: string;
        let suitableFor: string[];

        if (score >= 85) {
            classification = 'Uttama';
            description = 'Highest quality land - Suitable for temples, meditation, residences of spiritual persons';
            suitableFor = ['Residential (ideal)', 'Spiritual centers', 'Meditation retreats', 'Ayurvedic centers'];
        } else if (score >= 60) {
            classification = 'Madhyama';
            description = 'Medium quality land - Suitable for general habitation and commerce';
            suitableFor = ['Residential', 'Commercial', 'Agriculture', 'Educational institutions'];
        } else {
            classification = 'Adhama';
            description = 'Lower quality land - Suitable for industries and storage';
            suitableFor = ['Industrial', 'Warehousing', 'Parking', 'Service industries'];
        }

        return {
            classification,
            score,
            description,
            characteristics,
            suitableFor,
            puranicReference: this.getClassificationReferences(classification),
            enhancementPotential: this.assessEnhancementPotential(score)
        };
    }

    // ============================================
    // KARMIC HISTORY
    // ============================================

    private assessKarmicHistory(lat: number, lng: number): KarmicHistory {
        // Simulated historical data
        const historicalUse = this.researchHistoricalLandUse(lat, lng);

        let karmicScore = 50;
        const influences: KarmicInfluence[] = [];

        if (historicalUse.includes('temple') || historicalUse.includes('ashram')) {
            karmicScore += 30;
            influences.push({
                type: 'Highly Positive',
                description: 'Land has history of spiritual use - Temple/Ashram',
                impact: '+30 points',
                reasoning: 'Sacred activities purify land for generations'
            });
        }

        if (historicalUse.includes('forest')) {
            karmicScore += 20;
            influences.push({
                type: 'Positive',
                description: 'Natural forest land',
                impact: '+20 points',
                reasoning: 'Nature preserves positive energies'
            });
        }

        if (historicalUse.includes('cemetery')) {
            karmicScore -= 25;
            influences.push({
                type: 'Negative',
                description: 'Former burial ground',
                impact: '-25 points',
                reasoning: 'Needs extensive purification rituals',
                remedies: ['Perform Maha Mrityunjaya Homa', 'Install Hanuman idol', 'Daily Gayatri Mantra']
            });
        }

        return {
            score: Math.max(0, Math.min(100, karmicScore)),
            influences,
            overallEnergy: karmicScore > 70 ? 'Sattvic (Pure)' : karmicScore > 40 ? 'Rajasic (Active)' : 'Tamasic (Inert)',
            purificationNeeded: karmicScore < 60
        };
    }

    // ============================================
    // DHARMIC SUITABILITY
    // ============================================

    private calculateDharmicSuitability(
        bhumi: BhumiTattva,
        mahabhuta: PanchamahabhutaBalance,
        sacred: SacredGeography,
        classification: LandClassification
    ): number {
        return Math.round(
            bhumi.score * 0.25 +
            mahabhuta.overallBalanceScore * 0.30 +
            sacred.sacredEnergyScore * 0.20 +
            classification.score * 0.25
        );
    }

    // ============================================
    // PURANIC REMEDIES
    // ============================================

    private generatePuranicRemedies(
        bhumi: BhumiTattva,
        mahabhuta: PanchamahabhutaBalance,
        dharmicScore: number
    ): PuranicRemedy[] {
        const remedies: PuranicRemedy[] = [];

        if (dharmicScore < 70) {
            remedies.push({
                purpose: 'Land Purification',
                rituals: [
                    'Perform Bhumi Pujan before construction',
                    'Sprinkle Ganga Jal on all corners',
                    'Plant Tulsi in courtyard'
                ],
                mantras: ['Om Bhumaye Namaha', 'Prithvi Sukta from Rig Veda'],
                timing: 'Before any construction begins'
            });
        }

        if (mahabhuta.deficientElement === 'Jala') {
            remedies.push({
                purpose: 'Water Element Enhancement',
                rituals: [
                    'Create a small water feature in North or Northeast',
                    'Place aquarium with fish',
                    'Install fountain'
                ],
                mantras: ['Om Varunaya Namaha'],
                timing: 'Monday or Thursday'
            });
        }

        if (mahabhuta.deficientElement === 'Agni') {
            remedies.push({
                purpose: 'Fire Element Enhancement',
                rituals: [
                    'Keep diya lit in Southeast corner',
                    'Install solar lights',
                    'Paint Southeast in warm colors'
                ],
                mantras: ['Om Agnaye Namaha'],
                timing: 'Sunday'
            });
        }

        return remedies;
    }

    // ============================================
    // HELPER METHODS (SIMULATED)
    // ============================================

    private getSoilComposition(lat: number, lng: number): { color: string; fertility: number; rockContent: number } {
        return {
            color: ['reddish', 'golden', 'brown', 'black', 'white'][Math.floor(Math.random() * 5)],
            fertility: 0.5 + Math.random() * 0.4,
            rockContent: Math.random() * 0.5
        };
    }

    private estimateWaterTableDepth(lat: number, lng: number, elevation: number): number {
        return Math.max(5, 30 + elevation * 0.1 + Math.random() * 20);
    }

    private getVegetationDensity(lat: number, lng: number): number {
        return 0.3 + Math.random() * 0.5;
    }

    private interpretSoilColor(color: string): string {
        const meanings: Record<string, string> = {
            'reddish': 'Highly auspicious - Represents prosperity and Mars energy',
            'golden': 'Excellent - Represents wealth and Jupiter energy',
            'brown': 'Good - Represents stability and groundedness',
            'black': 'Rich in minerals - Good for agriculture',
            'white': 'Moderate - May need enrichment'
        };
        return meanings[color] || 'Neutral';
    }

    private getPuranicSoilClassification(soil: any): string {
        if (soil.fertility > 0.8) return 'Sukla (White/Pure) - Highest grade';
        if (soil.fertility > 0.6) return 'Pita (Yellow) - Good grade';
        return 'Krishna (Dark) - Moderate grade';
    }

    private getConstructionRecommendations(bhumiType: string): string[] {
        const recommendations: Record<string, string[]> = {
            'Jangala': ['Ideal for multi-story construction', 'Foundation depth: Standard', 'No special drainage needed'],
            'Anupa': ['Single story recommended', 'Deep foundation required', 'Install drainage system', 'Damp-proofing essential'],
            'Sadharana': ['Suitable for 2-3 stories', 'Standard foundation', 'Standard drainage']
        };
        return recommendations[bhumiType] || [];
    }

    private getElementRecommendations(element: string, score: number): string[] {
        if (score >= 80) return ['No enhancement needed'];

        const recommendations: Record<string, string[]> = {
            'Prithvi': ['Add clay pots with soil', 'Install stone sculptures', 'Use earth-tone colors'],
            'Jala': ['Add water feature', 'Place aquarium', 'Install fountain in North'],
            'Agni': ['Keep diya lit in Southeast', 'Install solar lights', 'Use warm colors'],
            'Vayu': ['Ensure cross-ventilation', 'Add wind chimes', 'Plant trees'],
            'Akasha': ['Create open spaces', 'Reduce clutter', 'Use mirrors strategically']
        };
        return recommendations[element] || [];
    }

    private findNearbyWaterBodies(lat: number, lng: number): number {
        return Math.floor(Math.random() * 4);
    }

    private getSolarExposure(lat: number, lng: number): number {
        return 2000 + Math.random() * 1000;
    }

    private getAverageWindSpeed(lat: number, lng: number): number {
        return 5 + Math.random() * 10;
    }

    private getAirQualityIndex(lat: number, lng: number): number {
        return Math.floor(20 + Math.random() * 60);
    }

    private calculateOpenSpace(lat: number, lng: number): number {
        return 0.4 + Math.random() * 0.4;
    }

    private getLightPollution(lat: number, lng: number): number {
        return Math.random() * 0.6;
    }

    private getNoiseLevel(lat: number, lng: number): number {
        return 30 + Math.random() * 30;
    }

    private calculateStd(values: number[]): number {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        return Math.sqrt(values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length);
    }

    private interpretPanchamahabhutaBalance(elements: Record<string, ElementAnalysis>): string {
        const dominant = Object.entries(elements).reduce((a, b) => a[1].score > b[1].score ? a : b)[0];
        return `With ${dominant} as the dominant element, this land carries ${dominant === 'Prithvi' ? 'stability and grounding energy' :
                dominant === 'Jala' ? 'prosperity and flow' :
                    dominant === 'Agni' ? 'transformation and vitality' :
                        dominant === 'Vayu' ? 'movement and life force' :
                            'expansiveness and consciousness'
            }.`;
    }

    private getSacredSitesNearby(lat: number, lng: number): SacredSite[] {
        // Simulated sacred sites
        return [
            { name: 'Ancient Temple', category: 'Temple', distanceKm: 15, significance: 'Historical spiritual center' },
            { name: 'Sacred Grove', category: 'Natural', distanceKm: 25, significance: 'Protected forest with sacred trees' }
        ];
    }

    private assessSpiritualSignificance(sites: SacredSite[]): string {
        if (sites.some(s => s.distanceKm < 10)) return 'High - Very close to sacred geography';
        if (sites.length > 0) return 'Moderate - Within spiritual influence';
        return 'Low - Far from known sacred sites';
    }

    private getSacredSitePractices(sites: SacredSite[]): string[] {
        if (sites.length === 0) return ['Establish personal sacred space in home'];
        return [
            'Regular visits to nearby sacred sites',
            'Bring blessed items from temples',
            'Participate in local spiritual activities'
        ];
    }

    private assessWaterQuality(lat: number, lng: number): string {
        return ['sweet', 'neutral', 'mineral'][Math.floor(Math.random() * 3)];
    }

    private getVegetationDiversity(lat: number, lng: number): number {
        return Math.floor(5 + Math.random() * 15);
    }

    private getClassificationReferences(classification: string): string {
        const refs: Record<string, string> = {
            'Uttama': 'Matsya Purana 252.3-5, Brihat Samhita 53.4',
            'Madhyama': 'Agni Purana 106.7-9',
            'Adhama': 'Matsya Purana 252.10'
        };
        return refs[classification] || 'General Vastu texts';
    }

    private assessEnhancementPotential(score: number): string {
        if (score >= 80) return 'Already excellent - minimal enhancement needed';
        if (score >= 60) return 'Good potential - Vastu remedies can enhance to Uttama';
        return 'Significant enhancement needed - consult Vastu expert';
    }

    private researchHistoricalLandUse(lat: number, lng: number): string[] {
        return ['agricultural', 'forest'];
    }

    private assessVedicAgriculture(lat: number, lng: number, elevation: number): any {
        return {
            suitableFor: ['Rice', 'Wheat', 'Vegetables', 'Medicinal herbs'],
            soilPreparation: 'Follow Krishi Parashar guidelines',
            auspiciousTiming: 'Consult Panchang for planting'
        };
    }

    private analyzeGeopathicStress(lat: number, lng: number): any {
        return {
            level: 'Low',
            recommendations: ['No significant geopathic stress detected', 'Safe for construction'],
            zones: []
        };
    }

    private generateOverallAssessment(dharmicScore: number): string {
        if (dharmicScore >= 85) return 'Exceptional - Highly recommended for all purposes';
        if (dharmicScore >= 70) return 'Very Good - Recommended with minor enhancements';
        if (dharmicScore >= 55) return 'Good - Suitable with appropriate Vastu remedies';
        return 'Fair - Consider alternatives or significant remediation';
    }

    private getScripturalReferences(): string[] {
        return [
            'Matsya Purana - Chapters 252-256 (Land Classification)',
            'Agni Purana - Bhumipariksha section',
            'Brihat Samhita - Vastu chapters',
            'Vayu Purana - Panchamahabhuta',
            'Krishi Parashar - Agricultural wisdom'
        ];
    }
}

// Types
interface BhumiTattva {
    bhumiType: string;
    qualityAssessment: string;
    characteristics: string[];
    score: number;
    soilColor: string;
    soilColorMeaning: string;
    waterTableDepthFt: number;
    vegetationIndex: number;
    puranicClassification: string;
    recommendedConstruction: string[];
}

interface ElementAnalysis {
    score: number;
    quality: string;
    characteristics: string[];
    recommendations: string[];
}

interface PanchamahabhutaBalance {
    elements: Record<string, ElementAnalysis>;
    overallBalanceScore: number;
    balanceQuality: string;
    dominantElement: string;
    deficientElement: string;
    puranicInterpretation: string;
}

interface SacredSite {
    name: string;
    category: string;
    distanceKm: number;
    significance: string;
}

interface SacredGeography {
    sacredSitesCount: number;
    nearestSacredSites: SacredSite[];
    sacredEnergyScore: number;
    spiritualSignificance: string;
    recommendedPractices: string[];
}

interface LandClassification {
    classification: string;
    score: number;
    description: string;
    characteristics: string[];
    suitableFor: string[];
    puranicReference: string;
    enhancementPotential: string;
}

interface KarmicInfluence {
    type: string;
    description: string;
    impact: string;
    reasoning: string;
    remedies?: string[];
}

interface KarmicHistory {
    score: number;
    influences: KarmicInfluence[];
    overallEnergy: string;
    purificationNeeded: boolean;
}

interface PuranicRemedy {
    purpose: string;
    rituals: string[];
    mantras: string[];
    timing: string;
}

interface PuranicAnalysis {
    id: string;
    latitude: number;
    longitude: number;
    elevation: number;
    bhumiTattva: BhumiTattva;
    panchamahabhutaBalance: PanchamahabhutaBalance;
    sacredGeography: SacredGeography;
    landClassification: LandClassification;
    karmicHistory: KarmicHistory;
    dharmicSuitabilityScore: number;
    puranicRemedies: PuranicRemedy[];
    vedicAgriculturePotential: any;
    geopathicStress: any;
    overallAssessment: string;
    scripturalReferences: string[];
    createdAt: string;
}

// Export singleton
export const puranicLandAnalyzer = new PuranicLandAnalyzer();
export default PuranicLandAnalyzer;

