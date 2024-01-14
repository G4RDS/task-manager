import { prisma } from 'database';
import { getTaskResponseSchema } from './type';

export const getTask = async (userId: string, taskId: string) => {
  const task = await prisma.task.findUnique({
    select: {
      taskId: true,
      title: true,
      status: true,
      order: true,
      createdAt: true,
      updatedAt: true,
      noteId: true,
    },
    where: {
      taskId: taskId,
      note: {
        authorId: userId,
      },
    },
  });

  if (!task) {
    return;
  }
  return getTaskResponseSchema.parse({ data: task });
};
