'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from 'database';
import { generateKeyBetween } from 'fractional-indexing';
import { getUser } from '../../../../../utils/nextAuth';

export const createTask = async (state: number, formData: FormData) => {
  const user = await getUser();

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

  if (!(await prisma.note.count({ where: { noteId, authorId: user.id } }))) {
    throw new Error('Note not found');
  }

  const firstTask = await prisma.task.findFirst({
    select: {
      order: true,
    },
    where: {
      note: {
        authorId: user.id,
      },
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
