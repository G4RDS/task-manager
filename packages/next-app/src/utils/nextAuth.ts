import NextAuth, {
  Session,
  NextAuthResult as _NextAuthResult,
} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { AppRouteHandlerFn } from 'next/dist/server/future/route-modules/app-route/module.js';
import { NextRequest } from 'next/server';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from 'database';

export interface NextAuthRequest extends NextRequest {
  auth: Session | null;
}

const nextAuth = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GoogleProvider],
  callbacks: {
    async session({ session, user }) {
      if (user && session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
} = nextAuth;
export const auth = nextAuth.auth as _NextAuthResult['auth'] &
  ((
    ...args: [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req: NextAuthRequest, context: any) => ReturnType<AppRouteHandlerFn>,
    ]
  ) => AppRouteHandlerFn);

export const getUser = async () => {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }
  const user = session.user;
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
};
