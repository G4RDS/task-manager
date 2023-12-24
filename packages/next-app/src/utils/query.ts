import { UndefinedInitialDataOptions } from '@tanstack/react-query';
import { getTaskResponseSchema } from '../app/api/tasks/[taskId]/route';
import { getTasksResponseSchema } from '../app/api/tasks/route';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export const queries = {
  getTasks: () =>
    ({
      queryKey: ['getTasks'],
      queryFn: async () =>
        fetch('/api/tasks').then(async (res) => {
          if (!res.ok) {
            // TODO: Handle error
            throw new Error('Failed to fetch');
          }
          return getTasksResponseSchema.parse(await res.json()).data;
        }),
    }) as const,
  getTask: (taskId: string) => ({
    queryKey: ['getTask', taskId],
    queryFn: async () =>
      fetch(`/api/tasks/${taskId}`).then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new NotFoundError('Task not found');
          }
          throw new Error('Failed to fetch');
        }
        return getTaskResponseSchema.parse(await res.json()).data;
      }),
  }),
} as const satisfies Record<
  string,
  (...args: never[]) => UndefinedInitialDataOptions
>;
