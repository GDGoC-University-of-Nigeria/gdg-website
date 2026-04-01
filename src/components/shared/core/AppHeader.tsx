'use client';

import { useState } from 'react';

import { ReactSVG } from 'react-svg';

import { Drawer } from '@mui/material';

import { links } from '@/constants';

import Image from 'next/image';
import Link from 'next/link';

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
    : [{ target: '/auth?mode=login', label: 'Log in' }];
  return [base, authGroup];
}

export const AppHeader = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, logout, isHydrated } = useAuth();
  const headerLinks = getHeaderLinks(!!user, user?.is_admin ?? false);

  const handleNavClick = async (item: LinkItem) => {
    if (item.label === 'Log out') {
      await logout();
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
              scrollbarWidth: 'none'
            }
          }
        }}
      >
        <aside className="relative flex h-full w-84 max-w-84 flex-col rounded-r-4xl bg-white pb-6 font-medium">
          <header className="z-20 flex items-center justify-end px-4 py-3.5">
            <Link
              className="w-3/4 origin-left mr-auto md:w-1/3 md:scale-100"
              href={""}
              onClick={() => setIsDrawerOpen(false)}
              role="button"
              aria-label="Close menu"
            >
              {' '}
              <img src={'/images/logo-banner.png'} />
            </Link>
            {/* ReactSVG Close Button added here */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="text-solid-matte-gray hover:text-blackout -m-2 ml-4 p-2"
              aria-label="Close menu"
            >
              <ReactSVG src="/graphics/close.svg" />
            </button>
          </header>
          <nav className="z-20 mt-6 flex w-full flex-col gap-10 px-8">
            {isHydrated &&
              headerLinks.flat().map(({ target, label }) =>
                label === 'Log out' ? (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleNavClick({ target, label })}
                    className="text-solid-matte-gray text-left text-xl hover:underline"
                  >
                    {label}
                  </button>
                ) : (
                  <Link
                    onClick={() => setIsDrawerOpen(false)}
                    className="text-solid-matte-gray text-xl"
                    href={target}
                    key={label}
                  >
                    {label}
                  </Link>
                )
              )}
          </nav>
        </aside>
      </Drawer>
      <header className="text-solid-matte-gray sticky top-0 right-0 left-0 z-20 flex h-14 w-full max-w-94 items-center justify-between bg-white pr-6.5 pl-5 md:h-25 md:max-w-360 md:px-30">
        <Link
          className="w-3/4 origin-left md:ml-0 md:w-1/3 md:scale-100"
          href="/"
        >
          <img src={'/images/logo-banner.png'} />
        </Link>
        <nav className="hidden items-center md:flex">
          {isHydrated &&
            headerLinks.map((group, index) => (
              <article className="flex items-center" key={index}>
                <ul className="flex items-center gap-8.5">
                  {group.map(({ target, label }) => (
                    <li key={label}>
                      {label === 'Log out' ? (
                        <button
                          type="button"
                          onClick={() => handleNavClick({ target, label })}
                          className="hover:underline"
                        >
                          {label}
                        </button>
                      ) : (
                        <Link className="hover:underline" href={target}>
                          {label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
                {index !== headerLinks.length - 1 && (
                  <ReactSVG src="/graphics/divide-x.svg" className="mx-8.5" />
                )}
              </article>
            ))}
        </nav>
        <ReactSVG
          src="/graphics/menu.svg"
          onClick={() => setIsDrawerOpen(true)}
          className="md:hidden"
          role="button"
        />
      </header>
    </>
  );
};
