'use client';

import { useState } from 'react';
import { ReactSVG } from 'react-svg';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
import { cls } from '@/utils';

type LinkItem = { target: string; label: string };

function getDashboardLinks(isAdmin: boolean): LinkItem[] {
  const links: LinkItem[] = [
    { target: '/dashboard', label: 'Dashboard' },
    { target: '/dashboard/profile', label: 'Profile' },
    { target: '/dashboard/community', label: 'Community' },
    { target: '/dashboard/events', label: 'Events' },
    { target: '/dashboard/projects', label: 'Projects' },
    { target: '/dashboard/blog', label: 'Blog' }
  ];
  if (isAdmin) links.push({ target: '/admin', label: 'Admin' });
  links.push({ target: '#', label: 'Log out' });
  return links;
}

export function DashboardNavbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isHydrated } = useAuth();
  const navLinks = getDashboardLinks(user?.is_admin ?? false);

  const handleNavClick = async (item: LinkItem) => {
    if (item.label === 'Log out') {
      try {
        await logout();
      } finally {
        router.replace('/');
      }
    }
    setIsDrawerOpen(false);
  };

  const navLinkClass = (target: string, label: string) => {
    const isActive =
      label === 'Dashboard'
        ? pathname === '/dashboard'
        : pathname === target || (target !== '/dashboard' && pathname.startsWith(target));
    return cls(
      'rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
      isActive
        ? 'bg-alexandra/10 text-alexandra'
        : 'text-solid-matte-gray hover:bg-tech-white hover:text-blackout'
    );
  };

  return (
    <>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close menu overlay"
            className="absolute inset-0 bg-black/35"
            onClick={() => setIsDrawerOpen(false)}
          />
          <aside className="relative z-10 flex h-full w-[min(320px,85vw)] flex-col bg-white p-6 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <Link href="/dashboard" onClick={() => setIsDrawerOpen(false)}>
                <Image
                  alt="GDG UNN Logo"
                  src="/images/logo-banner.png"
                  height={52}
                  width={220}
                  className="h-11 w-auto"
                />
              </Link>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="-m-2 p-2 text-solid-matte-gray hover:text-blackout"
                aria-label="Close menu"
              >
                <ReactSVG src="/graphics/close.svg" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {isHydrated &&
                navLinks.map(({ target, label }) =>
                  label === 'Log out' ? (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleNavClick({ target, label })}
                      className={cls(
                        'rounded-lg px-3 py-3 text-left font-medium text-solid-matte-gray',
                        'hover:bg-red-50 hover:text-red-600'
                      )}
                    >
                      {label}
                    </button>
                  ) : (
                    <Link
                      key={label}
                      onClick={() => setIsDrawerOpen(false)}
                      href={target}
                      className={navLinkClass(target, label)}
                    >
                      {label}
                    </Link>
                  )
                )}
            </nav>
          </aside>
        </div>
      )}

      <header className="sticky top-0 z-20 w-full border-b border-[#DADCE0] bg-white shadow-sm">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex min-w-0 shrink-0 items-center">
            <Image
              alt="GDG UNN"
              src="/images/logo-banner.png"
              height={48}
              width={220}
              className="h-10 w-auto max-w-[180px] sm:max-w-[220px]"
              priority
            />
          </Link>

          <nav className="hidden flex-1 justify-end md:flex">
            <ul className="scrollbar-hide flex items-center gap-1 overflow-x-auto">
              {isHydrated &&
                navLinks.map(({ target, label }) => (
                  <li key={label} className="shrink-0">
                    {label === 'Log out' ? (
                      <button
                        type="button"
                        onClick={() => handleNavClick({ target, label })}
                        className={cls(
                          'rounded-lg px-3 py-2 text-sm font-medium text-solid-matte-gray',
                          'transition-colors hover:bg-red-50 hover:text-red-600'
                        )}
                      >
                        {label}
                      </button>
                    ) : (
                      <Link href={target} className={navLinkClass(target, label)}>
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="-m-2 p-2 text-solid-matte-gray hover:text-blackout md:hidden"
            aria-label="Open menu"
          >
            <ReactSVG src="/graphics/menu.svg" className="h-6 w-6" />
          </button>
        </div>
      </header>
    </>
  );
}
