import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middlewares/auth';
import * as tagService from '../services/tag.service';

export const create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tag = await tagService.createTag(req.userId!, req.body);
  res.status(201).json({ success: true, data: tag });
});

export const list = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tags = await tagService.getTags(req.userId!);
  res.json({ success: true, data: tags });
});

export const getById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tag = await tagService.getTagById(req.userId!, req.params.id);
  res.json({ success: true, data: tag });
});

export const update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const tag = await tagService.updateTag(req.userId!, req.params.id, req.body);
  res.json({ success: true, data: tag });
});

export const remove = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await tagService.deleteTag(req.userId!, req.params.id);
  res.json({ success: true, data: { message: 'Tag deleted successfully' } });
});
