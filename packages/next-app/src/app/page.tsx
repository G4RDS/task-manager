import { css } from '../../styled-system/css';
import { flex } from '../../styled-system/patterns';
import { NoteEditor } from './_components/NoteEditor/NoteEditor';
import { NoteList } from './_components/NoteList/NoteList';

export default function Page() {
  return (
    <div
      className={flex({
        flexDirection: 'column',
        minH: '100vh',
      })}
    >
      <div
        className={flex({
          flex: '1',
        })}
      >
        <NoteList />
        <NoteEditor
          className={css({
            flex: '1',
            p: '48px',
            boxShadow: '0 0 50px -12px rgb(0 0 0 / 0.25)',
          })}
        />
      </div>
    </div>
  );
}
