'use server';

import { redirect } from 'next/navigation';
import { deleteNote } from '../../../../../serverUtils/note';
import { getUserOrThrow } from '../../../../../utils/nextAuth';

export const deleteNoteAction = async (noteId: string) => {
  const user = await getUserOrThrow();
  await deleteNote(user.id, noteId);
  redirect('/notes');
};
