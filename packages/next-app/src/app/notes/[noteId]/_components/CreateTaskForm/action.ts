'use server';

import { prisma } from 'database';
import { createTask } from '../../../../../serverUtils/task';
import { getUserOrThrow } from '../../../../../utils/nextAuth';

export const createTaskAction = async (formData: FormData) => {
  const user = await getUserOrThrow();

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

  await createTask(user.id, noteId, title);
};
