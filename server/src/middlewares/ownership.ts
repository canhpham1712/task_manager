import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { ForbiddenError, NotFoundError } from '../utils/errors';
import prisma from '../lib/prisma';

type ResourceModel = 'task' | 'project' | 'tag';

export function checkOwnership(resourceType: ResourceModel, idParam = 'id') {
  return async (req: AuthenticatedRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const resourceId = req.params[idParam];
      const userId = req.userId;

      if (!userId) {
        throw new ForbiddenError();
      }

      let resource: { userId: string } | null = null;

      switch (resourceType) {
        case 'task':
          resource = await prisma.task.findUnique({
            where: { id: resourceId },
            select: { userId: true },
          });
          break;
        case 'project':
          resource = await prisma.project.findUnique({
            where: { id: resourceId },
            select: { userId: true },
          });
          break;
        case 'tag':
          resource = await prisma.tag.findUnique({
            where: { id: resourceId },
            select: { userId: true },
          });
          break;
      }

      if (!resource) {
        throw new NotFoundError(resourceType, resourceId);
      }

      if (resource.userId !== userId) {
        throw new ForbiddenError('You do not have permission to access this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
