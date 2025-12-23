import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// GET COMMUNITY INSIGHTS
// ============================================
router.get('/insights/:neighborhoodId', async (req: Request, res: Response) => {
    try {
        const { neighborhoodId } = req.params;

        // In production, aggregate from reviews, surveys, and public data
        res.json({
            neighborhoodId,
            communityScore: 78,
            demographics: {
                averageAge: 38,
                familiesWithChildren: '35%',
                retirees: '15%',
                youngProfessionals: '30%'
            },
            lifestyle: {
                petFriendly: { score: 85, parks: 5, vetClinics: 3 },
                familyFriendly: { score: 82, schools: 4, playgrounds: 6 },
                nightlife: { score: 45, bars: 2, restaurants: 12 },
                fitness: { score: 70, gyms: 3, trails: 2 }
            },
            safety: {
                crimeRate: 'Low',
                trend: 'Decreasing',
                policeResponseTime: '4 min average'
            },
            events: [
                { name: 'Farmers Market', frequency: 'Weekly', day: 'Saturday' },
                { name: 'Community Cleanup', frequency: 'Monthly', day: 'First Sunday' },
                { name: 'Block Party', frequency: 'Annual', day: 'July 4th' }
            ]
        });
    } catch (error) {
        console.error('Community insights error:', error);
        res.status(500).json({ error: 'Failed to get insights' });
    }
});

// ============================================
// NEIGHBOR COMPATIBILITY
// ============================================
router.post('/compatibility', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = z.object({
            lifestylePreferences: z.object({
                noise: z.enum(['quiet', 'moderate', 'lively']),
                social: z.enum(['private', 'friendly', 'very_social']),
                pets: z.boolean(),
                children: z.boolean(),
                workFromHome: z.boolean(),
                hobbies: z.array(z.string())
            }),
            targetNeighborhoodId: z.string().uuid().optional()
        }).parse(req.body);

        // Calculate compatibility based on preferences
        const score = calculateCompatibility(data.lifestylePreferences);

        res.json({
            compatibilityScore: score.overall,
            breakdown: score.breakdown,
            idealNeighborhood: score.idealType,
            tips: getCompatibilityTips(data.lifestylePreferences),
            similarResidents: '~40% share your lifestyle preferences'
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Compatibility error:', error);
        res.status(500).json({ error: 'Compatibility check failed' });
    }
});

function calculateCompatibility(prefs: any): any {
    let overall = 70;
    const breakdown: Record<string, number> = {};

    // Noise preference matching
    breakdown.noiseLevel = prefs.noise === 'quiet' ? 85 : prefs.noise === 'moderate' ? 75 : 65;

    // Social matching
    breakdown.socialFit = prefs.social === 'friendly' ? 80 : 70;

    // Family factors
    breakdown.familyMatch = (prefs.children || prefs.pets) ? 75 : 80;

    // Work from home
    breakdown.workEnvironment = prefs.workFromHome ? 82 : 78;

    overall = Math.round(Object.values(breakdown).reduce((a, b) => a + b, 0) / Object.keys(breakdown).length);

    const types: Record<string, string> = {
        'quiet+private': 'Established suburban neighborhood',
        'quiet+friendly': 'Family-oriented community',
        'moderate+friendly': 'Mixed residential area',
        'lively+very_social': 'Urban walkable district'
    };

    return {
        overall,
        breakdown,
        idealType: types[`${prefs.noise}+${prefs.social}`] || 'Mixed community'
    };
}

function getCompatibilityTips(prefs: any): string[] {
    const tips: string[] = [];

    if (prefs.quiet) {
        tips.push('Look for homes away from main roads');
        tips.push('Check noise levels at different times of day');
    }

    if (prefs.workFromHome) {
        tips.push('Verify reliable internet availability');
        tips.push('Consider home office space and natural light');
    }

    if (prefs.pets) {
        tips.push('Check HOA pet policies if applicable');
        tips.push('Look for nearby parks and walking trails');
    }

    return tips;
}

// ============================================
// LOCAL SERVICES
// ============================================
router.get('/services/:propertyId', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;
        const { category } = req.query;

        const services = {
            healthcare: [
                { name: 'City Hospital', distance: '1.2 mi', rating: 4.5, type: 'hospital' },
                { name: 'Family Medical Center', distance: '0.5 mi', rating: 4.8, type: 'clinic' },
                { name: 'CVS Pharmacy', distance: '0.3 mi', rating: 4.2, type: 'pharmacy' }
            ],
            education: [
                { name: 'Lincoln Elementary', distance: '0.4 mi', rating: 4.7, type: 'elementary' },
                { name: 'Washington Middle School', distance: '0.8 mi', rating: 4.5, type: 'middle' },
                { name: 'Central High School', distance: '1.5 mi', rating: 4.3, type: 'high' }
            ],
            shopping: [
                { name: 'Whole Foods', distance: '0.7 mi', rating: 4.6, type: 'grocery' },
                { name: 'Target', distance: '1.0 mi', rating: 4.4, type: 'retail' },
                { name: 'Main Street Shops', distance: '0.3 mi', rating: 4.5, type: 'boutiques' }
            ],
            dining: [
                { name: 'Artisan Cafe', distance: '0.2 mi', rating: 4.8, type: 'cafe' },
                { name: 'Oak Table Restaurant', distance: '0.4 mi', rating: 4.6, type: 'american' },
                { name: 'Sakura Sushi', distance: '0.5 mi', rating: 4.7, type: 'japanese' }
            ],
            fitness: [
                { name: 'Equinox', distance: '0.8 mi', rating: 4.5, type: 'gym' },
                { name: 'Yoga Studio', distance: '0.3 mi', rating: 4.9, type: 'yoga' },
                { name: 'Community Pool', distance: '0.6 mi', rating: 4.4, type: 'pool' }
            ]
        };

        if (category && category in services) {
            res.json({
                propertyId,
                category,
                services: services[category as keyof typeof services]
            });
        } else {
            res.json({ propertyId, services });
        }
    } catch (error) {
        console.error('Services error:', error);
        res.status(500).json({ error: 'Failed to get services' });
    }
});

// ============================================
// COMMUNITY REVIEWS
// ============================================
router.get('/reviews/:neighborhoodId', async (req: Request, res: Response) => {
    try {
        const { neighborhoodId } = req.params;

        res.json({
            neighborhoodId,
            overallRating: 4.3,
            totalReviews: 127,
            ratings: {
                safety: 4.5,
                schools: 4.2,
                nightlife: 3.8,
                familyFriendly: 4.4,
                commute: 4.0,
                outdoorActivities: 4.6
            },
            recentReviews: [
                {
                    author: 'John D.',
                    rating: 5,
                    date: '2024-01-15',
                    text: 'Great neighborhood! Quiet streets, friendly neighbors, excellent schools nearby.',
                    helpful: 23
                },
                {
                    author: 'Sarah M.',
                    rating: 4,
                    date: '2024-01-10',
                    text: 'Love the walkability and local restaurants. Wish there were more parking options.',
                    helpful: 15
                },
                {
                    author: 'Mike R.',
                    rating: 4,
                    date: '2024-01-05',
                    text: 'Solid community, good for families. The farmers market is a highlight.',
                    helpful: 18
                }
            ]
        });
    } catch (error) {
        console.error('Reviews error:', error);
        res.status(500).json({ error: 'Failed to get reviews' });
    }
});

// ============================================
// SUBMIT REVIEW
// ============================================
router.post('/reviews/:neighborhoodId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { neighborhoodId } = req.params;
        const data = z.object({
            rating: z.number().min(1).max(5),
            text: z.string().min(10).max(1000),
            ratings: z.object({
                safety: z.number().min(1).max(5).optional(),
                schools: z.number().min(1).max(5).optional(),
                nightlife: z.number().min(1).max(5).optional(),
                familyFriendly: z.number().min(1).max(5).optional()
            }).optional()
        }).parse(req.body);

        res.status(201).json({
            message: 'Review submitted successfully',
            reviewId: `rev_${Date.now()}`,
            status: 'pending_moderation'
        });
    } catch (error) {
        console.error('Submit review error:', error);
        res.status(500).json({ error: 'Failed to submit review' });
    }
});

// ============================================
// UPCOMING EVENTS
// ============================================
router.get('/events/:neighborhoodId', async (req: Request, res: Response) => {
    try {
        const { neighborhoodId } = req.params;

        res.json({
            neighborhoodId,
            upcomingEvents: [
                {
                    name: 'Farmers Market',
                    date: 'Every Saturday',
                    time: '8am - 1pm',
                    location: 'Main Street',
                    type: 'market'
                },
                {
                    name: 'Community Yoga in the Park',
                    date: '2024-02-01',
                    time: '9am',
                    location: 'Central Park',
                    type: 'fitness'
                },
                {
                    name: 'Neighborhood Watch Meeting',
                    date: '2024-02-05',
                    time: '7pm',
                    location: 'Community Center',
                    type: 'community'
                },
                {
                    name: 'Kids Art Workshop',
                    date: '2024-02-10',
                    time: '2pm',
                    location: 'Public Library',
                    type: 'family'
                }
            ]
        });
    } catch (error) {
        console.error('Events error:', error);
        res.status(500).json({ error: 'Failed to get events' });
    }
});

export default router;

