import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// CALCULATE COMMUTE
// ============================================
router.post('/calculate', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid().optional(),
            originLat: z.number().optional(),
            originLng: z.number().optional(),
            originAddress: z.string().optional(),
            destinationAddress: z.string(),
            departureTime: z.string().optional(),
            modes: z.array(z.enum(['driving', 'transit', 'walking', 'biking'])).default(['driving', 'transit'])
        }).parse(req.body);

        // In production, would call Google Maps/Apple Maps API
        const commutes = generateCommuteData(data.modes);

        res.json({
            origin: data.originAddress || 'Property location',
            destination: data.destinationAddress,
            departureTime: data.departureTime || 'Now',
            routes: commutes,
            bestOption: commutes.sort((a, b) => a.duration - b.duration)[0],
            costComparison: calculateCommuteCosts(commutes)
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Commute error:', error);
        res.status(500).json({ error: 'Calculation failed' });
    }
});

function generateCommuteData(modes: string[]): any[] {
    const commutes: any[] = [];

    if (modes.includes('driving')) {
        const duration = Math.floor(Math.random() * 30) + 15;
        commutes.push({
            mode: 'driving',
            duration,
            durationText: `${duration} min`,
            distance: (duration * 0.8).toFixed(1) + ' mi',
            trafficConditions: duration > 25 ? 'Heavy' : 'Moderate',
            peakHours: {
                morning: `${duration + 10} min (7-9am)`,
                evening: `${duration + 15} min (5-7pm)`
            },
            monthlyGasCost: Math.round(duration * 2.5),
            parkingNote: 'Parking available at destination'
        });
    }

    if (modes.includes('transit')) {
        const duration = Math.floor(Math.random() * 20) + 30;
        commutes.push({
            mode: 'transit',
            duration,
            durationText: `${duration} min`,
            transitDetails: {
                walkToStation: '5 min',
                transitTime: `${duration - 10} min`,
                walkFromStation: '5 min',
                transfers: Math.floor(Math.random() * 2),
                lines: ['Blue Line', 'Bus 42']
            },
            monthlyPass: 100,
            frequency: 'Every 10 min during rush hour'
        });
    }

    if (modes.includes('biking')) {
        const duration = Math.floor(Math.random() * 20) + 20;
        commutes.push({
            mode: 'biking',
            duration,
            durationText: `${duration} min`,
            distance: (duration * 0.25).toFixed(1) + ' mi',
            bikeInfrastructure: {
                bikeLanes: '70% of route',
                bikeRacks: 'Available at destination',
                elevation: 'Mostly flat'
            },
            calories: Math.round(duration * 8)
        });
    }

    if (modes.includes('walking')) {
        const duration = Math.floor(Math.random() * 30) + 45;
        commutes.push({
            mode: 'walking',
            duration,
            durationText: `${duration} min`,
            distance: (duration * 0.05).toFixed(1) + ' mi',
            walkability: {
                sidewalks: 'Continuous',
                crossings: 'Well-marked',
                lighting: 'Adequate'
            },
            calories: Math.round(duration * 4)
        });
    }

    return commutes;
}

function calculateCommuteCosts(commutes: any[]): any {
    const workDays = 22; // per month
    const costs: any = {};

    for (const commute of commutes) {
        if (commute.mode === 'driving') {
            costs.driving = {
                monthly: commute.monthlyGasCost * 2, // round trip
                yearly: commute.monthlyGasCost * 2 * 12,
                note: 'Includes gas, not maintenance or wear'
            };
        }
        if (commute.mode === 'transit') {
            costs.transit = {
                monthly: commute.monthlyPass,
                yearly: commute.monthlyPass * 12,
                note: 'Unlimited rides with monthly pass'
            };
        }
        if (commute.mode === 'biking' || commute.mode === 'walking') {
            costs[commute.mode] = {
                monthly: 0,
                yearly: 0,
                note: 'Free! Plus health benefits'
            };
        }
    }

    return costs;
}

// ============================================
// COMMUTE SCORE FOR PROPERTY
// ============================================
router.post('/score/:propertyId', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;
        const { workplaces } = z.object({
            workplaces: z.array(z.object({
                name: z.string(),
                address: z.string()
            })).min(1).max(5)
        }).parse(req.body);

        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Calculate score based on simulated commute times
        const workplaceScores = workplaces.map(wp => {
            const commuteTime = Math.floor(Math.random() * 40) + 10;
            return {
                name: wp.name,
                commuteTime,
                score: Math.max(0, 100 - commuteTime * 2)
            };
        });

        const averageScore = Math.round(
            workplaceScores.reduce((a, b) => a + b.score, 0) / workplaceScores.length
        );

        res.json({
            propertyId,
            commuteScore: averageScore,
            grade: averageScore >= 80 ? 'A' : averageScore >= 65 ? 'B' : averageScore >= 50 ? 'C' : 'D',
            workplaces: workplaceScores,
            transitAccess: {
                nearestBusStop: '0.2 mi',
                nearestTrainStation: '0.5 mi',
                transitScore: 72
            },
            tips: [
                'Consider flexible work hours to avoid peak traffic',
                'Transit pass may be more economical than driving'
            ]
        });
    } catch (error) {
        console.error('Commute score error:', error);
        res.status(500).json({ error: 'Score calculation failed' });
    }
});

// ============================================
// ISOCHRONE (TRAVEL TIME ZONES)
// ============================================
router.get('/isochrone/:propertyId', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;
        const { mode, minutes } = req.query;

        res.json({
            propertyId,
            mode: mode || 'driving',
            travelTime: parseInt(minutes as string) || 15,
            reachableAreas: [
                'Downtown (12 min)',
                'Business District (8 min)',
                'Shopping Center (5 min)',
                'Airport (25 min)'
            ],
            nearbyAmenities: {
                groceryStores: 5,
                restaurants: 23,
                gyms: 4,
                parks: 8,
                hospitals: 2
            },
            note: 'Areas reachable within specified travel time'
        });
    } catch (error) {
        console.error('Isochrone error:', error);
        res.status(500).json({ error: 'Failed to get isochrone' });
    }
});

// ============================================
// TRAFFIC PATTERNS
// ============================================
router.get('/traffic/:location', async (req: Request, res: Response) => {
    try {
        const { location } = req.params;

        res.json({
            location,
            currentConditions: 'Moderate',
            congestionLevel: 45, // 0-100
            peakTimes: {
                morning: { start: '7:00 AM', end: '9:30 AM', level: 'Heavy' },
                evening: { start: '4:30 PM', end: '7:00 PM', level: 'Heavy' }
            },
            bestTravelTimes: [
                '10:00 AM - 3:00 PM',
                'Before 6:30 AM',
                'After 8:00 PM'
            ],
            weekendNote: 'Traffic is typically 40% lighter on weekends'
        });
    } catch (error) {
        console.error('Traffic error:', error);
        res.status(500).json({ error: 'Failed to get traffic data' });
    }
});

export default router;
