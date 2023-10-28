'use client';

import { HocuspocusProvider } from '@hocuspocus/provider';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Collaboration from '@tiptap/extension-collaboration';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import { BubbleMenu, Editor, EditorContent, useEditor } from '@tiptap/react';
import { css, cx } from '../../../../styled-system/css';
import { flex } from '../../../../styled-system/patterns';

const titleProvider = new HocuspocusProvider({
  url: 'ws://localhost:8008',
  name: '6b8c0248-15ff-428c-8a95-400b75731b19/title',
});

const contentProvider = new HocuspocusProvider({
  url: 'ws://localhost:8008',
  name: '6b8c0248-15ff-428c-8a95-400b75731b19/content',
});

const titleExtensions = [
  Document.extend({
    content: 'block',
  }),
  Text,
  Paragraph,
  Placeholder.configure({
    placeholder: '無題',
    showOnlyCurrent: false,
  }),
  Collaboration.configure({
    document: titleProvider.document,
  }),
];

const contentExtensions = [
  Document,
  Text,
  Heading.configure({
    levels: [1, 2, 3],
  }),
  BulletList,
  HardBreak,
  OrderedList,
  Bold,
  Paragraph,
  ListItem,
  Collaboration.configure({
    document: contentProvider.document,
  }),
];

export const NoteEditor = ({ className }: { className?: string }) => {
  const titleEditor = useEditor({
    extensions: titleExtensions,
  });

  const contentEditor = useEditor({
    extensions: contentExtensions,
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
