import { z } from 'zod';
import { taskStatusSchema } from '../../../../../utils/taskStatus';

export const getTasksForNoteResponseSchema = z.object({
  data: z.array(
    z.object({
      taskId: z.string().uuid(),
      title: z.string(),
      status: taskStatusSchema,
      order: z.string(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
    }),
  ),
});
