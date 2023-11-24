import { notFound } from 'next/navigation';
import { prisma } from 'database';
import { css } from '../../../../styled-system/css';
import { flex } from '../../../../styled-system/patterns';
import { NoteIcon } from '../../../components/icons/NoteIcon';
import { Header } from '../../_components/Header/Header';
import { MainContents } from '../../_components/MainContents/MainContents';
import { CreateTaskForm } from './_components/CreateTaskForm/CreateTaskForm';
import { NoteEditor } from './_components/NoteEditor/NoteEditor';
import { TaskCardList } from './_components/TaskCardList/TaskCardList';

export default async function Page({ params }: { params: { noteId: string } }) {
  const note = await prisma.note.findUnique({
    select: {
      title: true,
    },
    where: {
      id: params.noteId,
    },
  });

  if (!note) {
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
                  _after: {
                    display: 'none',
                  },
                },
              },
            })}
          >
            <li
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              })}
            >
              <NoteIcon className={css({ w: 4, h: 4, color: 'gray.500' })} />
              {note.title}
            </li>
          </ol>
        }
      />
      <MainContents
        className={css({
          p: '48px',
        })}
      >
        <NoteEditor noteId={params.noteId} />
        <div
          className={css({
            mt: 4,
          })}
        >
          <CreateTaskForm noteId={params.noteId} />
        </div>
        <div
          className={css({
            mt: 3,
          })}
        >
          <TaskCardList noteId={params.noteId} />
        </div>
      </MainContents>
    </>
  );
}
