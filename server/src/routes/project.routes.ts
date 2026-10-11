import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createProjectSchema, updateProjectSchema } from '@task-manager/shared';
import { z } from 'zod';

const router = Router();

// All project routes are protected
router.use(authenticate);

const idParamSchema = z.object({
  id: z.string().min(1),
});

router.get('/', projectController.list);
router.post('/', validate({ body: createProjectSchema }), projectController.create);
router.get('/:id', validate({ params: idParamSchema }), projectController.getById);
router.patch('/:id', validate({ params: idParamSchema, body: updateProjectSchema }), projectController.update);
router.delete('/:id', validate({ params: idParamSchema }), projectController.remove);

export default router;
