import { z } from 'zod';

/**
 * Create order validation schema
 */
export const createOrderSchema = z.object({
    storeId: z
        .string()
        .cuid('Invalid store ID'),

    totalAmount: z
        .number()
        .positive('Total amount must be positive')
        .max(999999.99, 'Total amount too high')
        .or(z.string().transform((val) => parseFloat(val))),

    items: z.array(z.object({
        productId: z.string().cuid('Invalid product ID'),
        quantity: z.number().int().positive().max(9999),
        price: z.number().positive().max(999999.99)
    })).min(1, 'Order must have at least one item').optional()
});

/**
 * Update order status validation schema
 */
export const updateOrderStatusSchema = z.object({
    status: z.enum([
        'PENDING',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED'
    ])
});

/**
 * Query orders validation schema
 */
export const queryOrdersSchema = z.object({
    storeId: z
        .string()
        .cuid('Invalid store ID')
        .optional(),

    status: z
        .enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
        .optional(),

    limit: z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(z.number().int().positive().max(100))
        .optional(),

    offset: z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(z.number().int().min(0))
        .optional()
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type QueryOrdersInput = z.infer<typeof queryOrdersSchema>;
