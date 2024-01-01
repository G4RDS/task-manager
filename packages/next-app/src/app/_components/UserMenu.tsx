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
import { dropdownMenuContentStyle } from '../../styles/dropdownMenu';
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
            className={dropdownMenuContentStyle}
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
