import { Router } from 'express';
import { createPaymentIntent, handleWebhook, getPayments } from '../controllers/payment.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/create-intent', createPaymentIntent); // Public for simulation (storefront)
router.post('/webhook', handleWebhook); // Public for stripe
router.get('/', authenticateJWT, getPayments);

export default router;
