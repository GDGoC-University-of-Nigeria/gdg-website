'use client';

import { useAuth } from '@/contexts/AuthContext';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isHydrated } = useAuth();

  if (!isHydrated) {
    return (
      <div className="bg-tech-white flex min-h-screen items-center justify-center">
        <div className="animate-pulsate text-solid-matte-gray">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
