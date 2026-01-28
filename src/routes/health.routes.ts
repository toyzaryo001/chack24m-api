import { Router, Request, Response } from 'express';
import { successResponse } from '../utils/response';
import { env } from '../config/env';

const router = Router();

/**
 * Health check endpoint
 * GET /api/health
 */
router.get('/health', (req: Request, res: Response) => {
    successResponse(res, {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env.NODE_ENV,
        version: '1.0.0',
    }, 'API is running');
});

/**
 * API info endpoint
 * GET /api
 */
router.get('/', (req: Request, res: Response) => {
    successResponse(res, {
        name: env.APP_NAME,
        version: '1.0.0',
        description: 'CHECK24M API - Node.js + Express + TypeScript',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth/*',
            wallet: '/api/wallet/*',
            games: '/api/games/*',
            admin: '/api/admin/*',
        },
    }, 'Welcome to CHECK24M API');
});

export default router;
