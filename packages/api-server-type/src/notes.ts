import { z } from 'zod';

export const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
});

export const getNotesQuerySchema = z.object({});

export const getNotesResponseSchema = z.object({
  data: z.array(noteSchema),
});
