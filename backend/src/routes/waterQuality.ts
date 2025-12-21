import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Water quality standards (mg/L or ppm unless noted)
const WATER_STANDARDS = {
    pH: { min: 6.5, max: 8.5, ideal: 7.0, unit: 'pH' },
    hardness: { safe: 120, moderate: 250, hard: 400, unit: 'mg/L CaCO3' },
    chlorine: { max: 4.0, ideal: 1.0, unit: 'mg/L' },
    lead: { max: 0.015, unit: 'mg/L' },
    nitrate: { max: 10, unit: 'mg/L' },
    arsenic: { max: 0.01, unit: 'mg/L' },
    fluoride: { max: 4.0, ideal: 0.7, unit: 'mg/L' },
    copper: { max: 1.3, unit: 'mg/L' },
    iron: { max: 0.3, unit: 'mg/L' },
    tds: { excellent: 50, good: 150, fair: 300, poor: 500, unit: 'mg/L' }
};

// ============================================
// ANALYZE WATER QUALITY
// ============================================
router.post('/analyze', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid().optional(),
            zipCode: z.string().optional(),
            waterSource: z.enum(['municipal', 'well', 'spring', 'unknown']).optional(),
            hasWaterSoftener: z.boolean().optional(),
            hasFilter: z.boolean().optional(),
            filterType: z.string().optional(),
            knownIssues: z.array(z.string()).optional()
        }).parse(req.body);

        // In production, would call EPA or local water utility APIs
        const waterData = generateWaterAnalysis(data);

        res.json({
            overallScore: waterData.score,
            grade: getWaterGrade(waterData.score),
            waterSource: data.waterSource || 'municipal',
            parameters: waterData.parameters,
            concerns: waterData.concerns,
            recommendations: waterData.recommendations,
            filterRecommendations: getFilterRecommendations(waterData),
            healthConsiderations: getHealthConsiderations(waterData),
            costEstimates: getCostEstimates(waterData)
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Water analysis error:', error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

function generateWaterAnalysis(data: any): any {
    // Simulated water quality data
    const isWell = data.waterSource === 'well';

    const parameters = {
        pH: {
            value: 7.0 + (Math.random() * 1.5 - 0.75),
            status: 'Normal',
            standard: WATER_STANDARDS.pH
        },
        hardness: {
            value: Math.round(50 + Math.random() * 300),
            status: 'Moderate',
            standard: WATER_STANDARDS.hardness
        },
        chlorine: {
            value: isWell ? 0 : (0.5 + Math.random() * 1.5),
            status: 'Safe',
            standard: WATER_STANDARDS.chlorine
        },
        lead: {
            value: Math.random() * 0.02,
            status: 'Check',
            standard: WATER_STANDARDS.lead
        },
        nitrate: {
            value: isWell ? (2 + Math.random() * 8) : (1 + Math.random() * 3),
            status: 'Normal',
            standard: WATER_STANDARDS.nitrate
        },
        tds: {
            value: Math.round(100 + Math.random() * 300),
            status: 'Acceptable',
            standard: WATER_STANDARDS.tds
        }
    };

    // Calculate overall score
    let score = 85;
    const concerns: string[] = [];

    if (parameters.lead.value > WATER_STANDARDS.lead.max) {
        score -= 25;
        concerns.push('Elevated lead levels detected');
    }
    if (parameters.hardness.value > WATER_STANDARDS.hardness.hard) {
        score -= 10;
        concerns.push('Very hard water - may affect appliances');
    }
    if (parameters.tds.value > WATER_STANDARDS.tds.poor) {
        score -= 15;
        concerns.push('High total dissolved solids');
    }

    // Add softener/filter benefits
    if (data.hasWaterSoftener) score += 5;
    if (data.hasFilter) score += 8;

    return {
        score: Math.max(0, Math.min(100, score)),
        parameters,
        concerns,
        recommendations: generateWaterRecommendations(parameters, data)
    };
}

function generateWaterRecommendations(params: any, data: any): string[] {
    const recs: string[] = [];

    if (params.hardness.value > WATER_STANDARDS.hardness.moderate && !data.hasWaterSoftener) {
        recs.push('Consider installing a water softener to extend appliance life');
    }

    if (params.lead.value > WATER_STANDARDS.lead.max * 0.5) {
        recs.push('Install a certified lead-removal filter on drinking water taps');
    }

    if (!data.hasFilter) {
        recs.push('Use a basic carbon filter for improved taste and odor');
    }

    if (data.waterSource === 'well') {
        recs.push('Test well water annually for bacteria and contaminants');
        recs.push('Consider UV sterilization for microbial safety');
    }

    return recs;
}

function getWaterGrade(score: number): string {
    if (score >= 90) return 'A (Excellent)';
    if (score >= 80) return 'B (Good)';
    if (score >= 70) return 'C (Acceptable)';
    if (score >= 60) return 'D (Needs Attention)';
    return 'F (Significant Issues)';
}

function getFilterRecommendations(waterData: any): any[] {
    return [
        {
            type: 'Reverse Osmosis',
            removes: ['Lead', 'Arsenic', 'Nitrates', 'Fluoride', 'TDS'],
            cost: '$200-500',
            maintenance: 'Filter replacements every 6-12 months',
            recommended: waterData.score < 75
        },
        {
            type: 'Activated Carbon',
            removes: ['Chlorine', 'Taste', 'Odor', 'Some chemicals'],
            cost: '$20-100',
            maintenance: 'Replace every 2-6 months',
            recommended: true
        },
        {
            type: 'Whole House Filter',
            removes: ['Sediment', 'Chlorine', 'Some contaminants'],
            cost: '$300-1000',
            maintenance: 'Annual filter changes',
            recommended: waterData.parameters.hardness.value > 200
        }
    ];
}

function getHealthConsiderations(waterData: any): any {
    return {
        drinkingWater: waterData.score >= 80 ? 'Safe for drinking as-is' : 'Recommend filtered water for drinking',
        cooking: 'Generally safe for cooking',
        bathing: 'Safe for bathing',
        sensitivePeople: waterData.concerns.length > 0
            ? 'Those with immune issues should use filtered water'
            : 'No special concerns'
    };
}

function getCostEstimates(waterData: any): any {
    return {
        testing: '$50-200 for comprehensive testing',
        basicFilter: '$20-100 annually',
        wholehouseSystem: '$300-1000 initial + $100/year maintenance',
        waterSoftener: '$500-2000 initial + $100/year salt'
    };
}

// ============================================
// GET WATER STANDARDS
// ============================================
router.get('/standards', (req: Request, res: Response) => {
    res.json({ standards: WATER_STANDARDS });
});

// ============================================
// CHECK WATER UTILITY REPORTS
// ============================================
router.get('/utility-report/:zipCode', async (req: Request, res: Response) => {
    try {
        const { zipCode } = req.params;

        // Simulated utility report
        res.json({
            zipCode,
            utilityName: 'Municipal Water Authority',
            lastTestDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            overallCompliance: 'Meets EPA Standards',
            violations: [],
            contaminantsFound: [
                'Chlorine (disinfectant)',
                'Fluoride (added for dental health)'
            ],
            annualReportUrl: 'https://example.com/water-report-2024.pdf'
        });
    } catch (error) {
        console.error('Utility report error:', error);
        res.status(500).json({ error: 'Failed to get report' });
    }
});

export default router;
