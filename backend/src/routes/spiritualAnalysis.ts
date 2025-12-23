// Feng Shui, Sacred Geometry, and Land Energy Routes
import { Router, Request, Response } from 'express';
import { fengShuiService } from '../services/fengShui';
import { sacredGeometryService, landEnergyService } from '../services/sacredGeometry';
import { logger } from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /fengshui/analyze:
 *   post:
 *     summary: Analyze Feng Shui for a property
 *     tags: [Feng Shui]
 */
router.post('/fengshui/analyze', async (req: Request, res: Response) => {
    try {
        const { facing, yearBuilt, floorPlan } = req.body;

        if (!facing) {
            return res.status(400).json({ success: false, error: 'Facing direction is required' });
        }

        const analysis = await fengShuiService.analyzeFengShui({
            facing,
            yearBuilt,
            floorPlan,
        });

        res.json({ success: true, data: analysis });
    } catch (error) {
        logger.error('Feng Shui analysis error:', error);
        res.status(500).json({ success: false, error: 'Failed to analyze Feng Shui' });
    }
});

/**
 * @swagger
 * /fengshui/bagua:
 *   get:
 *     summary: Get Bagua Map information
 *     tags: [Feng Shui]
 */
router.get('/fengshui/bagua', async (req: Request, res: Response) => {
    const baguaMap = {
        NORTH: { area: 'Career', element: 'Water', colors: ['Black', 'Blue'], number: 1 },
        NORTHEAST: { area: 'Knowledge', element: 'Earth', colors: ['Blue', 'Green'], number: 8 },
        EAST: { area: 'Family', element: 'Wood', colors: ['Green'], number: 3 },
        SOUTHEAST: { area: 'Wealth', element: 'Wood', colors: ['Purple', 'Green'], number: 4 },
        SOUTH: { area: 'Fame', element: 'Fire', colors: ['Red', 'Orange'], number: 9 },
        SOUTHWEST: { area: 'Love', element: 'Earth', colors: ['Pink', 'White'], number: 2 },
        WEST: { area: 'Creativity', element: 'Metal', colors: ['White', 'Gray'], number: 7 },
        NORTHWEST: { area: 'Helpful People', element: 'Metal', colors: ['Gray', 'White'], number: 6 },
        CENTER: { area: 'Health', element: 'Earth', colors: ['Yellow', 'Brown'], number: 5 },
    };

    res.json({ success: true, data: baguaMap });
});

/**
 * @swagger
 * /fengshui/elements:
 *   get:
 *     summary: Get Five Elements information
 *     tags: [Feng Shui]
 */
router.get('/fengshui/elements', async (req: Request, res: Response) => {
    const elements = {
        WOOD: { produces: 'FIRE', destroys: 'EARTH', color: 'Green', season: 'Spring', organ: 'Liver' },
        FIRE: { produces: 'EARTH', destroys: 'METAL', color: 'Red', season: 'Summer', organ: 'Heart' },
        EARTH: { produces: 'METAL', destroys: 'WATER', color: 'Yellow', season: 'Late Summer', organ: 'Spleen' },
        METAL: { produces: 'WATER', destroys: 'WOOD', color: 'White', season: 'Autumn', organ: 'Lungs' },
        WATER: { produces: 'WOOD', destroys: 'FIRE', color: 'Black/Blue', season: 'Winter', organ: 'Kidneys' },
    };

    res.json({ success: true, data: elements });
});

/**
 * @swagger
 * /sacred-geometry/analyze:
 *   post:
 *     summary: Analyze Sacred Geometry of a property
 *     tags: [Sacred Geometry]
 */
router.post('/sacred-geometry/analyze', async (req: Request, res: Response) => {
    try {
        const { roomDimensions, plotDimensions, architecturalFeatures } = req.body;

        const analysis = await sacredGeometryService.analyze({
            roomDimensions,
            plotDimensions,
            architecturalFeatures,
        });

        res.json({ success: true, data: analysis });
    } catch (error) {
        logger.error('Sacred Geometry analysis error:', error);
        res.status(500).json({ success: false, error: 'Failed to analyze Sacred Geometry' });
    }
});

/**
 * @swagger
 * /sacred-geometry/yantras:
 *   get:
 *     summary: Get Yantra recommendations
 *     tags: [Sacred Geometry]
 */
router.get('/sacred-geometry/yantras', async (req: Request, res: Response) => {
    const yantras = [
        {
            name: 'Sri Yantra',
            purpose: 'Abundance, prosperity, and spiritual growth',
            geometry: '9 interlocking triangles forming 43 smaller triangles',
            placement: 'Northeast corner, prayer room, or meditation space',
            deity: 'Sri Lakshmi / Tripura Sundari',
        },
        {
            name: 'Kubera Yantra',
            purpose: 'Wealth, financial success, and business growth',
            geometry: 'Square-based design with bindu',
            placement: 'North wall, safe, or treasury area',
            deity: 'Lord Kubera',
        },
        {
            name: 'Vastu Yantra',
            purpose: 'Correct Vastu defects and harmonize space',
            geometry: 'Complex geometric pattern for spatial balance',
            placement: 'Center of home (Brahmasthan) or defective zone',
            deity: 'Vastu Purusha',
        },
        {
            name: 'Shree Yantra',
            purpose: 'Success, fame, and recognition',
            geometry: 'Lotus petals surrounding triangular matrix',
            placement: 'South wall of living room or office',
            deity: 'Various prosperity deities',
        },
        {
            name: 'Navgraha Yantra',
            purpose: 'Planetary balance and astrological harmony',
            geometry: '9 squares representing 9 planets',
            placement: 'East-facing altar',
            deity: 'Nine planetary deities',
        },
    ];

    res.json({ success: true, data: yantras });
});

/**
 * @swagger
 * /land-energy/analyze:
 *   post:
 *     summary: Analyze Land Energy (Bhumi Shuddhi)
 *     tags: [Land Energy]
 */
router.post('/land-energy/analyze', async (req: Request, res: Response) => {
    try {
        const { latitude, longitude, historicalUse, soilType, waterSources, ancientTrees } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ success: false, error: 'Latitude and longitude are required' });
        }

        const analysis = await landEnergyService.analyze({
            latitude,
            longitude,
            historicalUse,
            soilType,
            waterSources,
            ancientTrees,
        });

        res.json({ success: true, data: analysis });
    } catch (error) {
        logger.error('Land Energy analysis error:', error);
        res.status(500).json({ success: false, error: 'Failed to analyze Land Energy' });
    }
});

/**
 * @swagger
 * /land-energy/purification:
 *   get:
 *     summary: Get land purification rituals
 *     tags: [Land Energy]
 */
router.get('/land-energy/purification', async (req: Request, res: Response) => {
    const rituals = [
        {
            name: 'Bhumi Puja',
            description: 'Land worship ceremony before construction',
            timing: 'Shukla Paksha (waxing moon), preferably on Thursday or Friday',
            duration: '2-3 hours',
            requirements: ['Kalash', 'Flowers', 'Fruits', 'Incense', 'Vermillion', 'Rice'],
        },
        {
            name: 'Bhumi Shuddhi',
            description: 'Deep land purification for negative energy removal',
            timing: 'During Brahma Muhurta or Abhijit Muhurta',
            duration: '3-7 days',
            requirements: ['Cow dung', 'Gomutra', 'Gangajal', 'Camphor', 'Neem leaves'],
        },
        {
            name: 'Vastu Shanti',
            description: 'Ceremony to appease Vastu Purusha and remove defects',
            timing: 'Auspicious muhurta calculated by priest',
            duration: '4-6 hours',
            requirements: ['Havan samagri', 'Ghee', 'Woods', 'Specific mantras'],
        },
        {
            name: 'Griha Pravesh',
            description: 'Auspicious house entering ceremony',
            timing: 'During Uttarayan, avoiding eclipses and inauspicious days',
            duration: '2-4 hours',
            requirements: ['Milk', 'Rice', 'New vessels', 'Lamps', 'Flowers'],
        },
    ];

    res.json({ success: true, data: rituals });
});

export default router;

