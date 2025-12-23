import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { AyurvedicService } from '../services/ayurvedic.service';
import { PropertyService } from '../services/property.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('api/v1/properties/:propertyId/ayurveda')
@UseGuards(AuthGuard)
export class AyurvedicController {
    constructor(
        private ayurvedicService: AyurvedicService,
        private propertyService: PropertyService
    ) { }

    @Post('analyze')
    async analyzeProperty(
        @Param('propertyId') propertyId: string,
        @Body() body: any,
        @CurrentUser() user: any
    ) {
        // Verify property ownership or access rights
        await this.verifyPropertyAccess(propertyId, user.user_id);

        // Run Ayurvedic analysis
        const analysis = await this.ayurvedicService.analyzeProperty(propertyId, body);

        return {
            success: true,
            analysis_id: analysis.analysis_id,
            dominant_dosha: analysis.dominant_dosha,
            analyzed_at: analysis.analyzed_at,
            details_url: `/api/v1/properties/${propertyId}/ayurveda/${analysis.analysis_id}`
        };
    }

    @Get()
    async getPropertyAnalyses(
        @Param('propertyId') propertyId: string,
        @CurrentUser() user: any
    ) {
        await this.verifyPropertyAccess(propertyId, user.user_id);

        const analyses = await this.ayurvedicService.getPropertyAnalyses(propertyId);

        return {
            property_id: propertyId,
            total_analyses: analyses.length,
            analyses: analyses.map(a => ({
                analysis_id: a.analysis_id,
                dominant_dosha: a.dominant_dosha,
                analyzed_at: a.analyzed_at
            }))
        };
    }

    @Get(':analysisId')
    async getAnalysisDetails(
        @Param('propertyId') propertyId: string,
        @Param('analysisId') analysisId: string,
        @CurrentUser() user: any
    ) {
        await this.verifyPropertyAccess(propertyId, user.user_id);

        const analysis = await this.ayurvedicService.getAnalysis(analysisId);

        if (!analysis || analysis.property_id !== propertyId) {
            throw new Error('Analysis not found');
        }

        return analysis;
    }

    private async verifyPropertyAccess(_propertyId: string, _userId: string) {
        // Mock verification
        return true;
    }
}

