import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from '@task-manager/shared';
import { z } from 'zod';

const router = Router();

// All task routes are protected
router.use(authenticate);

const idParamSchema = z.object({
  id: z.string().min(1),
});

router.get('/', validate({ query: taskQuerySchema }), taskController.list);
router.post('/', validate({ body: createTaskSchema }), taskController.create);
router.get('/:id', validate({ params: idParamSchema }), taskController.getById);
router.patch('/:id', validate({ params: idParamSchema, body: updateTaskSchema }), taskController.update);
router.delete('/:id', validate({ params: idParamSchema }), taskController.remove);

export default router;
