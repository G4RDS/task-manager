import Link from 'next/link';
import { prisma } from 'database';
import { flex } from '../../../../../../styled-system/patterns';
import { TaskCard } from './TaskCard';

interface Props {
  noteId: string;
}
export const TaskCardList = async ({ noteId }: Props) => {
  const tasks = await prisma.task.findMany({
    select: {
      taskId: true,
      title: true,
      status: true,
      contentHtml: true,
    },
    where: {
      noteId,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <ul className={flex({ flexDir: 'column', gap: 3 })}>
      {tasks.map((task) => (
        <li key={task.taskId}>
          <Link href={`/tasks/${task.taskId}`}>
            <TaskCard task={task} />
          </Link>
        </li>
      ))}
    </ul>
  );
};
