import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Heading, { Level } from '@tiptap/extension-heading';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { mergeAttributes } from '@tiptap/react';

export const noteTitleBaseExtensions = [
  Document.extend({
    content: 'block',
  }),
  Text,
  Paragraph,
];

export const noteContentBaseExtensions = [
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
];
