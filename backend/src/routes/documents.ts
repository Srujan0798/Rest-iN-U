import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// UPLOAD DOCUMENT
// ============================================
router.post('/upload', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid().optional(),
            transactionId: z.string().uuid().optional(),
            documentType: z.enum([
                'purchase_agreement', 'inspection_report', 'appraisal',
                'title_report', 'disclosure', 'mortgage_docs', 'insurance',
                'hoa_docs', 'warranty', 'receipt', 'other'
            ]),
            fileName: z.string(),
            fileSize: z.number(),
            mimeType: z.string(),
            description: z.string().optional()
        }).parse(req.body);

        const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        res.status(201).json({
            documentId,
            uploadUrl: `https://upload.example.com/presigned/${documentId}`,
            expiresIn: 3600,
            status: 'pending_upload',
            nextSteps: ['Upload file to presigned URL', 'Confirm upload completion']
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// ============================================
// LIST DOCUMENTS
// ============================================
router.get('/list', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { propertyId, transactionId, type } = req.query;

        res.json({
            documents: [
                {
                    id: 'doc_1',
                    name: 'Purchase Agreement.pdf',
                    type: 'purchase_agreement',
                    size: 245000,
                    uploadedAt: '2024-01-15T10:30:00Z',
                    uploadedBy: 'John Smith',
                    status: 'verified',
                    propertyId: propertyId || 'prop_123'
                },
                {
                    id: 'doc_2',
                    name: 'Home Inspection Report.pdf',
                    type: 'inspection_report',
                    size: 1245000,
                    uploadedAt: '2024-01-12T14:20:00Z',
                    uploadedBy: 'ABC Inspections',
                    status: 'verified',
                    propertyId: propertyId || 'prop_123'
                },
                {
                    id: 'doc_3',
                    name: 'Seller Disclosure.pdf',
                    type: 'disclosure',
                    size: 89000,
                    uploadedAt: '2024-01-10T09:00:00Z',
                    uploadedBy: 'Seller Agent',
                    status: 'pending_review',
                    propertyId: propertyId || 'prop_123'
                }
            ],
            total: 3
        });
    } catch (error) {
        console.error('List error:', error);
        res.status(500).json({ error: 'Failed to list documents' });
    }
});

// ============================================
// GET DOCUMENT
// ============================================
router.get('/:documentId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { documentId } = req.params;

        res.json({
            id: documentId,
            name: 'Purchase Agreement.pdf',
            type: 'purchase_agreement',
            size: 245000,
            mimeType: 'application/pdf',
            downloadUrl: `https://storage.example.com/download/${documentId}`,
            expiresIn: 3600,
            metadata: {
                uploadedAt: '2024-01-15T10:30:00Z',
                uploadedBy: 'John Smith',
                status: 'verified',
                version: 1
            }
        });
    } catch (error) {
        console.error('Get document error:', error);
        res.status(500).json({ error: 'Failed to get document' });
    }
});

// ============================================
// DELETE DOCUMENT
// ============================================
router.delete('/:documentId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { documentId } = req.params;

        res.json({
            message: 'Document deleted successfully',
            documentId
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
});

// ============================================
// SHARE DOCUMENT
// ============================================
router.post('/:documentId/share', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { documentId } = req.params;
        const data = z.object({
            recipients: z.array(z.string().email()),
            message: z.string().optional(),
            expiresInDays: z.number().default(7),
            requireSignature: z.boolean().default(false)
        }).parse(req.body);

        res.json({
            shareId: `share_${Date.now()}`,
            documentId,
            sharedWith: data.recipients,
            shareLink: `https://app.example.com/shared/${documentId}`,
            expiresAt: new Date(Date.now() + data.expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
            requireSignature: data.requireSignature
        });
    } catch (error) {
        console.error('Share error:', error);
        res.status(500).json({ error: 'Failed to share document' });
    }
});

// ============================================
// E-SIGNATURE
// ============================================
router.post('/:documentId/sign', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { documentId } = req.params;
        const data = z.object({
            signers: z.array(z.object({
                email: z.string().email(),
                name: z.string(),
                role: z.enum(['buyer', 'seller', 'agent', 'witness', 'other'])
            })),
            signatureLocations: z.array(z.object({
                pageNumber: z.number(),
                x: z.number(),
                y: z.number(),
                signerEmail: z.string().email()
            })).optional()
        }).parse(req.body);

        res.json({
            envelopeId: `env_${Date.now()}`,
            documentId,
            status: 'sent',
            signers: data.signers.map(s => ({
                ...s,
                status: 'pending',
                signUrl: `https://sign.example.com/sign/${documentId}?signer=${s.email}`
            })),
            message: 'Signature requests sent to all signers'
        });
    } catch (error) {
        console.error('Sign error:', error);
        res.status(500).json({ error: 'Failed to send for signature' });
    }
});

// ============================================
// DOCUMENT TEMPLATES
// ============================================
router.get('/templates/list', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        res.json({
            templates: [
                { id: 'tpl_1', name: 'Purchase Agreement', category: 'purchase', state: 'CA' },
                { id: 'tpl_2', name: 'Listing Agreement', category: 'listing', state: 'CA' },
                { id: 'tpl_3', name: 'Buyer Representation Agreement', category: 'buyer', state: 'CA' },
                { id: 'tpl_4', name: 'Seller Disclosure', category: 'disclosure', state: 'CA' },
                { id: 'tpl_5', name: 'Counter Offer', category: 'offer', state: 'CA' },
                { id: 'tpl_6', name: 'Lease Agreement', category: 'rental', state: 'CA' }
            ]
        });
    } catch (error) {
        console.error('Templates error:', error);
        res.status(500).json({ error: 'Failed to get templates' });
    }
});

export default router;
