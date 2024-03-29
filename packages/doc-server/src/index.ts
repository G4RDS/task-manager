import { Storage } from '@google-cloud/storage';
import { Hocuspocus } from '@hocuspocus/server';
import { TiptapTransformer } from '@hocuspocus/transformer';
import { Prisma, prisma } from 'database';
import { noteTitleBaseExtensions } from 'tiptap-shared';
import * as Y from 'yjs';
import { z } from 'zod';

const storage = new Storage().bucket(process.env.GCS_BUCKET_NAME as string);

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
  port: Number(process.env.PORT) || 8008,
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

    const note = await prisma.note.findUnique({
      select: { title: true, documentUrl: true },
      where: { noteId: id },
    });

    if (!note) {
      throw new Error('Note not found');
    }

    const file = await storage.file(data.documentName);

    if ((await file.exists())[0]) {
      const buf = (await file.download())[0];
      Y.applyUpdateV2(data.document, new Uint8Array(buf));
    } else if (note.title) {
      data.document.merge(getYdocFromTitleText(note.title));
    }

    return data.document;
  },
  onStoreDocument: async (data) => {
    const { id } = convertFromDocumentName(data.documentName);

    const buf = Buffer.from(Y.encodeStateAsUpdateV2(data.document).buffer);
    await storage.file(data.documentName).save(buf);

    try {
      await prisma.note.update({
        where: { noteId: id },
        data: {
          title: getTitleTextFromYdoc(data.document),
        },
      });
    } catch (err) {
      if (!(err instanceof Prisma.PrismaClientKnownRequestError)) {
        throw err;
      }
      if (err.code === 'P2025') {
        // user has deleted the note
        return;
      }
      throw err;
    }
  },
  onDestroy: async () => {
    await prisma.$disconnect();
  },
});

server.listen();
