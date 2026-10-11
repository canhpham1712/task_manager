import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { loginSchema, registerSchema } from '@task-manager/shared';

const router = Router();

// Public routes
router.post('/register', validate({ body: registerSchema }), authController.register);
router.post('/login', validate({ body: loginSchema }), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', authenticate, authController.getMe);

export default router;
