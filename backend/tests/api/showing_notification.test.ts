
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import propertiesRouter from '../../src/routes/properties';
import { prisma } from '../../src/utils/prisma';
import { emailService } from '../../src/services/email.service';

// Mock dependencies
vi.mock('../../src/utils/prisma', () => ({
  prisma: {
    property: {
      findUnique: vi.fn(),
    },
    lead: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
    showing: {
      create: vi.fn(),
    },
  },
}));

vi.mock('../../src/services/email.service', () => ({
  emailService: {
    sendShowingRequest: vi.fn(),
    sendShowingConfirmation: vi.fn(),
  },
}));

vi.mock('../../src/middleware/auth', () => ({
  authenticate: (req, res, next) => {
    req.user = { id: 'user-123', agentId: 'agent-123' };
    next();
  },
  optionalAuthenticate: (req, res, next) => next(),
  requireAgent: (req, res, next) => next(),
}));

vi.mock('../../src/utils/redis', () => ({
  cacheGet: vi.fn(),
  cacheSet: vi.fn(),
  cacheDelete: vi.fn(),
  cacheDeletePattern: vi.fn(),
  CACHE_KEYS: {},
  CACHE_TTL: {},
}));

const app = express();
app.use(express.json());
app.use('/properties', propertiesRouter);

describe('Property Routes - Schedule Showing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should schedule a showing and send emails to agent and user', async () => {
    // Mock data
    const propertyId = 'prop-123';
    const userId = 'user-123';
    const agentId = 'agent-456';
    const leadId = 'lead-789';

    const mockProperty = {
      id: propertyId,
      listingAgentId: agentId,
      title: 'Test Property',
      streetAddress: '123 Test St',
    };

    const mockUser = {
      id: userId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '555-0123',
    };

    const mockAgent = {
      id: agentId,
      firstName: 'Agent',
      email: 'agent@example.com',
    };

    const mockLead = {
      id: leadId,
      name: 'John Doe',
      status: 'NEW',
    };

    const mockShowing = {
      id: 'showing-123',
      scheduledAt: new Date('2023-12-25T10:00:00Z'),
    };

    // Setup mocks
    (prisma.property.findUnique as any).mockResolvedValue(mockProperty);
    (prisma.lead.findFirst as any).mockResolvedValue(null); // No existing lead
    (prisma.user.findUnique as any).mockImplementation(({ where }) => {
      if (where.id === userId) return Promise.resolve(mockUser);
      if (where.id === agentId) return Promise.resolve(mockAgent);
      return Promise.resolve(null);
    });
    (prisma.lead.create as any).mockResolvedValue(mockLead);
    (prisma.showing.create as any).mockResolvedValue(mockShowing);

    // Make request
    const response = await request(app)
      .post(`/properties/${propertyId}/schedule-showing`)
      .send({
        scheduledAt: '2023-12-25T10:00:00Z',
        type: 'IN_PERSON',
        notes: 'Interested',
      });

    // Assertions
    expect(response.status).toBe(201);
    expect(prisma.showing.create).toHaveBeenCalled();

    // Check emails
    expect(emailService.sendShowingRequest).toHaveBeenCalledWith(
      expect.objectContaining({ email: mockAgent.email }),
      expect.objectContaining({
        buyerName: mockLead.name,
        propertyAddress: mockProperty.streetAddress,
      })
    );

    expect(emailService.sendShowingConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({ email: mockUser.email }),
      expect.objectContaining({
        propertyAddress: mockProperty.streetAddress,
      })
    );
  });
});
