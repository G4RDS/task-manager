import { useEffect } from 'react';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NodeViewWrapper } from '@tiptap/react';
import { EditorContent, Extensions, useEditor } from '@tiptap/react';
import { Command, CommandInput, CommandItem, CommandList } from 'cmdk';
import { TaskStatus } from 'database/src/utils/prisma';
import { TaskCardAttributes } from 'tiptap-shared';
import { css } from '../../../styled-system/css';
import { flex } from '../../../styled-system/patterns';
import { GetTaskResponse } from '../../app/api/tasks/[taskId]/route';
import { NotFoundError, queries } from '../../utils/query';
import { uiByTaskStatus } from '../../utils/taskStatus';
import { NodeViewProps, createTaskDocConnection } from '../../utils/tiptap';

const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

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
      {task ? <TaskCardNodeViewContents task={task} /> : <TaskCardSkeleton />}
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

const TaskCardNodeViewContents = ({
  task: _task,
}: {
  task: GetTaskResponse['data'];
}) => {
  const queryClient = useQueryClient();
  const {
    mutateAsync: mutateTask,
    isPending,
    variables,
  } = useMutation({
    mutationFn: async ({
      newTask,
    }: {
      newTask: GetTaskResponse['data']; // fix type
    }) => {
      await fetch(`/api/tasks/${newTask.taskId}`, {
        method: 'PUT',
        body: JSON.stringify(newTask),
      });
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: queries.getTasks().queryKey,
      }),
  });
  const task = !isPending || !variables ? _task : variables?.newTask;

  const [isReady, setIsReady] = useState(false);
  const [titleDocExtensions, setTitleDocExtensions] = useState<Extensions>();
  const [contentDocExtensions, setContentDocExtensions] =
    useState<Extensions>();

  useEffect(() => {
    const connection = createTaskDocConnection(task.noteId, task.taskId);

    setTitleDocExtensions(connection.titleExtensions);
    setContentDocExtensions(connection.contentExtensions);

    if (connection.provider.isConnected) {
      setIsReady(true);
    }
    connection.provider.on('connect', () => {
      setIsReady(true);
    });

    return () => {
      // TODO: Destroy connection respecting other document connections
    };
  }, [task.noteId, task.taskId]);

  const onChangeStatus = async (status: TaskStatus) => {
    mutateTask({ newTask: { ...task, status } });
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
          <Status status={task.status} onChange={onChangeStatus} />
        </div>
        <div
          className={css({
            flex: '1 1 0',
          })}
        >
          {titleDocExtensions && isReady && (
            <TitleEditor extensions={titleDocExtensions} />
          )}
        </div>
      </div>
      <div className={css({ pl: '40px' })}>
        {contentDocExtensions && isReady && (
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
