import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import leadsRouter from '../../src/routes/leads';
import { emailService } from '../../src/services/email.service';
import { v4 as uuidv4 } from 'uuid';

// Mock dependencies directly inside vi.mock to avoid hoisting issues
vi.mock('../../src/lib/prisma', () => {
  const mockPrisma = {
    agent: {
      findUnique: vi.fn(),
    },
    lead: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      groupBy: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
    },
    property: {
      findUnique: vi.fn(),
    },
  };
  return { default: mockPrisma };
});

vi.mock('../../src/services/email.service', () => ({
  emailService: {
    sendNewLeadNotification: vi.fn(),
  },
}));

vi.mock('../../src/middleware/auth', () => ({
  authMiddleware: (req: any, res: any, next: any) => next(),
}));

vi.mock('../../src/middleware/rateLimiter', () => ({
  leadLimiter: (req: any, res: any, next: any) => next(),
  apiLimiter: (req: any, res: any, next: any) => next(),
  authLimiter: (req: any, res: any, next: any) => next(),
  createPropertyLimiter: (req: any, res: any, next: any) => next(),
  aiLimiter: (req: any, res: any, next: any) => next(),
}));

// Import the mocked prisma to use in tests
import prisma from '../../src/lib/prisma';

describe('POST /leads', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.use('/leads', leadsRouter);
    vi.clearAllMocks();
  });

  const validAgentId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
  const validPropertyId = 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e';
  const validLeadId = 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f';

  it('should create a lead and send email notification', async () => {
    const mockAgent = {
      id: validAgentId,
      user: {
        email: 'agent@example.com',
        firstName: 'Agent Smith',
      },
    };

    const mockLead = {
      id: validLeadId,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      message: 'Interested in property',
      propertyAddress: '123 Main St, City, State',
    };

    const mockProperty = {
      id: validPropertyId,
      streetAddress: '123 Main St',
      city: 'City',
      state: 'State',
    };

    // Setup mocks
    (prisma.agent.findUnique as any).mockResolvedValue(mockAgent);
    (prisma.lead.create as any).mockResolvedValue(mockLead);
    (prisma.property.findUnique as any).mockResolvedValue(mockProperty);
    (emailService.sendNewLeadNotification as any).mockResolvedValue(undefined);

    const payload = {
      agentId: validAgentId,
      propertyId: validPropertyId,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      message: 'Interested in property',
    };

    const response = await request(app)
      .post('/leads')
      .send(payload);

    if (response.status !== 201) {
        console.log('Error response body:', JSON.stringify(response.body, null, 2));
    }

    expect(response.status).toBe(201);
    expect(response.body.lead_id).toBe(validLeadId);

    // Verify Prisma calls
    expect(prisma.agent.findUnique).toHaveBeenCalledWith({
      where: { id: payload.agentId },
      include: {
        user: { select: { email: true, firstName: true } }
      }
    });

    expect(prisma.lead.create).toHaveBeenCalled();
    expect(prisma.property.findUnique).toHaveBeenCalledWith({
      where: { id: payload.propertyId },
      select: { streetAddress: true, city: true, state: true }
    });

    // Verify email service call
    expect(emailService.sendNewLeadNotification).toHaveBeenCalledWith(
      {
        email: mockAgent.user.email,
        firstName: mockAgent.user.firstName,
      },
      {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: payload.message,
        propertyAddress: `${mockProperty.streetAddress}, ${mockProperty.city}, ${mockProperty.state}`,
      }
    );
  });

  it('should handle missing propertyId (General Inquiry)', async () => {
    const mockAgent = {
      id: validAgentId,
      user: {
        email: 'agent@example.com',
        firstName: 'Agent Smith',
      },
    };

    const mockLead = {
      id: validLeadId,
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Just saying hi',
    };

    (prisma.agent.findUnique as any).mockResolvedValue(mockAgent);
    (prisma.lead.create as any).mockResolvedValue(mockLead);
    (emailService.sendNewLeadNotification as any).mockResolvedValue(undefined);

    const payload = {
      agentId: validAgentId,
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Just saying hi',
    };

    const response = await request(app)
      .post('/leads')
      .send(payload);

    if (response.status !== 201) {
        console.log('Error response body:', JSON.stringify(response.body, null, 2));
    }

    expect(response.status).toBe(201);

    // Verify email service call uses "General Inquiry"
    expect(emailService.sendNewLeadNotification).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        propertyAddress: 'General Inquiry',
      })
    );

    // Should not call property.findUnique
    expect(prisma.property.findUnique).not.toHaveBeenCalled();
  });

  it('should return 404 if agent not found', async () => {
    (prisma.agent.findUnique as any).mockResolvedValue(null);

    const payload = {
      agentId: validAgentId,
      name: 'John Doe',
      email: 'john@example.com',
    };

    const response = await request(app)
      .post('/leads')
      .send(payload);

    if (response.status !== 404) {
        console.log('Error response body:', JSON.stringify(response.body, null, 2));
    }

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Agent not found');
    expect(prisma.lead.create).not.toHaveBeenCalled();
    expect(emailService.sendNewLeadNotification).not.toHaveBeenCalled();
  });
});
