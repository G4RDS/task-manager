import { NextRequest } from 'next/server';
import { getUser } from '../../../../../utils/nextAuth';
import { getTasksForNote } from './query';

export const dynamic = 'force-dynamic';

export const GET = async (
  _req: NextRequest,
  { params }: { params: { noteId: string } },
) => {
  const user = await getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  return Response.json(await getTasksForNote(user.id, params.noteId));
};
