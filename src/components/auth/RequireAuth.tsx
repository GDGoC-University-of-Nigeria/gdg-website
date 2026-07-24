'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';

/**
 * Client-side guard for signed-in routes.
 *
 * This is the only route guard the app has: auth is a bearer token in
 * localStorage, which Next middleware (server-side) cannot read, so the check
 * has to happen here. The API independently rejects unauthorised requests —
 * this guard is UX, not a security boundary.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isHydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isHydrated || user) return;
    const next = pathname ? `?next=${encodeURIComponent(pathname)}` : '';
    router.replace(`/auth${next}`);
  }, [isHydrated, user, router, pathname]);

  if (!isHydrated || !user) {
    return (
      <div className="bg-tech-white flex min-h-screen items-center justify-center">
        <div className="animate-pulsate text-solid-matte-gray">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
