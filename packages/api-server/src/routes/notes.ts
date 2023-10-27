import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { getNotesQuerySchema, getNotesResponseSchema } from 'api-server-type';
import { prisma } from 'database';

export const getNotes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Reply: z.infer<typeof getNotesResponseSchema>;
  }>('/notes', async (request, reply) => {
    const query = getNotesQuerySchema.safeParse(request.query);

    if (!query.success) {
      throw fastify.httpErrors.badRequest(query.error.message);
    }

    const notes = await prisma.note.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    const response = { data: notes };
    getNotesResponseSchema.strict().parse(response);
    reply.send(response);
  });
};
