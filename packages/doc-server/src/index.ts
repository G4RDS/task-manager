import { Hocuspocus } from '@hocuspocus/server';
import { TiptapTransformer } from '@hocuspocus/transformer';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { prisma } from 'database';
import * as Y from 'yjs';

const titleExtensions = [
  Document.extend({
    content: 'block',
  }),
  Text,
  Paragraph,
];

const titleTransformer = TiptapTransformer.extensions(titleExtensions);

const getTitleTextFromYdoc = (doc: Y.Doc): string => {
  const obj = titleTransformer.fromYdoc(doc);
  try {
    return obj.default.content[0].content[0].text;
  } catch (e) {
    console.error(e);
  }
  return '';
};

const getYdocFromTitleText = (text: string): Y.Doc => {
  return titleTransformer.toYdoc({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text,
          },
        ],
      },
    ],
  });
};

const server = new Hocuspocus({
  port: 8008,
  onLoadDocument: async (data): Promise<Y.Doc> => {
    const [id, type] = data.documentName.split('/');

    if (type !== 'title' && type !== 'content') {
      throw new Error('Invalid document type');
    }

    if (type === 'title') {
      const note = await prisma.note.findUnique({
        select: { titleBlob: true, title: true },
        where: { id },
      });

      if (!note) {
        throw new Error('Note not found');
      }

      if (note.titleBlob) {
        Y.applyUpdate(data.document, note.titleBlob);
      } else if (note.title) {
        return getYdocFromTitleText(note.title);
      }

      return data.document;
    } else {
      const note = await prisma.note.findUnique({
        select: { contentBlob: true },
        where: { id },
      });

      if (!note) {
        throw new Error('Note not found');
      }

      if (note.contentBlob) {
        Y.applyUpdate(data.document, note.contentBlob);
      }

      return data.document;
    }
  },
  onStoreDocument: async (data) => {
    const [id, type] = data.documentName.split('/');

    if (type !== 'title' && type !== 'content') {
      throw new Error('Invalid document type');
    }

    if (type === 'title') {
      await prisma.note.update({
        where: { id },
        data: {
          titleBlob: Buffer.from(Y.encodeStateAsUpdate(data.document)),
          title: getTitleTextFromYdoc(data.document),
        },
      });
    } else {
      await prisma.note.update({
        where: { id },
        data: {
          contentBlob: Buffer.from(Y.encodeStateAsUpdate(data.document)),
        },
      });
    }
  },
  onDestroy: async () => {
    await prisma.$disconnect();
  },
});

server.listen();
