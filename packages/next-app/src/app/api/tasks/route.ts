import { NextRequest } from 'next/server';
import { prisma } from 'database';
import { generateKeyBetween } from 'fractional-indexing';
import { getTasksResponseSchema, postTaskRequestSchema } from './type';

export const dynamic = 'force-dynamic';

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

  return Response.json(getTasksResponseSchema.parse({ data: tasks }));
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
