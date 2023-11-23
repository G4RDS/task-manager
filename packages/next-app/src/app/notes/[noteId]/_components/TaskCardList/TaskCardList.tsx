import Link from 'next/link';
import { prisma } from 'database';
import { css } from '../../../../../../styled-system/css';
import { flex } from '../../../../../../styled-system/patterns';

interface Props {
  noteId: string;
}
export const TaskCardList = async ({ noteId }: Props) => {
  const tasks = await prisma.task.findMany({
    select: {
      id: true,
      title: true,
      status: true,
      contentHtml: true,
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
          <Link href={`/tasks/${task.id}`}>
            <article
              className={css({
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
              <h1
                className={css({
                  mt: 2,
                  mb: 1,
                  ml: '2px',
                  color: 'gray.900',
                  fontSize: '1.25rem',
                  lineHeight: 1.3,
                  fontWeight: 600,
                })}
              >
                {task.title}
              </h1>
              {task.contentHtml && (
                <div
                  dangerouslySetInnerHTML={{ __html: task.contentHtml }}
                  className={css({
                    mt: 4,
                    '& p': {
                      my: '1px',
                      py: '1px',
                    },
                    '& h2': {
                      mt: '1rem',
                      mb: '4px',
                      py: '1px',
                      fontSize: '1.125rem',
                      lineHeight: 1.3,
                      fontWeight: 600,
                    },
                    '& h3': {
                      mt: '0.7rem',
                      mb: '1px',
                      py: '1px',
                      fontSize: '1.0625rem',
                      lineHeight: 1.3,
                      fontWeight: 600,
                    },
                    '& h4': {
                      mt: '0.5rem',
                      mb: '1px',
                      py: '1px',
                      fontSize: '1rem',
                      lineHeight: 1.3,
                      fontWeight: 600,
                    },
                    '& ul li': {
                      position: 'relative',
                      my: '1px',
                      pl: '1.625rem',
                      _before: {
                        content: '"•"',
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        w: '1.625rem',
                        py: '1px',
                        textAlign: 'center',
                        fontFamily: 'Arial',
                        fontSize: '1.5rem',
                        lineHeight: '1.5rem',
                      },
                    },
                  })}
                />
              )}
            </article>
          </Link>
        </li>
      ))}
    </ul>
  );
};
