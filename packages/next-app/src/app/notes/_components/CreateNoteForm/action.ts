'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from 'database';

export const createNoteAndRedirect = async (
  state: number,
  formData: FormData,
) => {
  const formDataTitle = formData.get('title');
  if (typeof formDataTitle !== 'string' || formDataTitle === '') {
    throw new Error('Title is invalid');
  }

  const title = formDataTitle;
  const note = await prisma.note.create({
    data: {
      title,
    },
  });

  revalidatePath('/');
  redirect(`/notes/${note.noteId}`);

  return ++state;
};
