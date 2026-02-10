import { z } from 'zod';
import logger from './logger';

/**
 * Environment variables schema
 */
const envSchema = z.object({
    // Server
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().positive()).default('3001' as any),

    // Database
    DATABASE_URL: z.string().url('Invalid DATABASE_URL').min(1, 'DATABASE_URL is required'),

    // Redis
    REDIS_URL: z.string().url('Invalid REDIS_URL').default('redis://localhost:6379'),

    // Security Secrets
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    REFRESH_SECRET: z.string().min(32, 'REFRESH_SECRET must be at least 32 characters'),
    CSRF_SECRET: z.string().min(32, 'CSRF_SECRET must be at least 32 characters').optional(),

    // Token Configuration
    ACCESS_TOKEN_EXPIRES: z.string().default('15m'),
    REFRESH_TOKEN_EXPIRES: z.string().default('7d'),

    // CORS
    FRONTEND_URL: z.string().url('Invalid FRONTEND_URL').optional(),
    FRONTEND_DASHBOARD_URL: z.string().url('Invalid FRONTEND_DASHBOARD_URL').optional(),

    // File Upload
    MAX_FILE_SIZE: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().positive()).optional(),
    UPLOAD_DIR: z.string().default('uploads'),

    // Logging
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),

    // Stripe (optional)
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validate and parse environment variables
 */
export const validateEnv = (): EnvConfig => {
    try {
        const config = envSchema.parse(process.env);

        logger.info('Environment variables validated successfully', {
            nodeEnv: config.NODE_ENV,
            port: config.PORT,
        });

        return config;
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.errors.map((err: any) => ({
                field: err.path.join('.'),
                message: err.message,
            }));

            logger.error('Environment validation failed', { errors });

            console.error('\n❌ Environment Configuration Error:\n');
            errors.forEach((err: any) => {
                console.error(`  - ${err.field}: ${err.message}`);
            });
            console.error('\n💡 Please check your .env file and ensure all required variables are set.\n');

            process.exit(1);
        }

        throw error;
    }
};

/**
 * Get validated configuration
 */
export const getConfig = (): EnvConfig => {
    return validateEnv();
};
