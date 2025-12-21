import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// EMF exposure guidelines (in V/m for electric, μT for magnetic)
const EMF_GUIDELINES = {
    electric: {
        safe: 10, // V/m
        moderate: 100,
        high: 500,
        extreme: 1000
    },
    magnetic: {
        safe: 0.2, // μT
        moderate: 0.5,
        high: 2,
        extreme: 10
    },
    radioFrequency: {
        safe: 0.1, // W/m²
        moderate: 0.5,
        high: 2,
        extreme: 10
    }
};

// Common EMF sources
const EMF_SOURCES = {
    cellTower: {
        name: 'Cell Phone Tower',
        typicalRange: '100-1000m impact',
        mitigations: ['Distance is best protection', 'EMF blocking paint on facing walls', 'Metallic window film']
    },
    powerLines: {
        name: 'High Voltage Power Lines',
        typicalRange: '50-300m impact',
        mitigations: ['Maintain 100m+ distance', 'Shield with trees/hedges', 'Ground floor living']
    },
    wifi: {
        name: 'WiFi Routers',
        typicalRange: '3-10m',
        mitigations: ['Turn off at night', 'Use wired connections', 'Position away from bedrooms']
    },
    smartMeter: {
        name: 'Smart Meters',
        typicalRange: '1-3m',
        mitigations: ['Request analog meter', 'Shield with EMF fabric', 'Locate away from sleeping areas']
    },
    microwave: {
        name: 'Microwave Oven',
        typicalRange: '1-2m when operating',
        mitigations: ['Stand back when running', 'Check door seal', 'Consider alternatives']
    },
    electrical: {
        name: 'Electrical Wiring',
        typicalRange: '0.5-2m from walls',
        mitigations: ['Demand switches for bedrooms', 'Distance bed from walls', 'Reduce electronics']
    }
};

// ============================================
// PROPERTY EMF ASSESSMENT
// ============================================
router.post('/assess', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid().optional(),
            lat: z.number().optional(),
            lng: z.number().optional(),
            nearbySources: z.array(z.object({
                type: z.string(),
                distanceMeters: z.number(),
                direction: z.string().optional()
            })).optional(),
            internalSources: z.array(z.object({
                type: z.string(),
                room: z.string(),
                quantity: z.number().optional()
            })).optional()
        }).parse(req.body);

        const externalRisk = assessExternalRisk(data.nearbySources || []);
        const internalRisk = assessInternalRisk(data.internalSources || []);
        const overallScore = calculateEMFScore(externalRisk, internalRisk);

        res.json({
            emfScore: overallScore,
            grade: getGrade(overallScore),
            externalRisk,
            internalRisk,
            hotspots: identifyHotspots(data.internalSources || []),
            recommendations: generateEMFRecommendations(externalRisk, internalRisk),
            professionalAssessmentNeeded: overallScore < 60
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('EMF assessment error:', error);
        res.status(500).json({ error: 'Assessment failed' });
    }
});

function assessExternalRisk(sources: any[]): any {
    let totalRisk = 0;
    const sourceDetails: any[] = [];

    for (const source of sources) {
        const sourceInfo = EMF_SOURCES[source.type as keyof typeof EMF_SOURCES];
        if (!sourceInfo) continue;

        // Risk decreases with distance (inverse square law)
        let risk = 100;
        if (source.distanceMeters > 50) risk *= 0.5;
        if (source.distanceMeters > 100) risk *= 0.3;
        if (source.distanceMeters > 300) risk *= 0.1;
        if (source.distanceMeters > 1000) risk *= 0.05;

        totalRisk += risk;
        sourceDetails.push({
            type: source.type,
            name: sourceInfo.name,
            distance: source.distanceMeters,
            riskLevel: risk > 50 ? 'High' : risk > 20 ? 'Moderate' : 'Low',
            mitigations: sourceInfo.mitigations
        });
    }

    return {
        level: totalRisk > 100 ? 'High' : totalRisk > 50 ? 'Moderate' : 'Low',
        score: Math.max(0, 100 - totalRisk),
        sources: sourceDetails
    };
}

function assessInternalRisk(sources: any[]): any {
    let totalRisk = 0;
    const roomRisks: Record<string, number> = {};

    for (const source of sources) {
        const quantity = source.quantity || 1;
        let risk = 10 * quantity;

        // Higher risk for bedroom sources
        if (['bedroom', 'master bedroom', 'nursery'].includes(source.room.toLowerCase())) {
            risk *= 2;
        }

        totalRisk += risk;
        roomRisks[source.room] = (roomRisks[source.room] || 0) + risk;
    }

    return {
        level: totalRisk > 80 ? 'High' : totalRisk > 40 ? 'Moderate' : 'Low',
        score: Math.max(0, 100 - totalRisk),
        byRoom: roomRisks
    };
}

function calculateEMFScore(external: any, internal: any): number {
    // Weight external higher as it's harder to control
    return Math.round(external.score * 0.6 + internal.score * 0.4);
}

function identifyHotspots(sources: any[]): string[] {
    const hotspots: string[] = [];
    const roomCounts: Record<string, number> = {};

    for (const source of sources) {
        roomCounts[source.room] = (roomCounts[source.room] || 0) + 1;
    }

    for (const [room, count] of Object.entries(roomCounts)) {
        if (count >= 3) {
            hotspots.push(`${room} (${count} sources)`);
        }
    }

    return hotspots;
}

function generateEMFRecommendations(external: any, internal: any): string[] {
    const recs: string[] = [];

    if (external.level === 'High') {
        recs.push('Consider professional EMF shielding for exterior walls');
        recs.push('Install EMF blocking window film on affected sides');
    }

    if (internal.level !== 'Low') {
        recs.push('Remove electronics from bedrooms');
        recs.push('Use wired internet instead of WiFi');
        recs.push('Turn off WiFi router at night');
    }

    recs.push('Use battery-powered alarm clocks instead of plug-in');
    recs.push('Keep phones and tablets in airplane mode when not in use');

    return recs;
}

function getGrade(score: number): string {
    if (score >= 90) return 'A+ (Very Low EMF)';
    if (score >= 80) return 'A (Low EMF)';
    if (score >= 70) return 'B (Moderate EMF)';
    if (score >= 60) return 'C (Elevated EMF)';
    return 'D (High EMF - Address Required)';
}

// ============================================
// GET EMF SOURCES INFO
// ============================================
router.get('/sources', (req: Request, res: Response) => {
    res.json({ sources: EMF_SOURCES, guidelines: EMF_GUIDELINES });
});

// ============================================
// BEDROOM EMF CHECK
// ============================================
router.post('/bedroom-check', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            hasPhoneChargerNearBed: z.boolean(),
            hasWifiRouterNearby: z.boolean(),
            hasElectricBlanket: z.boolean(),
            hasPlugInAlarmClock: z.boolean(),
            hasTVInBedroom: z.boolean(),
            bedNearOuterWall: z.boolean(),
            smartMeterNearBedroom: z.boolean()
        }).parse(req.body);

        let score = 100;
        const issues: string[] = [];
        const solutions: string[] = [];

        if (data.hasPhoneChargerNearBed) {
            score -= 15;
            issues.push('Phone charger near bed');
            solutions.push('Move charger at least 6 feet from bed');
        }

        if (data.hasWifiRouterNearby) {
            score -= 20;
            issues.push('WiFi router nearby');
            solutions.push('Move router to another room or use timer to turn off at night');
        }

        if (data.hasElectricBlanket) {
            score -= 25;
            issues.push('Electric blanket');
            solutions.push('Replace with hot water bottle or heated mattress pad (turned off before sleep)');
        }

        if (data.hasPlugInAlarmClock) {
            score -= 10;
            issues.push('Plug-in alarm clock');
            solutions.push('Switch to battery-powered or phone alarm across room');
        }

        if (data.hasTVInBedroom) {
            score -= 15;
            issues.push('TV in bedroom');
            solutions.push('Remove TV or unplug when not in use');
        }

        if (data.bedNearOuterWall) {
            score -= 5;
            issues.push('Bed near outer wall');
            solutions.push('Move bed 1-2 feet from wall if power lines nearby');
        }

        if (data.smartMeterNearBedroom) {
            score -= 20;
            issues.push('Smart meter near bedroom');
            solutions.push('Request analog meter or use shielding');
        }

        res.json({
            bedroomEMFScore: Math.max(0, score),
            grade: getGrade(Math.max(0, score)),
            issuesFound: issues.length,
            issues,
            solutions,
            sleepQualityImpact: score < 60 ? 'Likely affecting sleep' : 'Minimal impact'
        });
    } catch (error) {
        console.error('Bedroom check error:', error);
        res.status(500).json({ error: 'Check failed' });
    }
});

export default router;
