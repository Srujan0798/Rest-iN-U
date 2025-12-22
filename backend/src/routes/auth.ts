// Authentication Routes
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { cacheDelete, CACHE_KEYS } from '../utils/redis';
import { 
  authenticate, 
  generateTokens, 
  verifyRefreshToken,
  AuthenticatedRequest 
} from '../middleware/auth';
import { 
  asyncHandler, 
  BadRequestError, 
  UnauthorizedError, 
  ConflictError 
} from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  userType: z.enum(['BUYER', 'SELLER', 'AGENT']).default('BUYER'),
  // Optional astrology fields
  dateOfBirth: z.string().optional(),
  birthTime: z.string().optional(),
  birthPlace: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const agentRegistrationSchema = z.object({
  licenseNumber: z.string().min(1, 'License number is required'),
  licenseState: z.string().min(1, 'License state is required'),
  licenseExpiry: z.string(),
  brokerage: z.string().optional(),
  yearsExperience: z.number().min(0),
  specialties: z.array(z.string()).optional(),
  serviceAreas: z.array(z.string()).optional(),
  languages: z.array(z.string()).default(['English']),
  bio: z.string().optional(),
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               userType:
 *                 type: string
 *                 enum: [BUYER, SELLER, AGENT]
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/register', asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(data.password, 12);

  // Calculate life path number if DOB provided
  let lifePathNumber: number | undefined;
  if (data.dateOfBirth) {
    lifePathNumber = calculateLifePathNumber(data.dateOfBirth);
  }

  // Create user
  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      userType: data.userType,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      birthTime: data.birthTime,
      birthPlace: data.birthPlace,
      lifePathNumber,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      userType: true,
      createdAt: true,
    },
  });

  // Generate tokens
  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    userType: user.userType,
  });

  // Create karmic score entry
  await prisma.karmicScore.create({
    data: {
      userId: user.id,
      overallScore: 500, // Start with neutral score
      honestyScore: 100,
      responsivenessScore: 100,
      fairnessScore: 100,
      communityScore: 100,
      environmentalScore: 100,
    },
  });

  // Create token balance entry
  await prisma.tokenBalance.create({
    data: {
      userId: user.id,
      balance: 100, // Welcome bonus tokens
    },
  });

  logger.info(`New user registered: ${user.email}`);

  res.status(201).json({
    success: true,
    data: {
      user,
      ...tokens,
    },
  });
}));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 */
router.post('/login', asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
    include: {
      agent: {
        select: {
          id: true,
          subscriptionTier: true,
          verified: true,
        },
      },
    },
  });

  if (!user || !user.passwordHash) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Check password
  const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
  if (!isValidPassword) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Account is deactivated');
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Generate tokens
  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    userType: user.userType,
    agentId: user.agent?.id,
  });

  logger.info(`User logged in: ${user.email}`);

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        profilePhotoUrl: user.profilePhotoUrl,
        agent: user.agent,
      },
      ...tokens,
    },
  });
}));

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 */
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new BadRequestError('Refresh token is required');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  // Get user
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: {
      agent: {
        select: { id: true },
      },
    },
  });

  if (!user || !user.isActive) {
    throw new UnauthorizedError('User not found or inactive');
  }

  // Generate new tokens
  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    userType: user.userType,
    agentId: user.agent?.id,
  });

  res.json({
    success: true,
    data: tokens,
  });
}));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      profilePhotoUrl: true,
      userType: true,
      dateOfBirth: true,
      birthTime: true,
      birthPlace: true,
      kycVerified: true,
      walletAddress: true,
      preferredLanguage: true,
      timezone: true,
      doshaType: true,
      lifePathNumber: true,
      createdAt: true,
      agent: {
        select: {
          id: true,
          licenseNumber: true,
          brokerage: true,
          yearsExperience: true,
          specialties: true,
          serviceAreas: true,
          languages: true,
          bio: true,
          rating: true,
          reviewCount: true,
          subscriptionTier: true,
          subscriptionExpiry: true,
          verified: true,
          ethicsScore: true,
        },
      },
      karmicScores: {
        select: {
          overallScore: true,
          badges: true,
        },
      },
      tokenBalance: {
        select: {
          balance: true,
          stakedAmount: true,
        },
      },
    },
  });

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  res.json({
    success: true,
    data: user,
  });
}));

/**
 * @swagger
 * /auth/register-agent:
 *   post:
 *     summary: Register as an agent (requires authentication)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
router.post('/register-agent', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const data = agentRegistrationSchema.parse(req.body);

  // Check if already an agent
  const existingAgent = await prisma.agent.findUnique({
    where: { userId: req.user!.id },
  });

  if (existingAgent) {
    throw new ConflictError('User is already registered as an agent');
  }

  // Create agent profile
  const agent = await prisma.agent.create({
    data: {
      userId: req.user!.id,
      licenseNumber: data.licenseNumber,
      licenseState: data.licenseState,
      licenseExpiry: new Date(data.licenseExpiry),
      brokerage: data.brokerage,
      yearsExperience: data.yearsExperience,
      specialties: data.specialties || [],
      serviceAreas: data.serviceAreas || [],
      languages: data.languages,
      bio: data.bio,
    },
  });

  // Update user type
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { userType: 'AGENT' },
  });

  // Clear cache
  await cacheDelete(`${CACHE_KEYS.USER}${req.user!.id}`);

  logger.info(`Agent registered: ${req.user!.email}`);

  res.status(201).json({
    success: true,
    data: agent,
  });
}));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
router.post('/logout', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  // Clear user cache
  await cacheDelete(`${CACHE_KEYS.USER}${req.user!.id}`);
  
  // In a more complete implementation, you would also:
  // - Blacklist the current token
  // - Clear refresh token from database
  
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
}));

/**
 * @swagger
 * /auth/connect-wallet:
 *   post:
 *     summary: Connect blockchain wallet
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
router.post('/connect-wallet', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { walletAddress, signature, message } = req.body;

  if (!walletAddress || !signature || !message) {
    throw new BadRequestError('Wallet address, signature, and message are required');
  }

  // TODO: Verify signature using ethers.js
  // const recoveredAddress = ethers.verifyMessage(message, signature);
  // if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
  //   throw new BadRequestError('Invalid signature');
  // }

  // Update user wallet
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { walletAddress: walletAddress.toLowerCase() },
  });

  // Clear cache
  await cacheDelete(`${CACHE_KEYS.USER}${req.user!.id}`);

  res.json({
    success: true,
    message: 'Wallet connected successfully',
    data: { walletAddress },
  });
}));

// Helper: Calculate life path number from date of birth
function calculateLifePathNumber(dateOfBirth: string): number {
  const date = new Date(dateOfBirth);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const sum = reduceToSingleDigit(day) + reduceToSingleDigit(month) + reduceToSingleDigit(year);
  return reduceToSingleDigit(sum);
}

function reduceToSingleDigit(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num; // Master numbers
  while (num > 9) {
    num = num.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return num;
}

export default router;
