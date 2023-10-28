import { ReactElement } from 'react';
import { flex } from '../../styled-system/patterns';
import './index.css';

export default function RootLayout({ children }: { children: ReactElement }) {
  return (
    <html lang="ja-JP">
      <body>
        <div
          className={flex({
            flexDirection: 'column',
            minH: '100vh',
          })}
        >
          <main
            className={flex({
              flex: '1',
            })}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
