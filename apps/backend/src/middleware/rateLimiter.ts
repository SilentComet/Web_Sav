import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from '../utils/redis';
import logger from '../utils/logger';

/**
 * Rate limiter for authentication endpoints
 * Prevents brute force attacks
 * 5 attempts per 15 minutes
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        status: 'error',
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many authentication attempts. Please try again later.',
    },
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,
    store: new RedisStore({
        // @ts-expect-error - rate-limit-redis types issue
        client: redis,
        prefix: 'rl:auth:',
    }),
    handler: (req, res) => {
        logger.warn('Rate limit exceeded for auth endpoint', {
            ip: req.ip,
            url: req.url,
            method: req.method,
        });
        res.status(429).json({
            status: 'error',
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many authentication attempts. Please try again in 15 minutes.',
        });
    },
});

/**
 * Rate limiter for general API endpoints
 * Prevents API abuse and DDoS
 * 100 requests per 15 minutes
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        status: 'error',
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        // @ts-expect-error - rate-limit-redis types issue
        client: redis,
        prefix: 'rl:api:',
    }),
    handler: (req, res) => {
        logger.warn('Rate limit exceeded for API endpoint', {
            ip: req.ip,
            url: req.url,
            method: req.method,
        });
        res.status(429).json({
            status: 'error',
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please try again in 15 minutes.',
        });
    },
    // Skip rate limiting for health check
    skip: (req) => req.url === '/health',
});

/**
 * Strict rate limiter for sensitive operations
 * 3 attempts per hour
 */
export const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: {
        status: 'error',
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many attempts. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        // @ts-expect-error - rate-limit-redis types issue
        client: redis,
        prefix: 'rl:strict:',
    }),
});
