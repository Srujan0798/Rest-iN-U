// Climate Analysis Service
import { prisma } from '../utils/prisma';
import { cacheGet, cacheSet, CACHE_KEYS, CACHE_TTL } from '../utils/redis';
import { logger } from '../utils/logger';

interface ClimateData {
    latitude: number;
    longitude: number;
    floodZone?: string;
    wildfireRisk?: number;
    hurricaneRisk?: number;
    tornadoRisk?: number;
    seismicRisk?: number;
    heatIslandEffect?: number;
    droughtRisk?: number;
    waterStressIndex?: number;
}

interface ClimateProjection {
    year: number;
    floodRisk: number;
    seaLevelRiseCm: number;
    extremeHeatDays: number;
    insuranceCost: number;
}

export class ClimateAnalysisService {

    /**
     * Analyze climate risks for a property
     */
    async analyzeProperty(propertyId: string, data: ClimateData): Promise<any> {
        const cacheKey = `${CACHE_KEYS.CLIMATE}${propertyId}`;

        // Calculate risk scores
        const floodRisk = this.calculateFloodRisk(data);
        const wildfireRisk = this.calculateWildfireRisk(data);
        const stormRisk = this.calculateStormRisk(data);
        const extremeWeatherRisk = this.calculateExtremeWeatherRisk(data);
        const seismicRisk = this.calculateSeismicRisk(data);

        // Calculate projections for future years
        const projections = this.calculateProjections(data);

        // Calculate insurance impact
        const insuranceAnalysis = this.calculateInsuranceImpact(floodRisk, wildfireRisk, stormRisk);

        // Overall risk score (weighted average)
        const overallRiskScore = Math.round(
            floodRisk.riskScore * 0.25 +
            wildfireRisk.riskScore * 0.2 +
            stormRisk.riskScore * 0.2 +
            extremeWeatherRisk.riskScore * 0.2 +
            seismicRisk.riskScore * 0.15
        );

        const riskGrade = this.calculateRiskGrade(overallRiskScore);

        // Generate mitigation strategies
        const mitigationStrategies = this.generateMitigationStrategies({
            flood: floodRisk,
            wildfire: wildfireRisk,
            storm: stormRisk,
            extremeWeather: extremeWeatherRisk,
            seismic: seismicRisk,
        });

        // Save to database
        const analysis = await prisma.climateAnalysis.upsert({
            where: { propertyId },
            create: {
                propertyId,
                overallRiskScore,
                riskGrade,
                currentFloodZone: data.floodZone,
                floodRisk2030: projections[0]?.floodRisk || 0,
                floodRisk2050: projections[2]?.floodRisk || 0,
                floodRisk2075: projections[4]?.floodRisk || 0,
                floodRisk2100: projections[6]?.floodRisk || 0,
                seaLevelRiseCm: projections.map(p => ({ year: p.year, cm: p.seaLevelRiseCm })),
                wildfireRisk: wildfireRisk.riskScore,
                fireHistoryWithin10Mi: 0,
                hurricaneRisk: stormRisk.hurricaneRisk,
                tornadoRisk: stormRisk.tornadoRisk,
                historicalStorms: 0,
                currentExtremeDays: extremeWeatherRisk.currentDays,
                projectedExtreme2050: extremeWeatherRisk.projected2050,
                heatIslandEffect: data.heatIslandEffect,
                droughtRisk: extremeWeatherRisk.droughtRisk,
                waterStressIndex: data.waterStressIndex,
                seismicRisk: seismicRisk.riskScore,
                insuranceCurrent: insuranceAnalysis.current,
                insurance2030: insuranceAnalysis.projected2030,
                insurance2050: insuranceAnalysis.projected2050,
                insurabilityStatus: insuranceAnalysis.status,
                mitigationStrategies,
                dataSources: ['FEMA', 'NOAA', 'EPA', 'USGS'],
            },
            update: {
                overallRiskScore,
                riskGrade,
                mitigationStrategies,
                analysisDate: new Date(),
            },
        });

        // Cache the result
        await cacheSet(cacheKey, analysis, CACHE_TTL.DAY);

        logger.info(`Climate analysis completed for property ${propertyId}`);

        return {
            ...analysis,
            projections,
            riskBreakdown: {
                flood: floodRisk,
                wildfire: wildfireRisk,
                storm: stormRisk,
                extremeWeather: extremeWeatherRisk,
                seismic: seismicRisk,
            },
            insuranceAnalysis,
        };
    }

    private calculateFloodRisk(data: ClimateData) {
        let riskScore = 20; // Base risk
        const factors: string[] = [];

        // FEMA flood zone analysis
        if (data.floodZone) {
            const zoneRisks: Record<string, number> = {
                'A': 80, 'AE': 75, 'AH': 70, 'AO': 70, 'AR': 65,
                'V': 90, 'VE': 85, // Coastal high hazard
                'B': 30, 'X500': 30, // Moderate risk
                'C': 10, 'X': 10, // Minimal risk
            };
            riskScore = zoneRisks[data.floodZone] || 50;
            factors.push(`FEMA Zone ${data.floodZone}`);
        }

        return {
            riskScore,
            category: this.getRiskCategory(riskScore),
            factors,
            historicalEvents: 0,
        };
    }

    private calculateWildfireRisk(data: ClimateData) {
        let riskScore = data.wildfireRisk || 20;
        const factors: string[] = [];

        // Regional adjustments (simplified)
        if (data.longitude && data.longitude < -100) {
            riskScore += 15; // Western US higher risk
            factors.push('Western US region');
        }

        return {
            riskScore: Math.min(100, riskScore),
            category: this.getRiskCategory(riskScore),
            factors,
            vegetationDensity: 'Moderate',
        };
    }

    private calculateStormRisk(data: ClimateData) {
        const hurricaneRisk = data.hurricaneRisk || 20;
        const tornadoRisk = data.tornadoRisk || 20;

        // Coastal proximity increases hurricane risk
        let adjustedHurricane = hurricaneRisk;
        if (data.latitude && data.latitude < 35 && data.longitude && data.longitude > -90) {
            adjustedHurricane += 20; // Gulf/Atlantic coast
        }

        return {
            riskScore: Math.round((adjustedHurricane + tornadoRisk) / 2),
            hurricaneRisk: Math.min(100, adjustedHurricane),
            tornadoRisk: Math.min(100, tornadoRisk),
            category: this.getRiskCategory((adjustedHurricane + tornadoRisk) / 2),
        };
    }

    private calculateExtremeWeatherRisk(data: ClimateData) {
        const droughtRisk = data.droughtRisk || 30;
        let currentDays = 15; // Base extreme heat days

        // Southern latitudes have more extreme heat
        if (data.latitude && data.latitude < 35) {
            currentDays += 20;
        }

        // Heat island effect
        if (data.heatIslandEffect) {
            currentDays += Math.round(data.heatIslandEffect * 10);
        }

        return {
            riskScore: Math.round((droughtRisk + (currentDays / 100) * 100) / 2),
            currentDays,
            projected2050: Math.round(currentDays * 1.5),
            droughtRisk,
            category: this.getRiskCategory(droughtRisk),
        };
    }

    private calculateSeismicRisk(data: ClimateData) {
        let riskScore = data.seismicRisk || 10;

        // West Coast higher seismic risk
        if (data.longitude && data.longitude < -115) {
            riskScore += 30;
        }

        return {
            riskScore: Math.min(100, riskScore),
            category: this.getRiskCategory(riskScore),
            nearestFaultMiles: null,
            liquefactionPotential: riskScore > 50 ? 'Moderate' : 'Low',
        };
    }

    private calculateProjections(data: ClimateData): ClimateProjection[] {
        const baseFloodRisk = this.calculateFloodRisk(data).riskScore;
        const years = [2030, 2040, 2050, 2060, 2075, 2085, 2100];

        return years.map((year, index) => {
            const yearsFromNow = year - 2024;
            const riskIncrease = yearsFromNow * 0.5; // 0.5% per year
            const seaLevelCm = Math.round(yearsFromNow * 0.3); // 3mm per year

            return {
                year,
                floodRisk: Math.min(100, Math.round(baseFloodRisk + riskIncrease)),
                seaLevelRiseCm: seaLevelCm,
                extremeHeatDays: 15 + Math.round(yearsFromNow * 0.5),
                insuranceCost: 2000 * Math.pow(1.03, yearsFromNow), // 3% annual increase
            };
        });
    }

    private calculateInsuranceImpact(flood: any, wildfire: any, storm: any) {
        const baseAnnual = 1500;
        const riskMultiplier = 1 + (flood.riskScore + wildfire.riskScore + storm.riskScore) / 300;

        const current = Math.round(baseAnnual * riskMultiplier);
        const projected2030 = Math.round(current * 1.25);
        const projected2050 = Math.round(current * 1.75);

        let status = 'Standard';
        if (flood.riskScore > 70 || wildfire.riskScore > 70) {
            status = 'High-risk coverage required';
        } else if (flood.riskScore > 50 || wildfire.riskScore > 50) {
            status = 'Specialized coverage recommended';
        }

        return { current, projected2030, projected2050, status };
    }

    private generateMitigationStrategies(risks: any) {
        const strategies: any[] = [];

        if (risks.flood.riskScore > 40) {
            strategies.push({
                type: 'flood',
                action: 'Elevate HVAC and electrical systems',
                cost: 5000,
                riskReduction: 15,
                priority: 'HIGH',
            });
            strategies.push({
                type: 'flood',
                action: 'Install flood barriers and sump pump',
                cost: 3000,
                riskReduction: 10,
                priority: 'MEDIUM',
            });
        }

        if (risks.wildfire.riskScore > 40) {
            strategies.push({
                type: 'wildfire',
                action: 'Create defensible space (clear vegetation)',
                cost: 2000,
                riskReduction: 20,
                priority: 'HIGH',
            });
            strategies.push({
                type: 'wildfire',
                action: 'Install ember-resistant vents',
                cost: 1500,
                riskReduction: 10,
                priority: 'MEDIUM',
            });
        }

        if (risks.seismic.riskScore > 30) {
            strategies.push({
                type: 'seismic',
                action: 'Secure water heater and heavy furniture',
                cost: 500,
                riskReduction: 5,
                priority: 'MEDIUM',
            });
            strategies.push({
                type: 'seismic',
                action: 'Foundation bolting',
                cost: 4000,
                riskReduction: 25,
                priority: 'HIGH',
            });
        }

        if (risks.extremeWeather.riskScore > 50) {
            strategies.push({
                type: 'heat',
                action: 'Install reflective roofing',
                cost: 8000,
                riskReduction: 10,
                priority: 'MEDIUM',
            });
            strategies.push({
                type: 'heat',
                action: 'Plant shade trees',
                cost: 1000,
                riskReduction: 5,
                priority: 'LOW',
            });
        }

        return strategies;
    }

    private getRiskCategory(score: number): string {
        if (score < 20) return 'Very Low';
        if (score < 40) return 'Low';
        if (score < 60) return 'Moderate';
        if (score < 80) return 'High';
        return 'Very High';
    }

    private calculateRiskGrade(score: number): string {
        if (score < 20) return 'A';
        if (score < 35) return 'B';
        if (score < 50) return 'C';
        if (score < 65) return 'D';
        return 'F';
    }

    /**
     * Get climate analysis for a property
     */
    async getAnalysis(propertyId: string) {
        const cacheKey = `${CACHE_KEYS.CLIMATE}${propertyId}`;
        let analysis = await cacheGet(cacheKey);

        if (!analysis) {
            analysis = await prisma.climateAnalysis.findUnique({
                where: { propertyId },
            });

            if (analysis) {
                await cacheSet(cacheKey, analysis, CACHE_TTL.DAY);
            }
        }

        return analysis;
    }
}

export const climateAnalysisService = new ClimateAnalysisService();
