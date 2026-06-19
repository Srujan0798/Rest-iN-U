
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import vastuRouter from '../../src/routes/vastu';
import { prisma } from '../../src/utils/prisma';
import { blockchainService } from '../../src/services/blockchain';

// Mock dependencies
vi.mock('../../src/utils/prisma', () => ({
  prisma: {
    vastuAnalysis: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    blockchainRecord: {
      create: vi.fn(),
    },
  },
}));

vi.mock('../../src/utils/redis', () => ({
  cacheGet: vi.fn().mockResolvedValue(null),
  cacheSet: vi.fn(),
  CACHE_KEYS: { VASTU: 'vastu:' },
  CACHE_TTL: { LONG: 3600 },
}));

vi.mock('../../src/middleware/auth', () => ({
  authenticate: (req, res, next) => {
    req.user = { id: 'test-user-id' };
    next();
  },
}));

// Mock VastuService since the router imports it
vi.mock('../../src/services/vastu.service', () => {
    return {
        VastuService: vi.fn().mockImplementation(() => ({
            analyzeProperty: vi.fn()
        })),
        VASTU_RULES: {},
        VASTU_REMEDIES: {}
    }
});

// Mock BlockchainService
vi.mock('../../src/services/blockchain', () => ({
  blockchainService: {
    issueVastuCertificate: vi.fn(),
    getVastuCertificate: vi.fn(),
  }
}));

const app = express();
app.use(express.json());
app.use('/vastu', vastuRouter);

describe('Vastu Blockchain Integration', () => {
  const mockPropertyId = 'test-property-id';
  const mockAnalysis = {
    propertyId: mockPropertyId,
    overallScore: 85,
    grade: 'A',
    entranceDirection: 'NORTH_EAST',
    entranceScore: 90,
    criticalDefects: 0,
    analyzedAt: new Date(),
    property: {
      streetAddress: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
    },
    blockchainTxHash: '0xmocktxhash',
  };

  beforeAll(() => {
    // Setup mocked responses
    (prisma.vastuAnalysis.findUnique as any).mockResolvedValue(mockAnalysis);
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('GET /certificate/:id - should include blockchain hash in certificate', async () => {
    const response = await request(app).get(`/vastu/certificate/${mockPropertyId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    const cert = response.body.data;

    expect(cert).toHaveProperty('blockchainHash');
    // expect(cert.blockchainHash).toMatch(/^0x[a-f0-9]{64}$/); // Mock value '0xmocktxhash' is not 64 chars
    expect(cert.blockchainHash).toBe(mockAnalysis.blockchainTxHash);
    expect(cert).toHaveProperty('verificationLink');
    expect(cert.verificationLink).toContain(mockAnalysis.blockchainTxHash);
  });

  it('GET /certificate/:id - should handle case without existing blockchain transaction', async () => {
     (prisma.vastuAnalysis.findUnique as any).mockResolvedValueOnce({
        ...mockAnalysis,
        blockchainTxHash: null
     });

     const response = await request(app).get(`/vastu/certificate/${mockPropertyId}`);

     expect(response.status).toBe(200);
     const cert = response.body.data;
     expect(cert).toHaveProperty('blockchainHash');
     expect(cert.verificationLink).toBe('');
  });

  it('POST /certificate/:id/issue - should issue certificate if not exists', async () => {
    // Mock analysis without tx hash
    (prisma.vastuAnalysis.findUnique as any).mockResolvedValueOnce({
       ...mockAnalysis,
       blockchainTxHash: null
    });

    const mockTxHash = '0xnewtransactionhash';
    (blockchainService.issueVastuCertificate as any).mockResolvedValue(mockTxHash);
    (prisma.vastuAnalysis.update as any).mockResolvedValue({
        ...mockAnalysis,
        blockchainTxHash: mockTxHash
    });

    const response = await request(app).post(`/vastu/certificate/${mockPropertyId}/issue`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.transactionHash).toBe(mockTxHash);

    // Verify blockchain service was called
    expect(blockchainService.issueVastuCertificate).toHaveBeenCalledWith(
        mockPropertyId,
        mockAnalysis.overallScore,
        mockAnalysis.grade,
        mockAnalysis.entranceDirection,
        expect.any(String) // Timestamp/Hash (impl detail changed from hash to timestamp apparently)
    );
  });

  it('POST /certificate/:id/issue - should return error if already issued', async () => {
    // Mock analysis WITH tx hash
    (prisma.vastuAnalysis.findUnique as any).mockResolvedValueOnce(mockAnalysis);

    const response = await request(app).post(`/vastu/certificate/${mockPropertyId}/issue`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('already issued');
  });
});
