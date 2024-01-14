import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NodeViewWrapper } from '@tiptap/react';
import { TaskCardAttributes } from 'tiptap-shared';
import { css } from '../../../styled-system/css';
import { NotFoundError, queries } from '../../utils/query';
import { NodeViewProps } from '../../utils/tiptap';
import { TaskCard } from '../TaskCard';

type Props = NodeViewProps<TaskCardAttributes>;
export const TaskCardNodeView = ({ editor, node, getPos }: Props) => {
  const taskId = node.attrs.taskId;
  const { data: task, error } = useQuery({
    ...queries.getTask(taskId),
  });

  // If task is not found, delete node
  useEffect(() => {
    if (error && error instanceof NotFoundError) {
      const from = getPos();
      const to = from + node.nodeSize;

      // Because editor calls flushSync, we need to run inside microtask
      queueMicrotask(() => {
        editor.commands.deleteRange({ from, to });
      });
    }
  }, [editor.commands, error, getPos, node.nodeSize]);

  return (
    <NodeViewWrapper
      contentEditable={false}
      className={css({
        my: 3,
      })}
    >
      {task ? <TaskCard task={task} /> : <TaskCardSkeleton />}
    </NodeViewWrapper>
  );
};

const TaskCardSkeleton = () => {
  return (
    <div
      className={css({
        h: 12,
        border: '1px solid token(colors.gray.100)',
        borderRadius: '10px',
        bgColor: '#fff',
        boxShadow: 'md',
      })}
    />
  );
};
