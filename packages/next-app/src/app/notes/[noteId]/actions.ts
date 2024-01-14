'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from 'database';
import { getUserOrThrow } from '../../../utils/nextAuth';

export const deleteNoteAndRedirect = async (noteId: string) => {
  const user = await getUserOrThrow();

  await prisma.note.delete({
    where: {
      noteId,
      authorId: user.id,
    },
  });

  redirect(`/notes`);
};

export const deleteTask = async (taskId: string) => {
  const user = await getUserOrThrow();

  await prisma.task.delete({
    where: {
      taskId,
      note: {
        authorId: user.id,
      },
    },
  });

  revalidatePath('/');
};
