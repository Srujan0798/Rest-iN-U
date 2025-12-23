// Authentication Middleware
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prisma } from '../utils/prisma';
import { cacheGet, cacheSet, CACHE_KEYS, CACHE_TTL } from '../utils/redis';
import { UnauthorizedError, ForbiddenError } from './errorHandler';
import { logger } from '../utils/logger';

// Extended Request with user info
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    userType: string;
    agentId?: string;
    walletAddress?: string;
  };
}

// JWT payload interface
interface JWTPayload {
  userId: string;
  email: string;
  userType: string;
  agentId?: string;
  iat: number;
  exp: number;
}

// Verify JWT token
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token expired');
      }
      throw new UnauthorizedError('Invalid token');
    }

    // Check if user exists (with caching)
    const cacheKey = `${CACHE_KEYS.USER}${decoded.userId}`;
    let user = await cacheGet<any>(cacheKey);

    if (!user) {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          userType: true,
          isActive: true,
          walletAddress: true,
          agent: {
            select: {
              id: true,
              subscriptionTier: true,
              verified: true,
            },
          },
        },
      });

      if (user) {
        await cacheSet(cacheKey, user, CACHE_TTL.MEDIUM);
      }
    }

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      userType: user.userType,
      agentId: user.agent?.id,
      walletAddress: user.walletAddress,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authMiddleware = authenticate;

// Optional authentication (doesn't fail if no token)
export const optionalAuthenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

      const cacheKey = `${CACHE_KEYS.USER}${decoded.userId}`;
      let user = await cacheGet<any>(cacheKey);

      if (!user) {
        user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            email: true,
            userType: true,
            isActive: true,
            walletAddress: true,
            agent: {
              select: {
                id: true,
              },
            },
          },
        });

        if (user) {
          await cacheSet(cacheKey, user, CACHE_TTL.MEDIUM);
        }
      }

      if (user && user.isActive) {
        req.user = {
          id: user.id,
          email: user.email,
          userType: user.userType,
          agentId: user.agent?.id,
          walletAddress: user.walletAddress,
        };
      }
    } catch (error) {
      // Ignore token errors for optional auth
      logger.debug('Optional auth failed:', error);
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Require specific user types
export const requireUserType = (...allowedTypes: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!allowedTypes.includes(req.user.userType)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
};

// Require agent role
export const requireAgent = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }

  if (!req.user.agentId) {
    return next(new ForbiddenError('Agent access required'));
  }

  next();
};

// Require admin role
export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }

  if (req.user.userType !== 'ADMIN') {
    return next(new ForbiddenError('Admin access required'));
  }

  next();
};

// Require verified agent
export const requireVerifiedAgent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !req.user.agentId) {
    return next(new ForbiddenError('Agent access required'));
  }

  try {
    const agent = await prisma.agent.findUnique({
      where: { id: req.user.agentId },
      select: { verified: true },
    });

    if (!agent?.verified) {
      return next(new ForbiddenError('Agent verification required'));
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Require specific subscription tier
export const requireSubscription = (...allowedTiers: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.agentId) {
      return next(new ForbiddenError('Agent access required'));
    }

    try {
      const agent = await prisma.agent.findUnique({
        where: { id: req.user.agentId },
        select: { subscriptionTier: true, subscriptionExpiry: true },
      });

      if (!agent) {
        return next(new ForbiddenError('Agent not found'));
      }

      if (!allowedTiers.includes(agent.subscriptionTier)) {
        return next(new ForbiddenError(
          `This feature requires ${allowedTiers.join(' or ')} subscription`
        ));
      }

      if (agent.subscriptionExpiry && new Date(agent.subscriptionExpiry) < new Date()) {
        return next(new ForbiddenError('Subscription expired'));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Generate tokens
export const generateTokens = (user: {
  id: string;
  email: string;
  userType: string;
  agentId?: string;
}) => {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      userType: user.userType,
      agentId: user.agentId,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  return { accessToken, refreshToken };
};

// Verify refresh token
export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, config.jwt.refreshSecret) as { userId: string };
};

