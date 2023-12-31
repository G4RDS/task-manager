import { notFound } from 'next/navigation';
import { NextRequest } from 'next/server';
import { prisma } from 'database';
import { getUser } from '../../../../utils/nextAuth';
import { getTaskResponseSchema, putTaskRequestSchema } from './type';

export const dynamic = 'force-dynamic';

export const GET = async (
  _req: NextRequest,
  { params }: { params: { taskId: string } },
) => {
  const user = await getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const task = await prisma.task.findUnique({
    select: {
      taskId: true,
      title: true,
      status: true,
      order: true,
      createdAt: true,
      updatedAt: true,
      noteId: true,
    },
    where: {
      taskId: params.taskId,
      note: {
        authorId: user.id,
      },
    },
  });

  if (!task) {
    notFound();
  }

  return Response.json(getTaskResponseSchema.parse({ data: task }));
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { taskId: string } },
) => {
  const user = await getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = putTaskRequestSchema.parse(await req.json());

  if (
    (await prisma.task.count({
      where: {
        taskId: params.taskId,
        note: {
          authorId: user.id,
        },
      },
    })) === 0
  ) {
    notFound();
  }

  const task = await prisma.task.update({
    data: {
      title: body.title,
      status: body.status,
      order: body.order,
    },
    select: {
      taskId: true,
      title: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      noteId: true,
    },
    where: {
      taskId: params.taskId,
    },
  });

  return Response.json({ data: task });
};
