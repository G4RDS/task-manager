'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Note, Task } from 'database/src/utils/prisma';
import { generateKeyBetween } from 'fractional-indexing';
import { css, cx } from '../../../../styled-system/css';
import { flex } from '../../../../styled-system/patterns';
import { GrabDotsIcon } from '../../../components/icons/GrabDotsIcon';
import { uiByTaskStatus } from '../../../utils/taskStatus';

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

interface Props {
  tasks: (Pick<Task, 'taskId' | 'title' | 'status' | 'order' | 'createdAt'> & {
    note: Pick<Note, 'noteId' | 'title'>;
  })[];
}

export const OrderableTaskList = ({ tasks }: Props) => {
  const [locallyOrderedTaskIds, setLocallyOrderedTaskIds] = useState(
    tasks.map((task) => task.taskId),
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragEnd = async (e: DragEndEvent) => {
    const activeTaskIndex = tasks.findIndex(
      (task) => task.taskId === e.active.id,
    );
    const activeTask = tasks[activeTaskIndex];
    const overTaskIndex = tasks.findIndex((task) => task.taskId === e.over?.id);
    const overTask = tasks[overTaskIndex];
    const nextTask =
      overTaskIndex < tasks.length - 1 ? tasks[overTaskIndex + 1] : undefined;

    if (!activeTask || !overTask || activeTask.taskId === overTask.taskId) {
      return;
    }

    setLocallyOrderedTaskIds(
      arrayMove(locallyOrderedTaskIds, activeTaskIndex, overTaskIndex),
    );

    // TODO: localもorderを更新しないと、二回目以降のドラッグが失敗する
    const newOrder = generateKeyBetween(overTask.order, nextTask?.order);
    await fetch(`/api/tasks/${activeTask.taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ order: newOrder }),
    });
  };

  const locallyOrderedTasks = useMemo(
    () =>
      locallyOrderedTaskIds.map((taskId) => {
        const task = tasks.find((task) => task.taskId === taskId);
        if (!task) {
          throw new Error(`Task not found: ${taskId}`);
        }
        return task;
      }),
    [locallyOrderedTaskIds, tasks],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={locallyOrderedTaskIds}
        strategy={verticalListSortingStrategy}
      >
        {locallyOrderedTasks.map((task) => (
          <TaskItem task={task} key={task.taskId} />
        ))}
      </SortableContext>
    </DndContext>
  );
};

const TaskItem = ({ task }: { task: Props['tasks'][number] }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.taskId });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
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
      {...attributes}
      {...listeners}
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
      <Link
        href={`/notes/${task.note.noteId}`}
        className={css({
          mr: 3,
          fontSize: '0.9375rem',
          fontWeight: 500,
          color: 'gray.800',
          ellipsis: '1',
        })}
      >
        {task.title}
      </Link>
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
    </div>
  );
};
