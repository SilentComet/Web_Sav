import { z } from 'zod';

/**
 * Create page validation schema
 */
export const createPageSchema = z.object({
    name: z
        .string()
        .min(1, 'Page name is required')
        .max(100, 'Page name too long')
        .trim(),

    slug: z
        .string()
        .min(1, 'Slug is required')
        .max(100, 'Slug too long')
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            'Slug must contain only lowercase letters, numbers, and hyphens'
        )
        .trim()
        .toLowerCase(),

    storeId: z
        .string()
        .cuid('Invalid store ID'),

    content: z
        .any()
        .optional() // JSON content, validated separately
});

/**
 * Update page validation schema
 */
export const updatePageSchema = z.object({
    name: z
        .string()
        .min(1, 'Page name is required')
        .max(100, 'Page name too long')
        .trim()
        .optional(),

    slug: z
        .string()
        .min(1, 'Slug is required')
        .max(100, 'Slug too long')
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            'Slug must contain only lowercase letters, numbers, and hyphens'
        )
        .trim()
        .toLowerCase()
        .optional(),

    content: z
        .any()
        .optional()
});

export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
