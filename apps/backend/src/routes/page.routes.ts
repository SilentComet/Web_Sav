import { Router } from 'express';
import { createPage, getPages, getPage, updatePage } from '../controllers/page.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateJWT, createPage);
router.get('/', authenticateJWT, getPages);
router.get('/:id', authenticateJWT, getPage);
router.put('/:id', authenticateJWT, updatePage);

export default router;
