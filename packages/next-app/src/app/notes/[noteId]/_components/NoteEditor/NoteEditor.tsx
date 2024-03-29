'use client';

import { useEffect, useState } from 'react';
import { EditorContent, Extensions, useEditor } from '@tiptap/react';
import { css, cx } from '../../../../../../styled-system/css';
import { flex } from '../../../../../../styled-system/patterns';
import { CustomBubbleMenu } from '../../../../../components/tiptap/CustomBubbleMenu';
import { CustomFloatingMenu } from '../../../../../components/tiptap/CustomFloatingMenu';
import { createNoteDocConnection } from '../../../../../utils/tiptap';

export const NoteEditor = ({
  noteId,
  className,
}: {
  noteId: string;
  className?: string;
}) => {
  const [isReady, setIsReady] = useState(false);
  const [titleDocExtensions, setTitleDocExtensions] = useState<Extensions>();
  const [contentDocExtensions, setContentDocExtensions] =
    useState<Extensions>();

  useEffect(() => {
    const connection = createNoteDocConnection(noteId);

    setTitleDocExtensions(connection.titleExtensions);
    setContentDocExtensions(connection.contentExtensions);

    if (connection.provider.isConnected) {
      setIsReady(true);
    }
    connection.provider.on('connect', () => {
      setIsReady(true);
    });

    return () => {
      // TODO: Destroy connection respecting other document connections
    };
  }, [noteId]);

  if (!titleDocExtensions || !contentDocExtensions || !isReady) {
    return (
      <div
        className={cx(
          flex({
            flexDir: 'column',
            minH: '100vh',
            p: '48px',
          }),
          className,
        )}
      >
        <div
          className={css({
            flex: '0 0 auto',
            w: '10ch',
            h: '40px',
            my: '4px',
            backgroundColor: 'gray.50',
            borderRadius: 6,
          })}
        />
        <div
          className={css({
            flex: '1',
            pt: 2,
          })}
        >
          <div
            className={css({
              my: '1px',
              py: '3px',
            })}
          >
            <div
              className={css({
                width: '100%',
                height: '24px',
                backgroundColor: 'gray.50',
                borderRadius: 6,
              })}
            />
          </div>
          <div
            className={css({
              my: '1px',
              py: '3px',
            })}
          >
            <div
              className={css({
                width: '30%',
                height: '24px',
                backgroundColor: 'gray.50',
                borderRadius: 6,
              })}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <NoteEditorInner
      titleDocExtensions={titleDocExtensions}
      contentDocExtensions={contentDocExtensions}
      noteId={noteId}
      className={className}
    />
  );
};

const NoteEditorInner = ({
  titleDocExtensions,
  contentDocExtensions,
  noteId,
  className,
}: {
  titleDocExtensions: Extensions;
  contentDocExtensions: Extensions;
  noteId: string;
  className?: string;
}) => {
  const titleEditor = useEditor({
    extensions: titleDocExtensions,
  });

  const contentEditor = useEditor({
    extensions: contentDocExtensions,
  });

  if (!titleEditor || !contentEditor) {
    return;
  }

  return (
    <div className={cx(flex({ flexDir: 'column', minH: '100%' }), className)}>
      <EditorContent
        className={css({
          flex: '0 0 auto',
          position: 'relative',
          w: '100%',
          p: '48px 48px 0',
          fontSize: '40px',
          fontWeight: 'bold',
          lineHeight: '1.2',
          color: 'gray.900',
          '& .tiptap': {
            outlineWidth: 0,
          },
          '& [data-placeholder]::before': {
            content: 'attr(data-placeholder)',
            position: 'absolute',
            inset: '0 auto auto 0',
            opacity: '0.15',
            pointerEvents: 'none',
          },
        })}
        editor={titleEditor}
      />
      <CustomFloatingMenu editor={contentEditor} noteId={noteId} />
      <EditorContent
        className={flex({
          flex: '1',
          flexDir: 'column',
          w: '100%',
          p: '16px 48px 48px',
          fontSize: '16px',
          lineHeight: '1.5',
          color: 'gray.800',
          '& .tiptap': {
            flex: '1',
            height: '100%',
            outlineWidth: 0,
          },
          '& .tiptap p': {
            my: '1px',
            py: '3px',
            px: '2px',
            fontSize: '1rem',
            lineHeight: 1.6,
          },
          '& .tiptap h2': {
            mt: '2rem',
            mb: '4px',
            py: '3px',
            px: '2px',
            fontSize: '1.875rem',
            lineHeight: 1.3,
            fontWeight: 600,
          },
          '& .tiptap h3': {
            mt: '1.4rem',
            mb: '1px',
            py: '3px',
            px: '2px',
            fontSize: '1.5rem',
            lineHeight: 1.3,
            fontWeight: 600,
          },
          '& .tiptap h4': {
            mt: '1rem',
            mb: '1px',
            py: '3px',
            px: '2px',
            fontSize: '1.25rem',
            lineHeight: 1.3,
            fontWeight: 600,
          },
          '& .tiptap ul li': {
            position: 'relative',
            my: '1px',
            pl: '1.625rem',
            _before: {
              content: '"•"',
              position: 'absolute',
              top: '0',
              left: '0',
              w: '1.625rem',
              py: '3px',
              textAlign: 'center',
              fontFamily: 'Arial',
              fontSize: '1.5rem',
              lineHeight: '1.5rem',
            },
          },
        })}
        editor={contentEditor}
      />
      <CustomBubbleMenu editor={contentEditor} />
    </div>
  );
};
