'use client';

import { Task } from 'database/src/utils/prisma';
import { css } from '../../../../../../styled-system/css';
import { flex } from '../../../../../../styled-system/patterns';
import { uiByTaskStatus } from '../../../../../utils/taskStatus';

interface Props {
  task: Pick<Task, 'taskId' | 'title' | 'status'>;
}
export const TaskCard = ({ task }: Props) => {
  return (
    <div
      className={flex({
        alignItems: 'center',
        gap: 2,
        p: 3,
        border: '1px solid token(colors.gray.100)',
        borderRadius: '14px',
        bgColor: '#fff',
        boxShadow: 'md',
        color: 'gray.700',
      })}
    >
      <div className={css({ width: 4, height: 4 })}>
        {uiByTaskStatus[task.status].icon}
      </div>
      <p
        className={css({
          fontSize: '0.9375rem',
          color: 'gray.900',
          fontWeight: 500,
        })}
      >
        {task.title}
      </p>
    </div>
  );
};
