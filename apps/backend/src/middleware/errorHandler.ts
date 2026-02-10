import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

/**
 * Global error handler middleware
 * Must be registered AFTER all routes
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Log the error
    if (err instanceof AppError) {
        if (err.statusCode >= 500) {
            logger.error('Application error', {
                message: err.message,
                statusCode: err.statusCode,
                code: err.code,
                stack: err.stack,
                url: req.url,
                method: req.method,
            });
        } else {
            logger.warn('Client error', {
                message: err.message,
                statusCode: err.statusCode,
                code: err.code,
                url: req.url,
                method: req.method,
            });
        }
    } else {
        // Unexpected error
        logger.error('Unexpected error', {
            message: err.message,
            stack: err.stack,
            url: req.url,
            method: req.method,
        });
    }

    // Determine status code and response
    let statusCode = 500;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    let errors: any[] | undefined;

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        code = err.code || 'APP_ERROR';

        // Include validation errors if present
        if ('errors' in err && Array.isArray((err as any).errors)) {
            errors = (err as any).errors;
        }
    }

    // Send error response
    const errorResponse: any = {
        status: 'error',
        code,
        message,
    };

    // Add errors array if present
    if (errors) {
        errorResponse.errors = errors;
    }

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    res.status(statusCode).json(errorResponse);
};

/**
 * 404 handler for unmatched routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
    logger.warn('Route not found', {
        url: req.url,
        method: req.method,
    });

    res.status(404).json({
        status: 'error',
        code: 'ROUTE_NOT_FOUND',
        message: `Cannot ${req.method} ${req.url}`,
    });
};
