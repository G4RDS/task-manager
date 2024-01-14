import { Note, Task } from 'database';
import { z } from 'zod';
import { taskStatusSchema } from '../../../utils/taskStatus';

export const getTasksResponseSchema = z.object({
  data: z.array(
    z.object({
      taskId: z.string().uuid(),
      title: z.string(),
      status: taskStatusSchema,
      order: z.string(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
      note: z.object({
        noteId: z.string().uuid(),
        title: z.string(),
        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date(),
      }),
    }),
  ),
});
export type GetTasksResponse = z.infer<typeof getTasksResponseSchema>;

export const postTaskRequestSchema = z.object({
  noteId: z.string().uuid(),
});

export type PostTaskRequest = z.infer<typeof postTaskRequestSchema>;

export type PostTaskResponse = {
  data: Pick<Task, 'taskId' | 'title' | 'status' | 'createdAt' | 'updatedAt'> &
    Pick<Note, 'noteId'>;
};
