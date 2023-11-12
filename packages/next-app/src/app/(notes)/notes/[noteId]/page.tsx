import { css } from '../../../../../styled-system/css';
import { CreateTaskForm } from './_components/CreateTaskForm/CreateTaskForm';
import { NoteEditor } from './_components/NoteEditor/NoteEditor';
import { TaskCardList } from './_components/TaskCardList/TaskCardList';

export default function Page({ params }: { params: { noteId: string } }) {
  return (
    <div
      className={css({
        w: '100%',
        height: '100vh',
        p: '48px',
      })}
    >
      <NoteEditor noteId={params.noteId} />
      <div
        className={css({
          mt: 4,
        })}
      >
        <CreateTaskForm noteId={params.noteId} />
      </div>
      <div
        className={css({
          mt: 3,
        })}
      >
        <TaskCardList noteId={params.noteId} />
      </div>
    </div>
  );
}
