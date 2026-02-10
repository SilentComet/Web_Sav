import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Validation middleware factory
 * Creates middleware to validate request body, query, or params
 */
export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate and transform the data
            const validated = await schema.parseAsync(req[source]);

            // Replace request data with validated and transformed data
            req[source] = validated;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Format Zod validation errors for user-friendly response
                const errors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                return res.status(400).json({
                    status: 'error',
                    message: 'Validation failed',
                    errors
                });
            }

            // Unexpected error
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    };
};

/**
 * Validate request body
 */
export const validateBody = (schema: ZodSchema) => validate(schema, 'body');

/**
 * Validate query parameters
 */
export const validateQuery = (schema: ZodSchema) => validate(schema, 'query');

/**
 * Validate URL parameters
 */
export const validateParams = (schema: ZodSchema) => validate(schema, 'params');
