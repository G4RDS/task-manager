import { prisma } from 'database';
import { flex } from '../../../../../../styled-system/patterns';
import { getUserOrThrow } from '../../../../../utils/nextAuth';
import { TaskCard } from './TaskCard';

interface Props {
  noteId: string;
}
export const TaskCardList = async ({ noteId }: Props) => {
  const user = await getUserOrThrow();

  const tasks = await prisma.task.findMany({
    select: {
      taskId: true,
      title: true,
      status: true,
    },
    where: {
      noteId,
      note: {
        authorId: user.id,
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <ul className={flex({ flexDir: 'column', gap: 3 })}>
      {tasks.map((task) => (
        <li key={task.taskId}>
          <TaskCard task={task} />
        </li>
      ))}
    </ul>
  );
};
