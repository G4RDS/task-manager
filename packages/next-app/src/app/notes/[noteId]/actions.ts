'use server';

import { redirect } from 'next/navigation';
import { prisma } from 'database';
import { getUser } from '../../../utils/nextAuth';

export const deleteNoteAndRedirect = async (noteId: string) => {
  const user = await getUser();

  await prisma.note.delete({
    where: {
      noteId,
      authorId: user.id,
    },
  });

  redirect(`/notes`);
};

export const deleteTask = async (taskId: string) => {
  const user = await getUser();

  await prisma.task.delete({
    where: {
      taskId,
      note: {
        authorId: user.id,
      },
    },
  });
};
