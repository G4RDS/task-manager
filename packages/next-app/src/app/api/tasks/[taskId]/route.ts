import { notFound } from 'next/navigation';
import { NextRequest } from 'next/server';
import { prisma } from 'database';
import { Note, Task } from 'database';
import { z } from 'zod';
import { taskStatusSchema } from '../../../../utils/taskStatus';

export const dynamic = 'force-dynamic';

export const getTaskResponseSchema = z.object({
  data: z.object({
    taskId: z.string().uuid(),
    title: z.string(),
    status: taskStatusSchema,
    order: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    noteId: z.string().uuid(),
  }),
});

export type GetTaskResponse = z.infer<typeof getTaskResponseSchema>;

export const GET = async (
  _req: NextRequest,
  { params }: { params: { taskId: string } },
) => {
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
    },
  });

  if (!task) {
    notFound();
  }

  return Response.json(getTaskResponseSchema.parse({ data: task }));
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
