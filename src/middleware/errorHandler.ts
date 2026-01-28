import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { errors } from '../utils/response';
import { isDev } from '../config/env';

/**
 * Global error handler middleware
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Log error
    logger.error(`Error: ${err.message}`, {
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return errors.validation(res, err.message);
    }

    if (err.name === 'UnauthorizedError') {
        return errors.unauthorized(res, 'Token ไม่ถูกต้อง');
    }

    // Generic error
    return errors.internal(
        res,
        isDev ? err.message : 'เกิดข้อผิดพลาดภายในระบบ'
    );
}

/**
 * 404 handler
 */
export function notFoundHandler(req: Request, res: Response) {
    return errors.notFound(res, `ไม่พบ ${req.method} ${req.originalUrl}`);
}
