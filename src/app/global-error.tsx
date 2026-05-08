'use client';

import { Button } from '@/components/ui';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('Global error boundary caught:', error);

  return (
    <html lang="en">
      <body className="font-product-sans bg-tech-white">
        <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
          <h2 className="text-2xl font-semibold text-blackout">Critical error</h2>
          <p className="mt-2 text-sm text-solid-matte-gray">
            The application encountered an unrecoverable error.
          </p>
          <Button className="mt-6" onClick={reset}>
            Reload section
          </Button>
        </div>
      </body>
    </html>
  );
}
