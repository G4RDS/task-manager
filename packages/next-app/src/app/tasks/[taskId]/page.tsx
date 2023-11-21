import { css } from '../../../../styled-system/css';
import { ParentNoteLink } from './_components/ParentNoteLink';
import { TaskEditor } from './_components/TaskEditor/TaskEditor';

export default function Page({ params }: { params: { taskId: string } }) {
  return (
    <div
      className={css({
        w: '100%',
        height: '100vh',
        p: '48px',
      })}
    >
      <ParentNoteLink taskId={params.taskId} />
      <TaskEditor
        taskId={params.taskId}
        className={css({
          mt: 8,
        })}
      />
    </div>
  );
}
