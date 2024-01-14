'use server';

import { createTask } from '../../serverUtils/task';
import { getUserOrThrow } from '../../utils/nextAuth';

export const createTaskAction = async (noteId: string) => {
  const user = await getUserOrThrow();
  return createTask(user.id, noteId, '');
};
