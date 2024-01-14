import { getUser } from '../../../utils/nextAuth';
import { getTasks } from './query';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  const user = await getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  return Response.json(await getTasks(user.id));
};
