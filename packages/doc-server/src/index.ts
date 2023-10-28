import { Hocuspocus } from '@hocuspocus/server';
import { TiptapTransformer } from '@hocuspocus/transformer';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { put } from '@vercel/blob';
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
  onConnect: async (data) => {
    console.log('connect:', data.documentName);
  },
  onDisconnect: async (data) => {
    console.log('disconnect:', data.documentName);
  },
  onLoadDocument: async (data): Promise<Y.Doc> => {
    const [id, type] = data.documentName.split('/');

    if (type !== 'title' && type !== 'content') {
      throw new Error('Invalid document type');
    }

    if (type === 'title') {
      const note = await prisma.note.findUnique({
        select: { title: true, titleBlobUrl: true },
        where: { id },
      });

      if (!note) {
        throw new Error('Note not found');
      }

      if (note.titleBlobUrl) {
        const res = await fetch(note.titleBlobUrl);
        const buf = await res.arrayBuffer();
        Y.applyUpdate(data.document, new Uint8Array(buf));
      } else if (note.title) {
        return getYdocFromTitleText(note.title);
      }

      return data.document;
    } else {
      const note = await prisma.note.findUnique({
        select: { contentBlobUrl: true },
        where: { id },
      });

      if (!note) {
        throw new Error('Note not found');
      }

      if (note.contentBlobUrl) {
        const res = await fetch(note.contentBlobUrl);
        const buf = await res.arrayBuffer();
        Y.applyUpdate(data.document, new Uint8Array(buf));
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
      const res = await put(
        `${id}/title`,
        Y.encodeStateAsUpdate(data.document).buffer as ArrayBuffer,
        {
          access: 'public',
          addRandomSuffix: false,
        },
      );
      await prisma.note.update({
        where: { id },
        data: {
          title: getTitleTextFromYdoc(data.document),
          titleBlobUrl: res.url,
        },
      });
    } else {
      const res = await put(
        `${id}/content`,
        Y.encodeStateAsUpdate(data.document).buffer as ArrayBuffer,
        {
          access: 'public',
          addRandomSuffix: false,
        },
      );
      await prisma.note.update({
        where: { id },
        data: {
          contentBlobUrl: res.url,
        },
      });
    }
  },
  onDestroy: async () => {
    await prisma.$disconnect();
  },
});

server.listen();
