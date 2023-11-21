import { ReactNode } from 'react';
import { css, cx } from '../../../../styled-system/css';

interface Props {
  className?: string;
  children: ReactNode;
}
export const MainContents = ({ className, children }: Props) => {
  return (
    <main
      className={cx(
        css({
          flex: '1',
          overflowY: 'auto',
        }),
        className,
      )}
    >
      {children}
    </main>
  );
};
