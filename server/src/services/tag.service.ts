import prisma from '../lib/prisma';
import { NotFoundError } from '../utils/errors';
import type { CreateTagInput } from '@task-manager/shared';

export async function createTag(userId: string, input: CreateTagInput) {
  const tag = await prisma.tag.create({
    data: {
      name: input.name,
      color: input.color ?? '#a855f7',
      userId,
    },
    select: {
      id: true,
      name: true,
      color: true,
      userId: true,
      createdAt: true,
    },
  });

  return {
    id: tag.id,
    name: tag.name,
    color: tag.color,
    userId: tag.userId,
    createdAt: tag.createdAt.toISOString(),
  };
}

export async function getTags(userId: string) {
  const tags = await prisma.tag.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      color: true,
      userId: true,
      createdAt: true,
      _count: { select: { taskTags: true } },
    },
  });

  return tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    color: tag.color,
    userId: tag.userId,
    createdAt: tag.createdAt.toISOString(),
    taskCount: tag._count.taskTags,
  }));
}

export async function getTagById(userId: string, tagId: string) {
  const tag = await prisma.tag.findFirst({
    where: { id: tagId, userId },
    select: {
      id: true,
      name: true,
      color: true,
      userId: true,
      createdAt: true,
    },
  });

  if (!tag) {
    throw new NotFoundError('Tag', tagId);
  }

  return {
    id: tag.id,
    name: tag.name,
    color: tag.color,
    userId: tag.userId,
    createdAt: tag.createdAt.toISOString(),
  };
}

export async function updateTag(userId: string, tagId: string, input: { name?: string; color?: string }) {
  const existing = await prisma.tag.findFirst({
    where: { id: tagId, userId },
  });

  if (!existing) {
    throw new NotFoundError('Tag', tagId);
  }

  const tag = await prisma.tag.update({
    where: { id: tagId },
    data: input,
    select: {
      id: true,
      name: true,
      color: true,
      userId: true,
      createdAt: true,
    },
  });

  return {
    id: tag.id,
    name: tag.name,
    color: tag.color,
    userId: tag.userId,
    createdAt: tag.createdAt.toISOString(),
  };
}

export async function deleteTag(userId: string, tagId: string) {
  const existing = await prisma.tag.findFirst({
    where: { id: tagId, userId },
  });

  if (!existing) {
    throw new NotFoundError('Tag', tagId);
  }

  await prisma.tag.delete({ where: { id: tagId } });
}
