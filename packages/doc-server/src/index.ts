import { Hocuspocus } from '@hocuspocus/server';
import { TiptapTransformer } from '@hocuspocus/transformer';
import { put } from '@vercel/blob';
import { prisma } from 'database';
import { noteTitleBaseExtensions } from 'tiptap-shared';
import * as Y from 'yjs';
import { z } from 'zod';

const docTypeSchema = z.literal('note');

const convertFromDocumentName = (documentName: string) => {
  const splitted = documentName.split('/');
  const docType = docTypeSchema.parse(splitted[0]);
  const id = splitted[1];

  return { docType, id } as const;
};

// TODO: noteとtaskで分ける
const titleTransformer = TiptapTransformer.extensions(noteTitleBaseExtensions);

const getTitleTextFromYdoc = (doc: Y.Doc): string => {
  const obj = titleTransformer.fromYdoc(doc);
  try {
    return obj?.default?.content?.[0]?.content?.[0]?.text;
  } catch (e) {
    // TODO: Why TypeError cannot be caught?
    console.error(e);
  }
  return '';
};

const getYdocFromTitleText = (text: string): Y.Doc => {
  return titleTransformer.toYdoc(
    {
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
    },
    'title',
  );
};

const server = new Hocuspocus({
  port: 8008,
  onRequest: async (data) => {
    console.log('request:', data);
  },
  onConnect: async (data) => {
    console.log('connect:', data.documentName);
  },
  onDisconnect: async (data) => {
    console.log('disconnect:', data.documentName);
  },
  onLoadDocument: async (data): Promise<Y.Doc> => {
    const { id } = convertFromDocumentName(data.documentName);

    const doc = await prisma.note.findUnique({
      select: { title: true, documentUrl: true },
      where: { noteId: id },
    });

    if (!doc) {
      throw new Error('Note not found');
    }

    if (doc.documentUrl) {
      const res = await fetch(doc.documentUrl);
      const buf = await res.arrayBuffer();
      Y.applyUpdateV2(data.document, new Uint8Array(buf));
    } else if (doc.title) {
      data.document.merge(getYdocFromTitleText(doc.title));
    }

    return data.document;
  },
  onStoreDocument: async (data) => {
    const { id } = convertFromDocumentName(data.documentName);

    const buf = Y.encodeStateAsUpdateV2(data.document).buffer as ArrayBuffer;
    const res = await put(data.documentName, buf, {
      access: 'public',
      cacheControlMaxAge: 0,
    });

    await prisma.note.update({
      where: { noteId: id },
      data: {
        title: getTitleTextFromYdoc(data.document),
        documentUrl: res.url,
      },
    });
  },
  onDestroy: async () => {
    await prisma.$disconnect();
  },
});

server.listen();
