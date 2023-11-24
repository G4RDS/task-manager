import { z } from 'zod';

export const noteSchema = z.object({
  noteId: z.string(),
  title: z.string(),
});

export const getNotesQuerySchema = z.object({});

export const getNotesResponseSchema = z.object({
  data: z.array(noteSchema),
});
