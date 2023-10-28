import { Suspense } from 'react';
import { css } from '../../styled-system/css';
import { NoteList } from './_components/NoteList/NoteList';

export default function Page() {
  return (
    <section
      className={css({
        p: 8,
      })}
    >
      <h1
        className={css({
          fontSize: '24px',
          lineHeight: 1.2,
          fontWeight: 'bold',
        })}
      >
        Notes
      </h1>
      <div className={css({ mt: 4 })}>
        <Suspense fallback="loading...">
          <NoteList />
        </Suspense>
      </div>
    </section>
  );
}
