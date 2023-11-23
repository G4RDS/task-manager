import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from 'database';
import { css } from '../../../../styled-system/css';
import { flex } from '../../../../styled-system/patterns';
import { NoteIcon } from '../../../components/icons/NoteIcon';
import { TaskIcon } from '../../../components/icons/TaskIcon';
import { Header } from '../../_components/Header/Header';
import { MainContents } from '../../_components/MainContents/MainContents';
import { TaskEditor } from './_components/TaskEditor/TaskEditor';

export default async function Page({ params }: { params: { taskId: string } }) {
  const task = await prisma.task.findUnique({
    select: {
      title: true,
      note: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    where: {
      id: params.taskId,
    },
  });

  if (!task) {
    notFound();
  }

  return (
    <>
      <Header
        titleEl={
          <ol
            className={flex({
              alignItems: 'center',
              '& > li': {
                position: 'relative',
                pr: 6,
                color: 'gray.700',
                fontWeight: 400,
                _after: {
                  content: '"/"',
                  position: 'absolute',
                  top: '50%',
                  right: 0,
                  transform: 'translate(0, -50%)',
                  w: 6,
                  color: 'gray.200',
                  textAlign: 'center',
                },
                _last: {
                  pr: 0,
                  _after: {
                    display: 'none',
                  },
                },
              },
            })}
          >
            <li>
              <Link
                href="/notes"
                className={css({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  mr: -2,
                  py: 1,
                  px: 2,
                  borderRadius: '6px',
                  transition: '0.15s token(easings.easeOut)',
                  color: 'inherit',
                  _hover: {
                    bgColor: 'gray.100',
                  },
                })}
              >
                <NoteIcon className={css({ w: 4, h: 4, color: 'gray.500' })} />
                Notes
              </Link>
            </li>
            <li>
              <Link
                href={`/notes/${task.note.id}`}
                className={css({
                  mx: -2,
                  py: 1,
                  px: 2,
                  borderRadius: '6px',
                  transition: '0.15s token(easings.easeOut)',
                  color: 'inherit',
                  _hover: {
                    bgColor: 'gray.100',
                  },
                })}
              >
                {task.note.title}
              </Link>
            </li>
            <li
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              })}
            >
              <TaskIcon className={css({ w: 4, h: 4, color: 'gray.500' })} />
              {task.title}
            </li>
          </ol>
        }
      />
      <MainContents
        className={css({
          p: '48px',
        })}
      >
        <TaskEditor taskId={params.taskId} />
      </MainContents>
    </>
  );
}
