import Link from 'next/link';
import { prisma } from 'database';
import { css, cx } from '../../../styled-system/css';
import { flex } from '../../../styled-system/patterns';
import { GrabDotsIcon } from '../../components/icons/GrabDotsIcon';
import { uiByTaskStatus } from '../../utils/taskStatus';
import { Header } from '../_components/Header/Header';
import { MainContents } from '../_components/MainContents/MainContents';

const thisYear = new Date().getFullYear();

const intlMonthDateFormat = new Intl.DateTimeFormat('ja-JP', {
  month: 'short',
  day: 'numeric',
});

const intlFullDateFormat = new Intl.DateTimeFormat('ja-JP', {
  dateStyle: 'short',
});

const formatCreatedAt = (createdAt: Date) => {
  if (createdAt.getFullYear() === thisYear) {
    return intlMonthDateFormat.format(createdAt);
  }
  return intlFullDateFormat.format(createdAt);
};

export default async function Page() {
  const tasks = await prisma.task.findMany({
    select: {
      taskId: true,
      title: true,
      status: true,
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
      updatedAt: 'desc',
    },
  });

  return (
    <>
      <Header titleEl={<h1>Dashboard</h1>} />
      <MainContents>
        {tasks.map((task) => (
          <Link
            href={`/tasks/${task.taskId}`}
            key={task.taskId}
            className={flex({
              alignItems: 'center',
              justifyContent: 'space-between',
              h: 12,
              pr: 3,
              borderBottom: '1px solid token(colors.gray.100)',
              color: 'inherit',
              transition: '150ms token(easings.easeOut)',
              _hover: {
                bg: 'token(colors.gray.50)',
                '& .grab-dots': {
                  opacity: 1,
                },
              },
            })}
          >
            <GrabDotsIcon
              className={cx(
                'grab-dots',
                css({
                  flex: '0 0 auto',
                  opacity: 0,
                  h: '10px',
                  mx: 3,
                  fill: 'gray.500',
                  transition: '150ms token(easings.easeOut)',
                }),
              )}
            />
            <div
              className={css({
                flex: '0 0 auto',
                w: 4,
                h: 4,
                mr: 3,
              })}
            >
              {uiByTaskStatus[task.status].icon}
            </div>
            <p
              className={css({
                maxW: 48,
                mr: 3,
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'gray.500',
                ellipsis: '1',
              })}
            >
              {task.note.title}
            </p>
            <p
              className={css({
                mr: 3,
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: 'gray.800',
                ellipsis: '1',
              })}
            >
              {task.title}
            </p>
            <div className={css({ flex: '1 1 0' })} />
            <p
              className={css({
                flex: '0 0 auto',
                fontSize: '0.75rem',
                color: 'gray.500',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {formatCreatedAt(task.createdAt)}
            </p>
          </Link>
        ))}
      </MainContents>
    </>
  );
}
