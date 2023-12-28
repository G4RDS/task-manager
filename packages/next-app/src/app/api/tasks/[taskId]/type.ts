import { Note, Task } from 'database';
import { z } from 'zod';
import { taskStatusSchema } from '../../../../utils/taskStatus';

export const getTaskResponseSchema = z.object({
  data: z.object({
    taskId: z.string().uuid(),
    title: z.string(),
    status: taskStatusSchema,
    order: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    noteId: z.string().uuid(),
  }),
});

export type GetTaskResponse = z.infer<typeof getTaskResponseSchema>;

export const putTaskRequestSchema = z.object({
  title: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  order: z.string(),
});

export type PutTaskRequest = z.infer<typeof putTaskRequestSchema>;

export type PutTaskResponse = {
  data: Pick<Task, 'taskId' | 'title' | 'status' | 'createdAt' | 'updatedAt'> &
    Pick<Note, 'noteId'>;
};
