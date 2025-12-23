import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import axios from 'axios';

interface AyurvedicAnalysisOptions {
    temperature?: number;
    humidity?: number;
    wind_speed?: number;
    rainfall?: number;
    elevation?: number;
    open_floor_plan?: boolean;
    high_ceilings?: boolean;
    south_facing_windows?: number;
    has_fireplace?: boolean;
    basement?: boolean;
    thick_walls?: boolean;
    entrance_direction?: string;
    construction_material?: string;
    waterfront?: boolean;
    swimming_pool?: boolean;
}

@Injectable()
export class AyurvedicService {
    private ayurvedicApiUrl: string;

    constructor(private prisma: PrismaService) {
        this.ayurvedicApiUrl = process.env.AYURVEDIC_API_URL || 'http://localhost:8004';
    }

    async analyzeProperty(
        propertyId: string,
        options: AyurvedicAnalysisOptions
    ) {
        try {
            console.log(`Calling Ayurvedic API for property ${propertyId}...`);

            const response = await axios.post(
                `${this.ayurvedicApiUrl}/analyze`,
                options,
                { timeout: 60000 }
            );

            const analysisData = response.data;

            // Save to database
            const analysis = await this.prisma.ayurvedicAnalysis.create({
                data: {
                    analysis_id: `ayurvedic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    property_id: propertyId,
                    vata_score: analysisData.scores.Vata,
                    pitta_score: analysisData.scores.Pitta,
                    kapha_score: analysisData.scores.Kapha,
                    dominant_dosha: analysisData.prakriti.dominant_dosha,
                    prakriti_description: analysisData.prakriti.description,
                    imbalances: analysisData.vikriti.imbalances,
                    recommendations: analysisData.recommendations,
                    remedies: analysisData.remedies,
                    analyzed_at: new Date()
                }
            });

            console.log(`Ayurvedic analysis saved: ${analysis.analysis_id}`);
            return analysis;

        } catch (error) {
            console.error(`Ayurvedic analysis failed for ${propertyId}:`, error);
            if (axios.isAxiosError(error)) {
                throw new Error(`Ayurvedic API error: ${error.response?.data?.detail || error.message}`);
            }
            throw error;
        }
    }

    async getAnalysis(analysisId: string) {
        return this.prisma.ayurvedicAnalysis.findUnique({
            where: { analysis_id: analysisId }
        });
    }

    async getPropertyAnalyses(propertyId: string) {
        return this.prisma.ayurvedicAnalysis.findMany({
            where: { property_id: propertyId },
            orderBy: { analyzed_at: 'desc' }
        });
    }
}

