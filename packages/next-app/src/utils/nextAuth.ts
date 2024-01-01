import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type {} from '@auth/core';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from 'database';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GoogleProvider],
});
