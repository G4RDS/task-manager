'use server';

import { redirect } from 'next/navigation';
import { createNote } from '../../../../serverUtils/note';
import { getUserOrThrow } from '../../../../utils/nextAuth';

export const createNoteAndRedirectAction = async (formData: FormData) => {
  const user = await getUserOrThrow();

  const formDataTitle = formData.get('title');
  if (typeof formDataTitle !== 'string' || formDataTitle === '') {
    throw new Error('Title is invalid');
  }

  const note = await createNote(user.id, formDataTitle);

  redirect(`/notes/${note.noteId}`);
};
