import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Noise level reference (dB)
const NOISE_LEVELS = {
    whisper: 30,
    library: 40,
    normalConversation: 60,
    busyTraffic: 70,
    lawnMower: 90,
    concert: 110,
    jetEngine: 130
};

// Noise sources and typical dB
const NOISE_SOURCES = {
    highway: {
        name: 'Highway/Interstate',
        typicalDb: 75,
        distanceDecay: 6, // dB reduction per doubling of distance
        impactRadius: 500
    },
    airport: {
        name: 'Airport',
        typicalDb: 90,
        distanceDecay: 6,
        impactRadius: 5000
    },
    railway: {
        name: 'Railway',
        typicalDb: 80,
        distanceDecay: 6,
        impactRadius: 300
    },
    commercialArea: {
        name: 'Commercial/Retail Area',
        typicalDb: 65,
        distanceDecay: 6,
        impactRadius: 200
    },
    industrial: {
        name: 'Industrial Zone',
        typicalDb: 85,
        distanceDecay: 6,
        impactRadius: 1000
    },
    school: {
        name: 'School',
        typicalDb: 70,
        distanceDecay: 6,
        impactRadius: 100,
        intermittent: true
    },
    bar: {
        name: 'Bar/Nightclub',
        typicalDb: 85,
        distanceDecay: 6,
        impactRadius: 150,
        nighttimeOnly: true
    }
};

// ============================================
// ANALYZE PROPERTY NOISE
// ============================================
router.post('/analyze', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid().optional(),
            lat: z.number().optional(),
            lng: z.number().optional(),
            nearbySources: z.array(z.object({
                type: z.string(),
                distanceMeters: z.number(),
                direction: z.enum(['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']).optional()
            })),
            hasDoubleGlazing: z.boolean().optional(),
            hasNoiseBarrier: z.boolean().optional()
        }).parse(req.body);

        const noiseAnalysis = analyzeNoise(data.nearbySources, data.hasDoubleGlazing, data.hasNoiseBarrier);

        res.json({
            noiseScore: noiseAnalysis.score,
            grade: getNoiseGrade(noiseAnalysis.score),
            estimatedOutdoorDb: noiseAnalysis.outdoorDb,
            estimatedIndoorDb: noiseAnalysis.indoorDb,
            peakNoiseTime: noiseAnalysis.peakTime,
            quietestTime: noiseAnalysis.quietestTime,
            sourceAnalysis: noiseAnalysis.sources,
            healthImpact: getHealthImpact(noiseAnalysis.indoorDb),
            recommendations: generateNoiseRecommendations(noiseAnalysis),
            propertyValueImpact: getValueImpact(noiseAnalysis.score)
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Noise analysis error:', error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

function analyzeNoise(sources: any[], hasDoubleGlazing?: boolean, hasNoiseBarrier?: boolean): any {
    let maxOutdoorDb = 35; // Base ambient
    const sourceDetails: any[] = [];
    let hasNighttimeNoise = false;

    for (const source of sources) {
        const sourceInfo = NOISE_SOURCES[source.type as keyof typeof NOISE_SOURCES];
        if (!sourceInfo) continue;

        // Calculate noise at property using inverse square law
        const distanceRatio = Math.log2(source.distanceMeters / 10); // Reference at 10m
        const attenuation = sourceInfo.distanceDecay * distanceRatio;
        const dbAtProperty = Math.max(30, sourceInfo.typicalDb - attenuation);

        if (dbAtProperty > maxOutdoorDb) {
            maxOutdoorDb = dbAtProperty;
        }

        if ((sourceInfo as any).nighttimeOnly) {
            hasNighttimeNoise = true;
        }

        sourceDetails.push({
            type: source.type,
            name: sourceInfo.name,
            distance: source.distanceMeters,
            direction: source.direction,
            estimatedDb: Math.round(dbAtProperty),
            impact: dbAtProperty > 65 ? 'High' : dbAtProperty > 50 ? 'Moderate' : 'Low'
        });
    }

    // Indoor noise reduction
    let indoorDb = maxOutdoorDb;
    indoorDb -= 15; // Standard single glazing
    if (hasDoubleGlazing) indoorDb -= 10;
    if (hasNoiseBarrier) indoorDb -= 8;
    indoorDb = Math.max(25, indoorDb);

    // Score calculation (lower noise = higher score)
    const score = Math.max(0, Math.min(100, 120 - maxOutdoorDb));

    return {
        score,
        outdoorDb: Math.round(maxOutdoorDb),
        indoorDb: Math.round(indoorDb),
        sources: sourceDetails,
        peakTime: hasNighttimeNoise ? 'Nighttime (10pm-2am)' : 'Daytime (7am-7pm)',
        quietestTime: hasNighttimeNoise ? 'Early morning (4am-6am)' : 'Nighttime (10pm-6am)'
    };
}

function getNoiseGrade(score: number): string {
    if (score >= 80) return 'A (Very Quiet)';
    if (score >= 65) return 'B (Quiet)';
    if (score >= 50) return 'C (Moderate)';
    if (score >= 35) return 'D (Noisy)';
    return 'F (Very Noisy)';
}

function getHealthImpact(indoorDb: number): any {
    if (indoorDb <= 35) {
        return {
            level: 'Minimal',
            sleepQuality: 'Excellent',
            stressImpact: 'None',
            description: 'Ideal quiet environment for health and wellbeing'
        };
    }
    if (indoorDb <= 45) {
        return {
            level: 'Low',
            sleepQuality: 'Good',
            stressImpact: 'Negligible',
            description: 'Acceptable noise levels for most activities'
        };
    }
    if (indoorDb <= 55) {
        return {
            level: 'Moderate',
            sleepQuality: 'May be affected',
            stressImpact: 'Possible elevation',
            description: 'Sleep disturbance possible, consider noise reduction'
        };
    }
    return {
        level: 'High',
        sleepQuality: 'Likely impaired',
        stressImpact: 'Elevated',
        description: 'Noise reduction strongly recommended for health'
    };
}

function generateNoiseRecommendations(analysis: any): string[] {
    const recs: string[] = [];

    if (analysis.outdoorDb > 65) {
        recs.push('Install double or triple-glazed windows');
        recs.push('Consider acoustic fencing or barriers');
        recs.push('Plant dense hedges or trees as natural sound barriers');
    }

    if (analysis.indoorDb > 45) {
        recs.push('Use heavy curtains to absorb sound');
        recs.push('Add rugs and soft furnishings');
        recs.push('Consider white noise machines for sleeping');
    }

    if (analysis.sources.some((s: any) => s.impact === 'High')) {
        recs.push('Position bedrooms away from noise sources');
        recs.push('Use solid-core interior doors');
    }

    recs.push('Seal gaps around windows and doors');

    return recs;
}

function getValueImpact(score: number): any {
    if (score < 40) {
        return {
            impact: 'Significant negative',
            estimatedPercent: '-5% to -15%',
            description: 'High noise levels typically reduce property values'
        };
    }
    if (score < 60) {
        return {
            impact: 'Moderate negative',
            estimatedPercent: '-2% to -5%',
            description: 'Some buyers may negotiate lower price'
        };
    }
    if (score >= 80) {
        return {
            impact: 'Positive',
            estimatedPercent: '+2% to +5%',
            description: 'Quiet neighborhoods command premium prices'
        };
    }
    return {
        impact: 'Neutral',
        estimatedPercent: '0%',
        description: 'Typical noise levels for the area'
    };
}

// ============================================
// GET NOISE SOURCE INFO
// ============================================
router.get('/sources', (req: Request, res: Response) => {
    res.json({ sources: NOISE_SOURCES, referenceLevels: NOISE_LEVELS });
});

// ============================================
// QUIET HOURS ANALYSIS
// ============================================
router.get('/quiet-hours/:propertyId', async (req: Request, res: Response) => {
    try {
        // In production, would analyze historical data or sensor readings
        res.json({
            propertyId: req.params.propertyId,
            weekday: {
                quietestPeriod: '11pm - 6am',
                busiestPeriod: '7am - 9am, 5pm - 7pm',
                averageDb: { day: 55, night: 40 }
            },
            weekend: {
                quietestPeriod: '2am - 8am',
                busiestPeriod: '11am - 6pm',
                averageDb: { day: 52, night: 42 }
            },
            recommendations: [
                'Best for home office work: 10am - 4pm weekdays',
                'Best for outdoor activities: Weekend mornings',
                'Sleep quality should be optimal throughout'
            ]
        });
    } catch (error) {
        console.error('Quiet hours error:', error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

export default router;

