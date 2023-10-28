import { css } from '../../../../styled-system/css';
import { NoteEditor } from './_components/NoteEditor/NoteEditor';

export default function Page() {
  return (
    <NoteEditor
      className={css({
        flex: '1',
        p: '48px',
        boxShadow: '0 0 50px -12px rgb(0 0 0 / 0.25)',
      })}
    />
  );
}
