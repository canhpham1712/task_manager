import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middlewares/auth';
import * as taskService from '../services/task.service';

export const create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const task = await taskService.createTask(req.userId!, req.body);
  res.status(201).json({ success: true, data: task });
});

export const list = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await taskService.getTasks(req.userId!, req.query as Record<string, string>);
  res.json({ success: true, data: result });
});

export const getById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const task = await taskService.getTaskById(req.userId!, req.params.id);
  res.json({ success: true, data: task });
});

export const update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const task = await taskService.updateTask(req.userId!, req.params.id, req.body);
  res.json({ success: true, data: task });
});

export const remove = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await taskService.deleteTask(req.userId!, req.params.id);
  res.json({ success: true, data: { message: 'Task deleted successfully' } });
});
