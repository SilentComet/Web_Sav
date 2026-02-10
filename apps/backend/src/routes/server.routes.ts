import { Router } from 'express';
import { createServer, getServers, updateServerStatus } from '../controllers/server.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';
import { validateBody, validateParams } from '../middleware/validation.middleware';
import { createServerSchema } from '../schemas/server.schema';
import { z } from 'zod';

const router = Router();

const idParamSchema = z.object({ id: z.string().cuid('Invalid ID') });

router.post('/', authenticateJWT, authorizeRole(['RESELLER', 'SUPER_ADMIN']), validateBody(createServerSchema), createServer);
router.get('/', authenticateJWT, authorizeRole(['RESELLER', 'SUPER_ADMIN']), getServers);
router.patch('/:id/status', authenticateJWT, authorizeRole(['RESELLER', 'SUPER_ADMIN']), validateParams(idParamSchema), updateServerStatus);

export default router;
