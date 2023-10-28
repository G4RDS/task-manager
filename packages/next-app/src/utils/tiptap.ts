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

export const createNoteTitleDocConnection = (noteId: string) => {
  const provider = new HocuspocusProvider({
    url: 'ws://localhost:8008',
    name: `${noteId}/title`,
  });

  const extensions = [
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
      document: provider.document,
    }),
  ];

  return {
    provider,
    extensions,
  } as const;
};

export const createNoteContentDocConnection = (noteId: string) => {
  const provider = new HocuspocusProvider({
    url: 'ws://localhost:8008',
    name: `${noteId}/content`,
  });

  const extensions = [
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
      document: provider.document,
    }),
  ];

  return {
    provider,
    extensions,
  } as const;
};
