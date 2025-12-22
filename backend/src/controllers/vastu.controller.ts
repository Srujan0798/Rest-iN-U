import { Controller, Post, Get, Param, Body, UploadedFile, UseInterceptors, UseGuards, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { VastuService } from '../services/vastu.service';
import { PropertyService } from '../services/property.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Controller('api/v1/properties/:propertyId/vastu')
@UseGuards(AuthGuard)
export class VastuController {
    constructor(
        private vastuService: VastuService,
        private propertyService: PropertyService
    ) { }

    @Post('analyze')
    @UseInterceptors(FileInterceptor('floor_plan', {
        storage: diskStorage({
            destination: '/tmp/floor-plans',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, `floor-plan-${uniqueSuffix}${path.extname(file.originalname)}`);
            }
        }),
        limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/image\/(jpeg|jpg|png)|application\/pdf/)) {
                return cb(new Error('Only images and PDFs are allowed'), false);
            }
            cb(null, true);
        }
    }))
    async analyzeProperty(
        @Param('propertyId') propertyId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
        @CurrentUser() user: any
    ) {
        // Verify property ownership
        await this.verifyPropertyOwnership(propertyId, user.user_id);

        // Run Vastu analysis
        const analysis = await this.vastuService.analyzeProperty(propertyId, {
            floor_plan_path: file.path,
            orientation: body.orientation || 'north',
            property_type: body.property_type || 'house',
            user_birth_date: body.user_birth_date,
            include_certificate: body.include_certificate !== 'false',
            language: body.language || 'en'
        });

        // Clean up uploaded file
        await fs.promises.unlink(file.path);

        return {
            success: true,
            analysis_id: analysis.analysis_id,
            score: analysis.score,
            grade: analysis.grade,
            analyzed_at: analysis.analyzed_at,
            visualization_url: `/api/v1/properties/${propertyId}/vastu/${analysis.analysis_id}/visualization`,
            certificate_url: `/api/v1/properties/${propertyId}/vastu/${analysis.analysis_id}/certificate`,
            details_url: `/api/v1/properties/${propertyId}/vastu/${analysis.analysis_id}`
        };
    }

    @Get()
    async getPropertyAnalyses(
        @Param('propertyId') propertyId: string,
        @CurrentUser() user: any
    ) {
        await this.verifyPropertyAccess(propertyId, user.user_id);

        const analyses = await this.vastuService.getPropertyAnalyses(propertyId);

        return {
            property_id: propertyId,
            total_analyses: analyses.length,
            analyses: analyses.map(a => ({
                analysis_id: a.analysis_id,
                score: a.score,
                grade: a.grade,
                analyzed_at: a.analyzed_at,
                issues_count: Array.isArray(a.issues) ? a.issues.length : 0
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

        const analysis = await this.vastuService.getAnalysis(analysisId);

        if (!analysis || analysis.property_id !== propertyId) {
            throw new Error('Analysis not found');
        }

        return analysis;
    }

    @Get(':analysisId/visualization')
    async getVisualization(
        @Param('propertyId') propertyId: string,
        @Param('analysisId') analysisId: string,
        @CurrentUser() user: any,
        @Res() res: Response
    ) {
        await this.verifyPropertyAccess(propertyId, user.user_id);

        const imageBuffer = await this.vastuService.downloadVisualization(analysisId);

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `inline; filename="vastu_${analysisId}.png"`);
        res.send(imageBuffer);
    }

    @Get(':analysisId/certificate')
    async getCertificate(
        @Param('propertyId') propertyId: string,
        @Param('analysisId') analysisId: string,
        @CurrentUser() user: any,
        @Res() res: Response
    ) {
        await this.verifyPropertyAccess(propertyId, user.user_id);

        const pdfBuffer = await this.vastuService.downloadCertificate(analysisId);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="vastu_certificate_${analysisId}.pdf"`);
        res.send(pdfBuffer);
    }

    private async verifyPropertyOwnership(propertyId: string, userId: string) {
        // Mock verification
        return true;
    }

    private async verifyPropertyAccess(propertyId: string, userId: string) {
        // Mock verification
        return true;
    }
}
