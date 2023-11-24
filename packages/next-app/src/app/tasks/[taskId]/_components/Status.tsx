'use client';

import { startTransition, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { Command, CommandInput, CommandItem, CommandList } from 'cmdk';
import { TaskStatus } from 'database/src/utils/prisma';
import { css } from '../../../../../styled-system/css';
import { flex } from '../../../../../styled-system/patterns';
import { uiByTaskStatus } from '../../../../utils/taskStatus';
import { updateTaskStatus } from '../_actions';

const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

interface Props {
  taskId: string;
  status: TaskStatus;
}
export const Status = ({ taskId, status }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { icon, label } = uiByTaskStatus[status];

  const onChangeStatus = (status: TaskStatus) => {
    setIsOpen(false);
    startTransition(() => {
      updateTaskStatus(taskId, status);
    });
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
            border: '1px solid transparent',
            borderRadius: '6px',
            transition: '0.15s token(easings.easeOut)',
            fontSize: '0.875rem',
            lineHeight: '1',
            fontWeight: 500,
            userSelect: 'none',
            _hover: {
              bg: 'gray.50',
              borderColor: 'gray.200',
            },
          })}
        >
          <div className={css({ w: 4, h: 4, mr: 2 })}>{icon}</div>
          <div
            className={css({
              color: 'gray.700',
            })}
          >
            {label}
          </div>
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
                  onSelect={() => onChangeStatus(status)}
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
