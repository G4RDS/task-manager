import { Hocuspocus } from '@hocuspocus/server';
import { TiptapTransformer } from '@hocuspocus/transformer';
import { generateHTML } from '@tiptap/html';
import { put } from '@vercel/blob';
import { prisma } from 'database';
import {
  noteTitleBaseExtensions,
  taskContentBaseExtensions,
} from 'tiptap-shared';
import * as Y from 'yjs';
import { z } from 'zod';

const docTypeSchema = z.union([z.literal('note'), z.literal('task')]);
const contentTypeSchema = z.union([z.literal('title'), z.literal('content')]);

const convertFromDocumentName = (documentName: string) => {
  const splitted = documentName.split('/');
  const docType = docTypeSchema.parse(splitted[0]);
  const id = splitted[1];
  const contentType = contentTypeSchema.parse(splitted[2]);

  return { docType, id, contentType } as const;
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
    const { id, docType, contentType } = convertFromDocumentName(
      data.documentName,
    );

    if (contentType === 'title') {
      const doc =
        docType === 'note'
          ? await prisma.note.findUnique({
              select: { title: true, titleBlobUrl: true },
              where: { noteId: id },
            })
          : await prisma.task.findUnique({
              select: { title: true, titleBlobUrl: true },
              where: { taskId: id },
            });

      if (!doc) {
        throw new Error('Note not found');
      }

      if (doc.titleBlobUrl) {
        const res = await fetch(doc.titleBlobUrl);
        const buf = await res.arrayBuffer();
        Y.applyUpdateV2(data.document, new Uint8Array(buf));
      } else if (doc.title) {
        return getYdocFromTitleText(doc.title);
      }

      return data.document;
    } else {
      const doc =
        docType === 'note'
          ? await prisma.note.findUnique({
              select: { contentBlobUrl: true },
              where: { noteId: id },
            })
          : await prisma.task.findUnique({
              select: { contentBlobUrl: true },
              where: { taskId: id },
            });

      if (!doc) {
        throw new Error('Note not found');
      }

      if (doc.contentBlobUrl) {
        const res = await fetch(doc.contentBlobUrl);
        const buf = await res.arrayBuffer();
        Y.applyUpdateV2(data.document, new Uint8Array(buf));
      }

      return data.document;
    }
  },
  onStoreDocument: async (data) => {
    const { id, docType, contentType } = convertFromDocumentName(
      data.documentName,
    );

    if (contentType === 'title') {
      const buf = Y.encodeStateAsUpdateV2(data.document).buffer as ArrayBuffer;
      const res = await put(data.documentName, buf, {
        access: 'public',
        cacheControlMaxAge: 0,
      });

      if (docType === 'note') {
        await prisma.note.update({
          where: { noteId: id },
          data: {
            title: getTitleTextFromYdoc(data.document),
            titleBlobUrl: res.url,
          },
        });
      } else {
        await prisma.task.update({
          where: { taskId: id },
          data: {
            title: getTitleTextFromYdoc(data.document),
            titleBlobUrl: res.url,
          },
        });
      }
    } else {
      const buf = Y.encodeStateAsUpdateV2(data.document).buffer as ArrayBuffer;
      const res = await put(data.documentName, buf, {
        access: 'public',
        cacheControlMaxAge: 0,
      });

      const prosemirrorJson = TiptapTransformer.fromYdoc(data.document);
      const html = generateHTML(
        prosemirrorJson.default,
        taskContentBaseExtensions,
      );

      if (docType === 'note') {
        await prisma.note.update({
          where: { noteId: id },
          data: {
            contentBlobUrl: res.url,
            contentHtml: html,
          },
        });
      } else {
        await prisma.task.update({
          where: { taskId: id },
          data: {
            contentBlobUrl: res.url,
            contentHtml: html,
          },
        });
      }
    }
  },
  onDestroy: async () => {
    await prisma.$disconnect();
  },
});

server.listen();
