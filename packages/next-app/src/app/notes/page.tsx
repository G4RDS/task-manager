import { Suspense } from 'react';
import { css } from '../../../styled-system/css';
import { Header } from '../_components/Header/Header';
import { MainContents } from '../_components/MainContents/MainContents';
import { NoteCards } from '../_components/NoteCards/NoteCards';
import { CreateNoteForm } from './_components/CreateNoteForm/CreateNoteForm';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <>
      <Header titleEl={<h1>Notes</h1>} />
      <MainContents
        className={css({
          p: 4,
        })}
      >
        <div
          className={css({
            maxWidth: '592px',
            mx: 'auto',
          })}
        >
          <CreateNoteForm />
          <div className={css({ mt: 3 })}>
            <Suspense fallback={''}>
              <NoteCards />
            </Suspense>
          </div>
        </div>
      </MainContents>
    </>
  );
}
