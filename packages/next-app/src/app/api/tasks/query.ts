import { prisma } from 'database';
import { getTasksResponseSchema } from './type';

export const getTasks = async (userId: string) => {
  const tasks = await prisma.task.findMany({
    select: {
      taskId: true,
      title: true,
      status: true,
      order: true,
      createdAt: true,
      updatedAt: true,
      note: {
        select: {
          noteId: true,
          title: true,
          createdAt: true,
          updatedAt: true,
        },
      },
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

  return getTasksResponseSchema.parse({ data: tasks });
};
