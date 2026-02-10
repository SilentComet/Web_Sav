import { z } from 'zod';

/**
 * Create product validation schema
 */
export const createProductSchema = z.object({
    name: z
        .string()
        .min(1, 'Product name is required')
        .max(200, 'Product name too long')
        .trim(),

    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(5000, 'Description too long')
        .trim()
        .optional(),

    price: z
        .number()
        .positive('Price must be positive')
        .max(999999.99, 'Price too high')
        .or(z.string().transform((val) => parseFloat(val))),

    stock: z
        .number()
        .int('Stock must be an integer')
        .min(0, 'Stock cannot be negative')
        .max(999999, 'Stock too high')
        .or(z.string().transform((val) => parseInt(val, 10))),

    storeId: z
        .string()
        .cuid('Invalid store ID'),

    categoryId: z
        .string()
        .cuid('Invalid category ID')
        .optional(),

    imageUrl: z
        .string()
        .url('Invalid image URL')
        .max(500, 'Image URL too long')
        .optional()
});

/**
 * Update product validation schema
 */
export const updateProductSchema = z.object({
    name: z
        .string()
        .min(1, 'Product name is required')
        .max(200, 'Product name too long')
        .trim()
        .optional(),

    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(5000, 'Description too long')
        .trim()
        .optional(),

    price: z
        .number()
        .positive('Price must be positive')
        .max(999999.99, 'Price too high')
        .or(z.string().transform((val) => parseFloat(val)))
        .optional(),

    stock: z
        .number()
        .int('Stock must be an integer')
        .min(0, 'Stock cannot be negative')
        .max(999999, 'Stock too high')
        .or(z.string().transform((val) => parseInt(val, 10)))
        .optional(),

    categoryId: z
        .string()
        .cuid('Invalid category ID')
        .optional()
        .nullable(),

    imageUrl: z
        .string()
        .url('Invalid image URL')
        .max(500, 'Image URL too long')
        .optional()
        .nullable()
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
