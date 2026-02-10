import { Router } from 'express';
import { createProduct, getProducts } from '../controllers/product.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { createProductSchema } from '../schemas/product.schema';

const router = Router();

router.post('/', authenticateJWT, authorizeRole(['STORE_OWNER', 'RESELLER', 'SUPER_ADMIN']), validateBody(createProductSchema), createProduct);
router.get('/', authenticateJWT, getProducts); // Open to authenticated users for now

export default router;
