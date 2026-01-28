import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

/**
 * General rate limiter
 */
export const generalLimiter = rateLimit({
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS),
    max: parseInt(env.RATE_LIMIT_MAX_REQUESTS),
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'คำขอมากเกินไป กรุณารอสักครู่',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Strict rate limiter for auth routes
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: {
        success: false,
        error: {
            code: 'AUTH_RATE_LIMIT',
            message: 'พยายามเข้าสู่ระบบมากเกินไป กรุณารอ 15 นาที',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful logins
});

/**
 * Strict limiter for sensitive operations
 */
export const strictLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'คำขอมากเกินไป กรุณารอสักครู่',
        },
    },
});
