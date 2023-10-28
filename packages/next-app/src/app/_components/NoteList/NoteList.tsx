import Link from 'next/link';
import { prisma } from 'database';
import { css } from '../../../../styled-system/css';
import { grid } from '../../../../styled-system/patterns';

export const NoteList = async () => {
  const notes = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  return (
    <ul
      className={grid({
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '16px',
      })}
    >
      {notes.map((note) => (
        <li key={note.id}>
          <Link
            href={`/notes/${note.id}`}
            className={css({
              display: 'block',
              p: '8px 8px 0 8px',
              borderRadius: '12px',
              boxShadow: 'md',
              color: 'gray.700',
            })}
          >
            <div
              className={css({
                aspectRatio: '16 / 9',
                backgroundColor: 'gray.100',
                borderRadius: '4px',
              })}
            />
            <div className={css({ py: '8px' })}>
              <p
                className={css({
                  fontSize: '14px',
                  lineHeight: 1.5,
                  fontWeight: 'bold',
                })}
              >
                {note.title}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};
