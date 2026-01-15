import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ClimateAnalysis } from '@prisma/client';
import axios from 'axios';

interface ClimateAnalysisOptions {
    latitude: number;
    longitude: number;
    elevation?: number;
    propertyData?: Record<string, unknown>;
}

interface ClimateApiResponse {
    overall_risk_score: number;
    grade: string;
    flood_risk?: { score: number; zone?: string; description?: string };
    fire_risk?: { score: number; zone?: string; vegetation_type?: string };
    earthquake_risk?: { score: number; zone?: string; fault_proximity?: number };
    hurricane_risk?: { score: number };
    tornado_risk?: { score: number };
    drought_risk?: { score: number };
    heat_risk?: { score: number };
    historical_events?: Array<{ type: string; date: string; severity: string }>;
    insurance_notes?: string[];
    premium_impact?: string;
    mitigations?: Array<{ risk: string; recommendation: string; cost: string; priority: string }>;
    data_sources?: string[];
}

@Injectable()
export class ClimateService {
    private climateApiUrl: string;
    private propertyIndexingQueue: { add: (jobName: string, data: unknown) => Promise<void> };

    constructor(private prisma: PrismaService) {
        this.climateApiUrl = process.env.CLIMATE_API_URL || 'http://localhost:8001';
        this.propertyIndexingQueue = {
            add: async (jobName: string, data: unknown) => {
                console.log(`Mock adding job ${jobName} to queue`, data);
            }
        };
    }

    async analyzeProperty(
        propertyId: string,
        options: ClimateAnalysisOptions
    ): Promise<ClimateAnalysis> {
        try {
            console.log(`Calling Climate API for property ${propertyId}...`);

            const response = await axios.post<ClimateApiResponse>(
                `${this.climateApiUrl}/api/v1/climate/analyze`,
                {
                    property_id: propertyId,
                    latitude: options.latitude,
                    longitude: options.longitude,
                    elevation: options.elevation || 0,
                    property_data: options.propertyData || {}
                },
                { timeout: 60000 }
            );

            const data = response.data;

            // Upsert to handle re-analysis
            const analysis = await this.prisma.climateAnalysis.upsert({
                where: { propertyId },
                update: {
                    overallRiskScore: data.overall_risk_score,
                    riskGrade: data.grade,
                    floodRiskScore: data.flood_risk?.score,
                    fireRiskScore: data.fire_risk?.score,
                    earthquakeRiskScore: data.earthquake_risk?.score,
                    hurricaneRiskScore: data.hurricane_risk?.score,
                    tornadoRiskScore: data.tornado_risk?.score,
                    droughtRiskScore: data.drought_risk?.score,
                    heatRiskScore: data.heat_risk?.score,
                    floodZone: data.flood_risk?.zone,
                    floodZoneDescription: data.flood_risk?.description,
                    fireZone: data.fire_risk?.zone,
                    vegetationType: data.fire_risk?.vegetation_type,
                    seismicZone: data.earthquake_risk?.zone,
                    faultProximity: data.earthquake_risk?.fault_proximity,
                    historicalEvents: data.historical_events,
                    insuranceNotes: data.insurance_notes || [],
                    estimatedPremiumImpact: data.premium_impact,
                    mitigations: data.mitigations,
                    dataSources: data.data_sources || [],
                    dataFreshness: new Date(),
                    analyzedAt: new Date()
                },
                create: {
                    propertyId,
                    overallRiskScore: data.overall_risk_score,
                    riskGrade: data.grade,
                    floodRiskScore: data.flood_risk?.score,
                    fireRiskScore: data.fire_risk?.score,
                    earthquakeRiskScore: data.earthquake_risk?.score,
                    hurricaneRiskScore: data.hurricane_risk?.score,
                    tornadoRiskScore: data.tornado_risk?.score,
                    droughtRiskScore: data.drought_risk?.score,
                    heatRiskScore: data.heat_risk?.score,
                    floodZone: data.flood_risk?.zone,
                    floodZoneDescription: data.flood_risk?.description,
                    fireZone: data.fire_risk?.zone,
                    vegetationType: data.fire_risk?.vegetation_type,
                    seismicZone: data.earthquake_risk?.zone,
                    faultProximity: data.earthquake_risk?.fault_proximity,
                    historicalEvents: data.historical_events,
                    insuranceNotes: data.insurance_notes || [],
                    estimatedPremiumImpact: data.premium_impact,
                    mitigations: data.mitigations,
                    dataSources: data.data_sources || [],
                    dataFreshness: new Date(),
                    analyzedAt: new Date()
                }
            });

            console.log(`Climate analysis saved for property ${propertyId}`);
            await this.triggerPropertyReindex(propertyId);

            return analysis;
        } catch (error) {
            console.error(`Climate analysis failed for ${propertyId}:`, error);

            if (axios.isAxiosError(error)) {
                throw new Error(`Climate API error: ${error.response?.data?.detail || error.message}`);
            }
            throw error;
        }
    }

    async getAnalysis(propertyId: string): Promise<ClimateAnalysis | null> {
        return this.prisma.climateAnalysis.findUnique({
            where: { propertyId }
        });
    }

    async getAnalysisWithProperty(propertyId: string) {
        return this.prisma.climateAnalysis.findUnique({
            where: { propertyId },
            include: { property: true }
        });
    }

    async deleteAnalysis(propertyId: string): Promise<void> {
        await this.prisma.climateAnalysis.delete({
            where: { propertyId }
        });
    }

    private async triggerPropertyReindex(propertyId: string): Promise<void> {
        await this.propertyIndexingQueue.add('index-property', {
            propertyId,
            action: 'update'
        });
    }
}

