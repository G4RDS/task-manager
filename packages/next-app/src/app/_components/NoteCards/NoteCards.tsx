import Link from 'next/link';
import { prisma } from 'database';
import { css } from '../../../../styled-system/css';
import { flex } from '../../../../styled-system/patterns';
import { getUserOrThrow } from '../../../utils/nextAuth';

export const NoteCards = async () => {
  const user = await getUserOrThrow();

  const notes = await prisma.note.findMany({
    select: {
      noteId: true,
      title: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    where: {
      authorId: user.id,
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
        <li key={note.noteId}>
          <Link
            href={`/notes/${note.noteId}`}
            className={css({
              display: 'block',
              p: 3,
              border: '1px solid token(colors.gray.100)',
              borderRadius: '14px',
              bgColor: '#fff',
              color: 'gray.700',
              transition: '150ms token(easings.easeOut)',
              _hover: {
                boxShadow: 'sm',
              },
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
