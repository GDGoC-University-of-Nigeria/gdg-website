'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.replace('/auth?mode=login');
    }
  }, [isHydrated, user, router]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tech-white">
        <div className="animate-pulsate text-solid-matte-gray">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
