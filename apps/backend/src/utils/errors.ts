/**
 * Base application error class
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly code?: string;

    constructor(
        message: string,
        statusCode: number = 500,
        isOperational: boolean = true,
        code?: string
    ) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.code = code;

        // Maintains proper stack trace
        Error.captureStackTrace(this, this.constructor);

        // Set the prototype explicitly
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

/**
 * 400 Bad Request
 */
export class BadRequestError extends AppError {
    constructor(message: string = 'Bad Request', code?: string) {
        super(message, 400, true, code);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized', code?: string) {
        super(message, 401, true, code || 'UNAUTHORIZED');
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

/**
 * 403 Forbidden
 */
export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden', code?: string) {
        super(message, 403, true, code || 'FORBIDDEN');
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

/**
 * 404 Not Found
 */
export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found', code?: string) {
        super(message, 404, true, code || 'NOT_FOUND');
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

/**
 * 409 Conflict
 */
export class ConflictError extends AppError {
    constructor(message: string = 'Conflict', code?: string) {
        super(message, 409, true, code || 'CONFLICT');
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}

/**
 * 422 Unprocessable Entity (Validation Error)
 */
export class ValidationError extends AppError {
    public readonly errors?: any[];

    constructor(message: string = 'Validation failed', errors?: any[], code?: string) {
        super(message, 422, true, code || 'VALIDATION_ERROR');
        this.errors = errors;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends AppError {
    constructor(message: string = 'Internal server error', code?: string) {
        super(message, 500, false, code || 'INTERNAL_ERROR');
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}

/**
 * 503 Service Unavailable
 */
export class ServiceUnavailableError extends AppError {
    constructor(message: string = 'Service unavailable', code?: string) {
        super(message, 503, true, code || 'SERVICE_UNAVAILABLE');
        Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
    }
}
