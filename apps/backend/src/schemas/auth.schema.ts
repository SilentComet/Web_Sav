import { z } from 'zod';

/**
 * Registration validation schema
 */
export const registerSchema = z.object({
    email: z
        .string()
        .email('Invalid email format')
        .min(1, 'Email is required')
        .max(255, 'Email too long'),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password too long')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),

    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name too long')
        .trim(),

    role: z
        .enum(['STORE_OWNER', 'RESELLER', 'SUPER_ADMIN'])
        .optional()
        .default('STORE_OWNER')
});

/**
 * Login validation schema
 */
export const loginSchema = z.object({
    email: z
        .string()
        .email('Invalid email format')
        .min(1, 'Email is required'),

    password: z
        .string()
        .min(1, 'Password is required')
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
