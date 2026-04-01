'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isHydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAdminLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isHydrated) return;
    if (isAdminLoginPage) return;
    if (!user) {
      router.replace('/admin/login');
      return;
    }
    if (!user.is_admin) {
      router.replace('/dashboard');
    }
  }, [isHydrated, user, router, isAdminLoginPage]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tech-white">
        <div className="animate-pulsate text-solid-matte-gray">Loading...</div>
      </div>
    );
  }

  if (isAdminLoginPage) {
    return <>{children}</>;
  }

  if (!user || !user.is_admin) {
    return null;
  }

  return <>{children}</>;
}
