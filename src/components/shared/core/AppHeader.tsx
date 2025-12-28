'use client';

import { useState } from 'react';
import { Drawer } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import gdgLogo from '@/assets/gdg-logo.png';

export const AppHeader = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Events', href: '#events' },
    { label: 'Team', href: '#team' },
    { label: 'Blog', href: '#blog' },
  ];

  return (
    <>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <aside className="flex h-full w-64 flex-col bg-white p-6 font-medium">
          <div className="mb-8 flex justify-end">
            <button onClick={() => setIsDrawerOpen(false)} className="text-2xl">✕</button>
          </div>
          <nav className="flex flex-col gap-6 text-lg">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} onClick={() => setIsDrawerOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
      </Drawer>

      <header className="sticky top-0 left-0 z-20 flex h-16 w-full items-center justify-between bg-white/80 px-6 backdrop-blur-md transition-all md:h-24 md:px-10">
        <Image src={gdgLogo} alt="GDG UNN Logo" className="h-8 w-auto md:h-10" priority />

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="text-sm font-medium hover:text-[#4285F4]">
              {link.label}
            </Link>
          ))}
          <button className="rounded-md bg-[#4285F4] px-5 py-2 text-sm text-white">Join</button>
        </nav>

        {/* Mobile Toggle */}
        <button className="text-2xl md:hidden" onClick={() => setIsDrawerOpen(true)}>
          ☰
        </button>
      </header>
    </>
  );
};