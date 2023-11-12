'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { css } from '../../../../../../../styled-system/css';
import { createTask } from './action';

interface Props {
  noteId: string;
}
export const CreateTaskForm = ({ noteId }: Props) => {
  const [isActive, setIsActive] = useState(false);
  const [state, formAction] = useFormState(createTask, 1);

  if (!isActive) {
    return (
      <button
        type="button"
        onClick={() => setIsActive(true)}
        className={css({
          display: 'block',
          w: '100%',
          p: '12px 14px',
          border: '1px dashed',
          borderColor: 'gray.200',
          borderRadius: '14px',
          bgColor: 'gray.100',
          color: 'gray.500',
          fontSize: '14px',
          lineHeight: '1.5rem',
          textAlign: 'left',
        })}
      >
        Create a task...
      </button>
    );
  }

  return (
    <form
      action={formAction}
      onSubmit={() => {
        setIsActive(false);
      }}
      className={css({
        border: '1px dashed',
        borderColor: 'gray.200',
        borderRadius: '14px',
        bgColor: '#fff',
        color: 'gray.700',
        animation: 'boxShadowAppearMd 150ms token(easings.easeOut) forwards',
      })}
      key={state}
    >
      <input type="hidden" name="noteId" value={noteId} />
      <input
        type="text"
        name="title"
        autoFocus={true}
        onBlur={() => {
          setIsActive(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setIsActive(false);
          }
        }}
        className={css({
          w: '100%',
          p: '12px 14px',
          bg: 'transparent',
          outline: 'none',
          fontSize: '1rem',
          lineHeight: '1.5rem',
        })}
      />
    </form>
  );
};
