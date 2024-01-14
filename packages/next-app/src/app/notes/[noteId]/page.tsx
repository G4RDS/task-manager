import { notFound } from 'next/navigation';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { prisma } from 'database';
import { css } from '../../../../styled-system/css';
import { flex } from '../../../../styled-system/patterns';
import { NoteIcon } from '../../../components/icons/NoteIcon';
import { getUserOrThrow } from '../../../utils/nextAuth';
import { queries } from '../../../utils/query';
import { Header } from '../../_components/Header/Header';
import { MainContents } from '../../_components/MainContents/MainContents';
import { getTasksForNote } from '../../api/notes/[noteId]/tasks/query';
import { CreateTaskForm } from './_components/CreateTaskForm/CreateTaskForm';
import { NoteActionMenu } from './_components/NoteActionMenu/NoteActionMenu';
import { NoteEditor } from './_components/NoteEditor/NoteEditor';
import { TaskCardList } from './_components/TaskCardList/TaskCardList';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { noteId: string } }) {
  const user = await getUserOrThrow();
  const note = await prisma.note.findUnique({
    select: {
      title: true,
    },
    where: {
      noteId: params.noteId,
      authorId: user.id,
    },
  });

  if (!note) {
    notFound();
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queries.getTasksForNote(params.noteId).queryKey,
    queryFn: async () => (await getTasksForNote(user.id, params.noteId)).data,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
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
        actionsEl={<NoteActionMenu noteId={params.noteId} />}
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
    </HydrationBoundary>
  );
}
