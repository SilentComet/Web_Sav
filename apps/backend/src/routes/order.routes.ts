import { Router } from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/order.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/', createOrder); // Public for now to simulate storefront
router.get('/', authenticateJWT, getOrders);
router.patch('/:id/status', authenticateJWT, updateOrderStatus);

export default router;
