import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { prisma } from 'database';
import { getUserOrThrow } from '../../utils/nextAuth';
import { queries } from '../../utils/query';
import { Header } from '../_components/Header/Header';
import { MainContents } from '../_components/MainContents/MainContents';
import { OrderableTaskList } from './_components/OrderableTaskList';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const user = await getUserOrThrow();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queries.getTasks().queryKey,
    queryFn: () =>
      prisma.task.findMany({
        select: {
          taskId: true,
          title: true,
          status: true,
          order: true,
          createdAt: true,
          updatedAt: true,
          note: {
            select: {
              noteId: true,
              title: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        where: {
          note: {
            authorId: user.id,
          },
        },
        orderBy: {
          order: 'asc',
        },
      }),
  });

  return (
    <>
      <Header titleEl={<h1>Dashboard</h1>} />
      <MainContents>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <OrderableTaskList />
        </HydrationBoundary>
      </MainContents>
    </>
  );
}
