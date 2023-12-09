import { NextRequest } from 'next/server';
import { prisma } from 'database';
import { Note, Task } from 'database/src/utils/prisma';
import { generateKeyBetween } from 'fractional-indexing';
import { z } from 'zod';
import { taskStatusSchema } from '../../../utils/taskStatus';

export const dynamic = 'force-dynamic';

export const getTasksResponseSchema = z.object({
  data: z.array(
    z.object({
      taskId: z.string().uuid(),
      title: z.string(),
      status: taskStatusSchema,
      order: z.string(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
      note: z.object({
        noteId: z.string().uuid(),
        title: z.string(),
        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date(),
      }),
    }),
  ),
});

export const GET = async () => {
  const tasks = await prisma.task.findMany({
    select: {
      taskId: true,
      title: true,
      status: true,
      order: true,
      createdAt: true,
      updatedAt: true,
      note: {
        select: {
          noteId: true,
          title: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
    orderBy: {
      order: 'asc',
    },
  });

  console.log(getTasksResponseSchema.safeParse({ data: tasks }));

  return Response.json({ data: tasks });
};

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
