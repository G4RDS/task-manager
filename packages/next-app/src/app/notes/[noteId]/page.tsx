import { notFound } from 'next/navigation';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { prisma } from 'database';
import { css } from '../../../../styled-system/css';
import { flex } from '../../../../styled-system/patterns';
import { NoteIcon } from '../../../components/icons/NoteIcon';
import { getUserOrThrow } from '../../../utils/nextAuth';
import { createQueryClient, queries } from '../../../utils/query';
import { Header } from '../../_components/Header/Header';
import { MainContents } from '../../_components/MainContents/MainContents';
import { getTasksForNote } from '../../api/notes/[noteId]/tasks/query';
import { getTask } from '../../api/tasks/[taskId]/query';
import { NoteActionMenu } from './_components/NoteActionMenu/NoteActionMenu';
import { NoteEditor } from './_components/NoteEditor/NoteEditor';

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

  const queryClient = createQueryClient();

  const taskIds = await prisma.task.findMany({
    select: {
      taskId: true,
    },
    where: {
      noteId: params.noteId,
    },
  });

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queries.getTasksForNote(params.noteId).queryKey,
      queryFn: async () => (await getTasksForNote(user.id, params.noteId)).data,
    }),
    ...taskIds.map(({ taskId }) =>
      queryClient.prefetchQuery({
        queryKey: queries.getTask(taskId).queryKey,
        queryFn: async () => {
          const task = await getTask(user.id, taskId);
          if (!task) {
            throw new Error('Task not found');
          }
          return task.data;
        },
      }),
    ),
  ]);

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
      <MainContents>
        <NoteEditor noteId={params.noteId} />
      </MainContents>
    </HydrationBoundary>
  );
}
