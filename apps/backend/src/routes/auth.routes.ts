import { Router } from 'express';
import { register, login, refreshAccessToken, logout } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validation.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply rate limiting to auth endpoints
router.post('/register', authLimiter, validateBody(registerSchema), register);
router.post('/login', authLimiter, validateBody(loginSchema), login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logout);

export default router;
