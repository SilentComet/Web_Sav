import { Router } from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/order.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import { createOrderSchema, updateOrderStatusSchema, queryOrdersSchema } from '../schemas/order.schema';
import { z } from 'zod';

const router = Router();

const idParamSchema = z.object({ id: z.string().cuid('Invalid ID') });

router.post('/', validateBody(createOrderSchema), createOrder); // Public for now to simulate storefront
router.get('/', authenticateJWT, validateQuery(queryOrdersSchema), getOrders);
router.patch('/:id/status', authenticateJWT, validateParams(idParamSchema), validateBody(updateOrderStatusSchema), updateOrderStatus);

export default router;
