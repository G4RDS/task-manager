import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';
import { prisma } from 'database';
import { generateKeyBetween } from 'fractional-indexing';
import { getUser } from '../../../utils/nextAuth';
import { getTasks } from './query';
import { postTaskRequestSchema } from './type';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  const user = await getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  return Response.json(await getTasks(user.id));
};

export const POST = async (req: NextRequest) => {
  const user = await getUser();
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

  revalidatePath('/');

  return Response.json({ data: task });
};
