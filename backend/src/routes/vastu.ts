// Vastu Shastra AI Analysis Routes
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import {
  cacheGet,
  cacheSet,
  CACHE_KEYS,
  CACHE_TTL
} from '../utils/redis';
import {
  authenticate,
  requireSubscription,
  AuthenticatedRequest
} from '../middleware/auth';
import {
  asyncHandler,
  BadRequestError,
  NotFoundError
} from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

// Vastu Rules Database - Comprehensive set of rules from ancient texts
const VASTU_RULES = {
  entrance: {
    NORTH: { score: 90, energy: 'positive', deity: 'Kubera', effect: 'wealth' },
    NORTH_EAST: { score: 100, energy: 'highly_positive', deity: 'Ishaan', effect: 'prosperity' },
    EAST: { score: 95, energy: 'positive', deity: 'Indra', effect: 'health' },
    SOUTH_EAST: { score: 60, energy: 'neutral', deity: 'Agni', effect: 'fire_element' },
    SOUTH: { score: 40, energy: 'negative', deity: 'Yama', effect: 'obstacles' },
    SOUTH_WEST: { score: 30, energy: 'highly_negative', deity: 'Nairutya', effect: 'instability' },
    WEST: { score: 70, energy: 'neutral', deity: 'Varuna', effect: 'water_element' },
    NORTH_WEST: { score: 75, energy: 'positive', deity: 'Vayu', effect: 'movement' },
  },

  rooms: {
    kitchen: {
      ideal: ['SOUTH_EAST'],
      acceptable: ['NORTH_WEST', 'SOUTH'],
      avoid: ['NORTH_EAST', 'SOUTH_WEST'],
      deity: 'Agni',
      element: 'fire',
    },
    masterBedroom: {
      ideal: ['SOUTH_WEST'],
      acceptable: ['SOUTH', 'WEST'],
      avoid: ['NORTH_EAST', 'SOUTH_EAST'],
      deity: 'Nairutya',
      element: 'earth',
    },
    bathroom: {
      ideal: ['NORTH_WEST', 'WEST'],
      acceptable: ['SOUTH'],
      avoid: ['NORTH_EAST', 'SOUTH_WEST', 'CENTER'],
      element: 'water',
    },
    poojaRoom: {
      ideal: ['NORTH_EAST'],
      acceptable: ['NORTH', 'EAST'],
      avoid: ['SOUTH', 'SOUTH_WEST', 'SOUTH_EAST'],
      deity: 'Ishaan',
      element: 'ether',
    },
    livingRoom: {
      ideal: ['NORTH', 'EAST', 'NORTH_EAST'],
      acceptable: ['NORTH_WEST'],
      avoid: ['SOUTH_WEST'],
      element: 'air',
    },
    study: {
      ideal: ['NORTH_EAST', 'EAST', 'NORTH'],
      acceptable: ['WEST'],
      avoid: ['SOUTH_WEST'],
      element: 'air',
    },
    dining: {
      ideal: ['WEST', 'EAST'],
      acceptable: ['NORTH'],
      avoid: ['SOUTH_EAST'],
      element: 'earth',
    },
    guestRoom: {
      ideal: ['NORTH_WEST'],
      acceptable: ['WEST', 'NORTH'],
      avoid: ['SOUTH_WEST'],
      element: 'air',
    },
  },

  slope: {
    ideal: { northEast: 'lowest', southWest: 'highest' },
    acceptable: { north: 'lower', south: 'higher' },
  },

  waterSources: {
    ideal: ['NORTH', 'NORTH_EAST', 'EAST'],
    acceptable: ['NORTH_WEST'],
    avoid: ['SOUTH', 'SOUTH_WEST', 'SOUTH_EAST'],
  },

  staircase: {
    idealDirection: ['WEST', 'SOUTH'],
    avoidDirection: ['NORTH_EAST', 'CENTER'],
    preferClockwise: true,
  },
};

// Remedies Database
const VASTU_REMEDIES = {
  entrance_south_west: [
    {
      type: 'structural',
      description: 'Relocate main entrance to North or East direction',
      cost_estimate: 50000,
      effectiveness: 100,
      difficulty: 'high',
    },
    {
      type: 'placement',
      description: 'Place Ganesha idol outside entrance facing outward',
      cost_estimate: 500,
      effectiveness: 60,
      difficulty: 'low',
    },
    {
      type: 'symbolic',
      description: 'Install Vastu pyramid at entrance, paint door green, hang sacred toran',
      cost_estimate: 200,
      effectiveness: 40,
      difficulty: 'low',
    },
  ],

  kitchen_north_east: [
    {
      type: 'structural',
      description: 'Relocate kitchen to South-East (Agni) direction',
      cost_estimate: 75000,
      effectiveness: 100,
      difficulty: 'high',
    },
    {
      type: 'placement',
      description: 'Place copper vessel with water in kitchen, cook facing East',
      cost_estimate: 100,
      effectiveness: 50,
      difficulty: 'low',
    },
    {
      type: 'symbolic',
      description: 'Install Agni yantra, use red/orange colors in kitchen',
      cost_estimate: 150,
      effectiveness: 35,
      difficulty: 'low',
    },
  ],

  bathroom_north_east: [
    {
      type: 'structural',
      description: 'Convert to prayer room or study, relocate bathroom',
      cost_estimate: 100000,
      effectiveness: 100,
      difficulty: 'high',
    },
    {
      type: 'placement',
      description: 'Keep bathroom door always closed, place sea salt bowl inside',
      cost_estimate: 50,
      effectiveness: 40,
      difficulty: 'low',
    },
    {
      type: 'symbolic',
      description: 'Install mirror on North wall, use light colors, add plants',
      cost_estimate: 200,
      effectiveness: 30,
      difficulty: 'low',
    },
  ],

  bedroom_north_east: [
    {
      type: 'structural',
      description: 'Convert to meditation room or study',
      cost_estimate: 25000,
      effectiveness: 100,
      difficulty: 'medium',
    },
    {
      type: 'placement',
      description: 'Sleep with head towards South, place heavy furniture in South-West',
      cost_estimate: 100,
      effectiveness: 50,
      difficulty: 'low',
    },
  ],

  center_blocked: [
    {
      type: 'structural',
      description: 'Keep Brahmasthan (center) open, remove pillars/walls',
      cost_estimate: 40000,
      effectiveness: 100,
      difficulty: 'high',
    },
    {
      type: 'placement',
      description: 'If unavoidable, place tulsi plant or crystal in center',
      cost_estimate: 100,
      effectiveness: 45,
      difficulty: 'low',
    },
  ],
};

// Validation schemas
const analyzeFloorPlanSchema = z.object({
  propertyId: z.string().uuid().optional(),
  floorPlanUrl: z.string().url().optional(),
  orientation: z.enum(['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST']),
  propertyType: z.enum(['HOUSE', 'APARTMENT', 'COMMERCIAL', 'VILLA', 'FARMHOUSE']).default('HOUSE'),

  // Manual room input (if no AI detection)
  rooms: z.array(z.object({
    type: z.string(),
    direction: z.enum(['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST', 'CENTER']),
    coordinates: z.object({
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
    }).optional(),
  })).optional(),

  entrance: z.object({
    direction: z.enum(['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST']),
    position: z.enum(['LEFT', 'CENTER', 'RIGHT']).optional(),
  }),

  slope: z.object({
    lowest: z.enum(['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST']).optional(),
    highest: z.enum(['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST']).optional(),
  }).optional(),

  waterSources: z.array(z.object({
    type: z.string(), // well, borewell, tank, etc.
    direction: z.enum(['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST']),
  })).optional(),

  staircase: z.object({
    direction: z.enum(['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST', 'CENTER']).optional(),
    rotation: z.enum(['CLOCKWISE', 'ANTICLOCKWISE']).optional(),
  }).optional(),

  language: z.enum(['en', 'hi', 'ta', 'te', 'mr', 'gu', 'bn']).default('en'),
});

/**
 * @swagger
 * /vastu/analyze:
 *   post:
 *     summary: Analyze property for Vastu compliance
 *     tags: [Vastu]
 *     security:
 *       - bearerAuth: []
 */
router.post('/analyze', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const data = analyzeFloorPlanSchema.parse(req.body);

  logger.info(`Vastu analysis requested by user ${req.user!.id}`);

  // Initialize analysis result
  const analysis: any = {
    overallScore: 0,
    grade: '',
    issues: [],
    recommendations: [],
    zoneScores: {},
    roomAnalysis: {},
  };

  // 1. Analyze Entrance Direction
  const entranceRule = VASTU_RULES.entrance[data.entrance.direction];
  analysis.entranceAnalysis = {
    direction: data.entrance.direction,
    score: entranceRule.score,
    energy: entranceRule.energy,
    deity: entranceRule.deity,
    effect: entranceRule.effect,
    isIdeal: entranceRule.score >= 90,
  };

  if (entranceRule.score < 70) {
    analysis.issues.push({
      type: 'entrance',
      severity: entranceRule.score < 50 ? 'critical' : 'moderate',
      direction: data.entrance.direction,
      description: `Main entrance is in ${data.entrance.direction} direction. ${entranceRule.energy === 'highly_negative'
          ? 'This is considered highly inauspicious and may bring obstacles and instability.'
          : 'This direction is not ideal for prosperity.'
        }`,
      vastuPrinciple: `Entrance should ideally be in North-East (Ishaan) or North (Kubera) for prosperity and wealth.`,
      remedies: getRemedies('entrance', data.entrance.direction),
    });
  }

  // 2. Analyze Room Placements
  if (data.rooms) {
    for (const room of data.rooms) {
      const roomRules = VASTU_RULES.rooms[room.type.toLowerCase() as keyof typeof VASTU_RULES.rooms];

      if (roomRules) {
        const isIdeal = roomRules.ideal.includes(room.direction);
        const isAcceptable = roomRules.acceptable.includes(room.direction);
        const isToAvoid = roomRules.avoid.includes(room.direction);

        let roomScore = 100;
        if (isIdeal) roomScore = 100;
        else if (isAcceptable) roomScore = 70;
        else if (isToAvoid) roomScore = 30;
        else roomScore = 50;

        analysis.roomAnalysis[room.type] = {
          currentDirection: room.direction,
          idealDirections: roomRules.ideal,
          score: roomScore,
          isIdeal,
          isAcceptable,
          isToAvoid,
          element: roomRules.element,
          deity: (roomRules as any).deity || null,
        };

        if (isToAvoid) {
          analysis.issues.push({
            type: room.type,
            severity: 'critical',
            direction: room.direction,
            description: `${room.type.charAt(0).toUpperCase() + room.type.slice(1)} is placed in ${room.direction} direction, which should be avoided.`,
            vastuPrinciple: `${room.type.charAt(0).toUpperCase() + room.type.slice(1)} should ideally be in ${roomRules.ideal.join(' or ')} direction.`,
            remedies: getRemedies(room.type, room.direction),
          });
        } else if (!isIdeal && !isAcceptable) {
          analysis.issues.push({
            type: room.type,
            severity: 'minor',
            direction: room.direction,
            description: `${room.type.charAt(0).toUpperCase() + room.type.slice(1)} placement could be improved.`,
            vastuPrinciple: `Consider ${roomRules.ideal.join(' or ')} for optimal energy flow.`,
          });
        }
      }
    }
  }

  // 3. Analyze Slope
  if (data.slope) {
    const idealSlope = data.slope.lowest === 'NORTH_EAST' && data.slope.highest === 'SOUTH_WEST';
    analysis.slopeAnalysis = {
      current: data.slope,
      isIdeal: idealSlope,
      score: idealSlope ? 100 : 50,
    };

    if (!idealSlope) {
      analysis.issues.push({
        type: 'slope',
        severity: 'moderate',
        description: 'Land slope is not in the ideal Vastu direction.',
        vastuPrinciple: 'Land should slope from South-West (highest) to North-East (lowest) for prosperity.',
        remedies: [
          {
            type: 'structural',
            description: 'Grade the land to slope towards North-East',
            cost_estimate: 20000,
            effectiveness: 100,
            difficulty: 'high',
          },
          {
            type: 'placement',
            description: 'Place heavy elements (boulders, structures) in South-West',
            cost_estimate: 5000,
            effectiveness: 60,
            difficulty: 'medium',
          },
        ],
      });
    }
  }

  // 4. Analyze Water Sources
  if (data.waterSources && data.waterSources.length > 0) {
    for (const water of data.waterSources) {
      const isIdeal = VASTU_RULES.waterSources.ideal.includes(water.direction);
      const isToAvoid = VASTU_RULES.waterSources.avoid.includes(water.direction);

      if (isToAvoid) {
        analysis.issues.push({
          type: 'water_source',
          severity: 'moderate',
          direction: water.direction,
          description: `Water source (${water.type}) is in ${water.direction}, which can disturb energy flow.`,
          vastuPrinciple: 'Water sources should be in North, North-East, or East for abundance.',
          remedies: [
            {
              type: 'structural',
              description: 'Relocate water source to North-East or North',
              cost_estimate: 30000,
              effectiveness: 100,
              difficulty: 'high',
            },
            {
              type: 'symbolic',
              description: 'Place Varuna yantra near water source, add aquatic plants',
              cost_estimate: 200,
              effectiveness: 40,
              difficulty: 'low',
            },
          ],
        });
      }
    }
  }

  // 5. Analyze Staircase
  if (data.staircase) {
    const isIdealDirection = VASTU_RULES.staircase.idealDirection.includes(data.staircase.direction!);
    const isToAvoid = VASTU_RULES.staircase.avoidDirection.includes(data.staircase.direction!);
    const isClockwise = data.staircase.rotation === 'CLOCKWISE';

    if (isToAvoid || !isClockwise) {
      analysis.issues.push({
        type: 'staircase',
        severity: isToAvoid ? 'critical' : 'minor',
        description: `Staircase ${isToAvoid ? 'is in ' + data.staircase.direction + ' (should be avoided)' : ''} ${!isClockwise ? 'rotates anticlockwise' : ''}`,
        vastuPrinciple: 'Staircase should be in South or West, rotating clockwise when ascending.',
        remedies: [
          {
            type: 'placement',
            description: 'Place a mirror on the North wall of staircase, use light colors',
            cost_estimate: 500,
            effectiveness: 40,
            difficulty: 'low',
          },
        ],
      });
    }
  }

  // Calculate Zone Scores (16-zone Vastu grid)
  const zones = ['NORTH', 'NORTH_EAST', 'EAST', 'SOUTH_EAST', 'SOUTH', 'SOUTH_WEST', 'WEST', 'NORTH_WEST', 'CENTER'];
  for (const zone of zones) {
    let zoneScore = 70; // Default neutral score

    // Adjust based on room placements
    if (data.rooms) {
      for (const room of data.rooms) {
        if (room.direction === zone) {
          const roomRules = VASTU_RULES.rooms[room.type.toLowerCase() as keyof typeof VASTU_RULES.rooms];
          if (roomRules) {
            if (roomRules.ideal.includes(zone)) zoneScore += 15;
            else if (roomRules.avoid.includes(zone)) zoneScore -= 20;
          }
        }
      }
    }

    analysis.zoneScores[zone] = Math.max(0, Math.min(100, zoneScore));
  }

  // Calculate Overall Score
  const entranceWeight = 0.25;
  const roomsWeight = 0.4;
  const slopeWeight = 0.15;
  const waterWeight = 0.1;
  const staircaseWeight = 0.1;

  let totalScore = analysis.entranceAnalysis.score * entranceWeight;

  if (Object.keys(analysis.roomAnalysis).length > 0) {
    const roomScores = Object.values(analysis.roomAnalysis).map((r: any) => r.score);
    const avgRoomScore = roomScores.reduce((a: number, b: number) => a + b, 0) / roomScores.length;
    totalScore += avgRoomScore * roomsWeight;
  } else {
    totalScore += 70 * roomsWeight; // Default if no rooms specified
  }

  if (analysis.slopeAnalysis) {
    totalScore += analysis.slopeAnalysis.score * slopeWeight;
  } else {
    totalScore += 70 * slopeWeight;
  }

  // Add remaining weights with default scores
  totalScore += 70 * waterWeight;
  totalScore += 70 * staircaseWeight;

  analysis.overallScore = Math.round(totalScore);

  // Determine Grade
  if (analysis.overallScore >= 90) analysis.grade = 'A+';
  else if (analysis.overallScore >= 80) analysis.grade = 'A';
  else if (analysis.overallScore >= 70) analysis.grade = 'B+';
  else if (analysis.overallScore >= 60) analysis.grade = 'B';
  else if (analysis.overallScore >= 50) analysis.grade = 'C';
  else if (analysis.overallScore >= 40) analysis.grade = 'D';
  else analysis.grade = 'F';

  // Count defects by severity
  analysis.criticalDefects = analysis.issues.filter((i: any) => i.severity === 'critical').length;
  analysis.moderateDefects = analysis.issues.filter((i: any) => i.severity === 'moderate').length;
  analysis.minorDefects = analysis.issues.filter((i: any) => i.severity === 'minor').length;

  // Calculate total remedy cost
  analysis.totalRemedyCost = analysis.issues.reduce((total: number, issue: any) => {
    if (issue.remedies) {
      const lowestCostRemedy = issue.remedies.reduce((min: any, r: any) =>
        r.cost_estimate < min.cost_estimate ? r : min, issue.remedies[0]);
      return total + (lowestCostRemedy?.cost_estimate || 0);
    }
    return total;
  }, 0);

  // Generate recommendations
  analysis.recommendations = generateRecommendations(analysis);

  // Save analysis if property ID provided
  if (data.propertyId) {
    await prisma.vastuAnalysis.upsert({
      where: { propertyId: data.propertyId },
      create: {
        propertyId: data.propertyId,
        overallScore: analysis.overallScore,
        grade: analysis.grade,
        entranceDirection: data.entrance.direction,
        entranceScore: analysis.entranceAnalysis.score,
        plotOrientation: data.orientation,
        plotScore: 70, // Default
        northEastScore: analysis.zoneScores['NORTH_EAST'] || 70,
        eastScore: analysis.zoneScores['EAST'] || 70,
        southEastScore: analysis.zoneScores['SOUTH_EAST'] || 70,
        southScore: analysis.zoneScores['SOUTH'] || 70,
        southWestScore: analysis.zoneScores['SOUTH_WEST'] || 70,
        westScore: analysis.zoneScores['WEST'] || 70,
        northWestScore: analysis.zoneScores['NORTH_WEST'] || 70,
        northScore: analysis.zoneScores['NORTH'] || 70,
        centerScore: analysis.zoneScores['CENTER'] || 70,
        kitchenPlacement: analysis.roomAnalysis['kitchen'] || {},
        masterBedroomPlacement: analysis.roomAnalysis['masterBedroom'] || {},
        bathroomPlacement: analysis.roomAnalysis['bathroom'] || {},
        poojaRoomPlacement: analysis.roomAnalysis['poojaRoom'] || {},
        studyRoomPlacement: analysis.roomAnalysis['study'] || {},
        livingRoomPlacement: analysis.roomAnalysis['livingRoom'] || {},
        defects: analysis.issues,
        criticalDefects: analysis.criticalDefects,
        moderateDefects: analysis.moderateDefects,
        minorDefects: analysis.minorDefects,
        remedies: analysis.issues.flatMap((i: any) => i.remedies || []),
        totalRemedyCost: analysis.totalRemedyCost,
        slopeAnalysis: analysis.slopeAnalysis,
      },
      update: {
        overallScore: analysis.overallScore,
        grade: analysis.grade,
        entranceDirection: data.entrance.direction,
        entranceScore: analysis.entranceAnalysis.score,
        defects: analysis.issues,
        criticalDefects: analysis.criticalDefects,
        moderateDefects: analysis.moderateDefects,
        minorDefects: analysis.minorDefects,
        remedies: analysis.issues.flatMap((i: any) => i.remedies || []),
        totalRemedyCost: analysis.totalRemedyCost,
        updatedAt: new Date(),
      },
    });
  }

  res.json({
    success: true,
    data: analysis,
  });
}));

/**
 * @swagger
 * /vastu/property/{propertyId}:
 *   get:
 *     summary: Get Vastu analysis for a property
 *     tags: [Vastu]
 */
router.get('/property/:propertyId', asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  const cacheKey = `${CACHE_KEYS.VASTU}${propertyId}`;
  const cached = await cacheGet(cacheKey);
  if (cached) {
    return res.json({ success: true, data: cached });
  }

  const analysis = await prisma.vastuAnalysis.findUnique({
    where: { propertyId },
  });

  if (!analysis) {
    throw new NotFoundError('Vastu analysis not found for this property');
  }

  await cacheSet(cacheKey, analysis, CACHE_TTL.LONG);

  res.json({
    success: true,
    data: analysis,
  });
}));

/**
 * @swagger
 * /vastu/rules:
 *   get:
 *     summary: Get Vastu rules reference
 *     tags: [Vastu]
 */
router.get('/rules', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      entrance: VASTU_RULES.entrance,
      rooms: Object.keys(VASTU_RULES.rooms).map(room => ({
        name: room,
        ...VASTU_RULES.rooms[room as keyof typeof VASTU_RULES.rooms],
      })),
      slope: VASTU_RULES.slope,
      waterSources: VASTU_RULES.waterSources,
      staircase: VASTU_RULES.staircase,
    },
  });
}));

/**
 * @swagger
 * /vastu/certificate/{propertyId}:
 *   get:
 *     summary: Generate Vastu compliance certificate
 *     tags: [Vastu]
 *     security:
 *       - bearerAuth: []
 */
router.get('/certificate/:propertyId', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { propertyId } = req.params;

  const analysis = await prisma.vastuAnalysis.findUnique({
    where: { propertyId },
    include: {
      property: {
        select: {
          streetAddress: true,
          city: true,
          state: true,
          zipCode: true,
        },
      },
    },
  });

  if (!analysis) {
    throw new NotFoundError('Vastu analysis not found');
  }

  // Generate certificate data
  const certificate = {
    certificateId: `VASTU-${propertyId.slice(0, 8).toUpperCase()}-${Date.now()}`,
    propertyAddress: `${analysis.property.streetAddress}, ${analysis.property.city}, ${analysis.property.state} ${analysis.property.zipCode}`,
    analysisDate: analysis.analyzedAt,
    overallScore: analysis.overallScore,
    grade: analysis.grade,
    entranceDirection: analysis.entranceDirection,
    entranceScore: analysis.entranceScore,
    criticalIssues: analysis.criticalDefects,
    recommendations: analysis.remedies?.slice(0, 5),
    issuedBy: 'REST-iN-U Vastu AI',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
    // TODO: Add blockchain hash for verification
  };

  res.json({
    success: true,
    data: certificate,
  });
}));

/**
 * @swagger
 * /vastu/auspicious-timing:
 *   post:
 *     summary: Get auspicious timing for property transactions
 *     tags: [Vastu]
 *     security:
 *       - bearerAuth: []
 */
router.post('/auspicious-timing', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { eventType, startDate, endDate, birthDetails } = req.body;

  if (!eventType || !startDate || !endDate) {
    throw new BadRequestError('Event type, start date, and end date are required');
  }

  // TODO: Integrate with Panchang API for actual calculations
  // For now, return mock auspicious timings

  const start = new Date(startDate);
  const end = new Date(endDate);
  const auspiciousDates: any[] = [];

  // Generate sample auspicious dates
  let current = new Date(start);
  while (current <= end) {
    // Simple logic: Skip Tuesday and Saturday for property transactions
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 2 && dayOfWeek !== 6) {
      // Check for Rahu Kaal (varies by day)
      const rahuKaalStart = getRahuKaalStart(dayOfWeek);

      auspiciousDates.push({
        date: current.toISOString().split('T')[0],
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
        auspiciousWindows: [
          { start: '06:00', end: rahuKaalStart, rating: 'good' },
          { start: addHours(rahuKaalStart, 1.5), end: '12:00', rating: 'excellent' },
          { start: '14:00', end: '17:00', rating: 'good' },
        ],
        rahuKaal: { start: rahuKaalStart, end: addHours(rahuKaalStart, 1.5) },
        nakshatra: getNakshatraForDate(current),
        tithi: getTithiForDate(current),
        yoga: getYogaForDate(current),
      });
    }

    current.setDate(current.getDate() + 1);
  }

  res.json({
    success: true,
    data: {
      eventType,
      auspiciousDates: auspiciousDates.slice(0, 10), // Limit to 10 dates
      generalGuidance: getEventGuidance(eventType),
    },
  });
}));

// Helper Functions
function getRemedies(type: string, direction: string): any[] {
  const key = `${type.toLowerCase()}_${direction.toLowerCase()}`;
  return VASTU_REMEDIES[key as keyof typeof VASTU_REMEDIES] || [
    {
      type: 'symbolic',
      description: 'Consult a Vastu expert for specific remedies',
      cost_estimate: 500,
      effectiveness: 50,
      difficulty: 'low',
    },
  ];
}

function generateRecommendations(analysis: any): string[] {
  const recommendations: string[] = [];

  if (analysis.overallScore < 60) {
    recommendations.push('Consider consulting a professional Vastu consultant for structural modifications.');
  }

  if (analysis.entranceAnalysis.score < 70) {
    recommendations.push('Focus on entrance remedies as they have the highest impact on overall energy.');
  }

  if (analysis.criticalDefects > 0) {
    recommendations.push(`Address the ${analysis.criticalDefects} critical defect(s) first for maximum improvement.`);
  }

  if (analysis.zoneScores['NORTH_EAST'] < 60) {
    recommendations.push('North-East (Ishaan) zone needs attention - keep it clean, clutter-free, and well-lit.');
  }

  if (analysis.zoneScores['SOUTH_WEST'] < 60) {
    recommendations.push('Strengthen South-West zone with heavy furniture and earth elements.');
  }

  recommendations.push('Regular space cleansing with camphor or incense improves overall energy.');
  recommendations.push('Ensure adequate natural light and ventilation throughout the property.');

  return recommendations;
}

function getRahuKaalStart(dayOfWeek: number): string {
  const rahuKaalTimes: Record<number, string> = {
    0: '16:30', // Sunday
    1: '07:30', // Monday
    2: '15:00', // Tuesday
    3: '12:00', // Wednesday
    4: '13:30', // Thursday
    5: '10:30', // Friday
    6: '09:00', // Saturday
  };
  return rahuKaalTimes[dayOfWeek];
}

function addHours(time: string, hours: number): string {
  const [h, m] = time.split(':').map(Number);
  const totalMinutes = h * 60 + m + hours * 60;
  const newH = Math.floor(totalMinutes / 60) % 24;
  const newM = totalMinutes % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

function getNakshatraForDate(date: Date): string {
  const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
    'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra',
    'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha',
    'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
  return nakshatras[date.getDate() % 27];
}

function getTithiForDate(date: Date): string {
  const tithis = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami',
    'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'];
  return tithis[date.getDate() % 15];
}

function getYogaForDate(date: Date): string {
  const yogas = ['Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarman',
    'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi',
    'Vyatipata', 'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
    'Indra', 'Vaidhriti'];
  return yogas[date.getDate() % 27];
}

function getEventGuidance(eventType: string): string {
  const guidance: Record<string, string> = {
    'PROPERTY_VIEWING': 'View properties during morning hours (after sunrise) when natural light reveals true condition.',
    'MAKING_OFFER': 'Make offers on days with favorable Nakshatra. Avoid during Rahu Kaal.',
    'SIGNING_CONTRACT': 'Sign contracts during Pushya or Uttara Phalguni Nakshatra for prosperity.',
    'CLOSING': 'Complete closing formalities during Shukla Paksha (waxing moon) for growth.',
    'GRIHA_PRAVESH': 'Enter new home during auspicious Muhurat with proper rituals for lasting happiness.',
    'RENOVATION_START': 'Begin renovations during Uttara Bhadrapada or Revati Nakshatra.',
  };
  return guidance[eventType] || 'Consult a Jyotish (Vedic astrologer) for personalized timing.';
}

export default router;

