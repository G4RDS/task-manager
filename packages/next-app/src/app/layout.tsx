import { ReactElement } from 'react';
import './index.css';

export default function RootLayout({ children }: { children: ReactElement }) {
  return (
    <html lang="ja-JP">
      <body>{children}</body>
    </html>
  );
}
