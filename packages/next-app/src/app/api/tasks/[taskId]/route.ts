import { NextRequest } from 'next/server';
import { prisma } from 'database';
import { Note, Task } from 'database/src/utils/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export type GetTaskResponse = {
  data: Pick<Task, 'taskId' | 'title' | 'status' | 'createdAt' | 'updatedAt'> &
    Pick<Note, 'noteId'>;
};

export const GET = async (
  _req: NextRequest,
  { params }: { params: { taskId: string } },
) => {
  const task = await prisma.task.findUnique({
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

const putTaskRequestSchema = z.object({
  title: z.string(),
});
export type PostTaskRequest = z.infer<typeof putTaskRequestSchema>;

export const PUT = async (
  req: NextRequest,
  { params }: { params: { taskId: string } },
) => {
  const body = putTaskRequestSchema.parse(await req.json());

  const task = await prisma.task.update({
    data: {
      title: body.title,
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
