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
  title: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  order: z.string(),
});
export type PutTaskRequest = z.infer<typeof putTaskRequestSchema>;

export type PutTaskResponse = {
  data: Pick<Task, 'taskId' | 'title' | 'status' | 'createdAt' | 'updatedAt'> &
    Pick<Note, 'noteId'>;
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { taskId: string } },
) => {
  const body = putTaskRequestSchema.parse(await req.json());

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
