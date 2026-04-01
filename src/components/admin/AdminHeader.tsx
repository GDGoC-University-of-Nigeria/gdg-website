'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ReactSVG } from 'react-svg';
import { Drawer } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { cls } from '@/utils';

const adminLinks = [
  { target: '/admin', label: 'Dashboard' },
  { target: '/admin/users', label: 'Users' },
  { target: '/admin/blog', label: 'Blog' },
  { target: '/admin/events', label: 'Events' },
  { target: '/admin/projects', label: 'Projects' },
  { target: '#', label: 'Log out' }
];

function isLinkActive(pathname: string, target: string): boolean {
  if (target === '#') return false;
  if (target === '/admin') return pathname === '/admin';
  return pathname.startsWith(target);
}

export function AdminHeader() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { logout, isHydrated } = useAuth();

  const handleNavClick = (item: (typeof adminLinks)[0]) => {
    if (item.label === 'Log out') {
      logout();
      window.location.href = '/';
    }
    setIsDrawerOpen(false);
  };

  return (
    <>
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              borderBottomRightRadius: '32px',
              borderTopRightRadius: '32px',
              backgroundColor: 'white',
              width: 'min(320px, 85vw)'
            }
          }
        }}
      >
        <aside className="flex h-full flex-col border-r border-[#DADCE0] bg-white p-6">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/admin" onClick={() => setIsDrawerOpen(false)}>
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
              className="text-solid-matte-gray hover:text-blackout -m-2 p-2"
              aria-label="Close menu"
            >
              <ReactSVG src="/graphics/close.svg" />
            </button>
          </div>
          <span className="text-alexandra mb-4 text-xs font-medium tracking-wider uppercase">
            Admin
          </span>
          <nav className="flex flex-col gap-1">
            {isHydrated &&
              adminLinks.map(({ target, label }) =>
                label === 'Log out' ? (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleNavClick({ target, label })}
                    className={cls(
                      'text-solid-matte-gray rounded-lg px-3 py-3 text-left font-medium hover:bg-red-50 hover:text-red-600'
                    )}
                  >
                    {label}
                  </button>
                ) : (
                  <Link
                    onClick={() => setIsDrawerOpen(false)}
                    href={target}
                    key={target}
                    className={cls(
                      'rounded-lg px-3 py-3 transition-colors',
                      isLinkActive(pathname, target)
                        ? 'bg-alexandra text-white'
                        : 'text-blackout hover:bg-tech-white'
                    )}
                  >
                    {label}
                  </Link>
                )
              )}
          </nav>
        </aside>
      </Drawer>
      <header
        className={cls(
          'sticky top-0 z-20 w-full border-b border-[#DADCE0]',
          'text-blackout bg-white shadow-sm'
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-360 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/admin"
            className="flex min-w-0 shrink-0 items-center gap-3"
          >
            <Image
              alt="GDG UNN Admin"
              src="/images/logo-banner.png"
              height={48}
              width={220}
              className="h-10 w-auto max-w-[180px] sm:max-w-[220px]"
              priority
            />
            <span className="bg-alexandra/10 text-alexandra border-alexandra/30 hidden items-center rounded-sm border px-2.5 py-0.5 text-xs font-medium tracking-wider uppercase sm:inline-flex">
              Admin
            </span>
          </Link>
          <nav className="flex flex-1 items-center justify-end gap-6">
            <div className="scrollbar-hide hidden max-w-full items-center gap-6 overflow-x-auto md:flex">
              {isHydrated &&
                adminLinks.map(({ target, label }) =>
                  label === 'Log out' ? (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleNavClick({ target, label })}
                      className={cls(
                        'rounded-lg px-3 py-2 text-sm font-medium',
                        'text-solid-matte-gray transition-colors hover:bg-red-50 hover:text-red-600'
                      )}
                    >
                      {label}
                    </button>
                  ) : (
                    <Link
                      key={target}
                      href={target}
                      className={cls(
                        'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isLinkActive(pathname, target)
                          ? 'bg-alexandra text-white'
                          : 'text-blackout hover:bg-tech-white'
                      )}
                    >
                      {label}
                    </Link>
                  )
                )}
            </div>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="text-solid-matte-gray hover:text-blackout -m-2 p-2 md:hidden"
              aria-label="Open menu"
            >
              <ReactSVG src="/graphics/menu.svg" className="h-6 w-6" />
            </button>
          </nav>
        </div>
      </header>
    </>
  );
}
