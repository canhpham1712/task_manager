import prisma from '../lib/prisma';
import { NotFoundError } from '../utils/errors';
import { Prisma } from '@prisma/client';
import type { CreateTaskInput, UpdateTaskInput, TaskQueryParams, TaskResponse } from '@task-manager/shared';

interface TaskWithRelations {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  projectId: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  project: { id: string; name: string; color: string | null } | null;
  taskTags: Array<{ tag: { id: string; name: string; color: string | null } }>;
}

function formatTaskResponse(task: TaskWithRelations): TaskResponse {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as TaskResponse['status'],
    priority: task.priority as TaskResponse['priority'],
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    projectId: task.projectId,
    userId: task.userId,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    project: task.project
      ? {
          id: task.project.id,
          name: task.project.name,
          color: task.project.color,
          description: null,
          userId: task.userId,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
        }
      : null,
    tags: task.taskTags.map((tt) => ({
      id: tt.tag.id,
      name: tt.tag.name,
      color: tt.tag.color,
      userId: task.userId,
      createdAt: task.createdAt.toISOString(),
    })),
  };
}

export async function createTask(userId: string, input: CreateTaskInput) {
  const { tagIds, ...taskData } = input;

  const task = await prisma.task.create({
    data: {
      ...taskData,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      userId,
      taskTags:
        tagIds && tagIds.length > 0
          ? {
              create: tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
    },
    include: {
      project: {
        select: { id: true, name: true, color: true },
      },
      taskTags: {
        include: {
          tag: { select: { id: true, name: true, color: true } },
        },
      },
    },
  });

  return formatTaskResponse(task);
}

export async function getTasks(userId: string, params: TaskQueryParams) {
  const {
    page = 1,
    limit = 20,
    status,
    priority,
    projectId,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = params;

  const where: Prisma.TaskWhereInput = { userId };

  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (projectId) where.projectId = projectId;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        project: { select: { id: true, name: true, color: true } },
        taskTags: {
          include: { tag: { select: { id: true, name: true, color: true } } },
        },
      },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    items: tasks.map(formatTaskResponse),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getTaskById(userId: string, taskId: string) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
    include: {
      project: { select: { id: true, name: true, color: true } },
      taskTags: {
        include: { tag: { select: { id: true, name: true, color: true } } },
      },
    },
  });

  if (!task) {
    throw new NotFoundError('Task', taskId);
  }

  return formatTaskResponse(task);
}

export async function updateTask(userId: string, taskId: string, input: UpdateTaskInput) {
  const existing = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!existing) {
    throw new NotFoundError('Task', taskId);
  }

  const { tagIds, ...taskData } = input;

  // If tagIds provided, replace all tags
  if (tagIds !== undefined) {
    await prisma.taskTag.deleteMany({ where: { taskId } });
    if (tagIds.length > 0) {
      await prisma.taskTag.createMany({
        data: tagIds.map((tagId) => ({ taskId, tagId })),
      });
    }
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...taskData,
      dueDate:
        taskData.dueDate === null
          ? null
          : taskData.dueDate
            ? new Date(taskData.dueDate)
            : undefined,
    },
    include: {
      project: { select: { id: true, name: true, color: true } },
      taskTags: {
        include: { tag: { select: { id: true, name: true, color: true } } },
      },
    },
  });

  return formatTaskResponse(task);
}

export async function deleteTask(userId: string, taskId: string) {
  const existing = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!existing) {
    throw new NotFoundError('Task', taskId);
  }

  await prisma.task.delete({ where: { id: taskId } });
}
