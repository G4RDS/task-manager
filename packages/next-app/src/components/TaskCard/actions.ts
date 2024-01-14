'use server';

import { deleteTask } from '../../serverUtils/task';
import { getUserOrThrow } from '../../utils/nextAuth';

export const deleteTaskAction = async (taskId: string) => {
  const user = await getUserOrThrow();
  return deleteTask(user.id, taskId);
};
