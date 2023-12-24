'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { Task } from 'database/src/utils/prisma';
import { css } from '../../../../../../styled-system/css';
import { flex, grid } from '../../../../../../styled-system/patterns';
import { MenuIcon } from '../../../../../components/icons/MenuIcon';
import { TrashIcon } from '../../../../../components/icons/TrashIcon';
import { uiByTaskStatus } from '../../../../../utils/taskStatus';
import { deleteTask } from '../../actions';

interface Props {
  task: Pick<Task, 'taskId' | 'title' | 'status'>;
}
export const TaskCard = ({ task }: Props) => {
  return (
    <div
      className={grid({
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        gap: 2,
        h: 10,
        border: '1px solid token(colors.gray.100)',
        borderRadius: '14px',
        bgColor: '#fff',
        boxShadow: 'md',
        color: 'gray.700',
      })}
    >
      <div className={css({ width: 4, height: 4, ml: 3 })}>
        {uiByTaskStatus[task.status].icon}
      </div>
      <p
        className={css({
          fontSize: '0.9375rem',
          color: 'gray.900',
          fontWeight: 500,
        })}
      >
        {task.title}
      </p>
      <ActionMenu taskId={task.taskId} />
    </div>
  );
};

const ActionMenu = ({ taskId }: { taskId: string }) => {
  const onDelete = async () => {
    await deleteTask(taskId);
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
