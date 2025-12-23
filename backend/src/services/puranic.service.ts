import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import axios from 'axios';

interface PuranicAnalysisOptions {
    latitude: number;
    longitude: number;
    elevation: number;
    soil_data?: any;
}

@Injectable()
export class PuranicService {
    private puranicApiUrl: string;

    constructor(private prisma: PrismaService) {
        this.puranicApiUrl = process.env.PURANIC_API_URL || 'http://localhost:8003';
    }

    async analyzeLand(
        propertyId: string,
        options: PuranicAnalysisOptions
    ) {
        try {
            // Call Puranic API
            console.log(`Calling Puranic API for property ${propertyId}...`);

            const response = await axios.post(
                `${this.puranicApiUrl}/analyze`,
                {
                    latitude: options.latitude,
                    longitude: options.longitude,
                    elevation: options.elevation,
                    soil_data: options.soil_data
                },
                {
                    timeout: 60000 // 60 second timeout
                }
            );

            const analysisData = response.data;

            // Save to database
            // Assuming PuranicAnalysis model exists in Prisma
            const analysis = await this.prisma.puranicAnalysis.create({
                data: {
                    analysis_id: `puranic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Mock ID generation if not provided by API
                    property_id: propertyId,
                    classification: analysisData.classification,
                    analyzed_at: new Date(),
                    bhumi_tattva: analysisData.bhumi_tattva,
                    elemental_balance: analysisData.elemental_balance,
                    sacred_geography: analysisData.sacred_geography,
                    karmic_history: analysisData.karmic_history,
                    dharmic_suitability: analysisData.dharmic_suitability,
                    overall_assessment: analysisData.overall_assessment
                }
            });

            console.log(`Puranic analysis saved: ${analysis.analysis_id}`);

            return analysis;

        } catch (error) {
            console.error(`Puranic analysis failed for ${propertyId}:`, error);

            if (axios.isAxiosError(error)) {
                throw new Error(`Puranic API error: ${error.response?.data?.detail || error.message}`);
            }

            throw error;
        }
    }

    async getAnalysis(analysisId: string) {
        return this.prisma.puranicAnalysis.findUnique({
            where: { analysis_id: analysisId }
        });
    }

    async getPropertyAnalyses(propertyId: string) {
        return this.prisma.puranicAnalysis.findMany({
            where: { property_id: propertyId },
            orderBy: { analyzed_at: 'desc' }
        });
    }
}

