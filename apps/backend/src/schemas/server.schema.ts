import { z } from 'zod';

/**
 * Create server validation schema
 */
export const createServerSchema = z.object({
    name: z
        .string()
        .min(1, 'Server name is required')
        .max(100, 'Server name too long')
        .trim(),

    type: z
        .enum(['VPS', 'DEDICATED'])
        .default('VPS'),

    capacity: z
        .number()
        .int('Capacity must be an integer')
        .positive('Capacity must be positive')
        .max(10000, 'Capacity too high')
        .or(z.string().transform((val) => parseInt(val, 10))),

    endpoint: z
        .string()
        .url('Invalid endpoint URL')
        .max(500, 'Endpoint URL too long')
});

/**
 * Update server validation schema
 */
export const updateServerSchema = z.object({
    name: z
        .string()
        .min(1, 'Server name is required')
        .max(100, 'Server name too long')
        .trim()
        .optional(),

    type: z
        .enum(['VPS', 'DEDICATED'])
        .optional(),

    capacity: z
        .number()
        .int('Capacity must be an integer')
        .positive('Capacity must be positive')
        .max(10000, 'Capacity too high')
        .or(z.string().transform((val) => parseInt(val, 10)))
        .optional(),

    endpoint: z
        .string()
        .url('Invalid endpoint URL')
        .max(500, 'Endpoint URL too long')
        .optional()
});

export type CreateServerInput = z.infer<typeof createServerSchema>;
export type UpdateServerInput = z.infer<typeof updateServerSchema>;
