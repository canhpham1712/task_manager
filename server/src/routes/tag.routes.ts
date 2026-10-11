import { Router } from 'express';
import * as tagController from '../controllers/tag.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createTagSchema } from '@task-manager/shared';
import { z } from 'zod';

const router = Router();

// All tag routes are protected
router.use(authenticate);

const idParamSchema = z.object({
  id: z.string().min(1),
});

router.get('/', tagController.list);
router.post('/', validate({ body: createTagSchema }), tagController.create);
router.get('/:id', validate({ params: idParamSchema }), tagController.getById);
router.patch('/:id', validate({ params: idParamSchema, body: createTagSchema.partial() }), tagController.update);
router.delete('/:id', validate({ params: idParamSchema }), tagController.remove);

export default router;
