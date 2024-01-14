import { revalidatePath } from 'next/cache';
import { prisma } from 'database';

export const createNote = async (userId: string, title: string) => {
  const note = await prisma.note.create({
    data: {
      title,
      authorId: userId,
    },
  });

  revalidatePath('/');

  return note;
};

export const deleteNote = async (userId: string, noteId: string) => {
  await prisma.note.delete({
    where: {
      noteId,
      authorId: userId,
    },
  });

  revalidatePath('/');
};
