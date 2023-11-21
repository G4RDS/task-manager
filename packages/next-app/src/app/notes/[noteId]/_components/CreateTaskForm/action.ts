'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from 'database';

export const createTask = async (state: number, formData: FormData) => {
  const formDataNoteId = formData.get('noteId');
  if (typeof formDataNoteId !== 'string' || formDataNoteId === '') {
    throw new Error('Note ID is invalid');
  }
  const formDataTitle = formData.get('title');
  if (typeof formDataTitle !== 'string' || formDataTitle === '') {
    throw new Error('Title is invalid');
  }

  const noteId = formDataNoteId;
  const title = formDataTitle;
  await prisma.task.create({
    data: {
      noteId,
      title,
    },
  });

  revalidatePath(`/notes/${noteId}`);

  return ++state;
};
