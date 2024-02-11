import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getUserOrThrow } from '../../utils/nextAuth';
import { createQueryClient, queries } from '../../utils/query';
import { Header } from '../_components/Header/Header';
import { MainContents } from '../_components/MainContents/MainContents';
import { getTasks } from '../api/tasks/query';
import { OrderableTaskList } from './_components/OrderableTaskList';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const user = await getUserOrThrow();
  const queryClient = createQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queries.getTasks().queryKey,
    queryFn: async () => (await getTasks(user.id)).data,
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
