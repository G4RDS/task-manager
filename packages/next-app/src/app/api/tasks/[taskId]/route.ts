import { notFound } from 'next/navigation';
import { prisma } from 'database';
import { NextAuthRequest, auth } from '../../../../utils/nextAuth';
import { getTaskResponseSchema, putTaskRequestSchema } from './type';

export const dynamic = 'force-dynamic';

export const GET = auth(
  async (req: NextAuthRequest, { params }: { params: { taskId: string } }) => {
    const user = req.auth?.user;
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
  },
);

export const PUT = auth(
  async (req: NextAuthRequest, { params }: { params: { taskId: string } }) => {
    const user = req.auth?.user;
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
  },
);
