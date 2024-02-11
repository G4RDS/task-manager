import { useEffect } from 'react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EditorContent, Extensions, useEditor } from '@tiptap/react';
import { Command, CommandInput, CommandItem, CommandList } from 'cmdk';
import { TaskStatus } from 'database';
import { css } from '../../../styled-system/css';
import { flex } from '../../../styled-system/patterns';
import { GetTaskResponse } from '../../app/api/tasks/[taskId]/type';
import { useDebounceCallback } from '../../hooks/useDebounceCallback';
import { queries } from '../../utils/query';
import { uiByTaskStatus } from '../../utils/taskStatus';
import { createTaskDocConnection } from '../../utils/tiptap';
import { MenuIcon } from '../icons/MenuIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { deleteTaskAction } from './actions';

const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

export const TaskCard = ({
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
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queries.getTasks().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queries.getTasksForNote(task.noteId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queries.getTask(task.taskId).queryKey,
      });
    },
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

  const onChangeStatus = (status: TaskStatus) => {
    mutateTask({ newTask: { ...task, status } });
  };

  const onChangeTitle = useDebounceCallback(
    (title: string) => {
      mutateTask({ newTask: { ...task, title } });
    },
    [mutateTask, task],
    500,
  );

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
        '.ProseMirror-focused .ProseMirror-selectednode &': {
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
            <TitleEditor
              extensions={titleDocExtensions}
              initialTitle={task.title}
              onChange={onChangeTitle}
            />
          )}
        </div>
        <div
          className={flex({
            alignItems: 'center',
            px: 1,
          })}
        >
          <ActionMenu taskId={task.taskId} />
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

const ActionMenu = ({ taskId }: { taskId: string }) => {
  const onDelete = async () => {
    await deleteTaskAction(taskId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={flex({
            alignItems: 'center',
            justifyContent: 'center',
            w: 8,
            h: 8,
            mr: 1,
            borderRadius: '12px',
            transition: '150ms token(easings.easeIn)',
            cursor: 'pointer',
            _hover: {
              bg: 'gray.100',
            },
          })}
        >
          <MenuIcon className={css({ w: 4, h: 4, color: 'gray.700' })} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          align="end"
          className={css({
            minW: 48,
            p: 1,
            border: '1px solid token(colors.gray.100)',
            borderRadius: '10px',
            boxShadow: 'md',
            background: '#fff',
            userSelect: 'none',
            transformOrigin:
              'var(--radix-dropdown-menu-content-transform-origin)',
            animation: 'popIn 150ms token(easings.easeOut)',
            '& > div[data-radix-collection-item]': {
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 2,
              px: 2,
              borderRadius: '4px',
              cursor: 'pointer',
              '& svg': {
                w: 4,
                h: 4,
                color: 'gray.500',
              },
              '&[data-highlighted]': {
                background: 'gray.100',
                outline: 'none',
              },
            },
          })}
        >
          <DropdownMenuItem onSelect={onDelete}>
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

const TitleEditor = ({
  extensions,
  initialTitle,
  onChange,
}: {
  extensions: Extensions;
  initialTitle: string;
  onChange: (value: string) => void;
}) => {
  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class: 'taskTitleEditor',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getText());
    },
  });

  useEffect(() => {
    if (!editor?.isEmpty) {
      return;
    }
    editor.commands.insertContent(initialTitle);
  }, [editor, initialTitle]);

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
