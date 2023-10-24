import { Hocuspocus } from '@hocuspocus/server';
import { prisma } from 'database';
import * as Y from 'yjs';

const server = new Hocuspocus({
  port: 8008,
  onStoreDocument: async (data) => {
    const [id, type] = data.documentName.split('.');

    if (type !== 'title' && type !== 'content') {
      throw new Error('Invalid document type');
    }

    if (type === 'title') {
      await prisma.note.update({
        where: { id },
        data: {
          titleBlob: Buffer.from(Y.encodeStateAsUpdate(data.document)),
          title: data.document.toString(),
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
  onLoadDocument: async (data): Promise<Y.Doc> => {
    const [id, type] = data.documentName.split('.');

    if (type !== 'title' && type !== 'content') {
      throw new Error('Invalid document type');
    }

    if (type === 'title') {
      const note = await prisma.note.findUnique({
        select: { titleBlob: true },
        where: { id },
      });

      if (!note) {
        throw new Error('Note not found');
      }

      if (note.titleBlob) {
        Y.applyUpdate(data.document, note.titleBlob);
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

  onDestroy: async () => {
    await prisma.$disconnect();
  },
});

server.listen();
