import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// GET INSURANCE ESTIMATE
// ============================================
router.post('/estimate', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid().optional(),
            homeValue: z.number().positive(),
            squareFeet: z.number().positive(),
            yearBuilt: z.number(),
            roofAge: z.number().optional(),
            constructionType: z.enum(['frame', 'masonry', 'steel', 'mixed']).optional(),
            stories: z.number().min(1).max(5).optional(),
            hasPool: z.boolean().optional(),
            hasTrampoline: z.boolean().optional(),
            dogBreed: z.string().optional(),
            securitySystem: z.boolean().optional(),
            smokeDetectors: z.boolean().optional(),
            fireHydrantDistance: z.number().optional(),
            fireStationDistance: z.number().optional(),
            claimsHistory: z.number().min(0).max(5).optional()
        }).parse(req.body);

        const estimate = calculateInsuranceEstimate(data);

        res.json({
            annualPremium: estimate.premium,
            monthlyPremium: Math.round(estimate.premium / 12),
            coverageDetails: estimate.coverage,
            factors: estimate.factors,
            discounts: estimate.discounts,
            deductibleOptions: getDeductibleOptions(estimate.premium),
            tips: getInsuranceTips(data)
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Insurance estimate error:', error);
        res.status(500).json({ error: 'Estimate failed' });
    }
});

function calculateInsuranceEstimate(data: any): any {
    // Base rate calculation
    let basePremium = data.homeValue * 0.0035; // ~0.35% of home value
    const factors: any[] = [];
    const discounts: any[] = [];

    // Age factor
    const age = new Date().getFullYear() - data.yearBuilt;
    if (age > 40) {
        basePremium *= 1.2;
        factors.push({ factor: 'Older home (40+ years)', impact: '+20%' });
    } else if (age > 25) {
        basePremium *= 1.1;
        factors.push({ factor: 'Home age (25-40 years)', impact: '+10%' });
    } else if (age < 10) {
        basePremium *= 0.95;
        discounts.push({ discount: 'New construction', impact: '-5%' });
    }

    // Roof age factor
    if (data.roofAge && data.roofAge > 20) {
        basePremium *= 1.15;
        factors.push({ factor: 'Older roof (20+ years)', impact: '+15%' });
    }

    // Construction type
    if (data.constructionType === 'masonry') {
        basePremium *= 0.95;
        discounts.push({ discount: 'Masonry construction', impact: '-5%' });
    }

    // Liability factors
    if (data.hasPool) {
        basePremium *= 1.05;
        factors.push({ factor: 'Swimming pool', impact: '+5%' });
    }
    if (data.hasTrampoline) {
        basePremium *= 1.08;
        factors.push({ factor: 'Trampoline', impact: '+8%' });
    }

    // Security discounts
    if (data.securitySystem) {
        basePremium *= 0.95;
        discounts.push({ discount: 'Security system', impact: '-5%' });
    }
    if (data.smokeDetectors) {
        basePremium *= 0.98;
        discounts.push({ discount: 'Smoke detectors', impact: '-2%' });
    }

    // Fire protection
    if (data.fireHydrantDistance && data.fireHydrantDistance < 0.1) {
        basePremium *= 0.97;
        discounts.push({ discount: 'Near fire hydrant', impact: '-3%' });
    }

    // Claims history
    if (data.claimsHistory && data.claimsHistory > 0) {
        basePremium *= (1 + data.claimsHistory * 0.1);
        factors.push({ factor: `${data.claimsHistory} prior claim(s)`, impact: `+${data.claimsHistory * 10}%` });
    }

    const finalPremium = Math.round(basePremium);

    return {
        premium: finalPremium,
        coverage: {
            dwelling: data.homeValue,
            personalProperty: Math.round(data.homeValue * 0.5),
            liability: 300000,
            medicalPayments: 5000,
            lossOfUse: Math.round(data.homeValue * 0.2)
        },
        factors,
        discounts
    };
}

function getDeductibleOptions(basePremium: number): any[] {
    return [
        { deductible: 500, premium: Math.round(basePremium * 1.15), savings: 0 },
        { deductible: 1000, premium: basePremium, savings: Math.round(basePremium * 0.15) },
        { deductible: 2500, premium: Math.round(basePremium * 0.88), savings: Math.round(basePremium * 0.12) },
        { deductible: 5000, premium: Math.round(basePremium * 0.8), savings: Math.round(basePremium * 0.2) }
    ];
}

function getInsuranceTips(data: any): string[] {
    const tips: string[] = [];

    if (!data.securitySystem) {
        tips.push('Installing a security system could save 5-10% on premiums');
    }

    if (data.roofAge && data.roofAge > 15) {
        tips.push('Consider roof replacement to lower premiums and prevent claims');
    }

    tips.push('Bundle home and auto insurance for additional 10-25% savings');
    tips.push('Increase deductible to lower monthly premiums');
    tips.push('Review coverage annually to ensure adequate protection');

    return tips;
}

// ============================================
// COMPARE INSURANCE QUOTES
// ============================================
router.get('/quotes/:propertyId', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;

        const baseQuote = 1800 + Math.random() * 800;

        res.json({
            propertyId,
            quotes: [
                {
                    provider: 'State Farm',
                    rating: 4.5,
                    annualPremium: Math.round(baseQuote * 0.95),
                    monthlyPremium: Math.round(baseQuote * 0.95 / 12),
                    coverage: { dwelling: 500000, liability: 300000 },
                    features: ['24/7 claims', 'Multi-policy discount']
                },
                {
                    provider: 'Allstate',
                    rating: 4.3,
                    annualPremium: Math.round(baseQuote),
                    monthlyPremium: Math.round(baseQuote / 12),
                    coverage: { dwelling: 500000, liability: 300000 },
                    features: ['Claim-free rewards', 'New roof discount']
                },
                {
                    provider: 'Liberty Mutual',
                    rating: 4.2,
                    annualPremium: Math.round(baseQuote * 1.05),
                    monthlyPremium: Math.round(baseQuote * 1.05 / 12),
                    coverage: { dwelling: 500000, liability: 300000 },
                    features: ['Inflation protection', 'Home protector plus']
                },
                {
                    provider: 'Lemonade',
                    rating: 4.6,
                    annualPremium: Math.round(baseQuote * 0.85),
                    monthlyPremium: Math.round(baseQuote * 0.85 / 12),
                    coverage: { dwelling: 500000, liability: 100000 },
                    features: ['Instant quotes', 'AI claims processing']
                }
            ],
            recommendation: 'Compare coverage limits, not just price. Ensure adequate liability protection.',
            nextSteps: [
                'Get personalized quotes from 3+ providers',
                'Review policy exclusions carefully',
                'Consider umbrella policy for additional liability'
            ]
        });
    } catch (error) {
        console.error('Quotes error:', error);
        res.status(500).json({ error: 'Failed to get quotes' });
    }
});

// ============================================
// SPECIAL COVERAGE OPTIONS
// ============================================
router.get('/special-coverage', (req: Request, res: Response) => {
    res.json({
        additionalCoverage: [
            {
                type: 'Flood Insurance',
                description: 'Required in flood zones, recommended for all',
                avgCost: '$700-$1,500/year',
                provider: 'NFIP or private'
            },
            {
                type: 'Earthquake Insurance',
                description: 'Separate policy for earthquake damage',
                avgCost: '$800-$2,000/year',
                provider: 'CEA or private'
            },
            {
                type: 'Umbrella Policy',
                description: 'Extra liability coverage beyond home policy',
                avgCost: '$200-$400/year per $1M',
                recommended: 'For high-net-worth individuals'
            },
            {
                type: 'Scheduled Personal Property',
                description: 'Coverage for valuables (jewelry, art)',
                avgCost: '$50-$200/year per $10,000',
                note: 'Requires appraisal'
            },
            {
                type: 'Home Business Coverage',
                description: 'For home-based business equipment/liability',
                avgCost: '$250-$500/year',
                note: 'Standard policy has limited coverage'
            }
        ]
    });
});

export default router;
