'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { flex } from '../../../../../../styled-system/patterns';
import { queries } from '../../../../../utils/query';
import { TaskCard } from './../../../../../components/TaskCard';

interface Props {
  noteId: string;
}
export const TaskCardList = ({ noteId }: Props) => {
  const { data: tasks } = useSuspenseQuery({
    ...queries.getTasksForNote(noteId),
  });

  return (
    <ul className={flex({ flexDir: 'column', gap: 3 })}>
      {tasks.map((task) => (
        <li key={task.taskId}>
          <TaskCard task={{ ...task }} />
        </li>
      ))}
    </ul>
  );
};
