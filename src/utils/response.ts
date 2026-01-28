import { Response } from 'express';

// Standard API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: ApiError;
    pagination?: Pagination;
}

export interface ApiError {
    code: string;
    message: string;
    details?: any;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// Success response
export function successResponse<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
): Response {
    return res.status(statusCode).json({
        success: true,
        data,
        message,
    });
}

// Paginated response
export function paginatedResponse<T>(
    res: Response,
    data: T[],
    pagination: Pagination,
    message: string = 'Success'
): Response {
    return res.status(200).json({
        success: true,
        data,
        message,
        pagination,
    });
}

// Error response
export function errorResponse(
    res: Response,
    code: string,
    message: string,
    statusCode: number = 400,
    details?: any
): Response {
    return res.status(statusCode).json({
        success: false,
        error: {
            code,
            message,
            ...(details && { details }),
        },
    });
}

// Common error helpers
export const errors = {
    badRequest: (res: Response, message: string = 'Bad Request', details?: any) =>
        errorResponse(res, 'BAD_REQUEST', message, 400, details),

    unauthorized: (res: Response, message: string = 'Unauthorized') =>
        errorResponse(res, 'UNAUTHORIZED', message, 401),

    forbidden: (res: Response, message: string = 'Forbidden') =>
        errorResponse(res, 'FORBIDDEN', message, 403),

    notFound: (res: Response, message: string = 'Not Found') =>
        errorResponse(res, 'NOT_FOUND', message, 404),

    conflict: (res: Response, message: string = 'Conflict') =>
        errorResponse(res, 'CONFLICT', message, 409),

    validation: (res: Response, details: any) =>
        errorResponse(res, 'VALIDATION_ERROR', 'Validation failed', 422, details),

    internal: (res: Response, message: string = 'Internal Server Error') =>
        errorResponse(res, 'INTERNAL_ERROR', message, 500),
};
