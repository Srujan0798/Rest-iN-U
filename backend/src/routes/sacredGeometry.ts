import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// SACRED GEOMETRY ANALYSIS
// ============================================
const SACRED_RATIOS = {
    goldenRatio: {
        value: 1.618,
        name: 'Golden Ratio (Phi)',
        description: 'Found in nature, art, and architecture. Creates visual harmony.',
        examples: ['Parthenon', 'Great Pyramid', 'Spiral galaxies']
    },
    squareRoot2: {
        value: 1.414,
        name: 'Silver Ratio (√2)',
        description: 'Used in A-series paper. Creates dynamic rectangles.',
        examples: ['Japanese tatami mats', 'Islamic architecture']
    },
    squareRoot3: {
        value: 1.732,
        name: 'Bronze Ratio (√3)',
        description: 'Foundation of hexagonal geometry.',
        examples: ['Bee honeycombs', 'Flower of Life']
    },
    pi: {
        value: 3.14159,
        name: 'Pi (π)',
        description: 'Circle constant. Creates sacred circular spaces.',
        examples: ['Stonehenge', 'Roman Pantheon dome']
    }
};

const SACRED_SHAPES = {
    vesicaPiscis: {
        name: 'Vesica Piscis',
        description: 'Two overlapping circles. Represents duality and creation.',
        energy: 'Creative, generative',
        idealFor: ['Art studios', 'Meditation rooms']
    },
    flowerOfLife: {
        name: 'Flower of Life',
        description: '19 overlapping circles. Blueprint of creation.',
        energy: 'Universal harmony',
        idealFor: ['Healing spaces', 'Gardens']
    },
    sriYantra: {
        name: 'Sri Yantra',
        description: '9 interlocking triangles. Most powerful yantra.',
        energy: 'Prosperity, spiritual growth',
        idealFor: ['Puja rooms', 'Meditation areas']
    },
    metatronsCube: {
        name: "Metatron's Cube",
        description: 'All 5 Platonic solids. Sacred protective geometry.',
        energy: 'Protection, balance',
        idealFor: ['Entrances', 'Children rooms']
    }
};

router.post('/analyze', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            length: z.number().positive(),
            width: z.number().positive(),
            height: z.number().positive().optional(),
            rooms: z.array(z.object({
                name: z.string(),
                length: z.number(),
                width: z.number()
            })).optional()
        }).parse(req.body);

        const mainRatio = data.length / data.width;
        const ratioAnalysis = analyzeRatios(mainRatio, data);
        const alignmentScore = calculateAlignmentScore(ratioAnalysis);

        res.json({
            dimensions: { length: data.length, width: data.width, height: data.height },
            mainRatio: mainRatio.toFixed(3),
            sacredGeometryScore: alignmentScore,
            grade: getGrade(alignmentScore),
            ratioAnalysis,
            closestSacredRatio: findClosestSacredRatio(mainRatio),
            roomAnalysis: data.rooms?.map(analyzeRoom),
            recommendations: generateGeometryRecommendations(ratioAnalysis, alignmentScore),
            suggestedPlacements: getSuggestedPlacements(alignmentScore)
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Sacred geometry error:', error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

function analyzeRatios(ratio: number, data: any): any {
    const analysis: any = {};

    for (const [key, sacred] of Object.entries(SACRED_RATIOS)) {
        const deviation = Math.abs(ratio - sacred.value) / sacred.value * 100;
        analysis[key] = {
            name: sacred.name,
            sacredValue: sacred.value,
            propertyRatio: ratio.toFixed(3),
            deviationPercent: deviation.toFixed(1),
            alignment: deviation < 5 ? 'Excellent' : deviation < 15 ? 'Good' : deviation < 30 ? 'Fair' : 'Poor'
        };
    }

    return analysis;
}

function calculateAlignmentScore(ratioAnalysis: any): number {
    // Find the best alignment
    let bestDeviation = 100;

    for (const analysis of Object.values(ratioAnalysis) as any[]) {
        const dev = parseFloat(analysis.deviationPercent);
        if (dev < bestDeviation) {
            bestDeviation = dev;
        }
    }

    // Score based on deviation (lower = better)
    return Math.max(0, Math.min(100, 100 - bestDeviation * 2));
}

function findClosestSacredRatio(ratio: number): any {
    let closest = { key: '', deviation: Infinity, ...SACRED_RATIOS.goldenRatio };

    for (const [key, sacred] of Object.entries(SACRED_RATIOS)) {
        const deviation = Math.abs(ratio - sacred.value);
        if (deviation < closest.deviation) {
            closest = { key, deviation, ...sacred };
        }
    }

    return closest;
}

function analyzeRoom(room: any): any {
    const ratio = room.length / room.width;
    const closest = findClosestSacredRatio(ratio);
    const deviation = Math.abs(ratio - closest.value) / closest.value * 100;

    return {
        name: room.name,
        ratio: ratio.toFixed(3),
        closestSacredRatio: closest.name,
        alignment: deviation < 10 ? 'Sacred' : deviation < 25 ? 'Good' : 'Adjust'
    };
}

function generateGeometryRecommendations(analysis: any, score: number): string[] {
    const recs: string[] = [];

    if (score < 60) {
        recs.push('Consider adding sacred geometry art to enhance the space');
        recs.push('Use circular or golden ratio elements in decor');
    }

    if (score >= 80) {
        recs.push('Excellent sacred proportions! Maintain the current layout.');
    }

    recs.push('Place a Flower of Life symbol near the entrance for protection');
    recs.push('Use golden ratio spirals in garden design');

    return recs;
}

function getSuggestedPlacements(score: number): any[] {
    return Object.entries(SACRED_SHAPES).map(([key, shape]) => ({
        id: key,
        ...shape,
        recommended: score < 70
    }));
}

function getGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
}

// ============================================
// GET SACRED RATIOS
// ============================================
router.get('/ratios', (req: Request, res: Response) => {
    res.json({ ratios: SACRED_RATIOS });
});

// ============================================
// GET SACRED SHAPES
// ============================================
router.get('/shapes', (req: Request, res: Response) => {
    res.json({ shapes: SACRED_SHAPES });
});

// ============================================
// FIBONACCI ROOM GENERATOR
// ============================================
router.post('/generate-room', async (req: Request, res: Response) => {
    try {
        const { baseSize, targetArea } = z.object({
            baseSize: z.number().positive(),
            targetArea: z.number().positive()
        }).parse(req.body);

        // Generate Fibonacci-based dimensions
        const phi = 1.618;
        const width = baseSize;
        const length = baseSize * phi;
        const actualArea = width * length;

        // Scale to target if needed
        const scaleFactor = Math.sqrt(targetArea / actualArea);
        const finalWidth = width * scaleFactor;
        const finalLength = length * scaleFactor;

        res.json({
            dimensions: {
                width: Math.round(finalWidth * 10) / 10,
                length: Math.round(finalLength * 10) / 10,
                area: Math.round(finalWidth * finalLength)
            },
            ratio: phi,
            ratioName: 'Golden Ratio',
            benefits: [
                'Naturally pleasing proportions',
                'Optimal energy flow',
                'Harmonious living space'
            ]
        });
    } catch (error) {
        console.error('Generate room error:', error);
        res.status(500).json({ error: 'Generation failed' });
    }
});

export default router;

