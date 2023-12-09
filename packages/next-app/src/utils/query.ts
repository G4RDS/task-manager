import { UndefinedInitialDataOptions } from '@tanstack/react-query';
import { getTasksResponseSchema } from '../app/api/tasks/route';

export const queries = {
  getTasks: () =>
    ({
      queryKey: ['getTasks'],
      queryFn: async () => {
        const res = await fetch('/api/tasks').then((res) => res.json());
        return getTasksResponseSchema.parse(res).data;
      },
    }) as const,
} as const satisfies Record<
  string,
  (...args: unknown[]) => UndefinedInitialDataOptions
>;
