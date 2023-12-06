import { NextRequest } from 'next/server';
import { prisma } from 'database';
import { Note, Task } from 'database/src/utils/prisma';
import { generateKeyBetween } from 'fractional-indexing';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const postTaskRequestSchema = z.object({
  noteId: z.string().uuid(),
});
export type PostTaskRequest = z.infer<typeof postTaskRequestSchema>;

export type PostTaskResponse = {
  data: Pick<Task, 'taskId' | 'title' | 'status' | 'createdAt' | 'updatedAt'> &
    Pick<Note, 'noteId'>;
};

export const POST = async (req: NextRequest) => {
  const body = postTaskRequestSchema.parse(await req.json());

  const firstTask = await prisma.task.findFirst({
    select: {
      order: true,
    },
    orderBy: {
      order: 'asc',
    },
  });
  const minimumOrder = generateKeyBetween(undefined, firstTask?.order);
  const task = await prisma.task.create({
    data: {
      title: '',
      noteId: body.noteId,
      order: minimumOrder,
    },
    select: {
      taskId: true,
      title: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      noteId: true,
    },
  });

  return Response.json({ data: task });
};
