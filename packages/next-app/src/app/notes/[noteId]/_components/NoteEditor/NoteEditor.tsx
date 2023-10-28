'use client';

import { useEffect, useState } from 'react';
import {
  BubbleMenu,
  Editor,
  EditorContent,
  Extensions,
  useEditor,
} from '@tiptap/react';
import { css, cx } from '../../../../../../styled-system/css';
import { flex } from '../../../../../../styled-system/patterns';
import {
  createNoteContentDocConnection,
  createNoteTitleDocConnection,
} from '../../../../../utils/tiptap';

export const NoteEditor = ({
  noteId,
  className,
}: {
  noteId: string;
  className?: string;
}) => {
  const [titleDocExtensions, setTitleDocExtensions] = useState<Extensions>();
  const [contentDocExtensions, setContentDocExtensions] =
    useState<Extensions>();

  useEffect(() => {
    const title = createNoteTitleDocConnection(noteId);
    const content = createNoteContentDocConnection(noteId);
    setTitleDocExtensions(title.extensions);
    setContentDocExtensions(content.extensions);

    return () => {
      title.provider.destroy();
      content.provider.destroy();
    };
  }, [noteId]);

  if (!titleDocExtensions || !contentDocExtensions) {
    return null;
  }

  return (
    <NoteEditorInner
      titleDocExtensions={titleDocExtensions}
      contentDocExtensions={contentDocExtensions}
      className={className}
    />
  );
};

const NoteEditorInner = ({
  titleDocExtensions,
  contentDocExtensions,
  className,
}: {
  titleDocExtensions: Extensions;
  contentDocExtensions: Extensions;
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
    <div className={cx(flex({ flexDir: 'column' }), className)}>
      <EditorContent
        className={css({
          flex: '0 0 auto',
          position: 'relative',
          w: '100%',
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
      <EditorContent
        className={flex({
          flex: '1',
          flexDir: 'column',
          w: '100%',
          pt: 2,
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
            px: '2px',
            py: '3px',
          },
          '& .tiptap ul li': {
            position: 'relative',
            my: '1px',
            pl: '26px',
            _before: {
              content: '"•"',
              position: 'absolute',
              top: '0',
              left: '0',
              w: '26px',
              py: '3px',
              textAlign: 'center',
              fontFamily: 'Arial',
              fontSize: '24px',
              lineHeight: '24px',
            },
          },
        })}
        editor={contentEditor}
      />
      <CustomBubbleMenu editor={contentEditor} />
    </div>
  );
};

const CustomBubbleMenu = ({ editor }: { editor: Editor }) => {
  return (
    <BubbleMenu
      editor={editor}
      className={flex({
        alignItems: 'stretch',
        height: '32px',
        backgroundColor: 'white',
        borderRadius: 6,
        boxShadow: 'md',
      })}
    >
      <button
        type="button"
        onClick={() => editor?.chain().focus().toggleBold().run()}
        data-active={editor?.isActive('bold') || undefined}
        className={flex({
          alignItems: 'center',
          px: 2,
          transition: 'background 20ms token(easings.easeIn)',
          cursor: 'pointer',
          color: 'gray.700',
          fontWeight: 'bold',
          fontSize: '14px',
          _hover: {
            bg: 'gray.50',
          },
          _active: {
            color: 'primary.500',
          },
        })}
      >
        B
      </button>
    </BubbleMenu>
  );
};
