import { Router } from 'express';
import { createServer, getServers, updateServerStatus } from '../controllers/server.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateJWT, authorizeRole(['RESELLER', 'SUPER_ADMIN']), createServer);
router.get('/', authenticateJWT, authorizeRole(['RESELLER', 'SUPER_ADMIN']), getServers);
router.patch('/:id/status', authenticateJWT, authorizeRole(['RESELLER', 'SUPER_ADMIN']), updateServerStatus);

export default router;
