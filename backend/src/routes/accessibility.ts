import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ADA accessibility features
const ACCESSIBILITY_FEATURES = {
    mobility: [
        'Single-story or elevator access',
        'Wide doorways (32"+ clear)',
        'No-step entry',
        'Accessible bathroom',
        'Grab bars',
        'Roll-in shower',
        'Lowered counters',
        'Accessible parking'
    ],
    visual: [
        'Good lighting',
        'High contrast features',
        'Tactile indicators',
        'Audio doorbell',
        'Smart home voice control'
    ],
    hearing: [
        'Visual doorbell/alerts',
        'Vibrating alarms',
        'Open floor plan',
        'Video intercom'
    ]
};

// ============================================
// ACCESSIBILITY SCORE
// ============================================
router.get('/score/:propertyId', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;

        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        const assessment = assessAccessibility(property);

        res.json({
            propertyId,
            accessibilityScore: assessment.score,
            grade: assessment.grade,
            breakdown: assessment.breakdown,
            existingFeatures: assessment.existing,
            missingFeatures: assessment.missing,
            modifications: getModificationEstimates(assessment.missing),
            resources: getAccessibilityResources()
        });
    } catch (error) {
        console.error('Accessibility error:', error);
        res.status(500).json({ error: 'Assessment failed' });
    }
});

function assessAccessibility(property: any): any {
    let score = 50; // Base score
    const breakdown: any = {};
    const existing: string[] = [];
    const missing: string[] = [];

    // Property type assessment
    if (property.type === 'house' || property.type === 'single-family') {
        if (property.floors === 1 || !property.floors) {
            score += 20;
            breakdown.singleStory = { score: 95, note: 'Single-story - no stairs needed' };
            existing.push('Single-story layout');
        } else {
            breakdown.singleStory = { score: 40, note: 'Multi-story may require stair lift' };
            missing.push('Elevator or stair lift');
        }
    } else if (property.type === 'condo' || property.type === 'apartment') {
        score += 10; // Assume elevator access in most buildings
        breakdown.elevatorAccess = { score: 70, note: 'Likely has elevator access' };
        existing.push('Building elevator');
    }

    // Bathroom assessment (simulated)
    const hasAccessibleBath = Math.random() > 0.6;
    if (hasAccessibleBath) {
        score += 15;
        existing.push('Accessible bathroom features');
        breakdown.bathroom = { score: 80, note: 'Has some accessibility features' };
    } else {
        missing.push('Grab bars in bathroom');
        missing.push('Roll-in shower');
        breakdown.bathroom = { score: 40, note: 'May need modifications' };
    }

    // Entry assessment
    const hasNoStepEntry = Math.random() > 0.5;
    if (hasNoStepEntry) {
        score += 10;
        existing.push('No-step entry');
        breakdown.entry = { score: 90, note: 'Step-free entrance' };
    } else {
        missing.push('Ramp or no-step entry');
        breakdown.entry = { score: 30, note: 'Steps at entry may need ramp' };
    }

    // Doorway width (simulated)
    const hasWideDoors = property.yearBuilt && property.yearBuilt > 2000;
    if (hasWideDoors) {
        score += 10;
        existing.push('Wide doorways (likely 32"+)');
        breakdown.doorways = { score: 85, note: 'Modern construction typically has wider doors' };
    } else {
        missing.push('Wider doorways');
        breakdown.doorways = { score: 50, note: 'Older homes may have narrow doors' };
    }

    return {
        score: Math.min(100, score),
        grade: score >= 80 ? 'A (Highly Accessible)' :
            score >= 65 ? 'B (Good Accessibility)' :
                score >= 50 ? 'C (Some Modifications Needed)' :
                    'D (Significant Modifications Needed)',
        breakdown,
        existing,
        missing
    };
}

function getModificationEstimates(missing: string[]): any[] {
    const estimates: any[] = [];

    const costMap: Record<string, { low: number; high: number; time: string }> = {
        'Ramp or no-step entry': { low: 1000, high: 5000, time: '1-3 days' },
        'Grab bars in bathroom': { low: 100, high: 500, time: '1 day' },
        'Roll-in shower': { low: 5000, high: 15000, time: '1-2 weeks' },
        'Wider doorways': { low: 500, high: 2000, time: '1-2 days per door' },
        'Elevator or stair lift': { low: 5000, high: 25000, time: '1-2 weeks' }
    };

    for (const item of missing) {
        const cost = costMap[item];
        if (cost) {
            estimates.push({
                modification: item,
                costRange: `$${cost.low.toLocaleString()} - $${cost.high.toLocaleString()}`,
                timeline: cost.time,
                contractors: 'Certified accessibility contractor recommended'
            });
        }
    }

    return estimates;
}

function getAccessibilityResources(): any {
    return {
        grants: [
            { name: 'HUD Home Modification Grants', type: 'Federal' },
            { name: 'VA HISA Grant', type: 'Veterans', amount: 'Up to $6,800' },
            { name: 'State Medicaid Waiver Programs', type: 'State-specific' }
        ],
        organizations: [
            { name: 'Rebuilding Together', service: 'Free home modifications for qualifying individuals' },
            { name: 'AARP HomeFit Guide', service: 'Free guide for home accessibility' }
        ],
        certifications: [
            'CAPS (Certified Aging-in-Place Specialist)',
            'UDCP (Universal Design Certified Professional)'
        ]
    };
}

// ============================================
// ACCESSIBILITY SEARCH FILTER
// ============================================
router.post('/search', async (req: Request, res: Response) => {
    try {
        const filters = z.object({
            wheelchairAccessible: z.boolean().optional(),
            singleStory: z.boolean().optional(),
            elevatorAccess: z.boolean().optional(),
            minScore: z.number().min(0).max(100).optional(),
            city: z.string().optional()
        }).parse(req.body);

        // In production, would filter properties from database
        const properties = await prisma.property.findMany({
            where: {
                status: 'active',
                ...(filters.city && { city: filters.city }),
                ...(filters.singleStory && { floors: 1 })
            },
            take: 20,
            include: { photos: { take: 1 } }
        });

        // Add accessibility scores
        const withScores = properties.map(p => ({
            ...p,
            accessibilityScore: 50 + Math.floor(Math.random() * 40),
            accessibilityFeatures: ['Single-story', 'Wide doorways'].slice(0, Math.floor(Math.random() * 2) + 1)
        }));

        const filtered = filters.minScore
            ? withScores.filter(p => p.accessibilityScore >= (filters.minScore || 0))
            : withScores;

        res.json({
            total: filtered.length,
            properties: filtered,
            filters
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

// ============================================
// AGING IN PLACE ASSESSMENT
// ============================================
router.get('/aging-in-place/:propertyId', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;

        res.json({
            propertyId,
            agingInPlaceScore: 72,
            readiness: 'Moderate - Some modifications recommended',
            byArea: {
                entryways: { score: 80, notes: 'Good threshold clearance' },
                bathroom: { score: 60, notes: 'Consider grab bars and non-slip surfaces' },
                kitchen: { score: 70, notes: 'Counter heights are standard' },
                bedroom: { score: 85, notes: 'Ground floor bedroom available' },
                lighting: { score: 65, notes: 'Add more lighting in hallways' }
            },
            priorityModifications: [
                { item: 'Bathroom grab bars', urgency: 'High', cost: '$200-500' },
                { item: 'Motion sensor lights', urgency: 'Medium', cost: '$100-300' },
                { item: 'Lever door handles', urgency: 'Low', cost: '$20-50 per door' }
            ],
            longevityScore: 85,
            longevityNote: 'Property can accommodate aging residents with minor modifications'
        });
    } catch (error) {
        console.error('Aging assessment error:', error);
        res.status(500).json({ error: 'Assessment failed' });
    }
});

export default router;

