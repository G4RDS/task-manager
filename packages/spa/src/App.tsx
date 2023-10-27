import { css } from '../styled-system/css';
import { flex } from '../styled-system/patterns';
import { NoteEditor } from './components/NoteEditor/NoteEditor';

export const App = () => {
  return (
    <div
      className={flex({
        flexDirection: 'column',
        alignItems: 'center',
        minH: '100vh',
      })}
    >
      <div
        className={flex({
          flex: '1',
          flexDirection: 'column',
          maxW: '708px',
          w: '100%',
        })}
      >
        <NoteEditor className={css({ flex: '1' })} />
      </div>
    </div>
  );
};
