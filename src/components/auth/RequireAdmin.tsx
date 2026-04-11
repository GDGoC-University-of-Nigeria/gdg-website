'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isHydrated } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.replace('/auth');
      return;
    }
    if (!user.is_admin) {
      router.replace('/dashboard');
    }
  }, [isHydrated, user, router]);


  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tech-white">
        <div className="animate-pulsate text-solid-matte-gray">Loading...</div>
      </div>
    );
  }

  if (!user || !user.is_admin) {
    return null;
  }


  return <>{children}</>;
}
