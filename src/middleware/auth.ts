import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../config/database';
import { errors } from '../utils/response';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                username: string;
                role?: string;
            };
            admin?: {
                id: number;
                username: string;
                role: string;
            };
        }
    }
}

export interface JwtPayload {
    id: number;
    username: string;
    role?: string;
    type: 'user' | 'admin';
    iat: number;
    exp: number;
}

/**
 * Parse expiry string to seconds
 */
function parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 900; // default 15 minutes

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
        case 's': return value;
        case 'm': return value * 60;
        case 'h': return value * 60 * 60;
        case 'd': return value * 60 * 60 * 24;
        default: return 900;
    }
}

/**
 * Generate JWT tokens
 */
export function generateTokens(payload: { id: number; username: string; role?: string; type: 'user' | 'admin' }) {
    const accessOptions: SignOptions = {
        expiresIn: parseExpiry(env.JWT_EXPIRES_IN),
    };

    const refreshOptions: SignOptions = {
        expiresIn: parseExpiry(env.JWT_REFRESH_EXPIRES_IN),
    };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, accessOptions);
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, refreshOptions);

    return { accessToken, refreshToken };
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string, isRefresh: boolean = false): JwtPayload | null {
    try {
        const secret = isRefresh ? env.JWT_REFRESH_SECRET : env.JWT_SECRET;
        return jwt.verify(token, secret) as JwtPayload;
    } catch {
        return null;
    }
}

/**
 * Extract token from request
 */
function extractToken(req: Request): string | null {
    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }

    // Check cookie (for browser requests)
    if (req.cookies?.accessToken) {
        return req.cookies.accessToken;
    }

    return null;
}

/**
 * Auth middleware for user routes
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = extractToken(req);

    if (!token) {
        return errors.unauthorized(res, 'กรุณาเข้าสู่ระบบ');
    }

    const payload = verifyToken(token);

    if (!payload || payload.type !== 'user') {
        return errors.unauthorized(res, 'Token ไม่ถูกต้องหรือหมดอายุ');
    }

    req.user = {
        id: payload.id,
        username: payload.username,
        role: payload.role,
    };

    next();
}

/**
 * Auth middleware for admin routes
 */
export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = extractToken(req);

    if (!token) {
        return errors.unauthorized(res, 'กรุณาเข้าสู่ระบบ');
    }

    const payload = verifyToken(token);

    if (!payload || payload.type !== 'admin') {
        return errors.unauthorized(res, 'Token ไม่ถูกต้องหรือหมดอายุ');
    }

    req.admin = {
        id: payload.id,
        username: payload.username,
        role: payload.role || 'Admin',
    };

    next();
}

/**
 * Super admin only middleware
 */
export function superAdminMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.admin || req.admin.role !== 'SuperAdmin') {
        return errors.forbidden(res, 'คุณไม่มีสิทธิ์เข้าถึง');
    }
    next();
}

/**
 * Optional auth middleware (doesn't fail if no token)
 */
export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = extractToken(req);

    if (!token) {
        return next();
    }

    const payload = verifyToken(token);

    if (payload && payload.type === 'user') {
        req.user = {
            id: payload.id,
            username: payload.username,
            role: payload.role,
        };
    }

    next();
}
