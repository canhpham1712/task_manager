import { Router } from 'express';
import authRoutes from './auth.routes';
import taskRoutes from './task.routes';
import projectRoutes from './project.routes';
import tagRoutes from './tag.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/projects', projectRoutes);
router.use('/tags', tagRoutes);

export default router;
