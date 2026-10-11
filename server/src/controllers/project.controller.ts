import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middlewares/auth';
import * as projectService from '../services/project.service';

export const create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const project = await projectService.createProject(req.userId!, req.body);
  res.status(201).json({ success: true, data: project });
});

export const list = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const projects = await projectService.getProjects(req.userId!);
  res.json({ success: true, data: projects });
});

export const getById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const project = await projectService.getProjectById(req.userId!, req.params.id);
  res.json({ success: true, data: project });
});

export const update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const project = await projectService.updateProject(req.userId!, req.params.id, req.body);
  res.json({ success: true, data: project });
});

export const remove = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await projectService.deleteProject(req.userId!, req.params.id);
  res.json({ success: true, data: { message: 'Project deleted successfully' } });
});
