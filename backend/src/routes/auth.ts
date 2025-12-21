import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Validation schemas
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional(),
    userType: z.enum(['BUYER', 'SELLER', 'AGENT']).default('BUYER'),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

// ============================================
// REGISTER
// ============================================
router.post('/register', async (req: Request, res: Response) => {
    try {
        const data = registerSchema.parse(req.body);

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(data.password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: data.email,
                passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                userType: data.userType,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                userType: true,
                createdAt: true,
            }
        });

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, userType: user.userType },
            process.env.JWT_SECRET || 'dev-secret',
            { expiresIn: 604800 } // 7 days in seconds
        );

        res.status(201).json({
            message: 'User registered successfully',
            user,
            token
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// ============================================
// LOGIN
// ============================================
router.post('/login', async (req: Request, res: Response) => {
    try {
        const data = loginSchema.parse(req.body);

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (!user || !user.passwordHash) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(data.password, user.passwordHash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, userType: user.userType },
            process.env.JWT_SECRET || 'dev-secret',
            { expiresIn: 604800 } // 7 days in seconds
        );

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userType: user.userType,
                profilePhoto: user.profilePhoto,
            },
            token
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// ============================================
// GET CURRENT USER
// ============================================
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                profilePhoto: true,
                userType: true,
                emailVerified: true,
                createdAt: true,
                agent: req.userType === 'AGENT' ? {
                    select: {
                        id: true,
                        licenseNumber: true,
                        brokerage: true,
                        yearsExperience: true,
                        specialties: true,
                        serviceAreas: true,
                        bio: true,
                        rating: true,
                        reviewCount: true,
                        subscriptionTier: true,
                        verified: true,
                    }
                } : false,
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

// ============================================
// UPDATE PROFILE
// ============================================
router.patch('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const updateData = z.object({
            firstName: z.string().min(1).optional(),
            lastName: z.string().min(1).optional(),
            phone: z.string().optional(),
            profilePhoto: z.string().url().optional(),
        }).parse(req.body);

        const user = await prisma.user.update({
            where: { id: req.userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                profilePhoto: true,
                userType: true,
            }
        });

        res.json({ message: 'Profile updated', user });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

export default router;
