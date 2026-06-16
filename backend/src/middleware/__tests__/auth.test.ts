// Authentication Middleware Tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
  authenticate,
  optionalAuthenticate,
  requireUserType,
  requireAgent,
  requireAdmin,
  requireVerifiedAgent,
  requireSubscription,
  generateTokens,
  verifyRefreshToken,
  AuthenticatedRequest,
} from '../auth';
import { prisma } from '../../utils/prisma';
import { cacheGet, cacheSet, CACHE_KEYS, CACHE_TTL } from '../../utils/redis';
import { jwtRotationService } from '../../services/jwt-rotation.service';

// Mock dependencies
vi.mock('../../utils/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    agent: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('../../utils/redis', () => ({
  cacheGet: vi.fn(),
  cacheSet: vi.fn(),
  CACHE_KEYS: {
    USER: 'user:',
  },
  CACHE_TTL: {
    MEDIUM: 300,
  },
}));

vi.mock('../../services/jwt-rotation.service', () => ({
  jwtRotationService: {
    verifyToken: vi.fn(),
    generateToken: vi.fn(),
  },
}));

vi.mock('../../utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Authentication Middleware', () => {
  let mockReq: Partial<AuthenticatedRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  const testUser = {
    id: 'user-123',
    email: 'test@example.com',
    userType: 'BUYER',
    isActive: true,
    walletAddress: '0x123',
    agent: null,
  };

  const testAgent = {
    id: 'agent-123',
    subscriptionTier: 'PROFESSIONAL',
    verified: true,
  };

  const validToken = 'valid-jwt-token';
  const decodedToken = {
    userId: 'user-123',
    email: 'test@example.com',
    userType: 'BUYER',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();

    // Reset all mocks
    vi.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate user with valid token', async () => {
      mockReq.headers = { authorization: `Bearer ${validToken}` };

      vi.mocked(jwtRotationService.verifyToken).mockReturnValue(decodedToken);
      vi.mocked(cacheGet).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(testUser as any);

      await authenticate(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockReq.user).toEqual({
        id: testUser.id,
        email: testUser.email,
        userType: testUser.userType,
        agentId: undefined,
        walletAddress: testUser.walletAddress,
      });
    });

    it('should use cached user data if available', async () => {
      mockReq.headers = { authorization: `Bearer ${validToken}` };

      vi.mocked(jwtRotationService.verifyToken).mockReturnValue(decodedToken);
      vi.mocked(cacheGet).mockResolvedValue(testUser);

      await authenticate(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(prisma.user.findUnique).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should cache user data after fetching from database', async () => {
      mockReq.headers = { authorization: `Bearer ${validToken}` };

      vi.mocked(jwtRotationService.verifyToken).mockReturnValue(decodedToken);
      vi.mocked(cacheGet).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(testUser as any);

      await authenticate(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(cacheSet).toHaveBeenCalledWith(
        `${CACHE_KEYS.USER}${decodedToken.userId}`,
        testUser,
        CACHE_TTL.MEDIUM
      );
    });

    it('should return error when no token provided', async () => {
      mockReq.headers = {};

      await authenticate(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'No token provided',
        })
      );
    });

    it('should return error when token format is invalid', async () => {
      mockReq.headers = { authorization: 'InvalidFormat token' };

      await authenticate(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'No token provided',
        })
      );
    });

    it('should return error when token is expired', async () => {
      mockReq.headers = { authorization: `Bearer ${validToken}` };

      vi.mocked(jwtRotationService.verifyToken).mockImplementation(() => {
        throw new jwt.TokenExpiredError('jwt expired', new Date());
      });

      await authenticate(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Token expired',
        })
      );
    });

    it('should return error when token is invalid', async () => {
      mockReq.headers = { authorization: `Bearer ${validToken}` };

      vi.mocked(jwtRotationService.verifyToken).mockImplementation(() => {
        throw new Error('invalid signature');
      });

      await authenticate(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid token',
        })
      );
    });

    it('should return error when user not found', async () => {
      mockReq.headers = { authorization: `Bearer ${validToken}` };

      vi.mocked(jwtRotationService.verifyToken).mockReturnValue(decodedToken);
      vi.mocked(cacheGet).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await authenticate(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User not found',
        })
      );
    });

    it('should return error when user is deactivated', async () => {
      mockReq.headers = { authorization: `Bearer ${validToken}` };
      const inactiveUser = { ...testUser, isActive: false };

      vi.mocked(jwtRotationService.verifyToken).mockReturnValue(decodedToken);
      vi.mocked(cacheGet).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(inactiveUser as any);

      await authenticate(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Account is deactivated',
        })
      );
    });

    it('should include agentId when user is an agent', async () => {
      mockReq.headers = { authorization: `Bearer ${validToken}` };
      const userWithAgent = { ...testUser, agent: testAgent };

      vi.mocked(jwtRotationService.verifyToken).mockReturnValue(decodedToken);
      vi.mocked(cacheGet).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(userWithAgent as any);

      await authenticate(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockReq.user?.agentId).toBe(testAgent.id);
    });
  });

  describe('optionalAuthenticate', () => {
    it('should authenticate user with valid token', async () => {
      mockReq.headers = { authorization: `Bearer ${validToken}` };

      vi.mocked(jwtRotationService.verifyToken).mockReturnValue(decodedToken);
      vi.mocked(cacheGet).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(testUser as any);

      await optionalAuthenticate(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockReq.user).toBeDefined();
    });

    it('should continue without error when no token provided', async () => {
      mockReq.headers = {};

      await optionalAuthenticate(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockReq.user).toBeUndefined();
    });

    it('should continue without error when token is invalid', async () => {
      mockReq.headers = { authorization: `Bearer invalid-token` };

      vi.mocked(jwtRotationService.verifyToken).mockImplementation(() => {
        throw new Error('invalid token');
      });

      await optionalAuthenticate(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockReq.user).toBeUndefined();
    });
  });

  describe('requireUserType', () => {
    it('should allow access for matching user type', () => {
      mockReq.user = {
        id: 'user-123',
        email: 'test@example.com',
        userType: 'BUYER',
      };

      const middleware = requireUserType('BUYER', 'SELLER');
      middleware(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should allow access when user type is in allowed list', () => {
      mockReq.user = {
        id: 'user-123',
        email: 'test@example.com',
        userType: 'SELLER',
      };

      const middleware = requireUserType('BUYER', 'SELLER', 'AGENT');
      middleware(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should deny access for non-matching user type', () => {
      mockReq.user = {
        id: 'user-123',
        email: 'test@example.com',
        userType: 'BUYER',
      };

      const middleware = requireUserType('ADMIN', 'AGENT');
      middleware(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Insufficient permissions',
        })
      );
    });

    it('should require authentication', () => {
      mockReq.user = undefined;

      const middleware = requireUserType('BUYER');
      middleware(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Authentication required',
        })
      );
    });
  });

  describe('requireAgent', () => {
    it('should allow access for agents', () => {
      mockReq.user = {
        id: 'user-123',
        email: 'test@example.com',
        userType: 'AGENT',
        agentId: 'agent-123',
      };

      requireAgent(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should deny access for non-agents', () => {
      mockReq.user = {
        id: 'user-123',
        email: 'test@example.com',
        userType: 'BUYER',
      };

      requireAgent(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Agent access required',
        })
      );
    });

    it('should require authentication', () => {
      mockReq.user = undefined;

      requireAgent(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Authentication required',
        })
      );
    });
  });

  describe('requireAdmin', () => {
    it('should allow access for admins', () => {
      mockReq.user = {
        id: 'user-123',
        email: 'admin@example.com',
        userType: 'ADMIN',
      };

      requireAdmin(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should deny access for non-admins', () => {
      mockReq.user = {
        id: 'user-123',
        email: 'test@example.com',
        userType: 'BUYER',
      };

      requireAdmin(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Admin access required',
        })
      );
    });
  });

  describe('requireVerifiedAgent', () => {
    it('should allow access for verified agents', async () => {
      mockReq.user = {
        id: 'user-123',
        email: 'test@example.com',
        userType: 'AGENT',
        agentId: 'agent-123',
      };

      vi.mocked(prisma.agent.findUnique).mockResolvedValue({
        verified: true,
      } as any);

      await requireVerifiedAgent(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should deny access for unverified agents', async () => {
      mockReq.user = {
        id: 'user-123',
        email: 'test@example.com',
        userType: 'AGENT',
        agentId: 'agent-123',
      };

      vi.mocked(prisma.agent.findUnique).mockResolvedValue({
        verified: false,
      } as any);

      await requireVerifiedAgent(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Agent verification required',
        })
      );
    });

    it('should deny access for non-agents', async () => {
      mockReq.user = {
        id: 'user-123',
        email: 'test@example.com',
        userType: 'BUYER',
      };

      await requireVerifiedAgent(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Agent access required',
        })
      );
    });
  });

  describe('requireSubscription', () => {
    it('should allow access for matching subscription tier', async () => {
      mockReq.user = {
        id: 'user-123',
        email: 'test@example.com',
        userType: 'AGENT',
        agentId: 'agent-123',
      };

      vi.mocked(prisma.agent.findUnique).mockResolvedValue({
        subscriptionTier: 'PROFESSIONAL',
        subscriptionExpires: new Date(Date.now() + 86400000), // 1 day in future
      } as any);

      const middleware = requireSubscription('PROFESSIONAL', 'ENTERPRISE');
      await middleware(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should deny access for non-matching subscription tier', async () => {
      mockReq.user = {
        id: 'user-123',
        email: 'test@example.com',
        userType: 'AGENT',
        agentId: 'agent-123',
      };

      vi.mocked(prisma.agent.findUnique).mockResolvedValue({
        subscriptionTier: 'BASIC',
        subscriptionExpires: new Date(Date.now() + 86400000),
      } as any);

      const middleware = requireSubscription('PROFESSIONAL', 'ENTERPRISE');
      await middleware(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('requires'),
        })
      );
    });

    it('should deny access for expired subscription', async () => {
      mockReq.user = {
        id: 'user-123',
        email: 'test@example.com',
        userType: 'AGENT',
        agentId: 'agent-123',
      };

      vi.mocked(prisma.agent.findUnique).mockResolvedValue({
        subscriptionTier: 'PROFESSIONAL',
        subscriptionExpires: new Date(Date.now() - 86400000), // 1 day in past
      } as any);

      const middleware = requireSubscription('PROFESSIONAL');
      await middleware(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Subscription expired',
        })
      );
    });

    it('should deny access for non-agents', async () => {
      mockReq.user = {
        id: 'user-123',
        email: 'test@example.com',
        userType: 'BUYER',
      };

      const middleware = requireSubscription('PROFESSIONAL');
      await middleware(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Agent access required',
        })
      );
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', () => {
      const user = {
        id: 'user-123',
        email: 'test@example.com',
        userType: 'BUYER',
      };

      vi.mocked(jwtRotationService.generateToken)
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const tokens = generateTokens(user);

      expect(tokens).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(jwtRotationService.generateToken).toHaveBeenCalledTimes(2);
    });

    it('should include agentId in token when provided', () => {
      const user = {
        id: 'user-123',
        email: 'test@example.com',
        userType: 'AGENT',
        agentId: 'agent-123',
      };

      vi.mocked(jwtRotationService.generateToken)
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      generateTokens(user);

      expect(jwtRotationService.generateToken).toHaveBeenCalledWith(
        expect.objectContaining({
          agentId: 'agent-123',
        }),
        expect.any(String)
      );
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify and return decoded refresh token', () => {
      const decoded = { userId: 'user-123' };
      vi.mocked(jwtRotationService.verifyToken).mockReturnValue(decoded);

      const result = verifyRefreshToken('refresh-token');

      expect(result).toEqual(decoded);
    });

    it('should throw error for invalid refresh token', () => {
      vi.mocked(jwtRotationService.verifyToken).mockImplementation(() => {
        throw new Error('invalid token');
      });

      expect(() => verifyRefreshToken('invalid-token')).toThrow();
    });
  });
});
