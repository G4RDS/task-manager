import { FastifyPluginAsync } from 'fastify';
import { getNotes } from './routes/notes';

export const router: FastifyPluginAsync = async (fastify) => {
  fastify.register(getNotes);
};
