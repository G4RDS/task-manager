import { prisma } from 'database';
import { generateKeyBetween } from 'fractional-indexing';
import { auth } from '../../../utils/nextAuth';
import { getTasksResponseSchema, postTaskRequestSchema } from './type';

export const dynamic = 'force-dynamic';

export const GET = auth(async (req) => {
  const user = req.auth?.user;
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

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
    where: {
      note: {
        authorId: user.id,
      },
    },
    orderBy: {
      order: 'asc',
    },
  });

  return Response.json(getTasksResponseSchema.parse({ data: tasks }));
});

export const POST = auth(async (req) => {
  const user = req.auth?.user;
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = postTaskRequestSchema.parse(await req.json());

  const firstTask = await prisma.task.findFirst({
    select: {
      order: true,
    },
    where: {
      note: {
        authorId: user.id,
      },
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
});
