import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Renovation cost estimates by region
const REGIONAL_MULTIPLIERS: Record<string, number> = {
    'CA': 1.35, 'NY': 1.40, 'TX': 0.90, 'FL': 0.95,
    'WA': 1.20, 'CO': 1.10, 'AZ': 0.92, 'default': 1.0
};

// ============================================
// GET RENOVATION ESTIMATE
// ============================================
router.post('/estimate', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid().optional(),
            squareFeet: z.number().positive(),
            state: z.string().length(2).optional(),
            renovationType: z.enum(['cosmetic', 'moderate', 'major', 'gut']),
            rooms: z.array(z.object({
                type: z.enum(['kitchen', 'bathroom', 'bedroom', 'living', 'basement', 'garage', 'outdoor']),
                scope: z.enum(['refresh', 'update', 'remodel', 'gut'])
            })).optional()
        }).parse(req.body);

        const estimate = calculateRenovationEstimate(data);

        res.json({
            estimate,
            breakdown: estimate.breakdown,
            timeline: getTimeline(data.renovationType),
            permits: getPermitRequirements(data.rooms || []),
            financing: getFinancingOptions(estimate.total),
            tips: getRenovationTips(data.renovationType)
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Renovation estimate error:', error);
        res.status(500).json({ error: 'Estimate failed' });
    }
});

function calculateRenovationEstimate(data: any): any {
    const multiplier = REGIONAL_MULTIPLIERS[data.state] || REGIONAL_MULTIPLIERS['default'];

    // Base costs per sqft by renovation type
    const baseCosts: Record<string, number> = {
        'cosmetic': 15,    // Paint, fixtures, minor updates
        'moderate': 75,    // Cosmetic + some structural, appliances
        'major': 150,      // Full room remodels
        'gut': 250         // Down to studs renovation
    };

    let baseCost = data.squareFeet * baseCosts[data.renovationType] * multiplier;
    const breakdown: any[] = [];

    // Room-specific costs
    if (data.rooms) {
        const roomCosts: Record<string, Record<string, number>> = {
            kitchen: { refresh: 5000, update: 15000, remodel: 40000, gut: 75000 },
            bathroom: { refresh: 2000, update: 8000, remodel: 20000, gut: 40000 },
            bedroom: { refresh: 1500, update: 4000, remodel: 10000, gut: 20000 },
            living: { refresh: 2000, update: 5000, remodel: 15000, gut: 30000 },
            basement: { refresh: 3000, update: 15000, remodel: 35000, gut: 60000 },
            garage: { refresh: 1000, update: 5000, remodel: 15000, gut: 25000 },
            outdoor: { refresh: 2000, update: 8000, remodel: 25000, gut: 50000 }
        };

        baseCost = 0; // Reset and calculate room by room
        for (const room of data.rooms) {
            const cost = (roomCosts[room.type]?.[room.scope] || 5000) * multiplier;
            baseCost += cost;
            breakdown.push({
                room: room.type,
                scope: room.scope,
                estimatedCost: Math.round(cost)
            });
        }
    }

    // Add contingency
    const contingency = baseCost * 0.15;
    const total = baseCost + contingency;

    return {
        lowEstimate: Math.round(total * 0.8),
        highEstimate: Math.round(total * 1.2),
        total: Math.round(total),
        baseCost: Math.round(baseCost),
        contingency: Math.round(contingency),
        breakdown
    };
}

function getTimeline(renovationType: string): any {
    const timelines: Record<string, any> = {
        'cosmetic': { duration: '1-2 weeks', phases: ['Prep', 'Paint/Finish', 'Cleanup'] },
        'moderate': { duration: '4-8 weeks', phases: ['Demo', 'Rough-in', 'Finishes', 'Inspection'] },
        'major': { duration: '3-6 months', phases: ['Design', 'Permits', 'Demo', 'Construction', 'Finishes', 'Inspection'] },
        'gut': { duration: '6-12 months', phases: ['Design/Permits', 'Demo', 'Structural', 'Rough-in', 'Drywall', 'Finishes', 'Final'] }
    };

    return timelines[renovationType] || timelines['moderate'];
}

function getPermitRequirements(rooms: any[]): any {
    const permits: string[] = [];

    if (rooms.some(r => r.scope === 'remodel' || r.scope === 'gut')) {
        permits.push('Building permit required');
    }
    if (rooms.some(r => r.type === 'kitchen' || r.type === 'bathroom')) {
        permits.push('Plumbing permit likely needed');
        permits.push('Electrical permit likely needed');
    }

    return {
        likely: permits.length > 0,
        permits: permits.length > 0 ? permits : ['Minor work may not require permits'],
        note: 'Verify with your local building department',
        estimatedPermitCost: permits.length > 0 ? '$500-2,000' : 'N/A'
    };
}

function getFinancingOptions(total: number): any[] {
    return [
        {
            type: 'Home Equity Loan',
            description: 'Fixed rate loan against home equity',
            rateRange: '7-9%',
            term: '5-30 years',
            bestFor: 'Large projects with predictable costs'
        },
        {
            type: 'HELOC',
            description: 'Revolving credit against home equity',
            rateRange: '8-10% variable',
            term: '10-20 years',
            bestFor: 'Projects with uncertain scope'
        },
        {
            type: 'Personal Loan',
            description: 'Unsecured loan, faster approval',
            rateRange: '6-15%',
            term: '2-7 years',
            bestFor: 'Smaller projects, renters'
        },
        {
            type: 'FHA 203(k)',
            description: 'Renovation costs rolled into mortgage',
            rateRange: 'Mortgage rates',
            term: '15-30 years',
            bestFor: 'Major renovations when buying'
        }
    ];
}

function getRenovationTips(type: string): string[] {
    const tips = [
        'Get at least 3 contractor quotes',
        'Check contractor licenses and insurance',
        'Always have a written contract',
        'Set aside 15-20% for unexpected costs'
    ];

    if (type === 'major' || type === 'gut') {
        tips.push('Consider temporary housing costs');
        tips.push('Hire an architect for major structural changes');
    }

    return tips;
}

// ============================================
// GET CONTRACTOR ESTIMATES
// ============================================
router.post('/contractors/quotes', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            zipCode: z.string(),
            projectType: z.string(),
            projectDescription: z.string(),
            timeline: z.enum(['asap', '1-3 months', '3-6 months', 'flexible'])
        }).parse(req.body);

        res.json({
            quoteRequestId: `quote_${Date.now()}`,
            status: 'Request submitted',
            estimatedResponses: '3-5 contractors within 48 hours',
            contractors: [
                {
                    name: 'Premier Renovations',
                    rating: 4.9,
                    reviews: 127,
                    yearsInBusiness: 15,
                    specialties: ['Kitchen', 'Bathroom', 'Whole Home']
                },
                {
                    name: 'Quality Home Builders',
                    rating: 4.7,
                    reviews: 89,
                    yearsInBusiness: 22,
                    specialties: ['Additions', 'Structural', 'Basements']
                },
                {
                    name: 'Modern Living Renovations',
                    rating: 4.8,
                    reviews: 56,
                    yearsInBusiness: 8,
                    specialties: ['Modern Design', 'Open Concept', 'Smart Home']
                }
            ],
            message: 'Contractors will contact you with detailed quotes'
        });
    } catch (error) {
        console.error('Quote request error:', error);
        res.status(500).json({ error: 'Failed to request quotes' });
    }
});

// ============================================
// ROI CALCULATOR
// ============================================
router.post('/roi', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            currentValue: z.number().positive(),
            renovationType: z.string(),
            renovationCost: z.number().positive()
        }).parse(req.body);

        // ROI multipliers by renovation type
        const roiMultipliers: Record<string, number> = {
            'kitchen-minor': 0.80,
            'kitchen-major': 0.60,
            'bathroom-minor': 0.70,
            'bathroom-addition': 0.55,
            'deck-addition': 0.75,
            'siding': 0.75,
            'roof': 0.60,
            'windows': 0.70,
            'basement-finish': 0.70,
            'garage-addition': 0.65
        };

        const recoupRate = roiMultipliers[data.renovationType] || 0.65;
        const valueAdded = data.renovationCost * recoupRate;
        const newValue = data.currentValue + valueAdded;
        const netCost = data.renovationCost - valueAdded;

        res.json({
            currentValue: data.currentValue,
            renovationCost: data.renovationCost,
            expectedRecoupRate: `${Math.round(recoupRate * 100)}%`,
            valueAdded: Math.round(valueAdded),
            estimatedNewValue: Math.round(newValue),
            netCost: Math.round(netCost),
            recommendation: recoupRate >= 0.70
                ? 'Good investment - high recoup rate'
                : recoupRate >= 0.55
                    ? 'Moderate ROI - consider if needed for livability'
                    : 'Low ROI - renovate for personal enjoyment, not resale'
        });
    } catch (error) {
        console.error('ROI error:', error);
        res.status(500).json({ error: 'Calculation failed' });
    }
});

export default router;
