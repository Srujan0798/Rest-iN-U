import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// FIVE ELEMENTS (PANCHA BHUTA) ANALYSIS
// ============================================
const ELEMENTS = {
    earth: {
        name: 'Earth (Prithvi)',
        directions: ['Southwest', 'Center'],
        colors: ['Yellow', 'Brown', 'Beige', 'Terracotta'],
        materials: ['Stone', 'Clay', 'Ceramic', 'Brick'],
        rooms: ['Master Bedroom', 'Storage'],
        shapes: ['Square', 'Rectangle'],
        healthAspects: ['Stability', 'Grounding', 'Strength'],
        balanceWith: ['Metal', 'Fire'],
        conflictsWith: ['Water']
    },
    water: {
        name: 'Water (Jala)',
        directions: ['North', 'Northeast'],
        colors: ['Blue', 'Black', 'Navy', 'Teal'],
        materials: ['Glass', 'Mirror', 'Crystal'],
        rooms: ['Bathroom', 'Pool area', 'Fountain'],
        shapes: ['Wavy', 'Irregular'],
        healthAspects: ['Kidney', 'Emotions', 'Flexibility'],
        balanceWith: ['Wood', 'Metal'],
        conflictsWith: ['Fire']
    },
    fire: {
        name: 'Fire (Agni)',
        directions: ['South', 'Southeast'],
        colors: ['Red', 'Orange', 'Purple', 'Pink'],
        materials: ['Candles', 'Fireplace', 'Electrical'],
        rooms: ['Kitchen', 'Living Room'],
        shapes: ['Triangle', 'Pointed'],
        healthAspects: ['Heart', 'Digestion', 'Passion'],
        balanceWith: ['Earth', 'Wood'],
        conflictsWith: ['Water']
    },
    air: {
        name: 'Air (Vayu)',
        directions: ['East', 'Northwest'],
        colors: ['White', 'Grey', 'Pastels'],
        materials: ['Wind chimes', 'Fabric', 'Paper'],
        rooms: ['Living areas', 'Entryway'],
        shapes: ['Circular', 'Arch'],
        healthAspects: ['Lungs', 'Movement', 'Communication'],
        balanceWith: ['Water', 'Space'],
        conflictsWith: ['Earth']
    },
    space: {
        name: 'Space (Akasha)',
        directions: ['Center', 'All'],
        colors: ['Light Blue', 'White', 'Transparent'],
        materials: ['Open spaces', 'High ceilings'],
        rooms: ['Courtyard', 'Meditation room'],
        shapes: ['Open', 'Expansive'],
        healthAspects: ['Mind', 'Spirit', 'Intuition'],
        balanceWith: ['All elements'],
        conflictsWith: ['None']
    }
};

router.post('/analyze', async (req: Request, res: Response) => {
    try {
        const data = z.object({
            entranceDirection: z.string(),
            kitchenDirection: z.string(),
            bedroomDirection: z.string(),
            bathroomDirection: z.string(),
            dominantColors: z.array(z.string()),
            hasWaterFeature: z.boolean().optional(),
            hasFireplace: z.boolean().optional(),
            hasOpenCourtyard: z.boolean().optional()
        }).parse(req.body);

        // Calculate element balance
        const balance = calculateElementBalance(data);
        const score = calculateFiveElementScore(balance);
        const recommendations = generateElementRecommendations(balance);

        res.json({
            fiveElementScore: score,
            grade: getGrade(score),
            elementBalance: balance,
            dominantElement: getDominantElement(balance),
            deficientElement: getDeficientElement(balance),
            recommendations,
            colorSuggestions: getColorSuggestions(balance),
            roomPlacements: getRoomPlacements(data)
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Five elements error:', error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

function calculateElementBalance(data: any): Record<string, number> {
    const balance: Record<string, number> = {
        earth: 20,
        water: 20,
        fire: 20,
        air: 20,
        space: 20
    };

    // Direction-based adjustments
    const directionMap: Record<string, string> = {
        'North': 'water', 'Northeast': 'water',
        'South': 'fire', 'Southeast': 'fire',
        'Southwest': 'earth', 'Center': 'earth',
        'East': 'air', 'Northwest': 'air',
        'West': 'space'
    };

    // Kitchen affects fire element
    if (['South', 'Southeast'].includes(data.kitchenDirection)) {
        balance.fire += 15;
    } else if (['North', 'Northeast'].includes(data.kitchenDirection)) {
        balance.fire -= 10; // Fire in water direction = imbalance
        balance.water -= 10;
    }

    // Bedroom affects earth element
    if (['Southwest', 'South'].includes(data.bedroomDirection)) {
        balance.earth += 10;
    }

    // Water features
    if (data.hasWaterFeature) {
        balance.water += 15;
    }

    // Fireplace
    if (data.hasFireplace) {
        balance.fire += 10;
    }

    // Open courtyard
    if (data.hasOpenCourtyard) {
        balance.space += 15;
        balance.air += 10;
    }

    // Normalize to 0-100
    const total = Object.values(balance).reduce((a, b) => a + b, 0);
    for (const key of Object.keys(balance)) {
        balance[key] = Math.round((balance[key] / total) * 100);
    }

    return balance;
}

function calculateFiveElementScore(balance: Record<string, number>): number {
    // Ideal is 20% each. Calculate deviation from ideal.
    const ideal = 20;
    let totalDeviation = 0;

    for (const value of Object.values(balance)) {
        totalDeviation += Math.abs(value - ideal);
    }

    // Max deviation would be 160 (all in one element)
    // Score = 100 - (deviation/160 * 100)
    return Math.round(100 - (totalDeviation / 160 * 100));
}

function getDominantElement(balance: Record<string, number>): string {
    return Object.entries(balance).sort((a, b) => b[1] - a[1])[0][0];
}

function getDeficientElement(balance: Record<string, number>): string {
    return Object.entries(balance).sort((a, b) => a[1] - b[1])[0][0];
}

function generateElementRecommendations(balance: Record<string, number>): string[] {
    const recs: string[] = [];
    const deficient = getDeficientElement(balance);
    const element = ELEMENTS[deficient as keyof typeof ELEMENTS];

    if (balance[deficient] < 15) {
        recs.push(`Enhance ${element.name} by adding ${element.colors.join(' or ')} colors`);
        recs.push(`Place ${element.materials.join(' or ')} in the ${element.directions[0]} area`);
    }

    const dominant = getDominantElement(balance);
    if (balance[dominant] > 30) {
        const domElement = ELEMENTS[dominant as keyof typeof ELEMENTS];
        recs.push(`Reduce excess ${domElement.name} by introducing elements that balance it`);
    }

    return recs;
}

function getColorSuggestions(balance: Record<string, number>): Record<string, string[]> {
    const deficient = getDeficientElement(balance);
    const element = ELEMENTS[deficient as keyof typeof ELEMENTS];

    return {
        suggestedColors: element.colors,
        forElement: element.name,
        reason: `To enhance the ${deficient} element which is currently at ${balance[deficient]}%`
    } as any;
}

function getRoomPlacements(data: any): any[] {
    return [
        {
            room: 'Kitchen',
            currentDirection: data.kitchenDirection,
            idealDirections: ELEMENTS.fire.directions,
            isOptimal: ELEMENTS.fire.directions.includes(data.kitchenDirection)
        },
        {
            room: 'Master Bedroom',
            currentDirection: data.bedroomDirection,
            idealDirections: ELEMENTS.earth.directions,
            isOptimal: ELEMENTS.earth.directions.includes(data.bedroomDirection)
        },
        {
            room: 'Bathroom',
            currentDirection: data.bathroomDirection,
            idealDirections: ELEMENTS.water.directions,
            isOptimal: ELEMENTS.water.directions.includes(data.bathroomDirection)
        }
    ];
}

function getGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
}

// ============================================
// GET ELEMENT INFO
// ============================================
router.get('/elements', (req: Request, res: Response) => {
    res.json({ elements: ELEMENTS });
});

// ============================================
// ELEMENT REMEDIES
// ============================================
router.get('/remedies/:element', (req: Request, res: Response) => {
    const { element } = req.params;
    const el = ELEMENTS[element.toLowerCase() as keyof typeof ELEMENTS];

    if (!el) {
        return res.status(404).json({ error: 'Element not found' });
    }

    res.json({
        element: el.name,
        toEnhance: {
            colors: el.colors,
            materials: el.materials,
            directions: el.directions,
            shapes: el.shapes
        },
        affectedRooms: el.rooms,
        healthBenefits: el.healthAspects,
        balancingElements: el.balanceWith,
        avoidWith: el.conflictsWith
    });
});

export default router;

