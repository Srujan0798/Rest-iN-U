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
  AuthenticatedRequest
} from '../middleware/auth';
import {
  asyncHandler,
  BadRequestError,
  NotFoundError
} from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { VastuService, VASTU_RULES, VASTU_REMEDIES } from '../services/vastu.service';

const router = Router();
const vastuService = new VastuService();

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

  const analysis = await vastuService.analyzeProperty(data);

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
    analysisDate: analysis.analyzedAt, // This is already a DateTime object from Prisma
    overallScore: analysis.overallScore,
    grade: analysis.grade,
    entranceDirection: analysis.entranceDirection,
    entranceScore: analysis.entranceScore,
    criticalIssues: analysis.criticalDefects,
    // @ts-ignore
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
