import { Hocuspocus } from '@hocuspocus/server';
import { TiptapTransformer } from '@hocuspocus/transformer';

const server = new Hocuspocus({
  port: 8008,
});

server.listen();
