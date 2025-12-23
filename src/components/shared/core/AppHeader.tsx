import { useState } from 'react';

import { ReactSVG } from 'react-svg';

import { Drawer } from '@mui/material';

import { links } from '@/constants';

import Image from 'next/image';

import Link from 'next/link';

export const AppHeader = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
          <header className="z-20 flex items-center justify-between px-4 py-3.5">
            <Link href="/">
              <Image
                alt="GDG UNN Logo Banner"
                src="/graphics/logo-banner.svg"
                height={60}
                width={296}
              />
            </Link>
            <ReactSVG
              onClick={() => setIsDrawerOpen(false)}
              src="/graphics/close.svg"
              role="button"
            />
          </header>
          <nav className="z-20 mt-15 flex w-full flex-col gap-10 px-8">
            {links.header.flat().map(({ target, label }) => (
              <Link
                onClick={() => setIsDrawerOpen(false)}
                className="text-solid-matte-gray text-xl"
                href={target}
                key={label}
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>
      </Drawer>
      <header className="text-solid-matte-gray sticky top-0 right-0 left-0 z-20 flex h-14 w-full max-w-94 items-center justify-between bg-white pr-6.5 pl-5 md:h-25 md:max-w-360 md:px-30">
        <Link
          className="w-38.5! origin-left scale-[47.7%] md:ml-0 md:w-auto md:scale-100"
          href="/"
        >
          <ReactSVG src="/graphics/logo-banner.svg" />
        </Link>
        <nav className="hidden items-center md:flex">
          {links.header.map((group, index) => (
            <article className="flex items-center" key={index}>
              <ul className="flex items-center gap-8.5">
                {group.map(({ target, label }) => (
                  <li key={label}>
                    <Link className="hover:underline" href={target}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              {index !== links.header.length - 1 && (
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
