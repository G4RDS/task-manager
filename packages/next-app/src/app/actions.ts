'use server';

import { signOut } from '../utils/nextAuth';

export const signOutAction = () => signOut();
