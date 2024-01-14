import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { useQueryClient } from '@tanstack/react-query';
import { Editor, FloatingMenu } from '@tiptap/react';
import { Command, CommandInput, CommandItem, CommandList } from 'cmdk';
import { css } from '../../../styled-system/css';
import { flex } from '../../../styled-system/patterns';
import { PostTaskResponse } from '../../app/api/tasks/type';
import { queries } from '../../utils/query';
import { PlusIcon } from '../icons/PlusIcon';
import { TaskIcon } from '../icons/TaskIcon';

export const CustomFloatingMenu = ({
  editor,
  noteId,
}: {
  editor: Editor;
  noteId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const onSelectNewTask = async () => {
    setIsOpen(false);
    const response = await fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        noteId,
      }),
    });
    const task = (await response.json()) as PostTaskResponse;
    queryClient.invalidateQueries({
      queryKey: queries.getTasks().queryKey,
    });
    queryClient.invalidateQueries({
      queryKey: queries.getTasksForNote(task.data.noteId).queryKey,
    });
    editor.commands.setTaskCard(task.data.taskId);
  };

  return (
    <FloatingMenu editor={editor}>
      <div
        className={css({
          transform: 'translateX(calc(-100% - 18px))',
        })}
      >
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={flex({
                alignItems: 'center',
                justifyContent: 'center',
                w: 6,
                h: 6,
                borderRadius: '6px',
                transition: '150ms token(easings.easeIn)',
                cursor: 'pointer',
                _hover: {
                  bg: 'gray.100',
                },
              })}
            >
              <PlusIcon className={css({ w: 4, h: 4, color: 'gray.500' })} />
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
                  placeholder="Search"
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
                  <CommandItem
                    onSelect={onSelectNewTask}
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
                      <TaskIcon />
                    </div>
                    <div
                      className={css({
                        color: 'gray.700',
                      })}
                    >
                      New Task
                    </div>
                  </CommandItem>
                </CommandList>
              </Command>
            </PopoverContent>
          </PopoverPortal>
        </Popover>
      </div>
    </FloatingMenu>
  );
};
