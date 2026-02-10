import { Router } from 'express';
import { createPage, getPages, getPage, updatePage } from '../controllers/page.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';
import { validateBody, validateParams } from '../middleware/validation.middleware';
import { createPageSchema, updatePageSchema } from '../schemas/page.schema';
import { z } from 'zod';

const router = Router();

const idParamSchema = z.object({ id: z.string().cuid('Invalid ID') });

router.post('/', authenticateJWT, validateBody(createPageSchema), createPage);
router.get('/', authenticateJWT, getPages);
router.get('/:id', authenticateJWT, validateParams(idParamSchema), getPage);
router.put('/:id', authenticateJWT, validateParams(idParamSchema), validateBody(updatePageSchema), updatePage);

export default router;
