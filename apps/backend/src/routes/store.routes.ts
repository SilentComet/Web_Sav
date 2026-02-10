import { Router } from 'express';
import { createStore, getStores } from '../controllers/store.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

// Only resellers/providers can manage stores in this context
router.post('/', authenticateJWT, authorizeRole(['RESELLER', 'SUPER_ADMIN']), createStore);
router.get('/', authenticateJWT, authorizeRole(['RESELLER', 'SUPER_ADMIN']), getStores);

export default router;
