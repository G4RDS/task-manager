import Fastify from 'fastify';
import FastifySensible from '@fastify/sensible';
import FastifyCors from '@fastify/cors';
import { router } from './router';

const fastify = Fastify({
  logger: true,
});

fastify.register(FastifySensible);
fastify.register(FastifyCors, {
  origin: '*',
});
fastify.register(router);

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
