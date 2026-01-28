import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { errors } from '../utils/response';

/**
 * Validation middleware factory
 * @param schema Zod schema to validate against
 */
export function validate(schema: ZodSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const details = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                return errors.validation(res, details);
            }
            next(error);
        }
    };
}

/**
 * Validate only body
 */
export function validateBody(schema: ZodSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const details = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                return errors.validation(res, details);
            }
            next(error);
        }
    };
}

/**
 * Validate only query params
 */
export function validateQuery(schema: ZodSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.query = await schema.parseAsync(req.query);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const details = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                return errors.validation(res, details);
            }
            next(error);
        }
    };
}
