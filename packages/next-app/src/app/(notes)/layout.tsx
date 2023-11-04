import { ReactNode, Suspense } from 'react';
import { css } from '../../../styled-system/css';
import { flex, grid } from '../../../styled-system/patterns';
import { CreateNoteForm } from './_components/CreateNoteForm/CreateNoteForm';
import { NoteCards } from './_components/NoteCards/NoteCards';

export default function NotesLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={grid({
        gridTemplateColumns: '384px 1fr',
        h: '100vh',
      })}
    >
      <section
        className={css({
          p: 4,
          bgColor: 'gray.50',
        })}
      >
        <h1
          className={css({
            color: 'gray.900',
            fontSize: '16px',
            lineHeight: 1.2,
            fontWeight: 'bold',
          })}
        >
          Notes
        </h1>
        <div className={css({ mt: 4 })}>
          <CreateNoteForm />
        </div>
        <div className={css({ mt: 3 })}>
          <Suspense fallback={''}>
            <NoteCards />
          </Suspense>
        </div>
      </section>
      <main
        className={flex({
          overflowY: 'auto',
        })}
      >
        {children}
      </main>
    </div>
  );
}
