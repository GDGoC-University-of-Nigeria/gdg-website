'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Serve cached data instantly and revalidate in the background, so
        // moving between dashboard pages doesn't refetch everything.
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Never retry auth/permission/not-found errors — the api client
          // already attempted a token refresh, so retrying just repeats it.
          if (error instanceof ApiError) {
            if ([400, 401, 403, 404, 422].includes(error.status)) return false;
          }
          return failureCount < 2;
        }
      }
    }
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  // useState so the client is created once per browser session and is never
  // shared across requests during SSR.
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
