import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Earth energy types
const ENERGY_TYPES = {
    leyLines: {
        name: 'Ley Lines',
        description: 'Ancient energy paths connecting sacred sites',
        benefit: 'Heightened spiritual awareness, creativity',
        challenge: 'Can be overstimulating for sleep',
        balancing: 'Use grounding crystals like black tourmaline'
    },
    waterVeins: {
        name: 'Underground Water Veins',
        description: 'Subterranean water flow creating electromagnetic disturbance',
        benefit: 'Fresh water access',
        challenge: 'May affect sleep if bed is above',
        balancing: 'Cork mat under bed, move bed position'
    },
    geopathicStress: {
        name: 'Geopathic Stress Zones',
        description: 'Disturbed earth energies from geological faults',
        benefit: 'None',
        challenge: 'Long-term health effects, poor sleep',
        balancing: 'Professional dowsing, earth acupuncture'
    },
    vortex: {
        name: 'Energy Vortex',
        description: 'Spiral energy centers in the earth',
        benefit: 'Meditation, healing, spiritual growth',
        challenge: 'Can be intense',
        balancing: 'Use for specific purposes, not constant living'
    },
    hartmannGrid: {
        name: 'Hartmann Grid Lines',
        description: 'Natural electromagnetic grid covering Earth',
        benefit: 'Neutral at nodes',
        challenge: 'Intersections may affect health',
        balancing: 'Avoid beds/desks at grid crossings'
    }
};

// ============================================
// ANALYZE LAND ENERGY
// ============================================
router.post('/analyze', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid().optional(),
            lat: z.number().optional(),
            lng: z.number().optional(),
            propertyHistory: z.object({
                previousUse: z.string().optional(),
                knownEvents: z.array(z.string()).optional(),
                yearBuilt: z.number().optional()
            }).optional(),
            observations: z.object({
                plantsThrive: z.boolean().optional(),
                petsAvoidAreas: z.boolean().optional(),
                unexplainedSymptoms: z.boolean().optional(),
                sleepIssuesInCertainRooms: z.boolean().optional()
            }).optional()
        }).parse(req.body);

        const analysis = generateLandEnergyAnalysis(data);

        res.json({
            landEnergyScore: analysis.score,
            grade: getEnergyGrade(analysis.score),
            detectedEnergies: analysis.energies,
            concerns: analysis.concerns,
            positiveAspects: analysis.positives,
            recommendations: analysis.recommendations,
            clearingRituals: getClearingRituals(analysis),
            crystalRecommendations: getCrystalRecommendations(analysis)
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Land energy error:', error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

function generateLandEnergyAnalysis(data: any): any {
    let score = 75;
    const energies: any[] = [];
    const concerns: string[] = [];
    const positives: string[] = [];
    const recommendations: string[] = [];

    // Analyze based on observations
    if (data.observations?.plantsThrive) {
        score += 10;
        positives.push('Plants thriving indicates healthy earth energy');
    }

    if (data.observations?.petsAvoidAreas) {
        score -= 10;
        concerns.push('Animals naturally sense geopathic stress zones');
        energies.push({ type: 'geopathicStress', likelihood: 'High', ...ENERGY_TYPES.geopathicStress });
    }

    if (data.observations?.unexplainedSymptoms) {
        score -= 15;
        concerns.push('Unexplained symptoms may indicate disturbed energies');
        recommendations.push('Consider professional dowsing or geomancy consultation');
    }

    if (data.observations?.sleepIssuesInCertainRooms) {
        score -= 10;
        concerns.push('Sleep issues in specific rooms suggest localized disturbances');
        recommendations.push('Try moving bed position within the room');
        energies.push({ type: 'waterVeins', likelihood: 'Medium', ...ENERGY_TYPES.waterVeins });
    }

    // Property history considerations
    if (data.propertyHistory?.previousUse) {
        const negativeHistory = ['hospital', 'cemetery', 'battlefield', 'prison', 'slaughterhouse'];
        if (negativeHistory.some(h => data.propertyHistory.previousUse.toLowerCase().includes(h))) {
            score -= 20;
            concerns.push(`Previous use as ${data.propertyHistory.previousUse} may carry residual energy`);
            recommendations.push('Perform space clearing ceremony');
        }
    }

    // Random positive energy detection
    if (Math.random() > 0.7) {
        positives.push('Property appears to be near a minor ley line - enhanced creativity potential');
        energies.push({ type: 'leyLines', likelihood: 'Medium', ...ENERGY_TYPES.leyLines });
    }

    return {
        score: Math.max(0, Math.min(100, score)),
        energies,
        concerns,
        positives,
        recommendations
    };
}

function getEnergyGrade(score: number): string {
    if (score >= 85) return 'A (Excellent Energy)';
    if (score >= 70) return 'B (Good Energy)';
    if (score >= 55) return 'C (Needs Balancing)';
    if (score >= 40) return 'D (Significant Issues)';
    return 'F (Major Clearing Needed)';
}

function getClearingRituals(analysis: any): any[] {
    const rituals = [
        {
            name: 'Smoke Clearing (Smudging)',
            description: 'Burn sage, palo santo, or cedar to purify space',
            bestFor: 'General energy refresh, moving into new space',
            frequency: 'Monthly or after negative events'
        },
        {
            name: 'Salt Clearing',
            description: 'Place bowls of sea salt in corners, replace weekly',
            bestFor: 'Absorbing negative energies',
            frequency: 'Ongoing'
        },
        {
            name: 'Sound Clearing',
            description: 'Use singing bowls, bells, or clapping in corners',
            bestFor: 'Breaking up stagnant energy',
            frequency: 'Weekly or as needed'
        }
    ];

    if (analysis.concerns.length > 2) {
        rituals.push({
            name: 'Professional Space Clearing',
            description: 'Hire a trained practitioner for deep cleansing',
            bestFor: 'Significant disturbances, persistent issues',
            frequency: 'One-time, then maintain'
        });
    }

    return rituals;
}

function getCrystalRecommendations(analysis: any): any[] {
    const crystals = [
        {
            name: 'Black Tourmaline',
            placement: 'Near entrances and corners',
            purpose: 'Protection, grounding, EMF shielding',
            priority: 'Essential'
        },
        {
            name: 'Clear Quartz',
            placement: 'Central areas, windowsills',
            purpose: 'Energy amplification, clarity',
            priority: 'Recommended'
        },
        {
            name: 'Selenite',
            placement: 'Bedroom, meditation space',
            purpose: 'Cleansing, high vibration, peaceful sleep',
            priority: 'Recommended'
        },
        {
            name: 'Shungite',
            placement: 'Near electronics',
            purpose: 'EMF protection, purification',
            priority: analysis.concerns.length > 0 ? 'High' : 'Optional'
        }
    ];

    if (analysis.energies.some((e: any) => e.type === 'geopathicStress')) {
        crystals.push({
            name: 'Orgonite Pyramid',
            placement: 'Under bed or affected areas',
            purpose: 'Transform negative energy to positive',
            priority: 'High'
        });
    }

    return crystals;
}

// ============================================
// GET ENERGY TYPES INFO
// ============================================
router.get('/energy-types', (req: Request, res: Response) => {
    res.json({ energyTypes: ENERGY_TYPES });
});

// ============================================
// DOWSING CHECKLIST
// ============================================
router.get('/dowsing-checklist', (req: Request, res: Response) => {
    res.json({
        preDowsingPreparation: [
            'Clear your own energy through meditation',
            'Set clear intention for what you\'re seeking',
            'Ensure you are hydrated and grounded'
        ],
        areasToCheck: [
            'All bedroom positions, especially head of bed',
            'Home office desk location',
            'Main sitting areas in living room',
            'Kitchen and dining areas'
        ],
        signsOfDisturbance: [
            'Pendulum spins or swings erratically',
            'Dowsing rods cross repeatedly in same spots',
            'You feel uneasy or headachy in certain areas'
        ],
        whenToHireProfessional: [
            'Persistent health issues with no medical cause',
            'Multiple family members feeling unwell',
            'Pets consistently avoiding areas',
            'Previous negative history on the land'
        ]
    });
});

export default router;

