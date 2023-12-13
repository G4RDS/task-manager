'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { generateKeyBetween } from 'fractional-indexing';
import { z } from 'zod';
import { css, cx } from '../../../../styled-system/css';
import { grid } from '../../../../styled-system/patterns';
import { token } from '../../../../styled-system/tokens';
import { GrabDotsIcon } from '../../../components/icons/GrabDotsIcon';
import { queries } from '../../../utils/query';
import { uiByTaskStatus } from '../../../utils/taskStatus';
import { getTasksResponseSchema } from '../../api/tasks/route';

type Task = z.infer<typeof getTasksResponseSchema>['data'][number];

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

const generateMutationArgs = (
  tasks: Task[],
  targetId: string,
  moveToId: string,
) => {
  const targetIdx = tasks.findIndex((v) => v.taskId === targetId);
  const moveToIdx = tasks.findIndex((v) => v.taskId === moveToId);
  const moveToTask = tasks[moveToIdx];

  if (targetIdx === -1 || moveToIdx === -1) {
    throw new Error('Task not found');
  }

  const newTasks = [...tasks];
  newTasks.splice(moveToIdx, 0, newTasks.splice(targetIdx, 1)[0]);
  const newOrder =
    moveToIdx < targetIdx
      ? generateKeyBetween(
          moveToIdx > 0 ? tasks[moveToIdx - 1].order : null,
          moveToTask.order,
        )
      : generateKeyBetween(
          moveToTask.order,
          moveToIdx < tasks.length - 1 ? tasks[moveToIdx + 1].order : null,
        );
  const targetTask = newTasks.find((v) => v.taskId === targetId)!;
  targetTask.order = newOrder;

  return {
    newTasks,
    targetTask,
  } as const;
};

export const OrderableTaskList = () => {
  const queryClient = useQueryClient();
  const { data: _tasks } = useSuspenseQuery({
    ...queries.getTasks(),
  });
  const {
    mutateAsync: mutateMoveTask,
    isPending,
    variables,
  } = useMutation({
    mutationFn: async ({
      targetTask,
    }: {
      newTasks: Task[];
      targetTask: Task;
    }) => {
      await fetch(`/api/tasks/${targetTask.taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ order: targetTask.order }),
      });
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: queries.getTasks().queryKey,
      }),
  });
  const tasks = !isPending || !variables ? _tasks : variables?.newTasks;

  const [draggingTaskId, setDraggingTaskId] = useState<string>();
  const draggingTask = tasks.find((v) => v.taskId === draggingTaskId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragStart = (e: DragStartEvent) => {
    setDraggingTaskId(e.active.id as string);
  };

  const onDragEnd = async (e: DragEndEvent) => {
    setDraggingTaskId(undefined);

    if (!e.over || e.active.id === e.over.id) {
      return;
    }

    await mutateMoveTask(
      generateMutationArgs(tasks, e.active.id as string, e.over.id as string),
    );
  };

  const taskIds = useMemo(() => tasks.map((v) => v.taskId), [tasks]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <SortableTaskItem
            task={task}
            isDragged={task.taskId === draggingTaskId}
            key={task.taskId}
          />
        ))}
      </SortableContext>
      <DragOverlay
        dropAnimation={{ duration: 150, easing: token('easings.easeInOut') }}
        modifiers={[restrictToVerticalAxis]}
        className={css({
          pointerEvents: 'none',
          boxShadow: 'lg',
          borderRadius: '6px',
          overflow: 'hidden',
          '& .grab-dots': {
            opacity: 1,
          },
        })}
      >
        {draggingTask ? <TaskItem task={draggingTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

const SortableTaskItem = ({
  task,
  isDragged,
}: {
  task: Task;
  isDragged: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.taskId });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={css({
        position: 'relative',
        ['&[data-dragged="true"]::after']: {
          content: '""',
          pointerEvents: 'none',
          position: 'absolute',
          inset: '4px',
          background: '#fff',
          borderRadius: '6px',
          border: '1px dashed token(colors.gray.200)',
        },
      })}
      data-dragged={isDragged}
      {...attributes}
      {...listeners}
    >
      <TaskItem task={task} />
    </div>
  );
};

const TaskItem = ({ task }: { task: Task }) => {
  return (
    <div
      className={grid({
        gridTemplateColumns: 'auto auto minmax(8rem, 1fr) 3fr 64px',
        gap: 0,
        alignItems: 'center',
        h: 12,
        pr: 3,
        borderBottom: '1px solid token(colors.gray.100)',
        background: 'white',
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
      <Link
        href={`/notes/${task.note.noteId}`}
        className={css({
          maxW: 48,
          mr: 3,
          fontSize: '0.75rem',
          lineHeight: '47px',
          fontWeight: 500,
          color: 'gray.500',
          ellipsis: '1',
        })}
      >
        {task.note.title}
      </Link>
      <Link
        href={`/notes/${task.note.noteId}`}
        data-empty={task.title.length === 0}
        className={css({
          mr: 3,
          fontSize: '0.9375rem',
          lineHeight: '47px',
          fontWeight: 500,
          color: 'gray.800',
          ellipsis: '1',
          '&[data-empty="true"]': {
            color: 'gray.400',
          },
        })}
      >
        {task.title || 'Untitled'}
      </Link>
      <p
        className={css({
          fontSize: '0.75rem',
          color: 'gray.500',
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        {formatCreatedAt(task.createdAt)}
      </p>
    </div>
  );
};
