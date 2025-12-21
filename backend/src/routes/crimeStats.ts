import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Crime categories
const CRIME_CATEGORIES = {
    violent: ['Assault', 'Robbery', 'Homicide', 'Sexual Assault'],
    property: ['Burglary', 'Theft', 'Motor Vehicle Theft', 'Vandalism'],
    other: ['Drug Offenses', 'DUI', 'Fraud', 'Trespassing']
};

// ============================================
// GET CRIME STATS FOR AREA
// ============================================
router.get('/stats/:location', async (req: Request, res: Response) => {
    try {
        const { location } = req.params;
        const { radius } = req.query;

        // In production, would call CrimeMapping API or local police data
        const stats = generateCrimeStats();

        res.json({
            location,
            radius: radius || '1 mile',
            period: 'Last 12 months',
            ...stats,
            comparedToNational: getComparisonToNational(stats.totalCrimes),
            trend: 'Decreasing (-8% from last year)'
        });
    } catch (error) {
        console.error('Crime stats error:', error);
        res.status(500).json({ error: 'Failed to get crime stats' });
    }
});

function generateCrimeStats(): any {
    const violentCrimes = Math.floor(Math.random() * 30) + 5;
    const propertyCrimes = Math.floor(Math.random() * 150) + 50;
    const otherCrimes = Math.floor(Math.random() * 80) + 20;
    const totalCrimes = violentCrimes + propertyCrimes + otherCrimes;

    return {
        totalCrimes,
        crimeRate: Math.round(totalCrimes / 10), // per 1000 residents
        breakdown: {
            violent: {
                total: violentCrimes,
                percentage: Math.round((violentCrimes / totalCrimes) * 100),
                types: {
                    assault: Math.floor(violentCrimes * 0.6),
                    robbery: Math.floor(violentCrimes * 0.3),
                    other: Math.floor(violentCrimes * 0.1)
                }
            },
            property: {
                total: propertyCrimes,
                percentage: Math.round((propertyCrimes / totalCrimes) * 100),
                types: {
                    theft: Math.floor(propertyCrimes * 0.5),
                    burglary: Math.floor(propertyCrimes * 0.3),
                    vehicleTheft: Math.floor(propertyCrimes * 0.2)
                }
            },
            other: {
                total: otherCrimes,
                percentage: Math.round((otherCrimes / totalCrimes) * 100)
            }
        },
        safetyScore: calculateSafetyScore(totalCrimes)
    };
}

function calculateSafetyScore(totalCrimes: number): any {
    // Lower crimes = higher score
    const score = Math.max(0, Math.min(100, 100 - (totalCrimes / 3)));

    return {
        score: Math.round(score),
        grade: score >= 80 ? 'A (Very Safe)' :
            score >= 65 ? 'B (Safe)' :
                score >= 50 ? 'C (Moderate)' :
                    score >= 35 ? 'D (Below Average)' : 'F (High Crime)',
        description: score >= 65 ? 'Crime rates are below average for the area' :
            'Consider additional security measures'
    };
}

function getComparisonToNational(totalCrimes: number): any {
    const nationalAverage = 200; // hypothetical
    const ratio = totalCrimes / nationalAverage;

    return {
        vsNational: ratio < 0.7 ? 'Much Lower' :
            ratio < 0.9 ? 'Lower' :
                ratio < 1.1 ? 'Average' :
                    ratio < 1.3 ? 'Higher' : 'Much Higher',
        percentDifference: `${Math.round((1 - ratio) * 100)}%`
    };
}

// ============================================
// GET SAFETY SCORE FOR PROPERTY
// ============================================
router.get('/safety-score/:propertyId', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;

        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        const stats = generateCrimeStats();

        res.json({
            propertyId,
            address: `${property.street}, ${property.city}`,
            safetyScore: stats.safetyScore,
            crimeStats: {
                violentCrimes: stats.breakdown.violent.total,
                propertyCrimes: stats.breakdown.property.total,
                totalCrimes: stats.totalCrimes
            },
            recommendations: getSafetyRecommendations(stats.safetyScore.score),
            nearestPoliceStation: {
                name: 'Central Police Station',
                distance: '1.2 mi',
                responseTime: '4 min average'
            }
        });
    } catch (error) {
        console.error('Safety score error:', error);
        res.status(500).json({ error: 'Failed to get safety score' });
    }
});

function getSafetyRecommendations(score: number): string[] {
    const recs: string[] = [];

    if (score < 50) {
        recs.push('Consider a home security system');
        recs.push('Install outdoor lighting');
        recs.push('Join neighborhood watch program');
    }

    recs.push('Review insurance coverage');
    recs.push('Meet your neighbors');

    if (score >= 70) {
        recs.push('Area is generally safe for outdoor activities');
    }

    return recs;
}

// ============================================
// CRIME HEATMAP DATA
// ============================================
router.get('/heatmap', async (req: Request, res: Response) => {
    try {
        const { lat, lng, radius } = req.query;

        // Generate random crime locations for heatmap
        const centerLat = parseFloat(lat as string) || 34.0522;
        const centerLng = parseFloat(lng as string) || -118.2437;
        const radiusVal = parseFloat(radius as string) || 0.05;

        const incidents: any[] = [];
        for (let i = 0; i < 50; i++) {
            incidents.push({
                lat: centerLat + (Math.random() - 0.5) * radiusVal * 2,
                lng: centerLng + (Math.random() - 0.5) * radiusVal * 2,
                weight: Math.random(),
                type: Math.random() > 0.7 ? 'violent' : 'property'
            });
        }

        res.json({
            center: { lat: centerLat, lng: centerLng },
            radius: radiusVal,
            incidents,
            note: 'Data for visualization purposes'
        });
    } catch (error) {
        console.error('Heatmap error:', error);
        res.status(500).json({ error: 'Failed to get heatmap data' });
    }
});

// ============================================
// RECENT INCIDENTS
// ============================================
router.get('/recent/:location', async (req: Request, res: Response) => {
    try {
        const { location } = req.params;

        const incidents = [
            {
                id: 'inc_1',
                type: 'Theft',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                location: '100 block of Main St',
                description: 'Theft from vehicle',
                status: 'Under Investigation'
            },
            {
                id: 'inc_2',
                type: 'Vandalism',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                location: '200 block of Oak Ave',
                description: 'Graffiti on building',
                status: 'Resolved'
            },
            {
                id: 'inc_3',
                type: 'Vehicle Theft',
                date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                location: 'Plaza parking garage',
                description: 'Stolen vehicle recovered',
                status: 'Closed'
            }
        ];

        res.json({
            location,
            period: 'Last 30 days',
            incidents,
            totalIncidents: incidents.length,
            emergency: '911',
            nonEmergency: '(555) 123-4567'
        });
    } catch (error) {
        console.error('Recent incidents error:', error);
        res.status(500).json({ error: 'Failed to get incidents' });
    }
});

export default router;
