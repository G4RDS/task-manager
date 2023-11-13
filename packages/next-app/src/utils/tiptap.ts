import { HocuspocusProvider } from '@hocuspocus/provider';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Collaboration from '@tiptap/extension-collaboration';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Heading, { Level } from '@tiptap/extension-heading';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import { mergeAttributes } from '@tiptap/react';

export const createNoteTitleDocConnection = (noteId: string) => {
  const provider = new HocuspocusProvider({
    url: 'ws://localhost:8008',
    name: `note/${noteId}/title`,
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
    name: `note/${noteId}/content`,
  });

  const extensions = [
    Document,
    Text,
    Heading.extend({
      parseHTML() {
        return this.options.levels.map((level: Level) => ({
          tag: `h${level + 1}`,
          attrs: { level },
        }));
      },
      renderHTML({ node, HTMLAttributes }) {
        const hasLevel = this.options.levels.includes(node.attrs.level);
        const level = hasLevel ? node.attrs.level : this.options.levels[0];

        return [
          `h${level + 1}`,
          mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
          0,
        ] as const;
      },
    }).configure({
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

export const createTaskTitleDocConnection = (taskId: string) => {
  const provider = new HocuspocusProvider({
    url: 'ws://localhost:8008',
    name: `task/${taskId}/title`,
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

export const createTaskContentDocConnection = (taskId: string) => {
  const provider = new HocuspocusProvider({
    url: 'ws://localhost:8008',
    name: `task/${taskId}/content`,
  });

  const extensions = [
    Document,
    Text,
    Heading.extend({
      parseHTML() {
        return this.options.levels.map((level: Level) => ({
          tag: `h${level + 1}`,
          attrs: { level },
        }));
      },
      renderHTML({ node, HTMLAttributes }) {
        const hasLevel = this.options.levels.includes(node.attrs.level);
        const level = hasLevel ? node.attrs.level : this.options.levels[0];

        return [
          `h${level + 1}`,
          mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
          0,
        ] as const;
      },
    }).configure({
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
