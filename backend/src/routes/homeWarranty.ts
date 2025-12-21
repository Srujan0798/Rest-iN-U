import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// GET WARRANTY OPTIONS
// ============================================
router.post('/options', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid().optional(),
            homeAge: z.number().optional(),
            squareFeet: z.number().optional(),
            hasPool: z.boolean().optional(),
            hasSeptic: z.boolean().optional(),
            hasWell: z.boolean().optional()
        }).parse(req.body);

        const options = generateWarrantyOptions(data);

        res.json({
            recommendedPlan: options.recommended,
            allPlans: options.plans,
            whatsCovered: getStandardCoverage(),
            whatsNotCovered: getExclusions(),
            tips: getWarrantyTips()
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Warranty options error:', error);
        res.status(500).json({ error: 'Failed to get options' });
    }
});

function generateWarrantyOptions(data: any): any {
    const isOlderHome = data.homeAge && data.homeAge > 15;
    const isLargerHome = data.squareFeet && data.squareFeet > 2500;

    const plans = [
        {
            name: 'Basic',
            price: 350,
            annualPrice: 350,
            serviceFee: 75,
            coverage: ['HVAC', 'Plumbing', 'Electrical', 'Water heater', 'Garbage disposal'],
            notCovered: ['Appliances', 'Pool', 'Roof leaks'],
            bestFor: 'New homes with modern systems'
        },
        {
            name: 'Standard',
            price: 500,
            annualPrice: 500,
            serviceFee: 75,
            coverage: ['Everything in Basic', 'Kitchen appliances', 'Washer/Dryer', 'Garage door opener', 'Ceiling fans'],
            notCovered: ['Pool', 'Roof leaks', 'Pre-existing conditions'],
            bestFor: 'Most homeowners'
        },
        {
            name: 'Premium',
            price: 700,
            annualPrice: 700,
            serviceFee: 100,
            coverage: ['Everything in Standard', 'Roof leak repair', 'Code violations (up to $500)', 'Permits and hauls', 'Unlimited AC refrigerant'],
            notCovered: ['Pool (add-on available)', 'Septic (add-on available)'],
            bestFor: 'Older homes, complete peace of mind'
        }
    ];

    // Add-ons
    const addOns: any[] = [];
    if (data.hasPool) {
        addOns.push({ name: 'Pool/Spa', annualCost: 150 });
    }
    if (data.hasSeptic) {
        addOns.push({ name: 'Septic System', annualCost: 100 });
    }
    if (data.hasWell) {
        addOns.push({ name: 'Well Pump', annualCost: 100 });
    }

    // Recommendation logic
    let recommended = 'Standard';
    if (isOlderHome || isLargerHome) {
        recommended = 'Premium';
    }

    return {
        plans,
        addOns,
        recommended: plans.find(p => p.name === recommended)
    };
}

function getStandardCoverage(): any {
    return {
        systems: [
            { item: 'Heating system', limit: '$2,000/year' },
            { item: 'Air conditioning', limit: '$2,000/year' },
            { item: 'Ductwork', limit: '$1,000/year' },
            { item: 'Plumbing system', limit: '$1,500/year' },
            { item: 'Electrical system', limit: '$1,500/year' },
            { item: 'Water heater', limit: '$1,500 replacement' }
        ],
        appliances: [
            { item: 'Refrigerator', limit: '$1,500 replacement' },
            { item: 'Dishwasher', limit: '$500 replacement' },
            { item: 'Oven/Range', limit: '$1,000 replacement' },
            { item: 'Microwave (built-in)', limit: '$400 replacement' },
            { item: 'Washer', limit: '$600 replacement' },
            { item: 'Dryer', limit: '$600 replacement' }
        ]
    };
}

function getExclusions(): string[] {
    return [
        'Pre-existing conditions (issues known before coverage)',
        'Improper installation or maintenance',
        'Cosmetic defects',
        'Code violations (unless covered in plan)',
        'Acts of God (fire, flood, earthquake)',
        'Commercial-grade equipment',
        'Secondary damage from primary failure',
        'Items under manufacturer warranty'
    ];
}

function getWarrantyTips(): string[] {
    return [
        'Read the contract carefully before purchasing',
        'Understand service fee vs. repair limits',
        'Check reviews for claim approval rates',
        'Get warranty at closing - sellers often pay',
        'Keep maintenance records (may be required for claims)',
        'Compare at least 3 warranty companies'
    ];
}

// ============================================
// COMPARE WARRANTY PROVIDERS
// ============================================
router.get('/providers', (req: Request, res: Response) => {
    res.json({
        providers: [
            {
                name: 'American Home Shield',
                rating: 4.2,
                reviews: 15000,
                plans: ['Bronze', 'Gold', 'Platinum'],
                priceRange: '$350-$700/year',
                serviceFee: '$75-$125',
                pros: ['Extensive network', 'Well-established'],
                cons: ['Higher prices', 'Some claim denials reported']
            },
            {
                name: 'Choice Home Warranty',
                rating: 4.0,
                reviews: 8500,
                plans: ['Basic', 'Total'],
                priceRange: '$400-$550/year',
                serviceFee: '$85',
                pros: ['Competitive pricing', 'Quick claims'],
                cons: ['Coverage limits', 'Fewer contractors in some areas']
            },
            {
                name: 'First American Home Warranty',
                rating: 4.1,
                reviews: 5200,
                plans: ['Basic', 'Premier'],
                priceRange: '$350-$600/year',
                serviceFee: '$75-$100',
                pros: ['Good coverage limits', 'Flexible plans'],
                cons: ['Limited availability in some states']
            },
            {
                name: 'Cinch Home Services',
                rating: 3.9,
                reviews: 4800,
                plans: ['Appliances', 'Built-In Systems', 'Complete Home'],
                priceRange: '$400-$650/year',
                serviceFee: '$100-$150',
                pros: ['180-day workmanship guarantee', 'Good add-ons'],
                cons: ['Higher service fees']
            }
        ],
        howToChoose: [
            'Compare coverage for YOUR specific needs',
            'Check contractor networks in your area',
            'Read claim approval/denial reviews',
            'Understand what\'s NOT covered',
            'Consider service fee vs. premium tradeoff'
        ]
    });
});

// ============================================
// FILE WARRANTY CLAIM
// ============================================
router.post('/claim', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid(),
            warrantyPlanId: z.string(),
            issueType: z.enum(['hvac', 'plumbing', 'electrical', 'appliance', 'other']),
            issueDescription: z.string().min(20).max(500),
            urgency: z.enum(['emergency', 'urgent', 'standard']),
            preferredContactTime: z.string().optional()
        }).parse(req.body);

        res.status(201).json({
            claimId: `CLM-${Date.now()}`,
            status: 'Submitted',
            nextSteps: [
                'Claim received and logged',
                'Contractor will contact you within 24-48 hours',
                'Service appointment will be scheduled',
                'Service fee due at time of service'
            ],
            estimatedResponse: data.urgency === 'emergency' ? '2-4 hours' :
                data.urgency === 'urgent' ? '24 hours' : '24-48 hours',
            contactNumber: '1-800-WARRANTY',
            trackingUrl: 'https://warranty.example.com/track/CLM-123'
        });
    } catch (error) {
        console.error('Claim error:', error);
        res.status(500).json({ error: 'Failed to file claim' });
    }
});

export default router;
