'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui';

export default function AppError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App route error boundary caught:', error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <h2 className="text-2xl font-semibold text-blackout">Something went wrong</h2>
      <p className="mt-2 text-sm text-solid-matte-gray">
        We hit an unexpected issue while rendering this page.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
