import { ReactNode } from 'react';
import './index.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja-JP">
      <body>{children}</body>
    </html>
  );
}
