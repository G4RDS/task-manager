import Link from 'next/link';
import { prisma } from 'database';
import { css } from '../../../../../styled-system/css';
import { flex } from '../../../../../styled-system/patterns';

export const NoteCards = async () => {
  const notes = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <ul
      className={flex({
        flexDir: 'column',
        gap: 3,
      })}
    >
      {notes.map((note) => (
        <li key={note.id}>
          <Link
            href={`/notes/${note.id}`}
            className={css({
              display: 'block',
              p: 3,
              border: '1px solid token(colors.gray.200)',
              borderRadius: '14px',
              bgColor: '#fff',
              color: 'gray.700',
            })}
          >
            <p
              className={css({
                color: 'gray.900',
                fontSize: '16px',
                lineHeight: 1.3,
                fontWeight: 600,
              })}
            >
              {note.title}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
};
