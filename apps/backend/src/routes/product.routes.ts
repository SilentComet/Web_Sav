import { Router } from 'express';
import { createProduct, getProducts } from '../controllers/product.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateJWT, authorizeRole(['STORE_OWNER', 'RESELLER', 'SUPER_ADMIN']), createProduct);
router.get('/', authenticateJWT, getProducts); // Open to authenticated users for now

export default router;
