'use client';

import Image from 'next/image';
import groupImage from '@/assets/group.png';
import gdgLogo from '@/assets/smaller-logo.png';

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 14V12.6667C11 11.9594 10.719 11.2811 10.219 10.781C9.71895 10.281 9.04058 10 8.33333 10H3.66667C2.95942 10 2.28105 10.281 1.78096 10.781C1.28086 11.2811 1 11.9594 1 12.6667V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 7.33333C7.47276 7.33333 8.66667 6.13943 8.66667 4.66667C8.66667 3.19391 7.47276 2 6 2C4.52724 2 3.33333 3.19391 3.33333 4.66667C3.33333 6.13943 4.52724 7.33333 6 7.33333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 14V12.6667C14.9995 12.0758 14.7931 11.5019 14.4144 11.0349C14.0357 10.5679 13.5065 10.2344 12.9167 10.0867" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.9167 2.08667C11.5079 2.23354 12.0387 2.56714 12.4186 3.03488C12.7984 3.50262 13.0053 4.07789 13.0053 4.67C13.0053 5.26211 12.7984 5.83738 12.4186 6.30512C12.0387 6.77286 11.5079 7.10646 10.9167 7.25333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LeftBracket = () => (
  <span className="text-[10rem] lg:text-[20rem] text-red-500 leading-none">{`{`}</span>
);

const RightBracket = () => (
  <span className="text-[10rem] lg:text-[20rem] text-red-500 leading-none">{`}`}</span>
);

export const CommunitySection = () => {
  return (
    <section className="bg-[#E8E8E8] px-6 py-16 md:px-20 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Header - Responsive Flex */}
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <h2 className="text-3xl font-normal leading-tight text-blackout md:text-4xl">
            Build. Create.
            <br />
            Lead. Together.
          </h2>

          <div className="flex flex-col items-start gap-6 md:flex-row md:items-start lg:items-center">
            <p className="max-w-md text-sm leading-relaxed text-solid-matte-gray">
              <span className="font-medium text-blackout">
                We started in 2019 as a tiny crew, and now we&apos;re 500+ strong, the UNN campus hub where
                ideas become real.
              </span>{' '}
              Whether you&apos;re building with code, designing interfaces, or bringing the next big idea, this is your space.
            </p>

            <button className="flex shrink-0 items-center gap-2 rounded-md bg-[#4285F4] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4285F4]/90 w-full md:w-auto justify-center">
              Become a member
              <UsersIcon />
            </button>
          </div>
        </div>

        {/* Photo Section with Responsive Brackets */}
        <div className="relative flex items-center justify-center gap-2 md:gap-4">
          <div className="hidden md:block">
            <LeftBracket />
          </div>

          <div className="relative w-full max-w-[800px]">
            {/* Unified Image Container - Uses CSS Masks for the circle effect */}
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              {/* Background Decorative Circles */}
              <div
                className="absolute inset-0 bg-[#FBBC04]"
                style={{
                  WebkitMaskImage: 'radial-gradient(circle at 25% 50%, black 30%, transparent 32%), radial-gradient(circle at 50% 50%, black 30%, transparent 32%), radial-gradient(circle at 75% 50%, black 30%, transparent 32%)',
                  maskImage: 'radial-gradient(circle at 25% 50%, black 30%, transparent 32%), radial-gradient(circle at 50% 50%, black 30%, transparent 32%), radial-gradient(circle at 75% 50%, black 30%, transparent 32%)',
                  WebkitMaskComposite: 'source-over',
                  maskComposite: 'add',
                }}
              />
              
              {/* Foreground Image with slightly smaller mask for border effect */}
              <div
                className="absolute inset-0"
                style={{
                  WebkitMaskImage: 'radial-gradient(circle at 25% 50%, black 29%, transparent 31%), radial-gradient(circle at 50% 50%, black 29%, transparent 31%), radial-gradient(circle at 75% 50%, black 29%, transparent 31%)',
                  maskImage: 'radial-gradient(circle at 25% 50%, black 29%, transparent 31%), radial-gradient(circle at 50% 50%, black 29%, transparent 31%), radial-gradient(circle at 75% 50%, black 29%, transparent 31%)',
                  WebkitMaskComposite: 'source-over',
                  maskComposite: 'add',
                }}
              >
                <Image
                  src={groupImage}
                  alt="GDG UNN Community"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
                <div className="absolute inset-0 bg-[#FBBC04]/10 mix-blend-multiply" />
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <RightBracket />
          </div>
        </div>

        {/* Footer Text - Responsive Scaling */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 text-center">
          <Image src={gdgLogo} alt="GDG Logo" width={24} height={24} className="h-5 w-auto" />
          <p className="max-w-2xl text-xs text-solid-matte-gray md:text-sm">
            We&apos;re part of Google Developer Groups, a global network of 1,000+ communities across 140+ countries.
            Access to Google tech, expert speakers, and cool swag.
          </p>
        </div>
      </div>
    </section>
  );
};