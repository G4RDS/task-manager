import { ReactNode } from 'react';
import { css } from '../../../../styled-system/css';
import { flex } from '../../../../styled-system/patterns';

interface Props {
  titleEl: ReactNode;
  actionsEl?: ReactNode;
}
export const Header = ({ titleEl, actionsEl }: Props) => {
  return (
    <header
      className={flex({
        alignItems: 'center',
        justifyContent: 'space-between',
        h: 16,
        px: 6,
        borderBottom: '1px solid token(colors.gray.200)',
      })}
    >
      <div
        className={css({
          fontSize: '1rem',
          color: 'gray.900',
          fontWeight: 600,
        })}
      >
        {titleEl}
      </div>
      <div>{actionsEl}</div>
    </header>
  );
};
