'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from 'database';
import { generateKeyBetween } from 'fractional-indexing';

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

  const firstTask = await prisma.task.findFirst({
    select: {
      order: true,
    },
    orderBy: {
      order: 'asc',
    },
  });
  const minimumOrder = generateKeyBetween(undefined, firstTask?.order);
  await prisma.task.create({
    data: {
      noteId,
      title,
      order: minimumOrder,
    },
  });

  revalidatePath(`/notes/${noteId}`);

  return ++state;
};
