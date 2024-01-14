import { prisma } from 'database';
import { getTasksForNoteResponseSchema } from './type';

export const getTasksForNote = async (userId: string, noteId: string) => {
  const tasks = await prisma.task.findMany({
    select: {
      taskId: true,
      title: true,
      status: true,
      order: true,
      createdAt: true,
      updatedAt: true,
    },
    where: {
      noteId,
      note: {
        authorId: userId,
      },
    },
    orderBy: {
      order: 'asc',
    },
  });

  return getTasksForNoteResponseSchema.parse({ data: tasks });
};
