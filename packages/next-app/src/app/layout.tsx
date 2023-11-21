import { ReactNode } from 'react';
import { css } from '../../styled-system/css';
import { flex, grid } from '../../styled-system/patterns';
import { NoteIcon } from '../components/icons/NoteIcon';
import { TaskIcon } from '../components/icons/TaskIcon';
import { NavLink } from './_components/NavLink';
import './index.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja-JP">
      <body
        className={css({
          overflowY: 'hidden',
        })}
      >
        <div
          className={grid({
            gridTemplateColumns: '256px 1fr',
            gap: 0,
            alignItems: 'stretch',
            h: '100vh',
            p: '12px 12px 12px 0',
            bgColor: 'gray.100',
          })}
        >
          <section className={css({ px: 4 })}>
            <div
              className={flex({
                alignItems: 'center',
                h: 16,
                px: 2,
                borderBottom: '1px solid token(colors.gray.200)',
              })}
            >
              <span
                className={css({
                  fontSize: '1rem',
                  fontWeight: 'bold',
                })}
              >
                Supertasks
              </span>
            </div>
            <nav className={flex({ flexDir: 'column', rowGap: 2, mt: 4 })}>
              <NavLink href="/notes" label="Notes" iconEl={<NoteIcon />} />
              <NavLink href="/tasks" label="Tasks" iconEl={<TaskIcon />} />
            </nav>
          </section>
          <div
            className={css({
              borderRadius: '20px',
              bgColor: 'white',
              boxShadow: 'md',
            })}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
