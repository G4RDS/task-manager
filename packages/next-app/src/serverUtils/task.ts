import { revalidatePath } from 'next/cache';
import { prisma } from 'database';
import { generateKeyBetween } from 'fractional-indexing';

export const createTask = async (
  userId: string,
  noteId: string,
  title: string,
) => {
  const firstTask = await prisma.task.findFirst({
    select: {
      order: true,
    },
    where: {
      note: {
        authorId: userId,
      },
    },
    orderBy: {
      order: 'asc',
    },
  });
  const minimumOrder = generateKeyBetween(undefined, firstTask?.order);
  const task = await prisma.task.create({
    data: {
      title,
      noteId,
      order: minimumOrder,
    },
    select: {
      taskId: true,
      title: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      noteId: true,
    },
  });

  revalidatePath('/');

  return task;
};

export const deleteTask = async (userId: string, taskId: string) => {
  await prisma.task.delete({
    where: {
      taskId,
      note: {
        authorId: userId,
      },
    },
  });

  revalidatePath('/');
};
