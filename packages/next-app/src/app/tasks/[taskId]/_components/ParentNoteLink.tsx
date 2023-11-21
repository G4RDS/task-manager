import Link from 'next/link';
import { prisma } from 'database';
import { css } from '../../../../../styled-system/css';

interface Props {
  taskId: string;
}
export const ParentNoteLink = async ({ taskId }: Props) => {
  const { note } = await prisma.task.findUniqueOrThrow({
    select: {
      note: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    where: {
      id: taskId,
    },
  });

  return (
    <Link
      href={`/notes/${note.id}`}
      className={css({
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        mt: -1,
        ml: -1,
        py: 1,
        pl: 1,
        pr: 3,
        borderRadius: '6px',
        color: 'gray.800',
        transition: '150ms token(easings.easeOut)',
        _hover: {
          bgColor: 'gray.100',
        },
      })}
    >
      <ChevronLeftIcon className={css({ height: '20px' })} />
      {note.title}
    </Link>
  );
};

const ChevronLeftIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
    </svg>
  );
};
