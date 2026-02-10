import { z } from 'zod';

/**
 * Create store validation schema
 */
export const createStoreSchema = z.object({
    name: z
        .string()
        .min(1, 'Store name is required')
        .max(100, 'Store name too long')
        .trim(),

    subdomain: z
        .string()
        .min(3, 'Subdomain must be at least 3 characters')
        .max(63, 'Subdomain too long')
        .regex(
            /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/,
            'Subdomain must contain only lowercase letters, numbers, and hyphens'
        )
        .trim()
        .toLowerCase(),

    serverId: z
        .string()
        .cuid('Invalid server ID')
        .optional()
});

/**
 * Update store validation schema
 */
export const updateStoreSchema = z.object({
    name: z
        .string()
        .min(1, 'Store name is required')
        .max(100, 'Store name too long')
        .trim()
        .optional(),

    subdomain: z
        .string()
        .min(3, 'Subdomain must be at least 3 characters')
        .max(63, 'Subdomain too long')
        .regex(
            /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/,
            'Subdomain must contain only lowercase letters, numbers, and hyphens'
        )
        .trim()
        .toLowerCase()
        .optional(),

    serverId: z
        .string()
        .cuid('Invalid server ID')
        .optional()
});

export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
