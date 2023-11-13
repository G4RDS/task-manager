import { css } from '../../../../../styled-system/css';
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
      <TaskEditor taskId={params.taskId} />
    </div>
  );
}
