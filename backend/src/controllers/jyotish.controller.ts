import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { JyotishService } from '../services/jyotish.service';
import { PropertyService } from '../services/property.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('api/v1/properties/:propertyId/jyotish')
@UseGuards(AuthGuard)
export class JyotishController {
    constructor(
        private jyotishService: JyotishService,
        private propertyService: PropertyService
    ) { }

    @Post('muhurat')
    async analyzeMuhurat(
        @Param('propertyId') propertyId: string,
        @Body() body: any,
        @CurrentUser() user: any
    ) {
        // Verify property ownership or access rights
        await this.verifyPropertyAccess(propertyId, user.user_id);

        // Run Jyotish analysis
        const analysis = await this.jyotishService.analyzeMuhurat(propertyId, {
            latitude: body.latitude,
            longitude: body.longitude,
            analysis_type: body.analysis_type || 'purchase',
            buyer_birth_data: body.buyer_birth_data
        });

        return {
            success: true,
            analysis_id: analysis.analysis_id,
            analysis_type: analysis.analysis_type,
            analyzed_at: analysis.analyzed_at,
            details_url: `/api/v1/properties/${propertyId}/jyotish/${analysis.analysis_id}`
        };
    }

    @Get()
    async getPropertyAnalyses(
        @Param('propertyId') propertyId: string,
        @CurrentUser() user: any
    ) {
        await this.verifyPropertyAccess(propertyId, user.user_id);

        const analyses = await this.jyotishService.getPropertyAnalyses(propertyId);

        return {
            property_id: propertyId,
            total_analyses: analyses.length,
            analyses: analyses.map(a => ({
                analysis_id: a.analysis_id,
                analysis_type: a.analysis_type,
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

        const analysis = await this.jyotishService.getAnalysis(analysisId);

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

