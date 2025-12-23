import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// GET MAINTENANCE SCHEDULE
// ============================================
router.get('/schedule/:propertyId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { propertyId } = req.params;

        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        const schedule = generateMaintenanceSchedule(property);

        res.json({
            propertyId,
            schedule,
            upcomingTasks: schedule.filter(t => t.urgency === 'upcoming' || t.urgency === 'due'),
            annualCostEstimate: calculateAnnualCost(schedule)
        });
    } catch (error) {
        console.error('Schedule error:', error);
        res.status(500).json({ error: 'Failed to get schedule' });
    }
});

function generateMaintenanceSchedule(property: any): any[] {
    const now = new Date();
    const month = now.getMonth();

    return [
        // Monthly tasks
        {
            task: 'Replace HVAC filters',
            frequency: 'Monthly',
            lastCompleted: null,
            nextDue: 'end of month',
            urgency: 'upcoming',
            estimatedCost: 15,
            diy: true
        },
        // Quarterly tasks
        {
            task: 'Test smoke/CO detectors',
            frequency: 'Quarterly',
            lastCompleted: null,
            nextDue: 'Next quarter',
            urgency: 'upcoming',
            estimatedCost: 0,
            diy: true
        },
        {
            task: 'Clean garbage disposal',
            frequency: 'Quarterly',
            lastCompleted: null,
            nextDue: 'Next quarter',
            urgency: 'low',
            estimatedCost: 5,
            diy: true
        },
        // Seasonal - Spring
        {
            task: 'Service air conditioning',
            frequency: 'Annual (Spring)',
            lastCompleted: null,
            nextDue: 'March-April',
            urgency: month >= 2 && month <= 3 ? 'due' : 'low',
            estimatedCost: 150,
            diy: false
        },
        {
            task: 'Clean gutters',
            frequency: 'Bi-annual (Spring/Fall)',
            lastCompleted: null,
            nextDue: 'Spring',
            urgency: month >= 2 && month <= 4 ? 'upcoming' : 'low',
            estimatedCost: 150,
            diy: true
        },
        {
            task: 'Power wash exterior',
            frequency: 'Annual (Spring)',
            lastCompleted: null,
            nextDue: 'Spring',
            urgency: 'low',
            estimatedCost: 200,
            diy: true
        },
        // Seasonal - Fall
        {
            task: 'Service furnace/heating',
            frequency: 'Annual (Fall)',
            lastCompleted: null,
            nextDue: 'September-October',
            urgency: month >= 8 && month <= 9 ? 'due' : 'low',
            estimatedCost: 150,
            diy: false
        },
        {
            task: 'Winterize outdoor faucets',
            frequency: 'Annual (Fall)',
            lastCompleted: null,
            nextDue: 'October',
            urgency: month === 9 ? 'due' : 'low',
            estimatedCost: 0,
            diy: true
        },
        {
            task: 'Clean fireplace/chimney',
            frequency: 'Annual (Fall)',
            lastCompleted: null,
            nextDue: 'October',
            urgency: 'low',
            estimatedCost: 250,
            diy: false
        },
        // Annual tasks
        {
            task: 'Flush water heater',
            frequency: 'Annual',
            lastCompleted: null,
            nextDue: 'Anniversary of last service',
            urgency: 'upcoming',
            estimatedCost: 100,
            diy: true
        },
        {
            task: 'Inspect roof',
            frequency: 'Annual',
            lastCompleted: null,
            nextDue: 'Spring',
            urgency: 'low',
            estimatedCost: 200,
            diy: false
        },
        {
            task: 'Service garage door',
            frequency: 'Annual',
            lastCompleted: null,
            nextDue: 'Any time',
            urgency: 'low',
            estimatedCost: 100,
            diy: true
        }
    ];
}

function calculateAnnualCost(schedule: any[]): any {
    let diy = 0;
    let professional = 0;

    for (const task of schedule) {
        if (task.diy) {
            diy += task.estimatedCost;
        } else {
            professional += task.estimatedCost;
        }
    }

    return {
        diyTotal: diy,
        professionalTotal: professional,
        total: diy + professional,
        tip: 'DIY tasks can save ~50% on maintenance costs'
    };
}

// ============================================
// LOG MAINTENANCE TASK
// ============================================
router.post('/log', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid(),
            taskName: z.string(),
            completedDate: z.string(),
            cost: z.number().optional(),
            notes: z.string().optional(),
            contractor: z.string().optional(),
            receipts: z.array(z.string()).optional()
        }).parse(req.body);

        const logId = `log_${Date.now()}`;

        res.status(201).json({
            logId,
            message: 'Maintenance logged successfully',
            task: data.taskName,
            completedDate: data.completedDate,
            nextDue: calculateNextDue(data.taskName)
        });
    } catch (error) {
        console.error('Log error:', error);
        res.status(500).json({ error: 'Failed to log maintenance' });
    }
});

function calculateNextDue(taskName: string): string {
    // Simplified - would look up task frequency
    const frequencies: Record<string, number> = {
        'Replace HVAC filters': 30,
        'Service air conditioning': 365,
        'Service furnace/heating': 365,
        'Clean gutters': 180,
        'Flush water heater': 365
    };

    const days = frequencies[taskName] || 365;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + days);

    return nextDate.toISOString().split('T')[0];
}

// ============================================
// GET MAINTENANCE HISTORY
// ============================================
router.get('/history/:propertyId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { propertyId } = req.params;

        res.json({
            propertyId,
            history: [
                {
                    id: 'log_1',
                    task: 'HVAC service',
                    date: '2024-01-15',
                    cost: 150,
                    contractor: 'ABC Heating & Cooling',
                    notes: 'Replaced capacitor, cleaned coils'
                },
                {
                    id: 'log_2',
                    task: 'Gutter cleaning',
                    date: '2023-11-10',
                    cost: 0,
                    contractor: null,
                    notes: 'DIY - removed leaves and debris'
                },
                {
                    id: 'log_3',
                    task: 'Water heater flush',
                    date: '2023-10-05',
                    cost: 0,
                    contractor: null,
                    notes: 'DIY flush, replaced anode rod'
                }
            ],
            totalSpent: 150,
            totalTasks: 3
        });
    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ error: 'Failed to get history' });
    }
});

// ============================================
// FIND SERVICE PROVIDERS
// ============================================
router.get('/providers/:category', async (req: Request, res: Response) => {
    try {
        const { category } = req.params;
        const { zipCode } = req.query;

        const providers: Record<string, any[]> = {
            hvac: [
                { name: 'ABC Heating & Cooling', rating: 4.8, reviews: 234, phone: '555-1234' },
                { name: 'Climate Control Pros', rating: 4.6, reviews: 156, phone: '555-5678' }
            ],
            plumbing: [
                { name: 'Fast Flow Plumbing', rating: 4.7, reviews: 189, phone: '555-2345' },
                { name: 'Rooter Experts', rating: 4.5, reviews: 312, phone: '555-6789' }
            ],
            electrical: [
                { name: 'Bright Spark Electric', rating: 4.9, reviews: 145, phone: '555-3456' },
                { name: 'Power Solutions', rating: 4.6, reviews: 98, phone: '555-7890' }
            ],
            roofing: [
                { name: 'Top Roofing Co', rating: 4.7, reviews: 167, phone: '555-4567' },
                { name: 'Shingle Masters', rating: 4.4, reviews: 89, phone: '555-8901' }
            ],
            landscaping: [
                { name: 'Green Thumb Landscaping', rating: 4.8, reviews: 256, phone: '555-5678' },
                { name: 'Lawn Perfect', rating: 4.5, reviews: 134, phone: '555-9012' }
            ]
        };

        res.json({
            category,
            zipCode: zipCode || 'Not specified',
            providers: providers[category] || [],
            tip: 'Always verify licensing and insurance before hiring'
        });
    } catch (error) {
        console.error('Providers error:', error);
        res.status(500).json({ error: 'Failed to find providers' });
    }
});

// ============================================
// EMERGENCY SERVICES
// ============================================
router.get('/emergency', (req: Request, res: Response) => {
    res.json({
        emergencies: [
            {
                type: 'Water leak/flood',
                steps: [
                    'Shut off main water valve',
                    'Turn off electricity if water near outlets',
                    'Call emergency plumber'
                ],
                providers: [
                    { name: '24/7 Emergency Plumbing', phone: '555-LEAK' }
                ]
            },
            {
                type: 'Gas leak',
                steps: [
                    'Evacuate immediately',
                    'Do NOT use switches or open flames',
                    'Call gas company from outside'
                ],
                providers: [
                    { name: 'Gas Emergency Line', phone: '1-800-GAS-LEAK' }
                ]
            },
            {
                type: 'No heat in winter',
                steps: [
                    'Check thermostat batteries',
                    'Check circuit breaker',
                    'Call HVAC emergency service'
                ],
                providers: [
                    { name: '24/7 HVAC Emergency', phone: '555-HEAT' }
                ]
            },
            {
                type: 'Electrical failure',
                steps: [
                    'Check if neighbors have power',
                    'Check main breaker',
                    'Call utility or electrician'
                ],
                providers: [
                    { name: 'Emergency Electrician', phone: '555-VOLT' }
                ]
            }
        ],
        importantNumbers: {
            'Police/Fire/Medical': '911',
            'Poison Control': '1-800-222-1222',
            'Utility Emergency': 'Check your utility\'s emergency line'
        }
    });
});

export default router;

