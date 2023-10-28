import { prisma } from 'database';
import { css, cx } from '../../../../styled-system/css';

export const NoteList = async ({ className }: { className?: string }) => {
  const notes = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  return (
    <ul
      className={cx(
        css({
          w: '240px',
        }),
        className,
      )}
    >
      {notes.map((note) => (
        <li
          className={css({
            w: '100%',
            p: '8px 16px',
            borderTop: '1px solid',
            borderColor: 'gray.100',
            _first: {
              borderTop: 'none',
            },
          })}
          key={note.id}
        >
          {note.title}
        </li>
      ))}
    </ul>
  );
};
