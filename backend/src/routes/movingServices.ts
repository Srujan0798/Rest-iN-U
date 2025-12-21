import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// GET MOVING ESTIMATE
// ============================================
router.post('/estimate', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            originZip: z.string(),
            destinationZip: z.string(),
            moveDate: z.string(),
            homeSize: z.enum(['studio', '1br', '2br', '3br', '4br', '5br+']),
            packingService: z.boolean().default(false),
            storageNeeded: z.boolean().default(false),
            storageDays: z.number().optional(),
            specialItems: z.array(z.enum(['piano', 'pool-table', 'hot-tub', 'safe', 'artwork', 'antiques'])).optional()
        }).parse(req.body);

        const estimate = calculateMovingEstimate(data);

        res.json({
            estimate,
            moveDetails: {
                origin: data.originZip,
                destination: data.destinationZip,
                date: data.moveDate,
                homeSize: data.homeSize
            },
            bookingOptions: getBookingOptions(estimate),
            checklist: getMovingChecklist(data.moveDate),
            tips: getMovingTips()
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Moving estimate error:', error);
        res.status(500).json({ error: 'Estimate failed' });
    }
});

function calculateMovingEstimate(data: any): any {
    // Base costs by home size
    const baseCosts: Record<string, { local: number; longDistance: number; weight: number }> = {
        'studio': { local: 400, longDistance: 1500, weight: 2000 },
        '1br': { local: 600, longDistance: 2500, weight: 3500 },
        '2br': { local: 900, longDistance: 3500, weight: 5000 },
        '3br': { local: 1200, longDistance: 5000, weight: 7500 },
        '4br': { local: 1600, longDistance: 7000, weight: 10000 },
        '5br+': { local: 2200, longDistance: 10000, weight: 15000 }
    };

    const base = baseCosts[data.homeSize];

    // Determine if local or long distance (simplified - same first 3 digits = local)
    const isLocal = data.originZip.substring(0, 3) === data.destinationZip.substring(0, 3);

    let totalCost = isLocal ? base.local : base.longDistance;
    const breakdown: any[] = [];

    breakdown.push({
        item: isLocal ? 'Local moving service' : 'Long-distance moving service',
        cost: isLocal ? base.local : base.longDistance
    });

    // Packing service
    if (data.packingService) {
        const packingCost = Math.round(base.weight * 0.15);
        totalCost += packingCost;
        breakdown.push({ item: 'Full packing service', cost: packingCost });
    }

    // Storage
    if (data.storageNeeded) {
        const storageDays = data.storageDays || 30;
        const storageCost = Math.round(storageDays * (base.weight / 1000) * 2);
        totalCost += storageCost;
        breakdown.push({ item: `Storage (${storageDays} days)`, cost: storageCost });
    }

    // Special items
    if (data.specialItems?.length > 0) {
        const specialCosts: Record<string, number> = {
            'piano': 450, 'pool-table': 350, 'hot-tub': 500,
            'safe': 200, 'artwork': 150, 'antiques': 200
        };

        for (const item of data.specialItems) {
            const cost = specialCosts[item] || 100;
            totalCost += cost;
            breakdown.push({ item: `Special handling: ${item}`, cost });
        }
    }

    return {
        lowEstimate: Math.round(totalCost * 0.85),
        highEstimate: Math.round(totalCost * 1.15),
        averageEstimate: Math.round(totalCost),
        breakdown,
        estimatedWeight: base.weight,
        moveType: isLocal ? 'Local (within 50 miles)' : 'Long Distance',
        estimatedDuration: isLocal ? '4-8 hours' : '3-7 days'
    };
}

function getBookingOptions(estimate: any): any[] {
    return [
        {
            tier: 'Basic',
            description: 'Loading, transport, and unloading only',
            price: estimate.lowEstimate,
            includes: ['Loading', 'Transport', 'Unloading'],
            notIncluded: ['Packing', 'Unpacking', 'Furniture assembly']
        },
        {
            tier: 'Standard',
            description: 'Basic + furniture protection',
            price: estimate.averageEstimate,
            includes: ['Loading', 'Transport', 'Unloading', 'Furniture blankets', 'Basic insurance'],
            notIncluded: ['Packing', 'Unpacking']
        },
        {
            tier: 'Premium',
            description: 'Full service - we handle everything',
            price: estimate.highEstimate,
            includes: ['Packing', 'Loading', 'Transport', 'Unloading', 'Unpacking', 'Furniture assembly', 'Full valuation coverage'],
            notIncluded: []
        }
    ];
}

function getMovingChecklist(moveDate: string): any {
    return {
        '8+ weeks before': [
            'Research and get quotes from movers',
            'Create moving budget',
            'Start decluttering',
            'Notify landlord if renting'
        ],
        '6 weeks before': [
            'Book moving company',
            'Start packing non-essentials',
            'Arrange school transfers',
            'Notify employer if needed'
        ],
        '4 weeks before': [
            'Change address with USPS',
            'Update address with banks, subscriptions',
            'Transfer or cancel utilities',
            'Arrange pet and plant transport'
        ],
        '2 weeks before': [
            'Confirm moving details',
            'Pack most items',
            'Prepare "essentials" box',
            'Clean and repair current home'
        ],
        '1 week before': [
            'Finish packing',
            'Defrost freezer',
            'Confirm delivery address',
            'Prepare payment for movers'
        ],
        'Moving day': [
            'Do final walkthrough',
            'Take meter readings',
            'Get copies of all keys',
            'Tip movers if satisfied'
        ]
    };
}

function getMovingTips(): string[] {
    return [
        'Book movers 4-8 weeks in advance, especially for summer moves',
        'Get at least 3 quotes and verify licensing/insurance',
        'Take photos of valuables before packing',
        'Label boxes on multiple sides with contents and room',
        'Pack a "first night" box with essentials',
        'Keep important documents with you, not on the truck'
    ];
}

// ============================================
// COMPARE MOVING COMPANIES
// ============================================
router.get('/companies/:zipCode', async (req: Request, res: Response) => {
    try {
        const { zipCode } = req.params;

        res.json({
            zipCode,
            companies: [
                {
                    name: 'Two Men and a Truck',
                    rating: 4.6,
                    reviews: 2340,
                    priceRange: '$$',
                    services: ['Local', 'Long-distance', 'Packing', 'Storage'],
                    licensed: true,
                    insured: true
                },
                {
                    name: 'United Van Lines',
                    rating: 4.4,
                    reviews: 1890,
                    priceRange: '$$$',
                    services: ['Long-distance', 'International', 'Corporate'],
                    licensed: true,
                    insured: true
                },
                {
                    name: 'PODS',
                    rating: 4.3,
                    reviews: 3200,
                    priceRange: '$$',
                    services: ['Portable containers', 'Storage', 'Self-pack'],
                    licensed: true,
                    insured: true
                },
                {
                    name: 'Local Moving Pros',
                    rating: 4.8,
                    reviews: 450,
                    priceRange: '$',
                    services: ['Local', 'Packing'],
                    licensed: true,
                    insured: true
                }
            ],
            redFlags: [
                'Unusually low estimates',
                'No physical address',
                'Demands large deposit',
                'No written estimate',
                'Not registered with FMCSA (for interstate moves)'
            ]
        });
    } catch (error) {
        console.error('Companies error:', error);
        res.status(500).json({ error: 'Failed to get companies' });
    }
});

// ============================================
// DIY MOVING OPTIONS
// ============================================
router.get('/diy-options', (req: Request, res: Response) => {
    res.json({
        truckRentals: [
            { company: 'U-Haul', truckSizes: ['10ft', '15ft', '20ft', '26ft'], priceRange: '$20-$150/day' },
            { company: 'Penske', truckSizes: ['12ft', '16ft', '22ft', '26ft'], priceRange: '$30-$180/day' },
            { company: 'Budget', truckSizes: ['12ft', '16ft', '24ft'], priceRange: '$25-$160/day' }
        ],
        containerOptions: [
            { company: 'PODS', description: 'Delivered to your door, you pack, we move', priceRange: '$150-$400/month' },
            { company: 'U-Pack', description: 'Trailer or container, pay for space used', priceRange: '$1,000-$3,000 one-way' }
        ],
        laborOnly: [
            { company: 'TaskRabbit', description: 'Hire helpers by the hour', priceRange: '$30-$60/hr per person' },
            { company: 'HireAHelper', description: 'Vetted moving labor', priceRange: '$50-$80/hr for 2 movers' }
        ],
        suppliesNeeded: [
            { item: 'Medium boxes', quantity: '20-40', cost: '$30-$60' },
            { item: 'Large boxes', quantity: '10-20', cost: '$25-$50' },
            { item: 'Wardrobe boxes', quantity: '2-5', cost: '$20-$50' },
            { item: 'Packing tape', quantity: '3-5 rolls', cost: '$15-$25' },
            { item: 'Bubble wrap', quantity: '100-200 ft', cost: '$20-$40' },
            { item: 'Furniture pads', quantity: '6-12', cost: '$50-$100' }
        ]
    });
});

export default router;
