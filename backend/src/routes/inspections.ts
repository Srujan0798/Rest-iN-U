import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { redis } from '../utils/redis';
import { authenticate, optionalAuthenticate, requireAgent, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// S3 client setup
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// ============================================================================
// SCHEMAS
// ============================================================================

const InspectionTypeEnum = z.enum([
  'GENERAL',
  'STRUCTURAL',
  'ELECTRICAL',
  'PLUMBING',
  'HVAC',
  'ROOF',
  'FOUNDATION',
  'PEST',
  'MOLD',
  'RADON',
  'ASBESTOS',
  'LEAD',
  'POOL',
  'SEPTIC',
  'WELL',
  'CHIMNEY',
  'VASTU',
  'ENERGY_AUDIT',
  'ENVIRONMENTAL',
]);

const DefectSeverityEnum = z.enum(['MINOR', 'MODERATE', 'MAJOR', 'SAFETY_HAZARD', 'CRITICAL']);

const CreateInspectionSchema = z.object({
  propertyId: z.string().uuid(),
  type: InspectionTypeEnum,
  scheduledDate: z.string().datetime(),
  inspectorId: z.string().uuid().optional(),
  inspectorName: z.string().max(200).optional(),
  inspectorCompany: z.string().max(200).optional(),
  inspectorLicense: z.string().max(100).optional(),
  inspectorPhone: z.string().max(20).optional(),
  inspectorEmail: z.string().email().optional(),
  estimatedDuration: z.number().int().min(15).max(480).optional(), // minutes
  estimatedCost: z.number().min(0).optional(),
  notes: z.string().max(2000).optional(),
  accessInstructions: z.string().max(500).optional(),
  attendees: z.array(z.object({
    userId: z.string().uuid().optional(),
    name: z.string(),
    role: z.enum(['BUYER', 'SELLER', 'AGENT', 'CONTRACTOR', 'OTHER']),
  })).optional(),
});

const UpdateInspectionSchema = CreateInspectionSchema.partial();

const InspectionReportSchema = z.object({
  overallCondition: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'CRITICAL']),
  summary: z.string().max(5000),
  recommendations: z.string().max(5000).optional(),
  estimatedRepairCost: z.number().min(0).optional(),
  estimatedRepairCostRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }).optional(),
  immediateActionRequired: z.boolean().default(false),
  reinspectionRecommended: z.boolean().default(false),
  reinspectionAreas: z.array(z.string()).optional(),
  systemsInspected: z.array(z.object({
    system: z.string(),
    condition: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'NOT_INSPECTED']),
    notes: z.string().optional(),
    estimatedAge: z.number().optional(),
    estimatedRemainingLife: z.number().optional(),
  })).optional(),
  vastuCompliance: z.object({
    isCompliant: z.boolean(),
    score: z.number().min(0).max(100),
    issues: z.array(z.string()),
    recommendations: z.array(z.string()),
  }).optional(),
});

const DefectSchema = z.object({
  category: z.string().max(100),
  location: z.string().max(200),
  description: z.string().max(2000),
  severity: DefectSeverityEnum,
  estimatedRepairCost: z.number().min(0).optional(),
  estimatedRepairCostRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }).optional(),
  urgency: z.enum(['IMMEDIATE', 'WITHIN_30_DAYS', 'WITHIN_90_DAYS', 'WITHIN_YEAR', 'MONITOR']).optional(),
  recommendedAction: z.string().max(1000).optional(),
  contractorType: z.string().max(100).optional(),
  photos: z.array(z.string()).optional(),
  coordinates: z.object({
    x: z.number(),
    y: z.number(),
    floorPlanId: z.string().optional(),
  }).optional(),
});

const RepairRequestSchema = z.object({
  defectIds: z.array(z.string().uuid()),
  requestType: z.enum(['FIX_BEFORE_CLOSE', 'CREDIT', 'PRICE_REDUCTION', 'AS_IS']),
  requestedAmount: z.number().min(0).optional(),
  notes: z.string().max(2000).optional(),
  deadline: z.string().datetime().optional(),
});

// ============================================================================
// INSPECTION CRUD
// ============================================================================

// Schedule inspection
router.post('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = CreateInspectionSchema.parse(req.body);
  
  // Verify property access (owner, agent, or buyer in transaction)
  const property = await prisma.property.findUnique({
    where: { id: data.propertyId },
    include: {
      transactions: {
        where: {
          OR: [
            { buyerId: req.user!.id },
            { sellerId: req.user!.id },
          ],
          status: { in: ['PENDING', 'IN_ESCROW', 'UNDER_CONTRACT'] },
        },
      },
    },
  });
  
  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }
  
  const hasAccess = 
    property.ownerId === req.user!.id ||
    property.agentId === req.user!.agentId ||
    property.transactions.length > 0;
  
  if (!hasAccess) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const inspection = await prisma.inspection.create({
    data: {
      ...data,
      scheduledDate: new Date(data.scheduledDate),
      scheduledById: req.user!.id,
      status: 'SCHEDULED',
    },
    include: {
      property: {
        select: { id: true, title: true, address: true, city: true },
      },
    },
  });
  
  // Notify relevant parties
  const notifications: any[] = [];
  
  if (property.ownerId && property.ownerId !== req.user!.id) {
    notifications.push({
      userId: property.ownerId,
      type: 'INSPECTION_SCHEDULED',
      title: 'Inspection Scheduled',
      message: `A ${data.type} inspection has been scheduled for ${property.title || property.address}`,
      data: { inspectionId: inspection.id, propertyId: property.id },
    });
  }
  
  if (property.agentId && property.agentId !== req.user!.id) {
    notifications.push({
      userId: property.agentId,
      type: 'INSPECTION_SCHEDULED',
      title: 'Inspection Scheduled',
      message: `A ${data.type} inspection has been scheduled for ${property.title || property.address}`,
      data: { inspectionId: inspection.id, propertyId: property.id },
    });
  }
  
  if (notifications.length > 0) {
    await prisma.notification.createMany({ data: notifications });
  }
  
  res.status(201).json(inspection);
}));

// List inspections
router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    propertyId,
    type,
    status,
    upcoming,
    past,
    limit = '20',
    offset = '0',
  } = req.query;
  
  const where: any = {
    OR: [
      { scheduledById: req.user!.id },
      { property: { ownerId: req.user!.id } },
      { property: { agentId: req.user!.agentId } },
    ],
  };
  
  if (propertyId) where.propertyId = propertyId;
  if (type) where.type = type;
  if (status) where.status = status;
  
  if (upcoming === 'true') {
    where.scheduledDate = { gte: new Date() };
    where.status = { in: ['SCHEDULED', 'CONFIRMED'] };
  }
  
  if (past === 'true') {
    where.scheduledDate = { lt: new Date() };
  }
  
  const [inspections, total] = await Promise.all([
    prisma.inspection.findMany({
      where,
      include: {
        property: {
          select: { id: true, title: true, address: true, city: true, photos: { take: 1 } },
        },
        report: { select: { id: true, overallCondition: true } },
        _count: { select: { defects: true } },
      },
      orderBy: { scheduledDate: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    }),
    prisma.inspection.count({ where }),
  ]);
  
  res.json({
    inspections,
    total,
    limit: parseInt(limit as string),
    offset: parseInt(offset as string),
  });
}));

// Get inspection details
router.get('/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const inspection = await prisma.inspection.findUnique({
    where: { id },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          address: true,
          city: true,
          state: true,
          ownerId: true,
          agentId: true,
        },
      },
      report: true,
      defects: {
        include: {
          photos: true,
          repairRequests: true,
        },
        orderBy: { severity: 'desc' },
      },
      documents: true,
      scheduledBy: {
        select: { firstName: true, lastName: true },
      },
    },
  });
  
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }
  
  // Check access
  const hasAccess = 
    inspection.scheduledById === req.user!.id ||
    inspection.property.ownerId === req.user!.id ||
    inspection.property.agentId === req.user!.agentId;
  
  if (!hasAccess) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.json(inspection);
}));

// Update inspection
router.put('/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = UpdateInspectionSchema.parse(req.body);
  
  const inspection = await prisma.inspection.findFirst({
    where: {
      id,
      OR: [
        { scheduledById: req.user!.id },
        { property: { agentId: req.user!.agentId } },
      ],
      status: { in: ['SCHEDULED', 'CONFIRMED'] },
    },
  });
  
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found or cannot be modified' });
  }
  
  const updated = await prisma.inspection.update({
    where: { id },
    data: {
      ...data,
      scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : undefined,
    },
  });
  
  res.json(updated);
}));

// Cancel inspection
router.post('/:id/cancel', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  
  const inspection = await prisma.inspection.findFirst({
    where: {
      id,
      OR: [
        { scheduledById: req.user!.id },
        { property: { agentId: req.user!.agentId } },
      ],
      status: { in: ['SCHEDULED', 'CONFIRMED'] },
    },
    include: {
      property: { select: { ownerId: true, agentId: true } },
    },
  });
  
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found or cannot be cancelled' });
  }
  
  await prisma.inspection.update({
    where: { id },
    data: {
      status: 'CANCELLED',
      cancellationReason: reason,
      cancelledAt: new Date(),
    },
  });
  
  res.json({ success: true, message: 'Inspection cancelled' });
}));

// Confirm inspection
router.post('/:id/confirm', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const inspection = await prisma.inspection.findFirst({
    where: {
      id,
      OR: [
        { scheduledById: req.user!.id },
        { property: { agentId: req.user!.agentId } },
      ],
      status: 'SCHEDULED',
    },
  });
  
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }
  
  await prisma.inspection.update({
    where: { id },
    data: { status: 'CONFIRMED' },
  });
  
  res.json({ success: true, message: 'Inspection confirmed' });
}));

// Mark inspection as in progress
router.post('/:id/start', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const inspection = await prisma.inspection.findFirst({
    where: {
      id,
      OR: [
        { scheduledById: req.user!.id },
        { property: { agentId: req.user!.agentId } },
      ],
      status: { in: ['SCHEDULED', 'CONFIRMED'] },
    },
  });
  
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }
  
  await prisma.inspection.update({
    where: { id },
    data: {
      status: 'IN_PROGRESS',
      actualStartTime: new Date(),
    },
  });
  
  res.json({ success: true, message: 'Inspection started' });
}));

// Complete inspection
router.post('/:id/complete', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const inspection = await prisma.inspection.findFirst({
    where: {
      id,
      OR: [
        { scheduledById: req.user!.id },
        { property: { agentId: req.user!.agentId } },
      ],
      status: 'IN_PROGRESS',
    },
  });
  
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found or not in progress' });
  }
  
  await prisma.inspection.update({
    where: { id },
    data: {
      status: 'COMPLETED',
      actualEndTime: new Date(),
    },
  });
  
  res.json({ success: true, message: 'Inspection completed' });
}));

// ============================================================================
// INSPECTION REPORT
// ============================================================================

// Create/update inspection report
router.post('/:id/report', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = InspectionReportSchema.parse(req.body);
  
  const inspection = await prisma.inspection.findFirst({
    where: {
      id,
      OR: [
        { scheduledById: req.user!.id },
        { property: { agentId: req.user!.agentId } },
      ],
    },
    include: {
      property: { select: { ownerId: true, agentId: true, title: true, address: true } },
    },
  });
  
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }
  
  const report = await prisma.inspectionReport.upsert({
    where: { inspectionId: id },
    create: {
      inspectionId: id,
      ...data,
      createdById: req.user!.id,
    },
    update: {
      ...data,
      updatedAt: new Date(),
    },
  });
  
  // Update inspection status
  await prisma.inspection.update({
    where: { id },
    data: { status: 'REPORT_READY' },
  });
  
  // Notify property owner and agent
  const notifications: any[] = [];
  
  if (inspection.property.ownerId) {
    notifications.push({
      userId: inspection.property.ownerId,
      type: 'INSPECTION_REPORT_READY',
      title: 'Inspection Report Ready',
      message: `The inspection report for ${inspection.property.title || inspection.property.address} is now available`,
      data: { inspectionId: id, reportId: report.id },
      priority: data.immediateActionRequired ? 'URGENT' : 'NORMAL',
    });
  }
  
  if (inspection.property.agentId) {
    notifications.push({
      userId: inspection.property.agentId,
      type: 'INSPECTION_REPORT_READY',
      title: 'Inspection Report Ready',
      message: `The inspection report for ${inspection.property.title || inspection.property.address} is now available`,
      data: { inspectionId: id, reportId: report.id },
      priority: data.immediateActionRequired ? 'URGENT' : 'NORMAL',
    });
  }
  
  if (notifications.length > 0) {
    await prisma.notification.createMany({ data: notifications });
  }
  
  res.status(201).json(report);
}));

// Get inspection report
router.get('/:id/report', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const inspection = await prisma.inspection.findFirst({
    where: {
      id,
      OR: [
        { scheduledById: req.user!.id },
        { property: { ownerId: req.user!.id } },
        { property: { agentId: req.user!.agentId } },
      ],
    },
    include: {
      report: {
        include: {
          createdBy: { select: { firstName: true, lastName: true } },
        },
      },
    },
  });
  
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }
  
  if (!inspection.report) {
    return res.status(404).json({ error: 'Report not yet available' });
  }
  
  res.json(inspection.report);
}));

// ============================================================================
// DEFECTS
// ============================================================================

// Add defect to inspection
router.post('/:id/defects', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = DefectSchema.parse(req.body);
  
  const inspection = await prisma.inspection.findFirst({
    where: {
      id,
      OR: [
        { scheduledById: req.user!.id },
        { property: { agentId: req.user!.agentId } },
      ],
    },
  });
  
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }
  
  const defect = await prisma.inspectionDefect.create({
    data: {
      inspectionId: id,
      ...data,
      reportedById: req.user!.id,
    },
  });
  
  res.status(201).json(defect);
}));

// List defects
router.get('/:id/defects', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { severity, category } = req.query;
  
  const inspection = await prisma.inspection.findFirst({
    where: {
      id,
      OR: [
        { scheduledById: req.user!.id },
        { property: { ownerId: req.user!.id } },
        { property: { agentId: req.user!.agentId } },
      ],
    },
  });
  
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }
  
  const where: any = { inspectionId: id };
  if (severity) where.severity = severity;
  if (category) where.category = { contains: category as string, mode: 'insensitive' };
  
  const defects = await prisma.inspectionDefect.findMany({
    where,
    include: {
      photos: true,
      repairRequests: true,
    },
    orderBy: [
      { severity: 'desc' },
      { createdAt: 'asc' },
    ],
  });
  
  // Summary statistics
  const summary = {
    total: defects.length,
    bySeverity: {
      critical: defects.filter(d => d.severity === 'CRITICAL').length,
      safetyHazard: defects.filter(d => d.severity === 'SAFETY_HAZARD').length,
      major: defects.filter(d => d.severity === 'MAJOR').length,
      moderate: defects.filter(d => d.severity === 'MODERATE').length,
      minor: defects.filter(d => d.severity === 'MINOR').length,
    },
    estimatedTotalCost: defects.reduce((sum, d) => sum + (d.estimatedRepairCost || 0), 0),
    byCategory: defects.reduce((acc, d) => {
      acc[d.category] = (acc[d.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
  
  res.json({ defects, summary });
}));

// Update defect
router.put('/:id/defects/:defectId', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id, defectId } = req.params;
  const data = DefectSchema.partial().parse(req.body);
  
  const defect = await prisma.inspectionDefect.findFirst({
    where: {
      id: defectId,
      inspectionId: id,
      inspection: {
        OR: [
          { scheduledById: req.user!.id },
          { property: { agentId: req.user!.agentId } },
        ],
      },
    },
  });
  
  if (!defect) {
    return res.status(404).json({ error: 'Defect not found' });
  }
  
  const updated = await prisma.inspectionDefect.update({
    where: { id: defectId },
    data,
  });
  
  res.json(updated);
}));

// Delete defect
router.delete('/:id/defects/:defectId', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id, defectId } = req.params;
  
  const defect = await prisma.inspectionDefect.findFirst({
    where: {
      id: defectId,
      inspectionId: id,
      inspection: {
        OR: [
          { scheduledById: req.user!.id },
          { property: { agentId: req.user!.agentId } },
        ],
      },
    },
  });
  
  if (!defect) {
    return res.status(404).json({ error: 'Defect not found' });
  }
  
  await prisma.inspectionDefect.delete({ where: { id: defectId } });
  
  res.json({ success: true, message: 'Defect deleted' });
}));

// Upload defect photo
router.post('/:id/defects/:defectId/photos', authenticate, upload.single('photo'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id, defectId } = req.params;
  
  if (!req.file) {
    return res.status(400).json({ error: 'No photo provided' });
  }
  
  const defect = await prisma.inspectionDefect.findFirst({
    where: {
      id: defectId,
      inspectionId: id,
      inspection: {
        OR: [
          { scheduledById: req.user!.id },
          { property: { agentId: req.user!.agentId } },
        ],
      },
    },
  });
  
  if (!defect) {
    return res.status(404).json({ error: 'Defect not found' });
  }
  
  const key = `inspections/${id}/defects/${defectId}/${uuidv4()}.jpg`;
  
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  }));
  
  const photo = await prisma.defectPhoto.create({
    data: {
      defectId,
      url: `${process.env.CDN_URL}/${key}`,
      s3Key: key,
      caption: req.body.caption,
    },
  });
  
  res.status(201).json(photo);
}));

// ============================================================================
// REPAIR REQUESTS
// ============================================================================

// Create repair request
router.post('/:id/repair-requests', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = RepairRequestSchema.parse(req.body);
  
  const inspection = await prisma.inspection.findFirst({
    where: {
      id,
      OR: [
        { scheduledById: req.user!.id },
        { property: { ownerId: req.user!.id } },
      ],
    },
    include: {
      property: { select: { ownerId: true, agentId: true, title: true } },
    },
  });
  
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }
  
  // Verify defects belong to this inspection
  const defects = await prisma.inspectionDefect.findMany({
    where: {
      id: { in: data.defectIds },
      inspectionId: id,
    },
  });
  
  if (defects.length !== data.defectIds.length) {
    return res.status(400).json({ error: 'Some defects not found' });
  }
  
  const repairRequest = await prisma.repairRequest.create({
    data: {
      inspectionId: id,
      requestedById: req.user!.id,
      requestType: data.requestType,
      requestedAmount: data.requestedAmount,
      notes: data.notes,
      deadline: data.deadline ? new Date(data.deadline) : null,
      status: 'PENDING',
      defects: {
        connect: data.defectIds.map(id => ({ id })),
      },
    },
    include: {
      defects: true,
    },
  });
  
  // Notify seller/owner
  if (inspection.property.ownerId && inspection.property.ownerId !== req.user!.id) {
    await prisma.notification.create({
      data: {
        userId: inspection.property.ownerId,
        type: 'REPAIR_REQUEST',
        title: 'New Repair Request',
        message: `A repair request has been submitted for ${inspection.property.title}`,
        data: { inspectionId: id, repairRequestId: repairRequest.id },
        priority: 'HIGH',
      },
    });
  }
  
  res.status(201).json(repairRequest);
}));

// Get repair requests for inspection
router.get('/:id/repair-requests', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const inspection = await prisma.inspection.findFirst({
    where: {
      id,
      OR: [
        { scheduledById: req.user!.id },
        { property: { ownerId: req.user!.id } },
        { property: { agentId: req.user!.agentId } },
      ],
    },
  });
  
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }
  
  const repairRequests = await prisma.repairRequest.findMany({
    where: { inspectionId: id },
    include: {
      defects: true,
      requestedBy: { select: { firstName: true, lastName: true } },
      responses: {
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  
  res.json(repairRequests);
}));

// Respond to repair request
router.post('/:id/repair-requests/:requestId/respond', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id, requestId } = req.params;
  const { response, counterOffer, notes } = req.body;
  
  const repairRequest = await prisma.repairRequest.findFirst({
    where: {
      id: requestId,
      inspectionId: id,
      inspection: {
        property: {
          OR: [
            { ownerId: req.user!.id },
            { agentId: req.user!.agentId },
          ],
        },
      },
    },
  });
  
  if (!repairRequest) {
    return res.status(404).json({ error: 'Repair request not found' });
  }
  
  // Create response
  const repairResponse = await prisma.repairRequestResponse.create({
    data: {
      repairRequestId: requestId,
      respondedById: req.user!.id,
      response, // ACCEPT, REJECT, COUNTER
      counterOffer,
      notes,
    },
  });
  
  // Update request status
  let newStatus = repairRequest.status;
  if (response === 'ACCEPT') newStatus = 'ACCEPTED';
  else if (response === 'REJECT') newStatus = 'REJECTED';
  else if (response === 'COUNTER') newStatus = 'COUNTER_OFFERED';
  
  await prisma.repairRequest.update({
    where: { id: requestId },
    data: { status: newStatus },
  });
  
  // Notify requester
  await prisma.notification.create({
    data: {
      userId: repairRequest.requestedById,
      type: 'REPAIR_REQUEST_RESPONSE',
      title: `Repair Request ${response}`,
      message: `Your repair request has received a response`,
      data: { repairRequestId: requestId },
    },
  });
  
  res.status(201).json(repairResponse);
}));

// ============================================================================
// DOCUMENTS
// ============================================================================

// Upload inspection document
router.post('/:id/documents', authenticate, upload.single('document'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { type, name } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ error: 'No document provided' });
  }
  
  const inspection = await prisma.inspection.findFirst({
    where: {
      id,
      OR: [
        { scheduledById: req.user!.id },
        { property: { agentId: req.user!.agentId } },
      ],
    },
  });
  
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }
  
  const key = `inspections/${id}/documents/${uuidv4()}-${req.file.originalname}`;
  
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  }));
  
  const document = await prisma.inspectionDocument.create({
    data: {
      inspectionId: id,
      type: type || 'REPORT',
      name: name || req.file.originalname,
      url: `${process.env.CDN_URL}/${key}`,
      s3Key: key,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedById: req.user!.id,
    },
  });
  
  res.status(201).json(document);
}));

// Get document download URL
router.get('/:id/documents/:docId/download', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id, docId } = req.params;
  
  const document = await prisma.inspectionDocument.findFirst({
    where: {
      id: docId,
      inspectionId: id,
      inspection: {
        OR: [
          { scheduledById: req.user!.id },
          { property: { ownerId: req.user!.id } },
          { property: { agentId: req.user!.agentId } },
        ],
      },
    },
  });
  
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: document.s3Key,
    }),
    { expiresIn: 3600 }
  );
  
  res.json({ url });
}));

// ============================================================================
// CONTRACTOR RECOMMENDATIONS
// ============================================================================

// Get contractor recommendations for defects
router.get('/:id/contractors', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { defectId, category } = req.query;
  
  const inspection = await prisma.inspection.findFirst({
    where: {
      id,
      OR: [
        { scheduledById: req.user!.id },
        { property: { ownerId: req.user!.id } },
        { property: { agentId: req.user!.agentId } },
      ],
    },
    include: {
      property: { select: { city: true, state: true, zipCode: true } },
      defects: defectId ? { where: { id: defectId as string } } : true,
    },
  });
  
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }
  
  // Get contractor types needed based on defects
  const contractorTypes = new Set<string>();
  inspection.defects.forEach(d => {
    if (d.contractorType) contractorTypes.add(d.contractorType);
  });
  
  if (category) contractorTypes.add(category as string);
  
  // Find contractors in the area
  const contractors = await prisma.contractor.findMany({
    where: {
      specialties: { hasSome: Array.from(contractorTypes) },
      serviceAreas: { has: inspection.property.city },
      isActive: true,
      isVerified: true,
    },
    include: {
      _count: { select: { reviews: true } },
    },
    orderBy: [
      { avgRating: 'desc' },
      { completedJobs: 'desc' },
    ],
    take: 10,
  });
  
  // Get reviews for top contractors
  const contractorsWithReviews = await Promise.all(
    contractors.map(async c => {
      const reviews = await prisma.contractorReview.findMany({
        where: { contractorId: c.id },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          rating: true,
          comment: true,
          createdAt: true,
        },
      });
      return { ...c, recentReviews: reviews };
    })
  );
  
  res.json({
    contractorTypes: Array.from(contractorTypes),
    contractors: contractorsWithReviews,
  });
}));

// Request quote from contractor
router.post('/:id/quote-request', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { contractorId, defectIds, message, preferredSchedule } = req.body;
  
  const inspection = await prisma.inspection.findFirst({
    where: {
      id,
      OR: [
        { scheduledById: req.user!.id },
        { property: { ownerId: req.user!.id } },
      ],
    },
    include: {
      property: { select: { address: true, city: true } },
      defects: { where: { id: { in: defectIds } } },
    },
  });
  
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }
  
  const quoteRequest = await prisma.quoteRequest.create({
    data: {
      inspectionId: id,
      contractorId,
      requestedById: req.user!.id,
      defects: { connect: defectIds.map((id: string) => ({ id })) },
      message,
      preferredSchedule,
      status: 'PENDING',
    },
  });
  
  // Notify contractor
  const contractor = await prisma.contractor.findUnique({
    where: { id: contractorId },
    select: { userId: true },
  });
  
  if (contractor?.userId) {
    await prisma.notification.create({
      data: {
        userId: contractor.userId,
        type: 'QUOTE_REQUEST',
        title: 'New Quote Request',
        message: `You have a new quote request for ${inspection.property.address}`,
        data: { quoteRequestId: quoteRequest.id },
      },
    });
  }
  
  res.status(201).json(quoteRequest);
}));

// ============================================================================
// INSPECTOR DIRECTORY
// ============================================================================

// Search inspectors
router.get('/inspectors/search', optionalAuthenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    city,
    state,
    zipCode,
    type,
    minRating,
    limit = '20',
    offset = '0',
  } = req.query;
  
  const where: any = {
    isActive: true,
    isVerified: true,
  };
  
  if (city) where.serviceAreas = { has: city };
  if (state) where.state = state;
  if (type) where.specializations = { has: type };
  if (minRating) where.avgRating = { gte: parseFloat(minRating as string) };
  
  const [inspectors, total] = await Promise.all([
    prisma.inspector.findMany({
      where,
      include: {
        _count: { select: { inspections: true, reviews: true } },
      },
      orderBy: [
        { avgRating: 'desc' },
        { completedInspections: 'desc' },
      ],
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    }),
    prisma.inspector.count({ where }),
  ]);
  
  res.json({
    inspectors,
    total,
    limit: parseInt(limit as string),
    offset: parseInt(offset as string),
  });
}));

// Get inspector profile
router.get('/inspectors/:inspectorId', optionalAuthenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { inspectorId } = req.params;
  
  const inspector = await prisma.inspector.findUnique({
    where: { id: inspectorId },
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
      },
      certifications: true,
      _count: { select: { inspections: true, reviews: true } },
    },
  });
  
  if (!inspector) {
    return res.status(404).json({ error: 'Inspector not found' });
  }
  
  res.json(inspector);
}));

export default router;

