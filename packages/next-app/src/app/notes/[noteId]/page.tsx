import { css } from '../../../../styled-system/css';
import { NoteEditor } from './_components/NoteEditor/NoteEditor';

export default function Page({ params }: { params: { noteId: string } }) {
  return (
    <NoteEditor
      noteId={params.noteId}
      className={css({
        flex: '1',
        p: '48px',
      })}
    />
  );
}
