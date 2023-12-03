import { prisma } from 'database';
import { Header } from '../_components/Header/Header';
import { MainContents } from '../_components/MainContents/MainContents';
import { OrderableTaskList } from './_components/OrderableTaskList';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const tasks = await prisma.task.findMany({
    select: {
      taskId: true,
      title: true,
      status: true,
      order: true,
      createdAt: true,
      note: {
        select: {
          noteId: true,
          title: true,
        },
      },
    },
    where: {},
    orderBy: {
      order: 'asc',
    },
  });

  return (
    <>
      <Header titleEl={<h1>Dashboard</h1>} />
      <MainContents>
        <OrderableTaskList tasks={tasks} />
      </MainContents>
    </>
  );
}
