import {
  QueryClient,
  UndefinedInitialDataOptions,
} from '@tanstack/react-query';
import { getTasksForNoteResponseSchema } from '../app/api/notes/[noteId]/tasks/type';
import { getTaskResponseSchema } from '../app/api/tasks/[taskId]/type';
import { getTasksResponseSchema } from '../app/api/tasks/type';

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
            throw new Error('Failed to fetch');
          }
          return getTasksResponseSchema.parse(await res.json()).data;
        }),
    }) as const,
  getTasksForNote: (noteId: string) =>
    ({
      queryKey: ['getTasksForNote', noteId],
      queryFn: async () =>
        fetch(`/api/notes/${noteId}/tasks`).then(async (res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch');
          }
          return getTasksForNoteResponseSchema.parse(await res.json()).data;
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

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: (failureCount, error) => {
          if (error instanceof NotFoundError) {
            return false;
          }
          return failureCount < 3;
        },
      },
    },
  });
};
