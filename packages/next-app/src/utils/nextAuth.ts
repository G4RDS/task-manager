import NextAuth, { User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from 'database';

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
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = nextAuth;

export const getUser = async () => {
  const session = await auth();
  if (!session) {
    return undefined;
  }
  const user = session.user;
  if (!user || !user.id) {
    return undefined;
  }
  return user as User & { id: string };
};

export const getUserOrThrow = async () => {
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
};
