'use client';

import { css } from '../../../../../../styled-system/css';
import { grid } from '../../../../../../styled-system/patterns';
import { uiByTaskStatus } from '../../../../../utils/taskStatus';
import { GetTasksForNoteResponse } from '../../../../api/notes/[noteId]/tasks/type';

type Task = GetTasksForNoteResponse['data'][number];

interface Props {
  task: Task;
}
export const TaskCard = ({ task }: Props) => {
  return (
    <div
      className={grid({
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        gap: 2,
        h: 10,
        border: '1px solid token(colors.gray.100)',
        borderRadius: '14px',
        bgColor: '#fff',
        boxShadow: 'md',
        color: 'gray.700',
      })}
    >
      <div className={css({ width: 4, height: 4, ml: 3 })}>
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
