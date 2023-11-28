'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentProps, ReactNode } from 'react';
import { css, cx } from '../../../styled-system/css';
import { flex } from '../../../styled-system/patterns';

export const NavLink = ({
  href,
  iconEl,
  label,
}: {
  href: ComponentProps<typeof Link>['href'] & string;
  iconEl: ReactNode;
  label: string;
}) => {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      aria-current={pathname === href ? 'page' : undefined}
      className={flex({
        alignItems: 'center',
        h: 8,
        py: 1,
        border: '1px solid transparent',
        borderRadius: '10px',
        _currentPage: {
          bgColor: 'white',
          borderColor: 'gray.200',
          boxShadow: 'xs',
          '& .icon': {
            color: 'gray.700',
          },
        },
      })}
    >
      <div
        className={cx(
          'icon',
          flex({
            justifyContent: 'center',
            w: 8,
            mr: '3px',
            color: 'gray.500',
          }),
        )}
      >
        <div className={css({ width: 4, height: 4 })}>{iconEl}</div>
      </div>
      <div
        className={css({
          fontSize: '15px',
          fontWeight: 500,
          color: 'gray.700',
        })}
      >
        {label}
      </div>
    </Link>
  );
};
