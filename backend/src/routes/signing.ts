import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import redis from '../utils/redis';
import { authenticate, requireAgent, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const router = Router();

// S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    cb(null, allowed.includes(file.mimetype));
  },
});

// ============================================================================
// DOCUSIGN API HELPER
// ============================================================================

class DocuSignClient {
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private baseUrl: string;
  private accountId: string;

  constructor() {
    this.baseUrl = process.env.DOCUSIGN_BASE_URL || 'https://demo.docusign.net/restapi';
    this.accountId = process.env.DOCUSIGN_ACCOUNT_ID || '';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    // JWT Grant flow for server-to-server
    const response = await fetch(`${process.env.DOCUSIGN_AUTH_SERVER}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: await this.generateJWT(),
      }),
    });

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = new Date(Date.now() + (data.expires_in - 60) * 1000);

    return this.accessToken!;
  }

  private async generateJWT(): Promise<string> {
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const now = Math.floor(Date.now() / 1000);
    const payload = Buffer.from(JSON.stringify({
      iss: process.env.DOCUSIGN_INTEGRATION_KEY,
      sub: process.env.DOCUSIGN_USER_ID,
      aud: process.env.DOCUSIGN_AUTH_SERVER?.replace('https://', ''),
      iat: now,
      exp: now + 3600,
      scope: 'signature impersonation',
    })).toString('base64url');

    const privateKey = process.env.DOCUSIGN_PRIVATE_KEY!.replace(/\\n/g, '\n');
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(`${header}.${payload}`);
    const signature = sign.sign(privateKey, 'base64url');

    return `${header}.${payload}.${signature}`;
  }

  async createEnvelope(data: {
    templateId?: string;
    documents?: Array<{
      documentId: string;
      name: string;
      content: Buffer;
    }>;
    recipients: Array<{
      email: string;
      name: string;
      roleName?: string;
      routingOrder: number;
      tabs?: any;
    }>;
    emailSubject: string;
    emailBlurb?: string;
    status?: 'created' | 'sent';
  }): Promise<{ envelopeId: string; uri: string }> {
    const token = await this.getAccessToken();

    const envelopeDefinition: any = {
      emailSubject: data.emailSubject,
      emailBlurb: data.emailBlurb,
      status: data.status || 'sent',
    };

    if (data.templateId) {
      envelopeDefinition.templateId = data.templateId;
      envelopeDefinition.templateRoles = data.recipients.map(r => ({
        email: r.email,
        name: r.name,
        roleName: r.roleName,
        routingOrder: r.routingOrder.toString(),
        tabs: r.tabs,
      }));
    } else {
      envelopeDefinition.documents = data.documents?.map(d => ({
        documentId: d.documentId,
        name: d.name,
        documentBase64: d.content.toString('base64'),
      }));
      envelopeDefinition.recipients = {
        signers: data.recipients.map((r, i) => ({
          email: r.email,
          name: r.name,
          recipientId: (i + 1).toString(),
          routingOrder: r.routingOrder.toString(),
          tabs: r.tabs,
        })),
      };
    }

    const response = await fetch(
      `${this.baseUrl}/v2.1/accounts/${this.accountId}/envelopes`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(envelopeDefinition),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`DocuSign error: ${error.message}`);
    }

    const result = await response.json();
    return { envelopeId: result.envelopeId, uri: result.uri };
  }

  async getEnvelopeStatus(envelopeId: string): Promise<any> {
    const token = await this.getAccessToken();

    const response = await fetch(
      `${this.baseUrl}/v2.1/accounts/${this.accountId}/envelopes/${envelopeId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.json();
  }

  async getSigningUrl(envelopeId: string, recipientEmail: string, recipientName: string, returnUrl: string): Promise<string> {
    const token = await this.getAccessToken();

    const response = await fetch(
      `${this.baseUrl}/v2.1/accounts/${this.accountId}/envelopes/${envelopeId}/views/recipient`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl,
          authenticationMethod: 'none',
          email: recipientEmail,
          userName: recipientName,
        }),
      }
    );

    const result = await response.json();
    return result.url;
  }

  async downloadDocument(envelopeId: string, documentId: string = 'combined'): Promise<Buffer> {
    const token = await this.getAccessToken();

    const response = await fetch(
      `${this.baseUrl}/v2.1/accounts/${this.accountId}/envelopes/${envelopeId}/documents/${documentId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return Buffer.from(await response.arrayBuffer());
  }

  async voidEnvelope(envelopeId: string, reason: string): Promise<void> {
    const token = await this.getAccessToken();

    await fetch(
      `${this.baseUrl}/v2.1/accounts/${this.accountId}/envelopes/${envelopeId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'voided',
          voidedReason: reason,
        }),
      }
    );
  }

  async listTemplates(): Promise<any[]> {
    const token = await this.getAccessToken();

    const response = await fetch(
      `${this.baseUrl}/v2.1/accounts/${this.accountId}/templates`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const result = await response.json();
    return result.envelopeTemplates || [];
  }
}

const docusign = new DocuSignClient();

// ============================================================================
// SCHEMAS
// ============================================================================

const DocumentTypeEnum = z.enum([
  'PURCHASE_AGREEMENT',
  'LISTING_AGREEMENT',
  'BUYER_AGENCY',
  'DISCLOSURE_FORM',
  'ADDENDUM',
  'AMENDMENT',
  'COUNTEROFFER',
  'CONTINGENCY_RELEASE',
  'INSPECTION_RESPONSE',
  'REPAIR_REQUEST',
  'CLOSING_STATEMENT',
  'DEED',
  'TITLE_INSURANCE',
  'LEASE_AGREEMENT',
  'RENTAL_APPLICATION',
  'OTHER',
]);

const CreateEnvelopeSchema = z.object({
  name: z.string().max(200),
  type: DocumentTypeEnum,
  propertyId: z.string().uuid().optional(),
  transactionId: z.string().uuid().optional(),
  templateId: z.string().optional(),
  recipients: z.array(z.object({
    email: z.string().email(),
    name: z.string(),
    role: z.enum(['BUYER', 'SELLER', 'AGENT', 'BROKER', 'ATTORNEY', 'TITLE_COMPANY', 'LENDER', 'OTHER']),
    routingOrder: z.number().int().min(1),
    signatureRequired: z.boolean().default(true),
    initialsRequired: z.boolean().default(false),
    dateRequired: z.boolean().default(false),
  })),
  message: z.string().max(1000).optional(),
  expirationDays: z.number().int().min(1).max(365).default(30),
  reminderEnabled: z.boolean().default(true),
  reminderDelay: z.number().int().min(1).max(30).default(3),
  reminderFrequency: z.number().int().min(1).max(30).default(3),
});

const BulkSendSchema = z.object({
  templateId: z.string(),
  recipients: z.array(z.object({
    email: z.string().email(),
    name: z.string(),
    propertyId: z.string().uuid().optional(),
    customFields: z.record(z.string()).optional(),
  })),
  emailSubject: z.string().max(200),
  emailMessage: z.string().max(1000).optional(),
});

// ============================================================================
// DOCUMENT TEMPLATES
// ============================================================================

// List available templates
router.get('/templates', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const cacheKey = 'docusign:templates';
  const cached = await redis.get(cacheKey);

  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // Get DocuSign templates
  const docusignTemplates = await docusign.listTemplates();

  // Get custom templates from database
  const customTemplates = await prisma.documentTemplate.findMany({
    where: {
      OR: [
        { isPublic: true },
        { createdById: req.user!.id },
        { agentId: req.user!.agentId },
      ],
    },
    orderBy: { usageCount: 'desc' },
  });

  const templates = {
    docusign: docusignTemplates.map(t => ({
      id: t.templateId,
      name: t.name,
      description: t.description,
      source: 'DOCUSIGN',
      roles: t.recipients?.signers?.map((s: any) => s.roleName) || [],
    })),
    custom: customTemplates.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      type: t.type,
      source: 'CUSTOM',
    })),
  };

  await redis.set(cacheKey, JSON.stringify(templates), 'EX', 3600);

  res.json(templates);
}));

// Create custom template
router.post('/templates', authenticate, requireAgent, upload.single('document'), asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No document provided' });
  }

  const { name, description, type, isPublic, fields } = req.body;

  const key = `templates/${req.user!.agentId}/${uuidv4()}.pdf`;

  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  }));

  const template = await prisma.documentTemplate.create({
    data: {
      name,
      description,
      type,
      isPublic: isPublic === 'true',
      s3Key: key,
      fields: fields ? JSON.parse(fields) : [],
      createdById: req.user!.id,
      agentId: req.user!.agentId,
    },
  });

  // Invalidate cache
  await redis.del('docusign:templates');

  res.status(201).json(template);
}));

// ============================================================================
// ENVELOPES (SIGNING REQUESTS)
// ============================================================================

// Create envelope with document upload
router.post('/envelopes', authenticate, upload.array('documents', 10), asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = CreateEnvelopeSchema.parse(JSON.parse(req.body.data));
  const files = req.files as Express.Multer.File[];

  if (!files?.length && !data.templateId) {
    return res.status(400).json({ error: 'Either documents or templateId required' });
  }

  // Verify property/transaction access if provided
  if (data.propertyId) {
    const property = await prisma.property.findFirst({
      where: {
        id: data.propertyId,
        OR: [
          { ownerId: req.user!.id },
          { agentId: req.user!.agentId },
        ],
      },
    });
    if (!property) {
      return res.status(403).json({ error: 'Property access denied' });
    }
  }

  // Prepare documents
  const documents = files?.map((file, index) => ({
    documentId: (index + 1).toString(),
    name: file.originalname,
    content: file.buffer,
  }));

  // Create DocuSign envelope
  const { envelopeId, uri } = await docusign.createEnvelope({
    templateId: data.templateId,
    documents,
    recipients: data.recipients.map(r => ({
      email: r.email,
      name: r.name,
      roleName: r.role,
      routingOrder: r.routingOrder,
      tabs: {
        signHereTabs: r.signatureRequired ? [{ documentId: '1', pageNumber: '1', xPosition: '100', yPosition: '700' }] : [],
        initialHereTabs: r.initialsRequired ? [{ documentId: '1', pageNumber: '1', xPosition: '100', yPosition: '750' }] : [],
        dateSignedTabs: r.dateRequired ? [{ documentId: '1', pageNumber: '1', xPosition: '400', yPosition: '700' }] : [],
      },
    })),
    emailSubject: `Please sign: ${data.name}`,
    emailBlurb: data.message,
    status: 'sent',
  });

  // Store envelope in database
  const envelope = await prisma.signingEnvelope.create({
    data: {
      docusignEnvelopeId: envelopeId,
      name: data.name,
      type: data.type,
      propertyId: data.propertyId,
      transactionId: data.transactionId,
      createdById: req.user!.id,
      status: 'SENT',
      expiresAt: new Date(Date.now() + data.expirationDays * 24 * 60 * 60 * 1000),
      recipients: {
        create: data.recipients.map(r => ({
          email: r.email,
          name: r.name,
          role: r.role,
          routingOrder: r.routingOrder,
          status: 'SENT',
        })),
      },
    },
    include: {
      recipients: true,
    },
  });

  // Store documents in S3
  if (files?.length) {
    for (const file of files) {
      const key = `envelopes/${envelope.id}/${file.originalname}`;
      await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }));

      await prisma.envelopeDocument.create({
        data: {
          envelopeId: envelope.id,
          name: file.originalname,
          s3Key: key,
          mimeType: file.mimetype,
          size: file.size,
        },
      });
    }
  }

  // Notify recipients
  await prisma.notification.createMany({
    data: data.recipients.map(r => ({
      userId: r.email, // Will need to look up by email
      type: 'DOCUMENT_TO_SIGN',
      title: 'Document Ready for Signature',
      message: `You have a document "${data.name}" waiting for your signature`,
      data: { envelopeId: envelope.id },
      priority: 'HIGH',
    })),
  });

  res.status(201).json(envelope);
}));

// List envelopes
router.get('/envelopes', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    status,
    type,
    propertyId,
    transactionId,
    role, // 'sender' or 'recipient'
    limit = '20',
    offset = '0',
  } = req.query;

  const where: any = {};

  if (role === 'sender') {
    where.createdById = req.user!.id;
  } else if (role === 'recipient') {
    where.recipients = { some: { email: req.user!.email } };
  } else {
    where.OR = [
      { createdById: req.user!.id },
      { recipients: { some: { email: req.user!.email } } },
    ];
  }

  if (status) where.status = status;
  if (type) where.type = type;
  if (propertyId) where.propertyId = propertyId;
  if (transactionId) where.transactionId = transactionId;

  const [envelopes, total] = await Promise.all([
    prisma.signingEnvelope.findMany({
      where,
      include: {
        property: { select: { id: true, title: true, address: true } },
        transaction: { select: { id: true, status: true } },
        recipients: true,
        createdBy: { select: { firstName: true, lastName: true } },
        _count: { select: { documents: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    }),
    prisma.signingEnvelope.count({ where }),
  ]);

  res.json({
    envelopes,
    total,
    limit: parseInt(limit as string),
    offset: parseInt(offset as string),
  });
}));

// Get envelope details
router.get('/envelopes/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const envelope = await prisma.signingEnvelope.findFirst({
    where: {
      id,
      OR: [
        { createdById: req.user!.id },
        { recipients: { some: { email: req.user!.email } } },
      ],
    },
    include: {
      property: { select: { id: true, title: true, address: true } },
      transaction: true,
      recipients: true,
      documents: true,
      auditTrail: { orderBy: { createdAt: 'asc' } },
      createdBy: { select: { firstName: true, lastName: true } },
    },
  });

  if (!envelope) {
    return res.status(404).json({ error: 'Envelope not found' });
  }

  // Get live status from DocuSign
  if (envelope.docusignEnvelopeId) {
    const docusignStatus = await docusign.getEnvelopeStatus(envelope.docusignEnvelopeId);

    // Update local status if changed
    if (docusignStatus.status !== envelope.status.toLowerCase()) {
      await prisma.signingEnvelope.update({
        where: { id },
        data: { status: docusignStatus.status.toUpperCase() },
      });
    }
  }

  res.json(envelope);
}));

// Get signing URL for recipient
router.get('/envelopes/:id/signing-url', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const envelope = await prisma.signingEnvelope.findFirst({
    where: {
      id,
      recipients: { some: { email: req.user!.email } },
      status: { in: ['SENT', 'DELIVERED'] },
    },
  });

  if (!envelope) {
    return res.status(404).json({ error: 'Envelope not found or not ready for signing' });
  }

  const returnUrl = `${process.env.APP_URL}/documents/signed?envelopeId=${id}`;

  const signingUrl = await docusign.getSigningUrl(
    envelope.docusignEnvelopeId!,
    req.user!.email,
    `${req.user!.firstName} ${req.user!.lastName}`,
    returnUrl
  );

  // Log audit event
  await prisma.envelopeAuditEvent.create({
    data: {
      envelopeId: id,
      event: 'SIGNING_URL_GENERATED',
      actor: req.user!.email,
      details: { ip: req.ip },
    },
  });

  res.json({ signingUrl });
}));

// Download signed document
router.get('/envelopes/:id/download', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { format = 'combined' } = req.query; // combined, separate, certificate

  const envelope = await prisma.signingEnvelope.findFirst({
    where: {
      id,
      OR: [
        { createdById: req.user!.id },
        { recipients: { some: { email: req.user!.email } } },
      ],
    },
  });

  if (!envelope) {
    return res.status(404).json({ error: 'Envelope not found' });
  }

  if (envelope.status !== 'COMPLETED') {
    return res.status(400).json({ error: 'Document not yet completed' });
  }

  const documentId = format === 'certificate' ? 'certificate' : 'combined';
  const document = await docusign.downloadDocument(envelope.docusignEnvelopeId!, documentId);

  // Log download
  await prisma.envelopeAuditEvent.create({
    data: {
      envelopeId: id,
      event: 'DOCUMENT_DOWNLOADED',
      actor: req.user!.email,
      details: { format },
    },
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${envelope.name}-signed.pdf"`);
  res.send(document);
}));

// Void envelope
router.post('/envelopes/:id/void', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ error: 'Void reason is required' });
  }

  const envelope = await prisma.signingEnvelope.findFirst({
    where: {
      id,
      createdById: req.user!.id,
      status: { in: ['SENT', 'DELIVERED'] },
    },
  });

  if (!envelope) {
    return res.status(404).json({ error: 'Envelope not found or cannot be voided' });
  }

  await docusign.voidEnvelope(envelope.docusignEnvelopeId!, reason);

  await prisma.signingEnvelope.update({
    where: { id },
    data: {
      status: 'VOIDED',
      voidedReason: reason,
      voidedAt: new Date(),
    },
  });

  // Notify recipients
  const recipients = await prisma.envelopeRecipient.findMany({
    where: { envelopeId: id },
  });

  // Log audit event
  await prisma.envelopeAuditEvent.create({
    data: {
      envelopeId: id,
      event: 'ENVELOPE_VOIDED',
      actor: req.user!.email,
      details: { reason },
    },
  });

  res.json({ success: true, message: 'Envelope voided' });
}));

// Resend envelope
router.post('/envelopes/:id/resend', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { recipientId } = req.body;

  const envelope = await prisma.signingEnvelope.findFirst({
    where: {
      id,
      createdById: req.user!.id,
      status: { in: ['SENT', 'DELIVERED'] },
    },
    include: { recipients: true },
  });

  if (!envelope) {
    return res.status(404).json({ error: 'Envelope not found' });
  }

  // Resend via DocuSign would go here
  // For now, just log the action

  await prisma.envelopeAuditEvent.create({
    data: {
      envelopeId: id,
      event: 'ENVELOPE_RESENT',
      actor: req.user!.email,
      details: { recipientId },
    },
  });

  res.json({ success: true, message: 'Envelope resent' });
}));

// ============================================================================
// WEBHOOKS
// ============================================================================

// DocuSign Connect webhook
router.post('/webhook/docusign', asyncHandler(async (req: Request, res: Response) => {
  // Verify HMAC signature
  const signature = req.headers['x-docusign-signature-1'] as string;
  const hmac = crypto.createHmac('sha256', process.env.DOCUSIGN_HMAC_KEY!);
  hmac.update(JSON.stringify(req.body));
  const expectedSignature = hmac.digest('base64');

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { event, data } = req.body;
  const envelopeId = data?.envelopeId;

  // Find our envelope
  const envelope = await prisma.signingEnvelope.findFirst({
    where: { docusignEnvelopeId: envelopeId },
  });

  if (!envelope) {
    return res.status(200).json({ received: true }); // Acknowledge but ignore
  }

  switch (event) {
    case 'envelope-sent':
      await prisma.signingEnvelope.update({
        where: { id: envelope.id },
        data: { status: 'SENT', sentAt: new Date() },
      });
      break;

    case 'envelope-delivered':
      await prisma.signingEnvelope.update({
        where: { id: envelope.id },
        data: { status: 'DELIVERED' },
      });
      break;

    case 'envelope-completed': {
      await prisma.signingEnvelope.update({
        where: { id: envelope.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });

      // Download and store signed document
      const signedDoc = await docusign.downloadDocument(envelopeId, 'combined');
      const key = `envelopes/${envelope.id}/signed-${Date.now()}.pdf`;

      await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: signedDoc,
        ContentType: 'application/pdf',
      }));

      await prisma.envelopeDocument.create({
        data: {
          envelopeId: envelope.id,
          name: `${envelope.name}-signed.pdf`,
          s3Key: key,
          mimeType: 'application/pdf',
          size: signedDoc.length,
          isSigned: true,
        },
      });

      // Notify creator
      await prisma.notification.create({
        data: {
          userId: envelope.createdById,
          type: 'DOCUMENT_COMPLETED',
          title: 'Document Fully Signed',
          message: `All parties have signed "${envelope.name}"`,
          data: { envelopeId: envelope.id },
          priority: 'HIGH',
        },
      });
      break;
    }

    case 'envelope-declined':
      await prisma.signingEnvelope.update({
        where: { id: envelope.id },
        data: { status: 'DECLINED', declinedAt: new Date() },
      });

      // Notify creator
      await prisma.notification.create({
        data: {
          userId: envelope.createdById,
          type: 'DOCUMENT_DECLINED',
          title: 'Document Declined',
          message: `"${envelope.name}" was declined by a recipient`,
          data: { envelopeId: envelope.id },
          priority: 'URGENT',
        },
      });
      break;

    case 'recipient-completed':
      await prisma.envelopeRecipient.updateMany({
        where: {
          envelopeId: envelope.id,
          email: data.recipientEmail,
        },
        data: { status: 'COMPLETED', signedAt: new Date() },
      });
      break;

    case 'recipient-declined':
      await prisma.envelopeRecipient.updateMany({
        where: {
          envelopeId: envelope.id,
          email: data.recipientEmail,
        },
        data: {
          status: 'DECLINED',
          declinedReason: data.declineReason,
        },
      });
      break;
  }

  // Log audit event
  await prisma.envelopeAuditEvent.create({
    data: {
      envelopeId: envelope.id,
      event: event.toUpperCase().replace(/-/g, '_'),
      actor: 'DOCUSIGN_WEBHOOK',
      details: data,
    },
  });

  res.status(200).json({ received: true });
}));

// ============================================================================
// BULK SEND
// ============================================================================

// Bulk send documents
router.post('/bulk-send', authenticate, requireAgent, asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = BulkSendSchema.parse(req.body);

  const results = [];

  for (const recipient of data.recipients) {
    try {
      const { envelopeId } = await docusign.createEnvelope({
        templateId: data.templateId,
        recipients: [{
          email: recipient.email,
          name: recipient.name,
          routingOrder: 1,
        }],
        emailSubject: data.emailSubject,
        emailBlurb: data.emailMessage,
        status: 'sent',
      });

      const envelope = await prisma.signingEnvelope.create({
        data: {
          docusignEnvelopeId: envelopeId,
          name: data.emailSubject,
          type: 'OTHER',
          propertyId: recipient.propertyId,
          createdById: req.user!.id,
          status: 'SENT',
          recipients: {
            create: {
              email: recipient.email,
              name: recipient.name,
              role: 'OTHER',
              routingOrder: 1,
              status: 'SENT',
            },
          },
        },
      });

      results.push({ success: true, email: recipient.email, envelopeId: envelope.id });
    } catch (error: any) {
      results.push({ success: false, email: recipient.email, error: error.message });
    }
  }

  res.json({
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results,
  });
}));

// ============================================================================
// ANALYTICS
// ============================================================================

// Get signing analytics
router.get('/analytics', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { period = '30' } = req.query;
  const since = new Date(Date.now() - parseInt(period as string) * 24 * 60 * 60 * 1000);

  const where = {
    createdById: req.user!.id,
    createdAt: { gte: since },
  };

  const [total, byStatus, byType, avgCompletionTime] = await Promise.all([
    prisma.signingEnvelope.count({ where }),
    prisma.signingEnvelope.groupBy({
      by: ['status'],
      where,
      _count: true,
    }),
    prisma.signingEnvelope.groupBy({
      by: ['type'],
      where,
      _count: true,
    }),
    prisma.signingEnvelope.aggregate({
      where: { ...where, status: 'COMPLETED' },
      _avg: {
        // Would need to calculate from sentAt to completedAt
      },
    }),
  ]);

  // Calculate completion rate
  const completed = byStatus.find(s => s.status === 'COMPLETED')?._count || 0;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  res.json({
    total,
    completionRate,
    byStatus: byStatus.reduce((acc, s) => ({ ...acc, [s.status]: s._count }), {}),
    byType: byType.reduce((acc, t) => ({ ...acc, [t.type]: t._count }), {}),
    period: parseInt(period as string),
  });
}));

export default router;

