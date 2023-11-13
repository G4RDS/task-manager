import Link from 'next/link';
import { prisma } from 'database';
import { css } from '../../../../../../../styled-system/css';
import { flex } from '../../../../../../../styled-system/patterns';

interface Props {
  noteId: string;
}
export const TaskCardList = async ({ noteId }: Props) => {
  const tasks = await prisma.task.findMany({
    select: {
      id: true,
      title: true,
      status: true,
    },
    where: {
      noteId: noteId,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <ul className={flex({ flexDir: 'column', gap: 3 })}>
      {tasks.map((task) => (
        <li key={task.id}>
          <Link
            href={`/tasks/${task.id}`}
            className={css({
              display: 'block',
              p: 3,
              border: '1px solid token(colors.gray.100)',
              borderRadius: '14px',
              bgColor: '#fff',
              boxShadow: 'md',
              color: 'gray.700',
            })}
          >
            {task.status === 'TODO' ? (
              <p
                className={css({
                  display: 'inline-flex',
                  alignItems: 'center',
                  width: 'auto',
                  height: 6,
                  px: 2,
                  backgroundColor: 'gray.200',
                  borderRadius: '6px',
                  color: 'gray.600',
                  fontSize: '12px',
                  fontWeight: 600,
                })}
              >
                TO-DO
              </p>
            ) : (
              <p>not implemented</p>
            )}
            <p
              className={css({
                mt: 2,
                mb: 1,
                ml: '2px',
                color: 'gray.900',
                fontSize: '16px',
                lineHeight: 1.3,
                fontWeight: 600,
              })}
            >
              {task.title}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
};
