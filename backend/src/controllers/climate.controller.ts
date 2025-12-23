import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ClimateService } from '../services/climate.service';
import { PropertyService } from '../services/property.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('api/v1/properties/:propertyId/climate')
@UseGuards(AuthGuard)
export class ClimateController {
    constructor(
        private climateService: ClimateService,
        private propertyService: PropertyService
    ) { }

    @Post('analyze')
    async analyzeProperty(
        @Param('propertyId') propertyId: string,
        @Body() body: any,
        @CurrentUser() user: any
    ) {
        // Verify property ownership
        await this.verifyPropertyOwnership(propertyId, user.user_id);

        // Run Climate analysis
        const analysis = await this.climateService.analyzeProperty(propertyId, {
            latitude: body.latitude,
            longitude: body.longitude,
            elevation: body.elevation,
            property_data: body.property_data
        });

        return {
            success: true,
            analysis_id: analysis.analysis_id,
            overall_risk_score: analysis.overall_risk_score,
            grade: analysis.grade,
            analyzed_at: analysis.analyzed_at,
            details_url: `/api/v1/properties/${propertyId}/climate/${analysis.analysis_id}`
        };
    }

    @Get()
    async getPropertyAnalyses(
        @Param('propertyId') propertyId: string,
        @CurrentUser() user: any
    ) {
        await this.verifyPropertyAccess(propertyId, user.user_id);

        const analyses = await this.climateService.getPropertyAnalyses(propertyId);

        return {
            property_id: propertyId,
            total_analyses: analyses.length,
            analyses: analyses.map(a => ({
                analysis_id: a.analysis_id,
                overall_risk_score: a.overall_risk_score,
                grade: a.grade,
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

        const analysis = await this.climateService.getAnalysis(analysisId);

        if (!analysis || analysis.property_id !== propertyId) {
            throw new Error('Analysis not found');
        }

        return analysis;
    }

    private async verifyPropertyOwnership(_propertyId: string, _userId: string) {
        // Mock verification
        return true;
    }

    private async verifyPropertyAccess(_propertyId: string, _userId: string) {
        // Mock verification
        return true;
    }
}
