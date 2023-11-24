import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from 'database';
import { css } from '../../../../styled-system/css';
import { flex } from '../../../../styled-system/patterns';
import { NoteIcon } from '../../../components/icons/NoteIcon';
import { TaskIcon } from '../../../components/icons/TaskIcon';
import { Header } from '../../_components/Header/Header';
import { MainContents } from '../../_components/MainContents/MainContents';
import { Status } from './_components/Status';
import { TaskEditor } from './_components/TaskEditor/TaskEditor';

export default async function Page({ params }: { params: { taskId: string } }) {
  const task = await prisma.task.findUnique({
    select: {
      title: true,
      status: true,
      note: {
        select: {
          noteId: true,
          title: true,
        },
      },
    },
    where: {
      taskId: params.taskId,
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
                href={`/notes/${task.note.noteId}`}
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
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
                <NoteIcon
                  className={css({
                    flex: '0 0 auto',
                    w: 4,
                    h: 4,
                    color: 'gray.500',
                  })}
                />
                <span className={css({ flex: 1, ellipsis: '1' })}>
                  {task.note.title}
                </span>
              </Link>
            </li>
            <li
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              })}
            >
              <TaskIcon
                className={css({
                  flex: '0 0 auto',
                  w: 4,
                  h: 4,
                  color: 'gray.500',
                })}
              />
              <span className={css({ flex: 1, ellipsis: '1' })}>
                {task.title}
              </span>
            </li>
          </ol>
        }
      />
      <MainContents>
        <div
          className={css({
            px: 10,
            py: 4,
            borderBottom: '1px solid token(colors.gray.100)',
          })}
        >
          <Status taskId={params.taskId} status={task.status} />
        </div>
        <div
          className={css({
            px: 12,
            py: 8,
          })}
        >
          <TaskEditor taskId={params.taskId} />
        </div>
      </MainContents>
    </>
  );
}
