'use client';

import { usePathname } from 'next/navigation';
import { RequireAdmin } from '@/components/auth/RequireAdmin';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { cls } from '@/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <RequireAdmin>
      <div className={cls('min-h-screen bg-tech-white')}>
        {!isLoginPage && <AdminHeader />}
        <main className={cls('mx-auto w-full max-w-6xl px-4 py-8 md:px-6')}>
          <div className={cls(isLoginPage ? '' : 'mt-6')}>{children}</div>
        </main>
      </div>
    </RequireAdmin>
  );
}
