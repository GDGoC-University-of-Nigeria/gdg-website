'use client';

import { useState } from 'react';
import { ReactSVG } from 'react-svg';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { links } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';

type LinkItem = { target: string; label: string };

function getHeaderLinks(isLoggedIn: boolean, isAdmin: boolean): LinkItem[][] {
  const base = links.header[0] as LinkItem[];
  const authGroup: LinkItem[] = isLoggedIn
    ? [
        { target: '/dashboard', label: 'Dashboard' },
        ...(isAdmin ? [{ target: '/admin', label: 'Admin' }] : []),
        { target: '#', label: 'Log out' }
      ]
    : [{ target: '/auth', label: 'Log in' }];
  return [base, authGroup];
}

export const AppHeader = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const { user, logout, isHydrated } = useAuth();
  const headerLinks = getHeaderLinks(!!user, user?.is_admin ?? false);

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
              <Link href="/" onClick={() => setIsDrawerOpen(false)}>
                <Image
                  src="/images/logo-banner.png"
                  alt="GDG UNN Logo"
                  width={220}
                  height={52}
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
            <nav className="flex flex-col gap-3">
              {isHydrated &&
                headerLinks.flat().map(({ target, label }) =>
                  label === 'Log out' ? (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleNavClick({ target, label })}
                      className="text-left text-lg text-solid-matte-gray transition-colors hover:text-red-600"
                    >
                      {label}
                    </button>
                  ) : (
                    <Link
                      key={label}
                      href={target}
                      onClick={() => setIsDrawerOpen(false)}
                      className="text-lg text-solid-matte-gray transition-colors hover:text-blackout"
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
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
          <Link className="flex min-w-0 shrink-0 items-center" href="/">
            <Image
              src="/images/logo-banner.png"
              alt="GDG UNN"
              width={220}
              height={52}
              className="h-10 w-auto max-w-[180px] sm:max-w-[220px]"
              priority
            />
          </Link>

          <nav className="hidden items-center md:flex">
            {isHydrated &&
              headerLinks.map((group, index) => (
                <article className="flex items-center" key={index}>
                  <ul className="flex items-center gap-8">
                    {group.map(({ target, label }) => (
                      <li key={label}>
                        {label === 'Log out' ? (
                          <button
                            type="button"
                            onClick={() => handleNavClick({ target, label })}
                            className="text-sm text-solid-matte-gray transition-colors hover:text-red-600"
                          >
                            {label}
                          </button>
                        ) : (
                          <Link
                            className="text-sm text-solid-matte-gray transition-colors hover:text-blackout"
                            href={target}
                          >
                            {label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                  {index !== headerLinks.length - 1 && (
                    <ReactSVG src="/graphics/divide-x.svg" className="mx-8" />
                  )}
                </article>
              ))}
          </nav>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="md:hidden"
            aria-label="Open menu"
          >
            <ReactSVG src="/graphics/menu.svg" />
          </button>
        </div>
      </header>
    </>
  );
};
