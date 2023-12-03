import { GetTaskResponse } from '../app/api/tasks/[taskId]/route';

export const swrKeyAndFetcher = {
  getTask: (id: string) =>
    [
      ['getTask', id],
      ([, id]: [string, string]): Promise<GetTaskResponse> => {
        return fetch(`/api/tasks/${id}`).then((res) => res.json());
      },
    ] as const,
};
