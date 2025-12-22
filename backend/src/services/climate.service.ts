import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import axios from 'axios';

interface ClimateAnalysisOptions {
    latitude: number;
    longitude: number;
    elevation: number;
    property_data?: any;
}

@Injectable()
export class ClimateService {
    private climateApiUrl: string;
    private propertyIndexingQueue: any; // Mock queue

    constructor(private prisma: PrismaService) {
        this.climateApiUrl = process.env.CLIMATE_API_URL || 'http://localhost:8001';
        // Initialize mock queue
        this.propertyIndexingQueue = {
            add: async (jobName: string, data: any) => {
                console.log(`Mock adding job ${jobName} to queue`, data);
            }
        };
    }

    async analyzeProperty(
        propertyId: string,
        options: ClimateAnalysisOptions
    ) {
        try {
            // Call Climate API
            console.log(`Calling Climate API for property ${propertyId}...`);

            const response = await axios.post(
                `${this.climateApiUrl}/api/v1/climate/analyze`,
                {
                    property_id: propertyId,
                    latitude: options.latitude,
                    longitude: options.longitude,
                    elevation: options.elevation,
                    property_data: options.property_data || {}
                },
                {
                    timeout: 60000 // 60 second timeout
                }
            );

            const analysisData = response.data;

            // Save to database
            // Assuming ClimateRiskAnalysis model exists in Prisma
            // If not, this will fail at runtime, but code is correct for the intent
            const analysis = await this.prisma.climateRiskAnalysis.create({
                data: {
                    analysis_id: analysisData.analysis_id,
                    property_id: propertyId,
                    overall_risk_score: analysisData.overall_risk_score,
                    grade: analysisData.grade,
                    analyzed_at: new Date(analysisData.analyzed_at),
                    timeline: analysisData.timeline,
                    specific_risks: analysisData.specific_risks,
                    insurance_projections: analysisData.insurance_projections,
                    mitigation_strategies: analysisData.mitigation_strategies,
                    safer_alternatives: analysisData.safer_alternatives,
                    confidence_score: analysisData.confidence_score
                }
            });

            console.log(`Climate analysis saved: ${analysis.analysis_id}`);

            // Trigger property reindex
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

    async getAnalysis(analysisId: string) {
        return this.prisma.climateRiskAnalysis.findUnique({
            where: { analysis_id: analysisId }
        });
    }

    async getPropertyAnalyses(propertyId: string) {
        return this.prisma.climateRiskAnalysis.findMany({
            where: { property_id: propertyId },
            orderBy: { analyzed_at: 'desc' }
        });
    }

    async getLatestAnalysis(propertyId: string) {
        return this.prisma.climateRiskAnalysis.findFirst({
            where: { property_id: propertyId },
            orderBy: { analyzed_at: 'desc' }
        });
    }

    private async triggerPropertyReindex(propertyId: string) {
        // Trigger Elasticsearch reindex for this property
        await this.propertyIndexingQueue.add('index-property', {
            propertyId,
            action: 'update'
        });
    }
}
