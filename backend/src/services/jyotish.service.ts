import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import axios from 'axios';

interface JyotishAnalysisOptions {
    latitude: number;
    longitude: number;
    analysis_type: string;
    buyer_birth_data?: any;
}

@Injectable()
export class JyotishService {
    private jyotishApiUrl: string;

    constructor(private prisma: PrismaService) {
        this.jyotishApiUrl = process.env.JYOTISH_API_URL || 'http://localhost:8002';
    }

    async analyzeMuhurat(
        propertyId: string,
        options: JyotishAnalysisOptions
    ) {
        try {
            // Call Jyotish API
            console.log(`Calling Jyotish API for property ${propertyId}...`);

            const response = await axios.post(
                `${this.jyotishApiUrl}/api/v1/jyotish/muhurat`,
                {
                    property_id: propertyId,
                    latitude: options.latitude,
                    longitude: options.longitude,
                    analysis_type: options.analysis_type,
                    buyer_birth_data: options.buyer_birth_data
                },
                {
                    timeout: 60000 // 60 second timeout
                }
            );

            const analysisData = response.data;

            // Save to database
            // Assuming JyotishAnalysis model exists in Prisma
            const analysis = await this.prisma.jyotishAnalysis.create({
                data: {
                    analysis_id: analysisData.analysis_id,
                    property_id: propertyId,
                    analysis_type: analysisData.analysis_type,
                    analyzed_at: new Date(analysisData.analyzed_at),
                    best_muhurats: analysisData.best_muhurats,
                    avoid_dates: analysisData.avoid_dates,
                    general_guidance: analysisData.general_guidance
                }
            });

            console.log(`Jyotish analysis saved: ${analysis.analysis_id}`);

            return analysis;

        } catch (error) {
            console.error(`Jyotish analysis failed for ${propertyId}:`, error);

            if (axios.isAxiosError(error)) {
                throw new Error(`Jyotish API error: ${error.response?.data?.detail || error.message}`);
            }

            throw error;
        }
    }

    async getAnalysis(analysisId: string) {
        return this.prisma.jyotishAnalysis.findUnique({
            where: { analysis_id: analysisId }
        });
    }

    async getPropertyAnalyses(propertyId: string) {
        return this.prisma.jyotishAnalysis.findMany({
            where: { property_id: propertyId },
            orderBy: { analyzed_at: 'desc' }
        });
    }
}

