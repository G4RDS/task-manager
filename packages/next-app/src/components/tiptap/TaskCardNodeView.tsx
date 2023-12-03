import { ChangeEvent, Suspense } from 'react';
import { useState } from 'react';
import { useDebounce } from 'react-use';
import { Node } from '@tiptap/pm/model';
import { NodeViewWrapper } from '@tiptap/react';
import useSWR from 'swr';
import { TaskCardAttributes } from 'tiptap-shared';
import { css } from '../../../styled-system/css';
import { flex } from '../../../styled-system/patterns';
import { swrKeyAndFetcher } from '../../utils/swr';
import { uiByTaskStatus } from '../../utils/taskStatus';

interface Props {
  node: Node;
  updateAttributes: (attrs: TaskCardAttributes) => void;
}
export const TaskCardNodeViewContents = ({ node }: Props) => {
  const { data: task, mutate } = useSWR(
    ...swrKeyAndFetcher.getTask(node.attrs.taskId),
    {
      suspense: true,
    },
  );
  const [isDirty, setIsDirty] = useState(false);

  useDebounce(
    () => {
      if (!isDirty) return;

      fetch(`/api/tasks/${task.data.taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ title: task.data.title }),
      });
    },
    300,
    [task.data.taskId, task.data.title, isDirty] as const,
  );

  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    mutate(
      { data: { ...task.data, title: e.target.value } },
      { revalidate: false },
    );
    setIsDirty(true);
  };

  return (
    <div
      className={flex({
        alignItems: 'stretch',
        h: 12,
        border: '1px solid token(colors.gray.100)',
        borderRadius: '14px',
        bgColor: '#fff',
        boxShadow: 'md',
        color: 'gray.700',
        '&:has(input:focus)': {
          outline: '2px solid token(colors.primary.500)',
        },
      })}
    >
      <div
        className={flex({
          alignItems: 'center',
          px: 3,
        })}
      >
        <div className={css({ width: 4, height: 4 })}>
          {uiByTaskStatus[task.data.status].icon}
        </div>
      </div>
      <input
        value={task.data.title}
        placeholder="New task..."
        onChange={onChangeTitle}
        className={css({
          flex: '1 1 0',
          display: 'block',
          pl: 1.5,
          pr: 3,
          fontSize: '0.9375rem',
          lineHeight: '3rem',
          color: 'gray.900',
          fontWeight: 500,
          outline: 'none',
        })}
      />
    </div>
  );
};

export const TaskCardNodeView = (props: Props) => (
  <NodeViewWrapper
    contentEditable={false}
    className={css({
      my: 2,
    })}
  >
    <Suspense fallback={'loading'}>
      <TaskCardNodeViewContents {...props} />
    </Suspense>
  </NodeViewWrapper>
);
