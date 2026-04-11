'use client';

import { RequireAuth } from '@/components/auth/RequireAuth';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { cls } from '@/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className={cls('min-h-screen bg-tech-white')}>
        <DashboardNavbar />
        <main className={cls('mx-auto w-full max-w-6xl px-4 py-8 md:px-6')}>
          {children}
        </main>
      </div>
    </RequireAuth>
  );
}
