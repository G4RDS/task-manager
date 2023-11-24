'use server';

import { revalidatePath } from 'next/cache';
import { TaskStatus, prisma } from 'database/src/utils/prisma';

export const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
  await prisma.task.update({
    data: { status },
    where: { taskId },
  });

  revalidatePath('/');
};
