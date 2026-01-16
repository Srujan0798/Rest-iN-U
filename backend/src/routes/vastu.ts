// Vastu Shastra AI Analysis Routes
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma";
import { cacheGet, cacheSet, CACHE_KEYS, CACHE_TTL } from "../utils/redis";
import { authenticate, AuthenticatedRequest } from "../middleware/auth";
import {
  asyncHandler,
  BadRequestError,
  NotFoundError,
} from "../middleware/errorHandler";
import { logger } from "../utils/logger";
import {
  VastuService,
  VASTU_RULES,
  VASTU_REMEDIES,
} from "../services/vastu.service";
import { PanchangService, PanchangData } from "../services/panchang.service";
import { blockchainService } from "../services/blockchain";

const router = Router();
const vastuService = new VastuService();
const panchangService = new PanchangService();

// Validation schemas
const analyzeFloorPlanSchema = z.object({
  propertyId: z.string().uuid().optional(),
  floorPlanUrl: z.string().url().optional(),
  orientation: z.enum([
    "NORTH",
    "SOUTH",
    "EAST",
    "WEST",
    "NORTH_EAST",
    "NORTH_WEST",
    "SOUTH_EAST",
    "SOUTH_WEST",
  ]),
  propertyType: z
    .enum(["HOUSE", "APARTMENT", "COMMERCIAL", "VILLA", "FARMHOUSE"])
    .default("HOUSE"),

  // Manual room input (if no AI detection)
  rooms: z
    .array(
      z.object({
        type: z.string(),
        direction: z.enum([
          "NORTH",
          "SOUTH",
          "EAST",
          "WEST",
          "NORTH_EAST",
          "NORTH_WEST",
          "SOUTH_EAST",
          "SOUTH_WEST",
          "CENTER",
        ]),
        coordinates: z
          .object({
            x: z.number(),
            y: z.number(),
            width: z.number(),
            height: z.number(),
          })
          .optional(),
      }),
    )
    .optional(),

  entrance: z.object({
    direction: z.enum([
      "NORTH",
      "SOUTH",
      "EAST",
      "WEST",
      "NORTH_EAST",
      "NORTH_WEST",
      "SOUTH_EAST",
      "SOUTH_WEST",
    ]),
    position: z.enum(["LEFT", "CENTER", "RIGHT"]).optional(),
  }),

  slope: z
    .object({
      lowest: z
        .enum([
          "NORTH",
          "SOUTH",
          "EAST",
          "WEST",
          "NORTH_EAST",
          "NORTH_WEST",
          "SOUTH_EAST",
          "SOUTH_WEST",
        ])
        .optional(),
      highest: z
        .enum([
          "NORTH",
          "SOUTH",
          "EAST",
          "WEST",
          "NORTH_EAST",
          "NORTH_WEST",
          "SOUTH_EAST",
          "SOUTH_WEST",
        ])
        .optional(),
    })
    .optional(),

  waterSources: z
    .array(
      z.object({
        type: z.string(), // well, borewell, tank, etc.
        direction: z.enum([
          "NORTH",
          "SOUTH",
          "EAST",
          "WEST",
          "NORTH_EAST",
          "NORTH_WEST",
          "SOUTH_EAST",
          "SOUTH_WEST",
        ]),
      }),
    )
    .optional(),

  staircase: z
    .object({
      direction: z
        .enum([
          "NORTH",
          "SOUTH",
          "EAST",
          "WEST",
          "NORTH_EAST",
          "NORTH_WEST",
          "SOUTH_EAST",
          "SOUTH_WEST",
          "CENTER",
        ])
        .optional(),
      rotation: z.enum(["CLOCKWISE", "ANTICLOCKWISE"]).optional(),
    })
    .optional(),

  language: z.enum(["en", "hi", "ta", "te", "mr", "gu", "bn"]).default("en"),
});

const auspiciousTimingSchema = z.object({
  eventType: z.string(),
  startDate: z.string().datetime().or(z.string()), // Accept ISO string or plain date string
  endDate: z.string().datetime().or(z.string()),
  location: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     VastuAnalysisRequest:
 *       type: object
 *       required:
 *         - orientation
 *         - entrance
 *       properties:
 *         propertyId:
 *           type: string
 *           format: uuid
 *         floorPlanUrl:
 *           type: string
 *         orientation:
 *           type: string
 *           enum: [NORTH, SOUTH, EAST, WEST, NORTH_EAST, NORTH_WEST, SOUTH_EAST, SOUTH_WEST]
 *         propertyType:
 *           type: string
 *           default: HOUSE
 *         rooms:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               direction:
 *                 type: string
 *         entrance:
 *           type: object
 *           properties:
 *             direction:
 *               type: string
 *             position:
 *               type: string
 *         language:
 *           type: string
 *           default: en
 *     VastuAnalysisResponse:
 *       type: object
 *       properties:
 *         overallScore:
 *           type: number
 *         grade:
 *           type: string
 *         defects:
 *           type: array
 *           items:
 *             type: object
 *         remedies:
 *           type: array
 *           items:
 *             type: string
 *     AuspiciousTimingRequest:
 *       type: object
 *       required:
 *         - eventType
 *         - startDate
 *         - endDate
 *       properties:
 *         eventType:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         location:
 *           type: object
 *           properties:
 *             lat:
 *               type: number
 *             lng:
 *               type: number
 */

/**
 * @swagger
 * /vastu/analyze:
 *   post:
 *     summary: Analyze property for Vastu compliance
 *     tags: [Vastu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VastuAnalysisRequest'
 *     responses:
 *       200:
 *         description: Analysis result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/VastuAnalysisResponse'
 */
router.post(
  "/analyze",
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const data = analyzeFloorPlanSchema.parse(req.body);

    logger.info(`Vastu analysis requested by user ${req.user!.id}`);

    const analysis = await vastuService.analyzeProperty(data);

    res.json({
      success: true,
      data: analysis,
    });
  }),
);

/**
 * @swagger
 * /vastu/property/{propertyId}:
 *   get:
 *     summary: Get Vastu analysis for a property
 *     tags: [Vastu]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Vastu analysis data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/VastuAnalysisResponse'
 */
router.get(
  "/property/:propertyId",
  asyncHandler(async (req, res) => {
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
      throw new NotFoundError("Vastu analysis not found for this property");
    }

    await cacheSet(cacheKey, analysis, CACHE_TTL.LONG);

    res.json({
      success: true,
      data: analysis,
    });
  }),
);

/**
 * @swagger
 * /vastu/rules:
 *   get:
 *     summary: Get Vastu rules reference
 *     tags: [Vastu]
 *     responses:
 *       200:
 *         description: Vastu rules data
 */
router.get(
  "/rules",
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: {
        entrance: VASTU_RULES.entrance,
        rooms: Object.keys(VASTU_RULES.rooms).map((room) => ({
          name: room,
          ...VASTU_RULES.rooms[room as keyof typeof VASTU_RULES.rooms],
        })),
        slope: VASTU_RULES.slope,
        waterSources: VASTU_RULES.waterSources,
        staircase: VASTU_RULES.staircase,
      },
    });
  }),
);

/**
 * @swagger
 * /vastu/remedies/{defectType}:
 *   get:
 *     summary: Get remedies for a specific defect
 *     tags: [Vastu]
 *     parameters:
 *       - in: path
 *         name: defectType
 *         required: true
 *         schema:
 *           type: string
 *         description: Type of Vastu defect
 *     responses:
 *       200:
 *         description: List of remedies
 */
router.get(
  "/remedies/:defectType",
  asyncHandler(async (req, res) => {
    const { defectType } = req.params;
    
    // @ts-ignore
    const remedies = VASTU_REMEDIES[defectType];

    if (!remedies) {
      throw new NotFoundError(`No remedies found for defect type: ${defectType}`);
    }

    res.json({
      success: true,
      data: {
        defectType,
        remedies
      }
    });
  })
);

/**
 * @swagger
 * /vastu/certificate/{propertyId}:
 *   get:
 *     summary: Generate Vastu compliance certificate
 *     tags: [Vastu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Vastu certificate details
 */
router.get(
  "/certificate/:propertyId",
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
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
      throw new NotFoundError("Vastu analysis not found");
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
      issuedBy: "REST-iN-U Vastu AI",
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
      blockchainHash: analysis.blockchainTxHash || null,
      verificationLink: analysis.blockchainTxHash
        ? `https://etherscan.io/tx/${analysis.blockchainTxHash}`
        : "",
    };

    res.json({
      success: true,
      data: certificate,
    });
  }),
);

/**
 * @swagger
 * /vastu/auspicious-timing:
 *   post:
 *     summary: Get auspicious timing for property transactions
 *     tags: [Vastu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuspiciousTimingRequest'
 *     responses:
 *       200:
 *         description: List of auspicious dates and times
 */
router.post(
  "/auspicious-timing",
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { eventType, startDate, endDate, location } =
      auspiciousTimingSchema.parse(req.body);

    const start = new Date(startDate);
    const end = new Date(endDate);

    const latitude = location?.lat || 28.6139; // Default to New Delhi
    const longitude = location?.lng || 77.209;

    const panchangDataList: any[] = [];

    let current = new Date(start);
    while (current <= end) {
      // Calculate Panchang for current date
      const panchang = panchangService.calculatePanchang(
        new Date(current),
        latitude,
        longitude,
      );

      if (panchang.isAuspicious) {
        panchangDataList.push({
          date: panchang.date,
          dayOfWeek: panchang.dayOfWeek,
          nakshatra: panchang.nakshatra.name,
          tithi: panchang.tithi.name,
          yoga: panchang.yoga.name,
          rahuKaal: panchang.rahuKaal,
          isAuspicious: true,
          details: {
            sunrise: panchang.sunrise,
            sunset: panchang.sunset,
          },
        });
      }

      current.setDate(current.getDate() + 1);
    }

    res.json({
      success: true,
      data: {
        eventType,
        auspiciousDates: panchangDataList.slice(0, 10), // Limit to 10
        generalGuidance: getEventGuidance(eventType),
      },
    });
  }),
);

/**
 * @swagger
 * /vastu/certificate/{propertyId}/issue:
 *   post:
 *     summary: Issue Vastu certificate on blockchain
 *     tags: [Vastu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Certificate issuance details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactionHash:
 *                       type: string
 *                     certificateId:
 *                       type: string
 */
router.post(
  "/certificate/:propertyId/issue",
  authenticate,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { propertyId } = req.params;

    const analysis = await prisma.vastuAnalysis.findUnique({
      where: { propertyId },
    });

    if (!analysis) {
      throw new NotFoundError("Vastu analysis not found");
    }

    if (analysis.blockchainTxHash) {
      throw new BadRequestError("Certificate already issued on blockchain");
    }

    // Issue certificate on blockchain
    const txHash = await blockchainService.issueVastuCertificate(
      propertyId,
      analysis.overallScore,
      analysis.grade,
      analysis.entranceDirection,
      analysis.analyzedAt.toISOString(),
    );

    // Update analysis with blockchain transaction hash
    const updatedAnalysis = await prisma.vastuAnalysis.update({
      where: { propertyId },
      data: { blockchainTxHash: txHash },
    });

    res.json({
      success: true,
      data: {
        transactionHash: txHash,
        certificateId: `VASTU-${propertyId.slice(0, 8).toUpperCase()}-${Date.now()}`,
      },
    });
  }),
);

function getEventGuidance(eventType: string): string {
  const guidance: Record<string, string> = {
    PROPERTY_VIEWING:
      "View properties during morning hours (after sunrise) when natural light reveals true condition.",
    MAKING_OFFER:
      "Make offers on days with favorable Nakshatra. Avoid during Rahu Kaal.",
    SIGNING_CONTRACT:
      "Sign contracts during Pushya or Uttara Phalguni Nakshatra for prosperity.",
    CLOSING:
      "Complete closing formalities during Shukla Paksha (waxing moon) for growth.",
    GRIHA_PRAVESH:
      "Enter new home during auspicious Muhurat with proper rituals for lasting happiness.",
    RENOVATION_START:
      "Begin renovations during Uttara Bhadrapada or Revati Nakshatra.",
  };
  return (
    guidance[eventType] ||
    "Consult a Jyotish (Vedic astrologer) for personalized timing."
  );
}

export default router;
