import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';

interface VastuAnalysisOptions {
    floor_plan_path: string;
    orientation: string;
    property_type: string;
    user_birth_date?: string;
    include_certificate?: boolean;
    language?: string;
}

@Injectable()
export class VastuService {
    private vastuApiUrl: string;
    private propertyIndexingQueue: any; // Mock queue

    constructor(private prisma: PrismaService) {
        this.vastuApiUrl = process.env.VASTU_API_URL || 'http://localhost:8001';
        // Initialize mock queue
        this.propertyIndexingQueue = {
            add: async (jobName: string, data: any) => {
                console.log(`Mock adding job ${jobName} to queue`, data);
            }
        };
    }

    async analyzeProperty(
        propertyId: string,
        options: VastuAnalysisOptions
    ) {
        try {
            // Create form data
            const formData = new FormData();

            // Add floor plan file
            const fileStream = fs.createReadStream(options.floor_plan_path);
            formData.append('floor_plan', fileStream);

            // Add other parameters
            formData.append('property_id', propertyId);
            formData.append('orientation', options.orientation);
            formData.append('property_type', options.property_type);

            if (options.user_birth_date) {
                formData.append('user_birth_date', options.user_birth_date);
            }

            formData.append('include_certificate', options.include_certificate ? 'true' : 'false');
            formData.append('language', options.language || 'en');

            // Call Vastu API
            console.log(`Calling Vastu API for property ${propertyId}...`);

            const response = await axios.post(
                `${this.vastuApiUrl}/api/v1/vastu/analyze`,
                formData,
                {
                    headers: formData.getHeaders(),
                    timeout: 60000, // 60 second timeout
                    maxContentLength: 15 * 1024 * 1024 // 15MB
                }
            );

            const analysisData = response.data;

            // Save to database
            const analysis = await this.prisma.vastuAnalysis.create({
                data: {
                    analysis_id: analysisData.analysis_id,
                    property_id: propertyId,
                    score: analysisData.score,
                    grade: analysisData.grade,
                    analyzed_at: new Date(analysisData.analyzed_at),
                    issues: analysisData.issues,
                    // detailed_analysis: analysisData.detailed_analysis, // Assuming schema supports this
                    // rooms_detected: analysisData.rooms_detected,
                    // entrance: analysisData.entrance,
                    // zones: analysisData.zones,
                    certificate_url: analysisData.certificate_url,
                    blockchain_tx: analysisData.blockchain_tx,
                    // personalized_analysis: analysisData.personalized_analysis
                }
            });

            console.log(`Vastu analysis saved: ${analysis.analysis_id}`);

            // Trigger property reindex (to update Vastu score in search)
            await this.triggerPropertyReindex(propertyId);

            return analysis;

        } catch (error) {
            console.error(`Vastu analysis failed for ${propertyId}:`, error);

            if (axios.isAxiosError(error)) {
                throw new Error(`Vastu API error: ${error.response?.data?.detail || error.message}`);
            }

            throw error;
        }
    }

    async getAnalysis(analysisId: string) {
        return this.prisma.vastuAnalysis.findUnique({
            where: { analysis_id: analysisId }
        });
    }

    async getPropertyAnalyses(propertyId: string) {
        return this.prisma.vastuAnalysis.findMany({
            where: { property_id: propertyId },
            orderBy: { analyzed_at: 'desc' }
        });
    }

    async getLatestAnalysis(propertyId: string) {
        return this.prisma.vastuAnalysis.findFirst({
            where: { property_id: propertyId },
            orderBy: { analyzed_at: 'desc' }
        });
    }

    async downloadVisualization(analysisId: string): Promise<Buffer> {
        const response = await axios.get(
            `${this.vastuApiUrl}/api/v1/vastu/visualization/${analysisId}`,
            { responseType: 'arraybuffer' }
        );

        return Buffer.from(response.data);
    }

    async downloadCertificate(analysisId: string): Promise<Buffer> {
        const response = await axios.get(
            `${this.vastuApiUrl}/api/v1/vastu/certificate/${analysisId}`,
            { responseType: 'arraybuffer' }
        );

        return Buffer.from(response.data);
    }

    async getVastuRules(category?: string) {
        const response = await axios.get(
            `${this.vastuApiUrl}/api/v1/vastu/rules`,
            { params: { category } }
        );

        return response.data;
    }

    private async triggerPropertyReindex(propertyId: string) {
        // Trigger Elasticsearch reindex for this property
        await this.propertyIndexingQueue.add('index-property', {
            propertyId,
            action: 'update'
        });
    }
}

