'use client';

import { RequireAdmin } from '@/components/auth/RequireAdmin';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { cls } from '@/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAdmin>
      <a
        href="#admin-main"
        className={cls(
          'sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]',
          'focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:shadow-md'
        )}
      >
        Skip to content
      </a>
      <div className={cls('min-h-screen bg-tech-white')}>
        <AdminHeader />
        <main
          id="admin-main"
          className={cls('mx-auto w-full max-w-6xl px-4 py-8 md:px-6')}
        >
          <div className={cls('mt-6')}>{children}</div>
        </main>
      </div>
    </RequireAdmin>
  );
}
