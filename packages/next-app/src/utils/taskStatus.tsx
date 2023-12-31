import { ReactNode } from 'react';
import { TaskStatus } from 'database';
import { z } from 'zod';
import { DoneIcon } from '../components/icons/taskStatus/DoneIcon';
import { InProgressIcon } from '../components/icons/taskStatus/InProgressIcon';
import { TodoIcon } from '../components/icons/taskStatus/TodoIcon';

export const uiByTaskStatus: Record<
  TaskStatus,
  {
    icon: ReactNode;
    label: string;
  }
> = {
  TODO: {
    icon: <TodoIcon />,
    label: 'Todo',
  },
  IN_PROGRESS: {
    icon: <InProgressIcon />,
    label: 'InProgress',
  },
  DONE: {
    icon: <DoneIcon />,
    label: 'Done',
  },
};

export const taskStatusSchema = z.enum(['TODO', 'IN_PROGRESS', 'DONE']);
