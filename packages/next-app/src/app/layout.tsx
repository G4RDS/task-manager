import { ReactNode } from 'react';
import { css } from '../../styled-system/css';
import { flex, grid } from '../../styled-system/patterns';
import { DashboardIcon } from '../components/icons/DashboardIcon';
import { NoteIcon } from '../components/icons/NoteIcon';
import { NavLink } from './_components/NavLink';
import './index.css';
import Providers from './providers';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja-JP">
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body
        className={css({
          overflowY: 'hidden',
        })}
      >
        <div
          className={grid({
            gridTemplateColumns: '256px 1fr',
            gap: 0,
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
              <NavLink
                href="/dashboard"
                label="Dashboard"
                iconEl={<DashboardIcon />}
              />
              <NavLink href="/notes" label="Notes" iconEl={<NoteIcon />} />
            </nav>
          </section>
          <div
            className={flex({
              flexDir: 'column',
              overflow: 'hidden',
              minH: 0,
              borderRadius: '20px',
              bgColor: 'white',
              boxShadow: 'md',
            })}
          >
            <Providers>{children}</Providers>
          </div>
        </div>
      </body>
    </html>
  );
}
