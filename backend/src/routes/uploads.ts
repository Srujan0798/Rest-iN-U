

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { redis } from '../utils/redis';

const router = Router();
const prisma = new PrismaClient();

// S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'rest-in-u-uploads';
const CDN_URL = process.env.CDN_URL || `https://${BUCKET_NAME}.s3.amazonaws.com`;

// Multer configuration for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
  const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const allowedTypes = [...allowedImageTypes, ...allowedDocTypes];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
});

// Image processing configurations
const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 400, height: 300 },
  medium: { width: 800, height: 600 },
  large: { width: 1200, height: 900 },
  original: null,
};

// Upload types and their S3 paths
const UPLOAD_PATHS = {
  PROPERTY_PHOTO: 'properties/photos',
  PROPERTY_FLOORPLAN: 'properties/floorplans',
  PROPERTY_DOCUMENT: 'properties/documents',
  PROPERTY_3D_TOUR: 'properties/3d-tours',
  AGENT_PHOTO: 'agents/photos',
  AGENT_DOCUMENT: 'agents/documents',
  USER_AVATAR: 'users/avatars',
  VASTU_DIAGRAM: 'vastu/diagrams',
  MESSAGE_ATTACHMENT: 'messages/attachments',
  INSPECTION_REPORT: 'inspections/reports',
  TRANSACTION_DOCUMENT: 'transactions/documents',
};

// ============================================
// PROPERTY PHOTO UPLOADS
// ============================================

// Upload property photos (multiple)
router.post('/properties/:propertyId/photos', authenticate, upload.array('photos', 20), asyncHandler(async (req: Request, res: Response) => {
  const { propertyId } = req.params;
  const userId = req.user!.id;
  const files = req.files as Express.Multer.File[];
  
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  // Verify property ownership
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      OR: [
        { ownerId: userId },
        { agentId: userId },
      ],
    },
    include: { photos: true },
  });

  if (!property) {
    return res.status(404).json({ error: 'Property not found or unauthorized' });
  }

  // Check photo limit (max 50 per property)
  if (property.photos.length + files.length > 50) {
    return res.status(400).json({ 
      error: 'Photo limit exceeded',
      current: property.photos.length,
      max: 50,
      trying: files.length,
    });
  }

  const uploadedPhotos = [];

  for (const file of files) {
    const photoId = uuidv4();
    const basePath = `${UPLOAD_PATHS.PROPERTY_PHOTO}/${propertyId}/${photoId}`;
    const urls: Record<string, string> = {};

    // Process and upload different sizes
    for (const [sizeName, dimensions] of Object.entries(IMAGE_SIZES)) {
      let processedBuffer: Buffer;
      
      if (dimensions) {
        processedBuffer = await sharp(file.buffer)
          .resize(dimensions.width, dimensions.height, { fit: 'cover' })
          .jpeg({ quality: 85 })
          .toBuffer();
      } else {
        // Original - just optimize
        processedBuffer = await sharp(file.buffer)
          .jpeg({ quality: 90 })
          .toBuffer();
      }

      const key = `${basePath}/${sizeName}.jpg`;
      
      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: processedBuffer,
        ContentType: 'image/jpeg',
        CacheControl: 'max-age=31536000',
        Metadata: {
          propertyId,
          uploadedBy: userId,
          originalName: file.originalname,
        },
      }));

      urls[sizeName] = `${CDN_URL}/${key}`;
    }

    // Extract image metadata
    const metadata = await sharp(file.buffer).metadata();

    // Save to database
    const photo = await prisma.propertyPhoto.create({
      data: {
        propertyId,
        url: urls.large,
        thumbnailUrl: urls.thumbnail,
        caption: '',
        isPrimary: property.photos.length === 0 && uploadedPhotos.length === 0,
        order: property.photos.length + uploadedPhotos.length,
        width: metadata.width,
        height: metadata.height,
        size: file.size,
        mimeType: 'image/jpeg',
        s3Key: `${basePath}/original.jpg`,
        variants: urls,
      },
    });

    uploadedPhotos.push(photo);
  }

  // Invalidate cache
  await redis.del(`property:${propertyId}:photos`);

  res.status(201).json({
    message: `${uploadedPhotos.length} photos uploaded successfully`,
    photos: uploadedPhotos,
  });
}));

// Get property photos
router.get('/properties/:propertyId/photos', asyncHandler(async (req: Request, res: Response) => {
  const { propertyId } = req.params;

  // Check cache
  const cached = await redis.get(`property:${propertyId}:photos`);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  const photos = await prisma.propertyPhoto.findMany({
    where: { propertyId },
    orderBy: [
      { isPrimary: 'desc' },
      { order: 'asc' },
    ],
  });

  await redis.setex(`property:${propertyId}:photos`, 3600, JSON.stringify(photos));

  res.json(photos);
}));

// Update photo metadata
router.put('/photos/:photoId', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const { photoId } = req.params;
  const userId = req.user!.id;

  const updateSchema = z.object({
    caption: z.string().max(500).optional(),
    altText: z.string().max(200).optional(),
    isPrimary: z.boolean().optional(),
    order: z.number().int().min(0).optional(),
    room: z.string().optional(),
    tags: z.array(z.string()).optional(),
  });

  const data = updateSchema.parse(req.body);

  // Verify ownership
  const photo = await prisma.propertyPhoto.findUnique({
    where: { id: photoId },
    include: {
      property: true,
    },
  });

  if (!photo) {
    return res.status(404).json({ error: 'Photo not found' });
  }

  if (photo.property.ownerId !== userId && photo.property.agentId !== userId) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  // If setting as primary, unset others
  if (data.isPrimary) {
    await prisma.propertyPhoto.updateMany({
      where: { propertyId: photo.propertyId, isPrimary: true },
      data: { isPrimary: false },
    });
  }

  const updated = await prisma.propertyPhoto.update({
    where: { id: photoId },
    data,
  });

  await redis.del(`property:${photo.propertyId}:photos`);

  res.json(updated);
}));

// Reorder photos
router.put('/properties/:propertyId/photos/reorder', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const { propertyId } = req.params;
  const userId = req.user!.id;

  const reorderSchema = z.object({
    photoIds: z.array(z.string()),
  });

  const { photoIds } = reorderSchema.parse(req.body);

  // Verify ownership
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      OR: [{ ownerId: userId }, { agentId: userId }],
    },
  });

  if (!property) {
    return res.status(404).json({ error: 'Property not found or unauthorized' });
  }

  // Update order
  await Promise.all(
    photoIds.map((photoId, index) =>
      prisma.propertyPhoto.update({
        where: { id: photoId },
        data: { order: index },
      })
    )
  );

  await redis.del(`property:${propertyId}:photos`);

  res.json({ message: 'Photos reordered successfully' });
}));

// Delete photo
router.delete('/photos/:photoId', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const { photoId } = req.params;
  const userId = req.user!.id;

  const photo = await prisma.propertyPhoto.findUnique({
    where: { id: photoId },
    include: { property: true },
  });

  if (!photo) {
    return res.status(404).json({ error: 'Photo not found' });
  }

  if (photo.property.ownerId !== userId && photo.property.agentId !== userId) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  // Delete from S3 (all variants)
  if (photo.variants) {
    const variants = photo.variants as Record<string, string>;
    for (const url of Object.values(variants)) {
      const key = url.replace(`${CDN_URL}/`, '');
      try {
        await s3Client.send(new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
        }));
      } catch (err) {
        console.error(`Failed to delete S3 object: ${key}`, err);
      }
    }
  }

  // Delete from database
  await prisma.propertyPhoto.delete({ where: { id: photoId } });

  // If was primary, set next photo as primary
  if (photo.isPrimary) {
    const nextPhoto = await prisma.propertyPhoto.findFirst({
      where: { propertyId: photo.propertyId },
      orderBy: { order: 'asc' },
    });
    if (nextPhoto) {
      await prisma.propertyPhoto.update({
        where: { id: nextPhoto.id },
        data: { isPrimary: true },
      });
    }
  }

  await redis.del(`property:${photo.propertyId}:photos`);

  res.json({ message: 'Photo deleted successfully' });
}));

// ============================================
// FLOOR PLAN UPLOADS
// ============================================

router.post('/properties/:propertyId/floorplan', authenticate, upload.single('floorplan'), asyncHandler(async (req: Request, res: Response) => {
  const { propertyId } = req.params;
  const userId = req.user!.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Verify ownership
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      OR: [{ ownerId: userId }, { agentId: userId }],
    },
  });

  if (!property) {
    return res.status(404).json({ error: 'Property not found or unauthorized' });
  }

  const floorplanId = uuidv4();
  const basePath = `${UPLOAD_PATHS.PROPERTY_FLOORPLAN}/${propertyId}`;
  const isImage = file.mimetype.startsWith('image/');

  let key: string;
  let processedBuffer: Buffer = file.buffer;

  if (isImage) {
    // Process as image
    processedBuffer = await sharp(file.buffer)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer();
    key = `${basePath}/${floorplanId}.png`;
  } else {
    // Keep as PDF
    key = `${basePath}/${floorplanId}.pdf`;
  }

  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: processedBuffer,
    ContentType: isImage ? 'image/png' : 'application/pdf',
    CacheControl: 'max-age=31536000',
  }));

  const url = `${CDN_URL}/${key}`;

  // Update property with floor plan URL
  const updated = await prisma.property.update({
    where: { id: propertyId },
    data: {
      floorPlanUrl: url,
    },
  });

  res.status(201).json({
    message: 'Floor plan uploaded successfully',
    url,
    property: updated,
  });
}));

// ============================================
// DOCUMENT UPLOADS
// ============================================

// Upload property documents
router.post('/properties/:propertyId/documents', authenticate, upload.single('document'), asyncHandler(async (req: Request, res: Response) => {
  const { propertyId } = req.params;
  const userId = req.user!.id;
  const file = req.file;

  const bodySchema = z.object({
    title: z.string().min(1).max(200),
    type: z.enum(['DEED', 'TITLE', 'SURVEY', 'INSPECTION', 'APPRAISAL', 'TAX', 'HOA', 'DISCLOSURE', 'CONTRACT', 'OTHER']),
    description: z.string().max(1000).optional(),
    isPublic: z.boolean().optional().default(false),
  });

  const data = bodySchema.parse(req.body);

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Verify ownership
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      OR: [{ ownerId: userId }, { agentId: userId }],
    },
  });

  if (!property) {
    return res.status(404).json({ error: 'Property not found or unauthorized' });
  }

  const docId = uuidv4();
  const ext = path.extname(file.originalname) || '.pdf';
  const key = `${UPLOAD_PATHS.PROPERTY_DOCUMENT}/${propertyId}/${docId}${ext}`;

  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    Metadata: {
      title: data.title,
      type: data.type,
      uploadedBy: userId,
    },
  }));

  const url = `${CDN_URL}/${key}`;

  const document = await prisma.propertyDocument.create({
    data: {
      propertyId,
      title: data.title,
      type: data.type,
      description: data.description,
      url,
      s3Key: key,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      isPublic: data.isPublic,
      uploadedById: userId,
    },
  });

  res.status(201).json({
    message: 'Document uploaded successfully',
    document,
  });
}));

// Get property documents
router.get('/properties/:propertyId/documents', optionalAuthenticate, asyncHandler(async (req: Request, res: Response) => {
  const { propertyId } = req.params;
  const userId = req.user?.id;

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }

  const isOwner = userId && (property.ownerId === userId || property.agentId === userId);

  const documents = await prisma.propertyDocument.findMany({
    where: {
      propertyId,
      ...(isOwner ? {} : { isPublic: true }),
    },
    orderBy: { createdAt: 'desc' },
    include: {
      uploadedBy: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
  });

  res.json(documents);
}));

// Get signed URL for private document access
router.get('/documents/:documentId/download', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const { documentId } = req.params;
  const userId = req.user!.id;

  const document = await prisma.propertyDocument.findUnique({
    where: { id: documentId },
    include: { property: true },
  });

  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }

  // Check access
  const isOwner = document.property.ownerId === userId || document.property.agentId === userId;
  if (!document.isPublic && !isOwner) {
    return res.status(403).json({ error: 'Not authorized to access this document' });
  }

  // Generate signed URL (valid for 1 hour)
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: document.s3Key,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  res.json({
    url: signedUrl,
    expiresIn: 3600,
    fileName: document.fileName,
  });
}));

// Delete document
router.delete('/documents/:documentId', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const { documentId } = req.params;
  const userId = req.user!.id;

  const document = await prisma.propertyDocument.findUnique({
    where: { id: documentId },
    include: { property: true },
  });

  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }

  if (document.property.ownerId !== userId && document.property.agentId !== userId) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  // Delete from S3
  await s3Client.send(new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: document.s3Key,
  }));

  // Delete from database
  await prisma.propertyDocument.delete({ where: { id: documentId } });

  res.json({ message: 'Document deleted successfully' });
}));

// ============================================
// AGENT UPLOADS
// ============================================

// Upload agent profile photo
router.post('/agents/photo', authenticate, upload.single('photo'), asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const agent = await prisma.agent.findUnique({
    where: { userId },
  });

  if (!agent) {
    return res.status(404).json({ error: 'Agent profile not found' });
  }

  const photoId = uuidv4();
  const basePath = `${UPLOAD_PATHS.AGENT_PHOTO}/${agent.id}`;
  const urls: Record<string, string> = {};

  // Process and upload different sizes
  const agentSizes = {
    thumbnail: { width: 100, height: 100 },
    medium: { width: 300, height: 300 },
    large: { width: 600, height: 600 },
  };

  for (const [sizeName, dimensions] of Object.entries(agentSizes)) {
    const processedBuffer = await sharp(file.buffer)
      .resize(dimensions.width, dimensions.height, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toBuffer();

    const key = `${basePath}/${photoId}-${sizeName}.jpg`;
    
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: processedBuffer,
      ContentType: 'image/jpeg',
      CacheControl: 'max-age=31536000',
    }));

    urls[sizeName] = `${CDN_URL}/${key}`;
  }

  // Delete old photos if exists
  if (agent.avatarUrl) {
    const oldKey = agent.avatarUrl.replace(`${CDN_URL}/`, '');
    try {
      await s3Client.send(new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: oldKey,
      }));
    } catch (err) {
      console.error('Failed to delete old agent photo', err);
    }
  }

  // Update agent
  const updated = await prisma.agent.update({
    where: { id: agent.id },
    data: {
      avatarUrl: urls.large,
    },
  });

  res.json({
    message: 'Profile photo updated successfully',
    urls,
    agent: updated,
  });
}));

// Upload agent certification/license documents
router.post('/agents/certifications', authenticate, upload.single('document'), asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const file = req.file;

  const bodySchema = z.object({
    type: z.enum(['LICENSE', 'CERTIFICATION', 'VASTU_CERT', 'AWARD', 'DEGREE', 'OTHER']),
    name: z.string().min(1).max(200),
    issuedBy: z.string().max(200).optional(),
    issuedDate: z.string().optional(),
    expiryDate: z.string().optional(),
  });

  const data = bodySchema.parse(req.body);

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const agent = await prisma.agent.findUnique({
    where: { userId },
  });

  if (!agent) {
    return res.status(404).json({ error: 'Agent profile not found' });
  }

  const docId = uuidv4();
  const ext = path.extname(file.originalname) || '.pdf';
  const key = `${UPLOAD_PATHS.AGENT_DOCUMENT}/${agent.id}/${docId}${ext}`;

  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));

  const url = `${CDN_URL}/${key}`;

  const certification = await prisma.agentCertification.create({
    data: {
      agentId: agent.id,
      type: data.type,
      name: data.name,
      issuedBy: data.issuedBy,
      issuedDate: data.issuedDate ? new Date(data.issuedDate) : undefined,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      documentUrl: url,
      s3Key: key,
      verified: false,
    },
  });

  res.status(201).json({
    message: 'Certification uploaded successfully',
    certification,
  });
}));

// ============================================
// USER AVATAR UPLOADS
// ============================================

router.post('/users/avatar', authenticate, upload.single('avatar'), asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const avatarId = uuidv4();
  const key = `${UPLOAD_PATHS.USER_AVATAR}/${userId}/${avatarId}.jpg`;

  const processedBuffer = await sharp(file.buffer)
    .resize(400, 400, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toBuffer();

  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: processedBuffer,
    ContentType: 'image/jpeg',
    CacheControl: 'max-age=31536000',
  }));

  const url = `${CDN_URL}/${key}`;

  // Delete old avatar if exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.avatarUrl) {
    const oldKey = user.avatarUrl.replace(`${CDN_URL}/`, '');
    try {
      await s3Client.send(new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: oldKey,
      }));
    } catch (err) {
      console.error('Failed to delete old avatar', err);
    }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: url },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
    },
  });

  res.json({
    message: 'Avatar updated successfully',
    user: updated,
  });
}));

// ============================================
// MESSAGE ATTACHMENT UPLOADS
// ============================================

router.post('/messages/attachments', authenticate, upload.single('attachment'), asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const attachmentId = uuidv4();
  const ext = path.extname(file.originalname);
  const key = `${UPLOAD_PATHS.MESSAGE_ATTACHMENT}/${userId}/${attachmentId}${ext}`;

  let processedBuffer = file.buffer;
  let contentType = file.mimetype;

  // Process images
  if (file.mimetype.startsWith('image/')) {
    processedBuffer = await sharp(file.buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();
    contentType = 'image/jpeg';
  }

  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: processedBuffer,
    ContentType: contentType,
    CacheControl: 'max-age=31536000',
  }));

  const url = `${CDN_URL}/${key}`;

  // Generate thumbnail for images
  let thumbnailUrl: string | undefined;
  if (file.mimetype.startsWith('image/')) {
    const thumbnailBuffer = await sharp(file.buffer)
      .resize(200, 200, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const thumbnailKey = `${UPLOAD_PATHS.MESSAGE_ATTACHMENT}/${userId}/${attachmentId}-thumb.jpg`;
    
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: thumbnailKey,
      Body: thumbnailBuffer,
      ContentType: 'image/jpeg',
    }));

    thumbnailUrl = `${CDN_URL}/${thumbnailKey}`;
  }

  res.status(201).json({
    attachmentId,
    url,
    thumbnailUrl,
    fileName: file.originalname,
    fileSize: processedBuffer.length,
    mimeType: contentType,
  });
}));

// ============================================
// VASTU DIAGRAM UPLOADS
// ============================================

router.post('/vastu/:analysisId/diagram', authenticate, upload.single('diagram'), asyncHandler(async (req: Request, res: Response) => {
  const { analysisId } = req.params;
  const userId = req.user!.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Verify ownership
  const analysis = await prisma.vastuAnalysis.findUnique({
    where: { id: analysisId },
    include: { property: true },
  });

  if (!analysis) {
    return res.status(404).json({ error: 'Vastu analysis not found' });
  }

  if (analysis.property.ownerId !== userId && analysis.property.agentId !== userId) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const diagramId = uuidv4();
  const key = `${UPLOAD_PATHS.VASTU_DIAGRAM}/${analysisId}/${diagramId}.png`;

  const processedBuffer = await sharp(file.buffer)
    .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
    .png()
    .toBuffer();

  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: processedBuffer,
    ContentType: 'image/png',
  }));

  const url = `${CDN_URL}/${key}`;

  const updated = await prisma.vastuAnalysis.update({
    where: { id: analysisId },
    data: { floorPlanUrl: url },
  });

  res.json({
    message: 'Vastu diagram uploaded successfully',
    url,
    analysis: updated,
  });
}));

// ============================================
// PRESIGNED URL GENERATION
// ============================================

// Generate presigned URL for direct upload
router.post('/presigned-url', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const schema = z.object({
    fileName: z.string(),
    fileType: z.string(),
    uploadType: z.enum([
      'PROPERTY_PHOTO',
      'PROPERTY_FLOORPLAN',
      'PROPERTY_DOCUMENT',
      'PROPERTY_3D_TOUR',
      'AGENT_PHOTO',
      'AGENT_DOCUMENT',
      'USER_AVATAR',
      'MESSAGE_ATTACHMENT',
    ]),
    entityId: z.string().optional(), // propertyId or agentId
  });

  const data = schema.parse(req.body);

  const fileId = uuidv4();
  const ext = path.extname(data.fileName);
  const basePath = UPLOAD_PATHS[data.uploadType];
  const entityPath = data.entityId || userId;
  const key = `${basePath}/${entityPath}/${fileId}${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: data.fileType,
    Metadata: {
      uploadedBy: userId,
      originalName: data.fileName,
    },
  });

  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  res.json({
    presignedUrl,
    key,
    finalUrl: `${CDN_URL}/${key}`,
    expiresIn: 3600,
  });
}));

// ============================================
// BULK OPERATIONS
// ============================================

// Bulk delete photos
router.post('/properties/:propertyId/photos/bulk-delete', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const { propertyId } = req.params;
  const userId = req.user!.id;

  const schema = z.object({
    photoIds: z.array(z.string()).min(1).max(50),
  });

  const { photoIds } = schema.parse(req.body);

  // Verify ownership
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      OR: [{ ownerId: userId }, { agentId: userId }],
    },
  });

  if (!property) {
    return res.status(404).json({ error: 'Property not found or unauthorized' });
  }

  // Get photos to delete
  const photos = await prisma.propertyPhoto.findMany({
    where: {
      id: { in: photoIds },
      propertyId,
    },
  });

  // Delete from S3
  for (const photo of photos) {
    if (photo.variants) {
      const variants = photo.variants as Record<string, string>;
      for (const url of Object.values(variants)) {
        const key = url.replace(`${CDN_URL}/`, '');
        try {
          await s3Client.send(new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
          }));
        } catch (err) {
          console.error(`Failed to delete: ${key}`, err);
        }
      }
    }
  }

  // Delete from database
  await prisma.propertyPhoto.deleteMany({
    where: {
      id: { in: photoIds },
      propertyId,
    },
  });

  await redis.del(`property:${propertyId}:photos`);

  res.json({
    message: `${photos.length} photos deleted successfully`,
    deletedCount: photos.length,
  });
}));

// ============================================
// STORAGE STATS
// ============================================

router.get('/stats', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  // Get user's storage usage
  const [propertyPhotos, propertyDocs, agentDocs, messageAttachments] = await Promise.all([
    prisma.propertyPhoto.aggregate({
      where: {
        property: {
          OR: [{ ownerId: userId }, { agentId: userId }],
        },
      },
      _sum: { size: true },
      _count: true,
    }),
    prisma.propertyDocument.aggregate({
      where: {
        uploadedById: userId,
      },
      _sum: { fileSize: true },
      _count: true,
    }),
    prisma.agentCertification.aggregate({
      where: {
        agent: { userId },
      },
      _count: true,
    }),
    prisma.message.count({
      where: {
        senderId: userId,
        type: { in: ['IMAGE', 'DOCUMENT', 'VIDEO', 'VOICE'] },
      },
    }),
  ]);

  const totalSize = (propertyPhotos._sum.size || 0) + (propertyDocs._sum.fileSize || 0);
  const storageLimit = 5 * 1024 * 1024 * 1024; // 5GB default limit

  res.json({
    usage: {
      totalBytes: totalSize,
      totalMB: Math.round(totalSize / (1024 * 1024) * 100) / 100,
      limitBytes: storageLimit,
      limitGB: storageLimit / (1024 * 1024 * 1024),
      percentUsed: Math.round((totalSize / storageLimit) * 100 * 100) / 100,
    },
    breakdown: {
      propertyPhotos: {
        count: propertyPhotos._count,
        bytes: propertyPhotos._sum.size || 0,
      },
      propertyDocuments: {
        count: propertyDocs._count,
        bytes: propertyDocs._sum.fileSize || 0,
      },
      agentCertifications: {
        count: agentDocs._count,
      },
      messageAttachments: {
        count: messageAttachments,
      },
    },
  });
}));

export default router;

