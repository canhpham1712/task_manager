import prisma from '../lib/prisma';
import { NotFoundError } from '../utils/errors';
import type { CreateProjectInput, UpdateProjectInput } from '@task-manager/shared';

interface ProjectWithCount {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  _count: { tasks: number };
}

interface ProjectResponse {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  taskCount: number;
}

function formatProjectResponse(project: ProjectWithCount): ProjectResponse {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    color: project.color,
    userId: project.userId,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    taskCount: project._count.tasks,
  };
}

export async function createProject(userId: string, input: CreateProjectInput) {
  const project = await prisma.project.create({
    data: {
      ...input,
      userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { tasks: true },
      },
    },
  });

  return formatProjectResponse(project);
}

export async function getProjects(userId: string) {
  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { tasks: true },
      },
    },
  });

  return projects.map(formatProjectResponse);
}

export async function getProjectById(userId: string, projectId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { tasks: true },
      },
    },
  });

  if (!project) {
    throw new NotFoundError('Project', projectId);
  }

  return formatProjectResponse(project);
}

export async function updateProject(userId: string, projectId: string, input: UpdateProjectInput) {
  const existing = await prisma.project.findFirst({
    where: { id: projectId, userId },
  });

  if (!existing) {
    throw new NotFoundError('Project', projectId);
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data: input,
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { tasks: true },
      },
    },
  });

  return formatProjectResponse(project);
}

export async function deleteProject(userId: string, projectId: string) {
  const existing = await prisma.project.findFirst({
    where: { id: projectId, userId },
  });

  if (!existing) {
    throw new NotFoundError('Project', projectId);
  }

  await prisma.project.delete({ where: { id: projectId } });
}
