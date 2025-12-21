import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string;
    userType?: string;
}

export interface JwtPayload {
    userId: string;
    userType: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'dev-secret';

        const decoded = jwt.verify(token, secret) as JwtPayload;

        req.userId = decoded.userId;
        req.userType = decoded.userType;

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Optional auth - doesn't fail if no token, but attaches user if present
export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const secret = process.env.JWT_SECRET || 'dev-secret';
            const decoded = jwt.verify(token, secret) as JwtPayload;
            req.userId = decoded.userId;
            req.userType = decoded.userType;
        }

        next();
    } catch (error) {
        // Token is invalid, but we continue anyway
        next();
    }
};

// Check if user is an agent
export const agentOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.userType !== 'AGENT') {
        return res.status(403).json({ error: 'Agent access required' });
    }
    next();
};

// Check if user is admin
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.userType !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
