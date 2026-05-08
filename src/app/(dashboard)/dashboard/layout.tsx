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
      <a
        href="#dashboard-main"
        className={cls(
          'sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]',
          'focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:shadow-md'
        )}
      >
        Skip to content
      </a>
      <div className={cls('min-h-screen bg-tech-white')}>
        <DashboardNavbar />
        <main id="dashboard-main" className={cls('mx-auto w-full max-w-6xl px-4 py-8 md:px-6')}>
          {children}
        </main>
      </div>
    </RequireAuth>
  );
}
