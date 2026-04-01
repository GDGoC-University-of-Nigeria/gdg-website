'use client';

import { useState } from 'react';
import { ReactSVG } from 'react-svg';
import { Drawer } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  if (isAdmin) {
    links.push({ target: '/admin', label: 'Admin' });
  }
  links.push({ target: '#', label: 'Log out' });
  return links;
}

export function DashboardNavbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isHydrated } = useAuth();
  const navLinks = getDashboardLinks(user?.is_admin ?? false);

  const handleNavClick = async (item: LinkItem) => {
    if (item.label === 'Log out') {
      await logout();
      window.location.href = '/';
    }
    setIsDrawerOpen(false);
  };

  const navLinkClass = (target: string, label: string) => {
    const isActive =
      label === 'Dashboard'
        ? pathname === '/dashboard'
        : pathname === target ||
          (target !== '/dashboard' && pathname.startsWith(target));
    return cls(
      'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
      isActive
        ? 'bg-alexandra/10 text-alexandra'
        : 'text-solid-matte-gray hover:bg-tech-white hover:text-blackout'
    );
  };

  return (
    <>
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              borderBottomRightRadius: '16px',
              borderTopRightRadius: '16px',
              backgroundColor: 'white',
              width: 'min(320px, 85vw)'
            }
          }
        }}
      >
        <aside className="flex h-full flex-col bg-white p-6">
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
              className="text-solid-matte-gray hover:text-blackout -m-2 p-2"
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
                      'text-solid-matte-gray rounded-lg px-3 py-3 text-left font-medium hover:bg-red-50 hover:text-red-600'
                    )}
                  >
                    {label}
                  </button>
                ) : (
                  <Link
                    onClick={() => setIsDrawerOpen(false)}
                    href={target}
                    key={label}
                    className={navLinkClass(target, label)}
                  >
                    {label}
                  </Link>
                )
              )}
          </nav>
        </aside>
      </Drawer>
      <header className="sticky top-0 z-20 w-full border-b border-[#DADCE0] bg-white shadow-sm">
        <div className="mx-auto flex h-16 w-full max-w-360 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo - fixed width, no overlap */}
          <Link
            href="/dashboard"
            className="flex min-w-0 shrink-0 items-center"
          >
            <Image
              alt="GDG UNN"
              src="/images/logo-banner.png"
              height={48}
              width={220}
              className="h-10 w-auto max-w-[180px] sm:max-w-[220px]"
              priority
            />
          </Link>

          {/* Desktop nav - scrollable if needed */}
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
                          'rounded-lg px-3 py-2 text-sm font-medium',
                          'text-solid-matte-gray transition-colors hover:bg-red-50 hover:text-red-600'
                        )}
                      >
                        {label}
                      </button>
                    ) : (
                      <Link
                        href={target}
                        className={navLinkClass(target, label)}
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
            </ul>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="text-solid-matte-gray hover:text-blackout -m-2 p-2 md:hidden"
            aria-label="Open menu"
          >
            <ReactSVG src="/graphics/menu.svg" className="h-6 w-6" />
          </button>
        </div>
      </header>
    </>
  );
}
