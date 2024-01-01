'use client';

import { User } from 'next-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { css } from '../../../styled-system/css';
import { circle } from '../../../styled-system/patterns';
import { LogOutIcon } from '../../components/icons/LogOutIcon';
import { signOutAction } from '../actions';

interface Props {
  user: User;
  className?: string;
}
export const UserMenu = ({ user, className }: Props) => {
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={css({
              p: 1,
              borderRadius: '6px',
              transition: '150ms token(easings.easeOut)',
              cursor: 'pointer',
              _hover: {
                bgColor: 'gray.200',
              },
            })}
          >
            <img
              src={user.image ?? undefined}
              className={circle({
                w: 6,
                h: 6,
              })}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent
            align="start"
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
                fontSize: '14px',
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
            <DropdownMenuItem onSelect={() => signOutAction()}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </div>
  );
};
