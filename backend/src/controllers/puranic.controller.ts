import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { PuranicService } from '../services/puranic.service';
import { PropertyService } from '../services/property.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('api/v1/properties/:propertyId/puranic')
@UseGuards(AuthGuard)
export class PuranicController {
    constructor(
        private puranicService: PuranicService,
        private propertyService: PropertyService
    ) { }

    @Post('analyze')
    async analyzeLand(
        @Param('propertyId') propertyId: string,
        @Body() body: any,
        @CurrentUser() user: any
    ) {
        // Verify property ownership or access rights
        await this.verifyPropertyAccess(propertyId, user.user_id);

        // Run Puranic analysis
        const analysis = await this.puranicService.analyzeLand(propertyId, {
            latitude: body.latitude,
            longitude: body.longitude,
            elevation: body.elevation,
            soil_data: body.soil_data
        });

        return {
            success: true,
            analysis_id: analysis.analysis_id,
            classification: analysis.classification,
            analyzed_at: analysis.analyzed_at,
            details_url: `/api/v1/properties/${propertyId}/puranic/${analysis.analysis_id}`
        };
    }

    @Get()
    async getPropertyAnalyses(
        @Param('propertyId') propertyId: string,
        @CurrentUser() user: any
    ) {
        await this.verifyPropertyAccess(propertyId, user.user_id);

        const analyses = await this.puranicService.getPropertyAnalyses(propertyId);

        return {
            property_id: propertyId,
            total_analyses: analyses.length,
            analyses: analyses.map(a => ({
                analysis_id: a.analysis_id,
                classification: a.classification,
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

        const analysis = await this.puranicService.getAnalysis(analysisId);

        if (!analysis || analysis.property_id !== propertyId) {
            throw new Error('Analysis not found');
        }

        return analysis;
    }

    private async verifyPropertyAccess(propertyId: string, userId: string) {
        // Mock verification
        return true;
    }
}

