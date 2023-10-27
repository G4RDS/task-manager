import useSWR from 'swr';
import { css, cx } from '../../../styled-system/css';
import { requestGetNotes } from '../../api/notes';

export const NoteList = ({ className }: { className?: string }) => {
  const { data: notes } = useSWR('/notes', requestGetNotes);

  return (
    <ul
      className={cx(
        css({
          w: '240px',
        }),
        className,
      )}
    >
      {notes?.data.map((note) => (
        <li
          className={css({
            w: '100%',
            p: '8px 16px',
            borderTop: '1px solid',
            borderColor: 'gray.100',
            _first: {
              borderTop: 'none',
            },
          })}
          key={note.id}
        >
          {note.title}
        </li>
      ))}
    </ul>
  );
};
