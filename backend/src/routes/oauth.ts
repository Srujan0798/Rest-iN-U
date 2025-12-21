import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../lib/prisma.js';

const router = Router();

// ============================================
// GOOGLE OAUTH CALLBACK
// ============================================
const googleTokenSchema = z.object({
    credential: z.string(), // JWT token from Google
    clientId: z.string().optional(),
});

router.post('/google', async (req: Request, res: Response) => {
    try {
        const { credential } = googleTokenSchema.parse(req.body);

        // Decode Google JWT (in production, verify with Google's public keys)
        const decoded = jwt.decode(credential) as {
            email: string;
            name: string;
            given_name: string;
            family_name: string;
            picture: string;
            sub: string; // Google user ID
            email_verified: boolean;
        };

        if (!decoded || !decoded.email) {
            return res.status(400).json({ error: 'Invalid Google credential' });
        }

        // Find or create user
        let user = await prisma.user.findUnique({
            where: { email: decoded.email }
        });

        if (!user) {
            // Create new user from Google data
            user = await prisma.user.create({
                data: {
                    email: decoded.email,
                    firstName: decoded.given_name || decoded.name?.split(' ')[0] || 'User',
                    lastName: decoded.family_name || decoded.name?.split(' ').slice(1).join(' ') || '',
                    profilePhoto: decoded.picture,
                    emailVerified: decoded.email_verified,
                    googleId: decoded.sub,
                    userType: 'BUYER',
                }
            });
        } else if (!user.googleId) {
            // Link Google account to existing user
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    googleId: decoded.sub,
                    profilePhoto: user.profilePhoto || decoded.picture,
                    emailVerified: true,
                }
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, userType: user.userType },
            process.env.JWT_SECRET || 'dev-secret',
            { expiresIn: 604800 } // 7 days
        );

        res.json({
            message: 'Google login successful',
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
        console.error('Google OAuth error:', error);
        res.status(500).json({ error: 'Google authentication failed' });
    }
});

// ============================================
// FACEBOOK OAUTH CALLBACK
// ============================================
const facebookTokenSchema = z.object({
    accessToken: z.string(),
    userId: z.string(),
});

router.post('/facebook', async (req: Request, res: Response) => {
    try {
        const { accessToken, userId } = facebookTokenSchema.parse(req.body);

        // Verify token with Facebook Graph API (simulate response for now)
        // In production, call: https://graph.facebook.com/me?fields=id,name,email,picture&access_token=...
        const fbGraphUrl = `https://graph.facebook.com/${userId}?fields=id,name,email,first_name,last_name,picture.type(large)&access_token=${accessToken}`;

        // For demo purposes, we'll trust the token
        // In production, verify with Facebook
        const fbResponse = await fetch(fbGraphUrl);

        if (!fbResponse.ok) {
            return res.status(401).json({ error: 'Invalid Facebook token' });
        }

        const fbData = await fbResponse.json() as {
            id: string;
            name: string;
            email?: string;
            first_name: string;
            last_name: string;
            picture?: { data?: { url?: string } };
        };

        if (!fbData.email) {
            return res.status(400).json({
                error: 'Email not provided by Facebook. Please allow email access.'
            });
        }

        // Find or create user
        let user = await prisma.user.findUnique({
            where: { email: fbData.email }
        });

        if (!user) {
            // Create new user from Facebook data
            user = await prisma.user.create({
                data: {
                    email: fbData.email,
                    firstName: fbData.first_name || fbData.name?.split(' ')[0] || 'User',
                    lastName: fbData.last_name || fbData.name?.split(' ').slice(1).join(' ') || '',
                    profilePhoto: fbData.picture?.data?.url,
                    facebookId: fbData.id,
                    emailVerified: true,
                    userType: 'BUYER',
                }
            });
        } else if (!user.facebookId) {
            // Link Facebook account to existing user
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    facebookId: fbData.id,
                    profilePhoto: user.profilePhoto || fbData.picture?.data?.url,
                }
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, userType: user.userType },
            process.env.JWT_SECRET || 'dev-secret',
            { expiresIn: 604800 } // 7 days
        );

        res.json({
            message: 'Facebook login successful',
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
        console.error('Facebook OAuth error:', error);
        res.status(500).json({ error: 'Facebook authentication failed' });
    }
});

// ============================================
// APPLE SIGN-IN (Bonus)
// ============================================
const appleTokenSchema = z.object({
    identityToken: z.string(),
    authorizationCode: z.string(),
    user: z.object({
        email: z.string().email().optional(),
        name: z.object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
        }).optional(),
    }).optional(),
});

router.post('/apple', async (req: Request, res: Response) => {
    try {
        const data = appleTokenSchema.parse(req.body);

        // Decode Apple identity token
        const decoded = jwt.decode(data.identityToken) as {
            sub: string; // Apple user ID
            email?: string;
            email_verified?: boolean;
        };

        if (!decoded) {
            return res.status(400).json({ error: 'Invalid Apple credential' });
        }

        const email = decoded.email || data.user?.email;

        if (!email) {
            return res.status(400).json({ error: 'Email not provided' });
        }

        // Find or create user
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { appleId: decoded.sub }
                ]
            }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    firstName: data.user?.name?.firstName || 'User',
                    lastName: data.user?.name?.lastName || '',
                    appleId: decoded.sub,
                    emailVerified: decoded.email_verified ?? true,
                    userType: 'BUYER',
                }
            });
        } else if (!user.appleId) {
            user = await prisma.user.update({
                where: { id: user.id },
                data: { appleId: decoded.sub }
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, userType: user.userType },
            process.env.JWT_SECRET || 'dev-secret',
            { expiresIn: 604800 }
        );

        res.json({
            message: 'Apple sign-in successful',
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
        console.error('Apple OAuth error:', error);
        res.status(500).json({ error: 'Apple authentication failed' });
    }
});

export default router;
