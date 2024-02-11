'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotFoundError } from '../utils/query';

export default function Providers({
  session,
  children,
}: {
  session: Session | null;
  children: ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            retry: (failureCount, error) => {
              if (error instanceof NotFoundError) {
                return false;
              }
              return failureCount < 3;
            },
          },
        },
      }),
  );

  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    queryClient.invalidateQueries();
  }, [pathname, queryClient, searchParams]);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </QueryClientProvider>
  );
}
