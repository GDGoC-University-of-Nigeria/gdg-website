'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cls } from '@/utils';

const adminLinks = [
  { href: '/admin', label: 'Users' },
  { href: '/admin/blog', label: 'Blog moderation' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className={cls('flex gap-4 mb-6 border-b border-[#DADCE0] pb-4')}>
      {adminLinks.map(({ href, label }) => {
        const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cls(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              isActive
                ? 'bg-alexandra text-white'
                : 'text-solid-matte-gray hover:bg-tech-white hover:text-blackout'
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
