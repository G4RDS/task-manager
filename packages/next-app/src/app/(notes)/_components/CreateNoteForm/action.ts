'use server';

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
  redirect(`/notes/${note.id}`);

  return ++state;
};
