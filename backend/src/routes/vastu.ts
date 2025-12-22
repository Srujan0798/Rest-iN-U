// Vastu Shastra Analysis Routes
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { cacheGet, cacheSet, cacheDelete, CACHE_KEYS, CACHE_TTL } from '../utils/redis';
import { authenticate, optionalAuthenticate, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler, NotFoundError, BadRequestError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

// Vastu direction data
const VASTU_DIRECTIONS = {
    NORTH: { element: 'Water', deity: 'Kubera', ideal: ['entrance', 'water_feature', 'living_room'] },
    NORTHEAST: { element: 'Water', deity: 'Shiva', ideal: ['pooja_room', 'meditation', 'water_tank'] },
    EAST: { element: 'Fire', deity: 'Indra', ideal: ['entrance', 'living_room', 'study'] },
    SOUTHEAST: { element: 'Fire', deity: 'Agni', ideal: ['kitchen', 'electrical'] },
    SOUTH: { element: 'Fire', deity: 'Yama', ideal: ['master_bedroom', 'storage'] },
    SOUTHWEST: { element: 'Earth', deity: 'Pitru', ideal: ['master_bedroom', 'heavy_safe'] },
    WEST: { element: 'Air', deity: 'Varuna', ideal: ['bathroom', 'dining', 'children_room'] },
    NORTHWEST: { element: 'Air', deity: 'Vayu', ideal: ['guest_room', 'garage', 'bathroom'] },
    CENTER: { element: 'Space', deity: 'Brahma', ideal: ['courtyard', 'open_space'] },
};

// Vastu scoring weights
const SCORING_WEIGHTS = {
    entrance: 15,
    masterBedroom: 12,
    kitchen: 12,
    poojaRoom: 10,
    bathroom: 8,
    livingRoom: 8,
    plotShape: 10,
    slope: 8,
    waterSource: 7,
    staircase: 5,
    beams: 5,
};

// Validation schemas
const analyzePropertySchema = z.object({
    entranceDirection: z.enum(['NORTH', 'NORTHEAST', 'EAST', 'SOUTHEAST', 'SOUTH', 'SOUTHWEST', 'WEST', 'NORTHWEST']),
    plotOrientation: z.string(),
    plotShape: z.enum(['SQUARE', 'RECTANGLE', 'IRREGULAR', 'L_SHAPED', 'T_SHAPED']),
    slope: z.enum(['NORTH', 'NORTHEAST', 'EAST', 'FLAT', 'OTHER']).optional(),
    rooms: z.array(z.object({
        type: z.enum(['MASTER_BEDROOM', 'BEDROOM', 'KITCHEN', 'LIVING_ROOM', 'POOJA_ROOM', 'BATHROOM', 'STUDY', 'DINING', 'GUEST_ROOM', 'STORE_ROOM']),
        direction: z.enum(['NORTH', 'NORTHEAST', 'EAST', 'SOUTHEAST', 'SOUTH', 'SOUTHWEST', 'WEST', 'NORTHWEST', 'CENTER']),
        floor: z.number().int().min(0).optional(),
    })),
    waterSource: z.object({
        type: z.enum(['BORE_WELL', 'OVERHEAD_TANK', 'UNDERGROUND_TANK', 'MUNICIPAL']),
        direction: z.string(),
    }).optional(),
    staircase: z.object({
        direction: z.string(),
        rotationType: z.enum(['CLOCKWISE', 'ANTICLOCKWISE']),
    }).optional(),
    hasBeams: z.boolean().optional(),
    beamLocations: z.array(z.string()).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

const auspiciousTimingSchema = z.object({
    eventType: z.enum(['PROPERTY_VIEWING', 'MAKING_OFFER', 'SIGNING_CONTRACT', 'CLOSING', 'GRIHA_PRAVESH', 'RENOVATION_START']),
    dateOfBirth: z.string().optional(),
    birthTime: z.string().optional(),
    birthPlace: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

/**
 * @swagger
 * /vastu/analyze:
 *   post:
 *     summary: Perform Vastu analysis on property data
 *     tags: [Vastu]
 */
router.post('/analyze', asyncHandler(async (req: Request, res: Response) => {
    const data = analyzePropertySchema.parse(req.body);

    const analysis = performVastuAnalysis(data);

    res.json({ success: true, data: analysis });
}));

/**
 * @swagger
 * /vastu/property/{id}:
 *   get:
 *     summary: Get Vastu analysis for a property
 *     tags: [Vastu]
 */
router.get('/property/:id', asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const cacheKey = `${CACHE_KEYS.VASTU}${id}`;
    let analysis = await cacheGet(cacheKey);

    if (!analysis) {
        analysis = await prisma.vastuAnalysis.findUnique({
            where: { propertyId: id },
        });

        if (analysis) {
            await cacheSet(cacheKey, analysis, CACHE_TTL.LONG);
        }
    }

    if (!analysis) {
        throw new NotFoundError('Vastu analysis not found for this property');
    }

    res.json({ success: true, data: analysis });
}));

/**
 * @swagger
 * /vastu/property/{id}/analyze:
 *   post:
 *     summary: Create or update Vastu analysis for a property
 *     tags: [Vastu]
 *     security:
 *       - bearerAuth: []
 */
router.post('/property/:id/analyze', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const data = analyzePropertySchema.parse(req.body);

    const property = await prisma.property.findUnique({
        where: { id },
        select: { id: true, listingAgentId: true },
    });

    if (!property) {
        throw new NotFoundError('Property not found');
    }

    const analysisResult = performVastuAnalysis(data);

    const vastuAnalysis = await prisma.vastuAnalysis.upsert({
        where: { propertyId: id },
        create: {
            propertyId: id,
            overallScore: analysisResult.overallScore,
            grade: analysisResult.grade,
            entranceDirection: data.entranceDirection,
            entranceScore: analysisResult.directionalScores.entrance,
            plotOrientation: data.plotOrientation,
            plotScore: analysisResult.directionalScores.plot,
            northEastScore: analysisResult.directionalScores.NORTHEAST,
            eastScore: analysisResult.directionalScores.EAST,
            southEastScore: analysisResult.directionalScores.SOUTHEAST,
            southScore: analysisResult.directionalScores.SOUTH,
            southWestScore: analysisResult.directionalScores.SOUTHWEST,
            westScore: analysisResult.directionalScores.WEST,
            northWestScore: analysisResult.directionalScores.NORTHWEST,
            northScore: analysisResult.directionalScores.NORTH,
            centerScore: analysisResult.directionalScores.CENTER,
            kitchenPlacement: analysisResult.roomAnalysis.kitchen || {},
            masterBedroomPlacement: analysisResult.roomAnalysis.masterBedroom || {},
            bathroomPlacement: analysisResult.roomAnalysis.bathroom || {},
            poojaRoomPlacement: analysisResult.roomAnalysis.poojaRoom || {},
            studyRoomPlacement: analysisResult.roomAnalysis.study || {},
            livingRoomPlacement: analysisResult.roomAnalysis.livingRoom || {},
            defects: analysisResult.defects,
            criticalDefects: analysisResult.defects.filter((d: any) => d.severity === 'critical').length,
            moderateDefects: analysisResult.defects.filter((d: any) => d.severity === 'moderate').length,
            minorDefects: analysisResult.defects.filter((d: any) => d.severity === 'minor').length,
            remedies: analysisResult.remedies,
            totalRemedyCost: analysisResult.estimatedRemedyCost,
            slopeAnalysis: analysisResult.slopeAnalysis,
            waterSourceAnalysis: analysisResult.waterAnalysis,
            staircaseAnalysis: analysisResult.staircaseAnalysis,
        },
        update: {
            overallScore: analysisResult.overallScore,
            grade: analysisResult.grade,
            entranceDirection: data.entranceDirection,
            entranceScore: analysisResult.directionalScores.entrance,
            defects: analysisResult.defects,
            remedies: analysisResult.remedies,
            updatedAt: new Date(),
        },
    });

    await cacheDelete(`${CACHE_KEYS.VASTU}${id}`);
    await cacheDelete(`${CACHE_KEYS.PROPERTY}${id}`);

    logger.info(`Vastu analysis created/updated for property ${id}`);

    res.json({ success: true, data: vastuAnalysis });
}));

/**
 * @swagger
 * /vastu/rules:
 *   get:
 *     summary: Get Vastu rules and guidelines
 *     tags: [Vastu]
 */
router.get('/rules', asyncHandler(async (req: Request, res: Response) => {
    const rules = {
        directions: VASTU_DIRECTIONS,
        entranceGuidelines: {
            auspicious: ['NORTH', 'NORTHEAST', 'EAST'],
            neutral: ['NORTHWEST', 'WEST'],
            inauspicious: ['SOUTH', 'SOUTHWEST', 'SOUTHEAST'],
        },
        roomPlacement: {
            masterBedroom: { ideal: ['SOUTHWEST', 'SOUTH', 'WEST'], avoid: ['NORTHEAST', 'SOUTHEAST'] },
            kitchen: { ideal: ['SOUTHEAST', 'SOUTH'], avoid: ['NORTHEAST', 'NORTH', 'SOUTHWEST'] },
            poojaRoom: { ideal: ['NORTHEAST', 'EAST', 'NORTH'], avoid: ['SOUTH', 'SOUTHWEST', 'UNDER_STAIRS'] },
            bathroom: { ideal: ['NORTHWEST', 'WEST'], avoid: ['NORTHEAST', 'SOUTHEAST', 'CENTER'] },
            livingRoom: { ideal: ['NORTH', 'NORTHEAST', 'EAST'], avoid: ['SOUTHWEST'] },
            study: { ideal: ['NORTHEAST', 'NORTH', 'WEST'], avoid: ['SOUTH'] },
        },
        plotGuidelines: {
            idealShapes: ['SQUARE', 'RECTANGLE'],
            avoidShapes: ['IRREGULAR', 'L_SHAPED', 'T_SHAPED'],
            idealSlope: ['NORTH', 'NORTHEAST', 'EAST'],
        },
        generalPrinciples: [
            { rule: 'Northeast should be the lowest point', importance: 'HIGH' },
            { rule: 'Southwest should be the highest point', importance: 'HIGH' },
            { rule: 'Center of the house (Brahmasthan) should be open', importance: 'HIGH' },
            { rule: 'North and East walls should be thinner than South and West', importance: 'MEDIUM' },
            { rule: 'Main door should not face a wall, pillar, or tree', importance: 'MEDIUM' },
            { rule: 'Stairs should be clockwise ascending', importance: 'MEDIUM' },
            { rule: 'Avoid toilet in Northeast', importance: 'HIGH' },
            { rule: 'Kitchen fire should face East', importance: 'HIGH' },
        ],
    };

    res.json({ success: true, data: rules });
}));

/**
 * @swagger
 * /vastu/auspicious-timing:
 *   post:
 *     summary: Get auspicious timing for property events
 *     tags: [Vastu]
 */
router.post('/auspicious-timing', optionalAuthenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const data = auspiciousTimingSchema.parse(req.body);

    const startDate = data.startDate ? new Date(data.startDate) : new Date();
    const endDate = data.endDate ? new Date(data.endDate) : new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000);

    const auspiciousDates = calculateAuspiciousDates(data.eventType, startDate, endDate, {
        dateOfBirth: data.dateOfBirth,
        birthTime: data.birthTime,
        birthPlace: data.birthPlace,
    });

    // Save for authenticated users
    if (req.user) {
        await prisma.auspiciousTiming.create({
            data: {
                userId: req.user.id,
                eventType: data.eventType,
                birthChart: data.dateOfBirth ? { dob: data.dateOfBirth, time: data.birthTime, place: data.birthPlace } : undefined,
                viewingWindows: auspiciousDates.viewing || [],
                offerWindows: auspiciousDates.offer || [],
                closingWindows: auspiciousDates.closing || [],
                movingWindows: auspiciousDates.moving || [],
                inauspiciousDates: auspiciousDates.avoid || [],
                validUntil: endDate,
            },
        });
    }

    res.json({ success: true, data: auspiciousDates });
}));

/**
 * @swagger
 * /vastu/remedies:
 *   get:
 *     summary: Get common Vastu remedies
 *     tags: [Vastu]
 */
router.get('/remedies', asyncHandler(async (req: Request, res: Response) => {
    const remedies = {
        entranceRemedies: [
            { defect: 'South-facing entrance', remedy: 'Install Hanuman figure', cost: 50, effectiveness: 'HIGH' },
            { defect: 'South-West entrance', remedy: 'Place heavy metal objects at entrance', cost: 100, effectiveness: 'MEDIUM' },
            { defect: 'Entrance facing obstruction', remedy: 'Install convex mirror or goddess Lakshmi image', cost: 30, effectiveness: 'HIGH' },
        ],
        roomRemedies: [
            { defect: 'Kitchen in Northeast', remedy: 'Place camphor crystals, shift cooking platform to SE corner', cost: 200, effectiveness: 'MEDIUM' },
            { defect: 'Bathroom in Northeast', remedy: 'Keep rock salt, install exhaust, paint light colors', cost: 150, effectiveness: 'MEDIUM' },
            { defect: 'Bedroom in Northeast', remedy: 'Shift bed to Southwest corner, use calming colors', cost: 100, effectiveness: 'HIGH' },
        ],
        generalRemedies: [
            { issue: 'Negative energy', remedy: 'Burn camphor daily', cost: 10, effectiveness: 'HIGH' },
            { issue: 'Financial problems', remedy: 'Place aquarium in North or Northeast', cost: 200, effectiveness: 'MEDIUM' },
            { issue: 'Health issues', remedy: 'Plant Tulsi in North or East', cost: 20, effectiveness: 'HIGH' },
            { issue: 'Relationship problems', remedy: 'Place rose quartz in Southwest bedroom', cost: 50, effectiveness: 'MEDIUM' },
            { issue: 'Career obstacles', remedy: 'Hang wind chimes in Northwest', cost: 40, effectiveness: 'MEDIUM' },
        ],
        yantras: [
            { name: 'Vastu Dosh Nivaran Yantra', purpose: 'General Vastu correction', placement: 'East wall', cost: 500 },
            { name: 'Shri Yantra', purpose: 'Prosperity and wealth', placement: 'North or Northeast', cost: 800 },
            { name: 'Kuber Yantra', purpose: 'Financial growth', placement: 'North', cost: 600 },
        ],
    };

    res.json({ success: true, data: remedies });
}));

// Helper: Perform Vastu analysis
function performVastuAnalysis(data: z.infer<typeof analyzePropertySchema>) {
    let totalScore = 0;
    const defects: any[] = [];
    const remedies: any[] = [];
    const directionalScores: Record<string, number> = {};
    const roomAnalysis: Record<string, any> = {};

    // Entrance analysis (15% weight)
    const entranceScore = analyzeEntrance(data.entranceDirection);
    directionalScores.entrance = entranceScore.score;
    totalScore += entranceScore.score * (SCORING_WEIGHTS.entrance / 100);
    if (entranceScore.defects) defects.push(...entranceScore.defects);
    if (entranceScore.remedies) remedies.push(...entranceScore.remedies);

    // Plot shape analysis (10% weight)
    const plotScore = analyzePlotShape(data.plotShape);
    directionalScores.plot = plotScore.score;
    totalScore += plotScore.score * (SCORING_WEIGHTS.plotShape / 100);
    if (plotScore.defects) defects.push(...plotScore.defects);

    // Room placement analysis
    for (const room of data.rooms) {
        const roomResult = analyzeRoomPlacement(room.type, room.direction);
        directionalScores[room.direction] = (directionalScores[room.direction] || 50) + roomResult.modifier;

        const roomKey = room.type.toLowerCase().replace('_', '');
        roomAnalysis[roomKey] = {
            direction: room.direction,
            score: roomResult.score,
            ideal: roomResult.ideal,
            recommendations: roomResult.recommendations,
        };

        if (roomResult.defects) defects.push(...roomResult.defects);
        if (roomResult.remedies) remedies.push(...roomResult.remedies);

        // Calculate weighted score based on room importance
        const weight = getRoomWeight(room.type);
        totalScore += roomResult.score * (weight / 100);
    }

    // Slope analysis
    let slopeAnalysis = null;
    if (data.slope) {
        slopeAnalysis = analyzeSlope(data.slope);
        totalScore += slopeAnalysis.score * (SCORING_WEIGHTS.slope / 100);
        if (slopeAnalysis.defects) defects.push(...slopeAnalysis.defects);
    }

    // Water source analysis
    let waterAnalysis = null;
    if (data.waterSource) {
        waterAnalysis = analyzeWaterSource(data.waterSource);
        totalScore += waterAnalysis.score * (SCORING_WEIGHTS.waterSource / 100);
        if (waterAnalysis.defects) defects.push(...waterAnalysis.defects);
    }

    // Staircase analysis
    let staircaseAnalysis = null;
    if (data.staircase) {
        staircaseAnalysis = analyzeStaircase(data.staircase);
        totalScore += staircaseAnalysis.score * (SCORING_WEIGHTS.staircase / 100);
        if (staircaseAnalysis.defects) defects.push(...staircaseAnalysis.defects);
    }

    // Fill missing directional scores
    for (const dir of ['NORTH', 'NORTHEAST', 'EAST', 'SOUTHEAST', 'SOUTH', 'SOUTHWEST', 'WEST', 'NORTHWEST', 'CENTER']) {
        if (!directionalScores[dir]) directionalScores[dir] = 50;
    }

    // Normalize score to 0-100
    const normalizedScore = Math.round(Math.min(100, Math.max(0, totalScore)));

    // Calculate grade
    const grade = calculateGrade(normalizedScore);

    // Estimate remedy cost
    const estimatedRemedyCost = remedies.reduce((sum, r) => sum + (r.cost || 0), 0);

    return {
        overallScore: normalizedScore,
        grade,
        directionalScores,
        roomAnalysis,
        defects,
        remedies,
        slopeAnalysis,
        waterAnalysis,
        staircaseAnalysis,
        estimatedRemedyCost,
        summary: generateSummary(normalizedScore, defects.length),
    };
}

function analyzeEntrance(direction: string) {
    const auspicious = ['NORTH', 'NORTHEAST', 'EAST'];
    const neutral = ['NORTHWEST', 'WEST'];

    if (auspicious.includes(direction)) {
        return { score: 100, defects: [], remedies: [] };
    } else if (neutral.includes(direction)) {
        return { score: 70, defects: [{ type: 'entrance', severity: 'minor', description: `${direction} entrance is neutral` }], remedies: [] };
    } else {
        return {
            score: 40,
            defects: [{ type: 'entrance', severity: 'moderate', description: `${direction} entrance is not ideal per Vastu` }],
            remedies: [{ type: 'entrance', action: 'Install protective symbols at entrance', cost: 100 }],
        };
    }
}

function analyzePlotShape(shape: string) {
    if (shape === 'SQUARE' || shape === 'RECTANGLE') {
        return { score: 100, defects: [] };
    } else {
        return {
            score: 50,
            defects: [{ type: 'plot', severity: 'moderate', description: `${shape} plot shape is not ideal` }],
        };
    }
}

function analyzeRoomPlacement(roomType: string, direction: string) {
    const idealPlacements: Record<string, string[]> = {
        MASTER_BEDROOM: ['SOUTHWEST', 'SOUTH', 'WEST'],
        BEDROOM: ['SOUTH', 'WEST', 'NORTHWEST'],
        KITCHEN: ['SOUTHEAST', 'SOUTH'],
        LIVING_ROOM: ['NORTH', 'NORTHEAST', 'EAST'],
        POOJA_ROOM: ['NORTHEAST', 'EAST', 'NORTH'],
        BATHROOM: ['NORTHWEST', 'WEST'],
        STUDY: ['NORTHEAST', 'NORTH', 'WEST'],
        DINING: ['WEST', 'EAST'],
        GUEST_ROOM: ['NORTHWEST', 'NORTHEAST'],
        STORE_ROOM: ['SOUTHWEST', 'SOUTH'],
    };

    const avoidPlacements: Record<string, string[]> = {
        MASTER_BEDROOM: ['NORTHEAST', 'SOUTHEAST'],
        KITCHEN: ['NORTHEAST', 'NORTH', 'SOUTHWEST'],
        POOJA_ROOM: ['SOUTH', 'SOUTHWEST'],
        BATHROOM: ['NORTHEAST', 'SOUTHEAST', 'CENTER'],
    };

    const ideal = idealPlacements[roomType] || [];
    const avoid = avoidPlacements[roomType] || [];

    if (ideal.includes(direction)) {
        return { score: 100, modifier: 10, ideal: true, recommendations: [], defects: [], remedies: [] };
    } else if (avoid.includes(direction)) {
        return {
            score: 30,
            modifier: -15,
            ideal: false,
            recommendations: [`Consider relocating ${roomType} from ${direction}`],
            defects: [{ type: 'room_placement', severity: 'critical', description: `${roomType} should not be in ${direction}` }],
            remedies: [{ type: 'room', action: `Apply Vastu remedies for ${roomType} in ${direction}`, cost: 150 }],
        };
    } else {
        return { score: 60, modifier: 0, ideal: false, recommendations: [], defects: [], remedies: [] };
    }
}

function analyzeSlope(slope: string) {
    const ideal = ['NORTH', 'NORTHEAST', 'EAST'];
    if (ideal.includes(slope)) {
        return { score: 100, direction: slope, ideal: true, defects: [] };
    } else if (slope === 'FLAT') {
        return { score: 80, direction: slope, ideal: false, defects: [] };
    } else {
        return {
            score: 40,
            direction: slope,
            ideal: false,
            defects: [{ type: 'slope', severity: 'moderate', description: 'Slope direction is not favorable' }],
        };
    }
}

function analyzeWaterSource(waterSource: { type: string; direction: string }) {
    const idealDirections = ['NORTH', 'NORTHEAST', 'EAST'];
    if (idealDirections.includes(waterSource.direction)) {
        return { score: 100, defects: [] };
    } else {
        return {
            score: 50,
            defects: [{ type: 'water', severity: 'minor', description: 'Water source placement could be optimized' }],
        };
    }
}

function analyzeStaircase(staircase: { direction: string; rotationType: string }) {
    const idealDirections = ['SOUTH', 'WEST', 'SOUTHWEST'];
    let score = 70;
    const defects = [];

    if (idealDirections.includes(staircase.direction)) score += 15;
    if (staircase.rotationType === 'CLOCKWISE') score += 15;
    else {
        defects.push({ type: 'staircase', severity: 'minor', description: 'Staircase should rotate clockwise' });
    }

    return { score: Math.min(100, score), defects };
}

function getRoomWeight(roomType: string): number {
    const weights: Record<string, number> = {
        MASTER_BEDROOM: 12,
        KITCHEN: 12,
        POOJA_ROOM: 10,
        LIVING_ROOM: 8,
        BATHROOM: 8,
        STUDY: 5,
        BEDROOM: 5,
        DINING: 4,
        GUEST_ROOM: 3,
        STORE_ROOM: 2,
    };
    return weights[roomType] || 5;
}

function calculateGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    if (score >= 40) return 'D';
    return 'F';
}

function generateSummary(score: number, defectCount: number): string {
    if (score >= 80) return 'Excellent Vastu compliance. This property has strong positive energy.';
    if (score >= 60) return 'Good Vastu compliance with minor corrections needed.';
    if (score >= 40) return 'Moderate Vastu compliance. Several remedies recommended.';
    return 'Significant Vastu defects present. Professional consultation recommended.';
}

function calculateAuspiciousDates(
    eventType: string,
    startDate: Date,
    endDate: Date,
    birthDetails: { dateOfBirth?: string; birthTime?: string; birthPlace?: string }
) {
    // Simplified Muhurat calculation - in production, integrate with Vedic astrology APIs
    const auspiciousDates: any = { viewing: [], offer: [], closing: [], moving: [], avoid: [] };

    const current = new Date(startDate);
    while (current <= endDate) {
        const dayOfWeek = current.getDay();
        const date = current.getDate();

        // Avoid Tuesdays and Saturdays
        if (dayOfWeek === 2 || dayOfWeek === 6) {
            auspiciousDates.avoid.push({
                date: current.toISOString().split('T')[0],
                reason: dayOfWeek === 2 ? 'Mangalvar (Tuesday) - avoid major decisions' : 'Shanivar (Saturday) - avoid new beginnings',
            });
        }
        // Auspicious days: Monday, Wednesday, Thursday, Friday
        else if ([1, 3, 4, 5].includes(dayOfWeek)) {
            // Simplified logic - add as auspicious based on event type
            const dateStr = current.toISOString().split('T')[0];
            const entry = { date: dateStr, quality: date <= 15 ? 'Shukla Paksha' : 'Krishna Paksha', nakshatra: 'Rohini' };

            if (eventType === 'PROPERTY_VIEWING' || eventType === 'MAKING_OFFER') {
                auspiciousDates.viewing.push(entry);
                auspiciousDates.offer.push(entry);
            }
            if (eventType === 'SIGNING_CONTRACT' || eventType === 'CLOSING') {
                if (dayOfWeek === 4) auspiciousDates.closing.push(entry); // Thursdays best for contracts
            }
            if (eventType === 'GRIHA_PRAVESH') {
                if (dayOfWeek === 3 || dayOfWeek === 4) auspiciousDates.moving.push(entry);
            }
        }

        current.setDate(current.getDate() + 1);
    }

    return auspiciousDates;
}

export default router;
