import { Suspense, useEffect } from 'react';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { Node } from '@tiptap/pm/model';
import { NodeViewWrapper } from '@tiptap/react';
import { EditorContent, Extensions, useEditor } from '@tiptap/react';
import { Command, CommandInput, CommandItem, CommandList } from 'cmdk';
import { TaskStatus } from 'database/src/utils/prisma';
import useSWR from 'swr';
import { TaskCardAttributes } from 'tiptap-shared';
import { css } from '../../../styled-system/css';
import { flex } from '../../../styled-system/patterns';
import { PutTaskResponse } from '../../app/api/tasks/[taskId]/route';
import { swrKeyAndFetcher } from '../../utils/swr';
import { uiByTaskStatus } from '../../utils/taskStatus';
import {
  createTaskContentDocConnection,
  createTaskTitleDocConnection,
} from '../../utils/tiptap';

const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

interface Props {
  node: Node;
  updateAttributes: (attrs: TaskCardAttributes) => void;
}

export const TaskCardNodeView = (props: Props) => (
  <NodeViewWrapper
    contentEditable={false}
    className={css({
      my: 3,
    })}
  >
    <Suspense fallback={<TaskCardSkeleton />}>
      <TaskCardNodeViewContents {...props} />
    </Suspense>
  </NodeViewWrapper>
);

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

const TaskCardNodeViewContents = ({ node }: Props) => {
  const taskId = node.attrs.taskId;
  const { data: task, mutate } = useSWR(...swrKeyAndFetcher.getTask(taskId), {
    suspense: true,
  });
  const [titleDocExtensions, setTitleDocExtensions] = useState<Extensions>();
  const [contentDocExtensions, setContentDocExtensions] =
    useState<Extensions>();

  useEffect(() => {
    const title = createTaskTitleDocConnection(taskId);
    const content = createTaskContentDocConnection(taskId);

    title.provider.on('connect', () => {
      setTitleDocExtensions(title.extensions);
    });
    content.provider.on('connect', () => {
      setContentDocExtensions(content.extensions);
    });

    return () => {
      title.provider.destroy();
      content.provider.destroy();
    };
  }, [taskId]);

  const onChangeStatus = async (status: TaskStatus) => {
    mutate(
      () =>
        fetch(`/api/tasks/${task.data.taskId}`, {
          method: 'PUT',
          body: JSON.stringify({ status }),
        }).then((res) => res.json()) as Promise<PutTaskResponse>,
      {
        optimisticData: {
          data: { ...task.data, status },
        },
      },
    );
  };

  return (
    <div
      className={css({
        border: '1px solid token(colors.gray.100)',
        borderRadius: '10px',
        bgColor: '#fff',
        boxShadow: 'md',
        color: 'gray.700',
        '&:has([data-editor="true"]:focus)': {
          outline: '2px solid token(colors.primary.500)',
        },
      })}
    >
      <div
        className={flex({
          alignItems: 'stretch',
          h: 10,
        })}
      >
        <div
          className={flex({
            alignItems: 'center',
            px: 1,
          })}
        >
          <Status status={task.data.status} onChange={onChangeStatus} />
        </div>
        <div
          className={css({
            flex: '1 1 0',
          })}
        >
          {titleDocExtensions && (
            <TitleEditor extensions={titleDocExtensions} />
          )}
        </div>
      </div>
      <div className={css({ pl: '40px' })}>
        {contentDocExtensions && (
          <ContentEditor extensions={contentDocExtensions} />
        )}
      </div>
    </div>
  );
};

const Status = ({
  status,
  onChange,
}: {
  status: TaskStatus;
  onChange: (status: TaskStatus) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { icon } = uiByTaskStatus[status];

  const onSelect = (status: TaskStatus) => {
    onChange(status);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={flex({
            alignItems: 'center',
            w: 'fit-content',
            p: 2,
            borderRadius: '6px',
            transition: '0.15s token(easings.easeOut)',
            fontSize: '0.875rem',
            lineHeight: '1',
            fontWeight: 500,
            cursor: 'pointer',
            _hover: {
              bg: 'gray.50',
            },
          })}
        >
          <div className={css({ w: 4, h: 4 })}>{icon}</div>
        </button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent className={css({})} align="start">
          <Command
            className={css({
              minW: 48,
              border: '1px solid token(colors.gray.100)',
              borderRadius: '10px',
              bg: 'white',
              boxShadow: 'md',
            })}
          >
            <CommandInput
              placeholder="Status"
              className={flex({
                w: '100%',
                h: 10,
                px: 3,
                borderBottom: '1px solid token(colors.gray.100)',
                borderRadius: '6px',
                fontSize: '0.875rem',
                outline: 'none',
                _placeholder: {
                  color: 'gray.500',
                },
              })}
            />
            <CommandList
              className={css({
                p: 1,
              })}
            >
              {statuses.map((status) => (
                <CommandItem
                  key={status}
                  onSelect={() => onSelect(status)}
                  className={flex({
                    alignItems: 'center',
                    h: 8,
                    px: 2,
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    lineHeight: '1',
                    fontWeight: 500,
                    userSelect: 'none',
                    _selected: {
                      bg: 'gray.100',
                    },
                  })}
                >
                  <div className={css({ w: 4, h: 4, mr: 2 })}>
                    {uiByTaskStatus[status].icon}
                  </div>
                  <div
                    className={css({
                      color: 'gray.700',
                    })}
                  >
                    {uiByTaskStatus[status].label}
                  </div>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
};

const TitleEditor = ({ extensions }: { extensions: Extensions }) => {
  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class: 'taskTitleEditor',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <EditorContent
      className={css({
        position: 'relative',
        w: '100%',
        pr: 3,
        outline: 'none',
        '& .tiptap': {
          outlineWidth: 0,
        },
        '& [data-placeholder]::before': {
          content: 'attr(data-placeholder)',
          position: 'absolute',
          inset: '0 auto auto 0',
          opacity: '0.15',
          pointerEvents: 'none',
        },
        '& .tiptap.taskTitleEditor p': {
          m: 0,
          p: 0,
          fontSize: '0.9375rem',
          lineHeight: '40px',
          color: 'gray.900',
          fontWeight: 500,
        },
      })}
      editor={editor}
      data-editor={true}
    />
  );
};

const ContentEditor = ({ extensions }: { extensions: Extensions }) => {
  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class: 'taskContentEditor',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <EditorContent
      className={css({
        position: 'relative',
        w: '100%',
        outline: 'none',
        '& .tiptap': {
          outlineWidth: 0,
        },
        '& [data-placeholder]::before': {
          content: 'attr(data-placeholder)',
          position: 'absolute',
          inset: '0 auto auto 0',
          opacity: '0.15',
          pointerEvents: 'none',
        },
        '& .tiptap.taskNoteEditor p': {
          m: 0,
          p: 0,
          fontSize: '1rem',
          lineHeight: '1.6',
        },
      })}
      editor={editor}
      data-editor={true}
    />
  );
};
