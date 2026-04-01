import Image from 'next/image';
import Link from 'next/link';

import groupImage from '@/assets/group.png';
import gdgLogo from '@/assets/smaller-logo.png';

const UsersIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 14V12.6667C11 11.9594 10.719 11.2811 10.219 10.781C9.71895 10.281 9.04058 10 8.33333 10H3.66667C2.95942 10 2.28105 10.281 1.78096 10.781C1.28086 11.2811 1 11.9594 1 12.6667V14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 7.33333C7.47276 7.33333 8.66667 6.13943 8.66667 4.66667C8.66667 3.19391 7.47276 2 6 2C4.52724 2 3.33333 3.19391 3.33333 4.66667C3.33333 6.13943 4.52724 7.33333 6 7.33333Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 14V12.6667C14.9995 12.0758 14.7931 11.5019 14.4144 11.0349C14.0357 10.5679 13.5065 10.2344 12.9167 10.0867"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.9167 2.08667C11.5079 2.23354 12.0387 2.56714 12.4186 3.03488C12.7984 3.50262 13.0053 4.07789 13.0053 4.67C13.0053 5.26211 12.7984 5.83738 12.4186 6.30512C12.0387 6.77286 11.5079 7.10646 10.9167 7.25333"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LeftBracket = () => (
  <span className="text-[8rem] leading-none text-[#EA4335] md:text-[20rem]">{`{`}</span>
);

const RightBracket = () => (
  <span className="text-[8rem] leading-none text-[#EA4335] md:text-[20rem]">{`}`}</span>
);

export const CommunitySection = () => {
  return (
    <section className="bg-[#E8E8E8] px-6 py-16 md:px-20 md:py-24" id="our-vibe">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:gap-8 md:items-center md:justify-between">
          <h2 className="text-2xl font-normal leading-tight text-blackout md:text-3xl">
            <span className="text-[#EA4335]">{`{`}</span>
            <span className="text-[#EA4335]">{` }`}</span>{' '}
            Build. Create.
            <br />
            Lead. Together.
          </h2>

          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <p className="max-w-md text-sm leading-relaxed text-solid-matte-gray">
              <span className="font-medium text-blackout">
                We started in 2019 as a tiny crew, and now we&apos;re 500+ strong, the UNN campus hub where
                ideas become real.
              </span>{' '}
              Whether you&apos;re building with code, designing interfaces, managing the
              chaos, or just bringing the next big idea, this is your space. All skill levels, zero gatekeeping.
            </p>

            <Link 
              href="/auth?mode=signup"
              className="flex shrink-0 items-center gap-2 rounded-md bg-[#4285F4] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4285F4]/90 md:mt-0 mt-4"
            >
              Become a member
              <UsersIcon />
            </Link>
          </div>
        </div>

        {/* Group Photo with Decorative Elements */}
        <div className="relative flex flex-col items-center justify-center md:flex-row md:w-2/3 mx-auto">

          {/* Photo Container with Masked Circles */}
          <div className="relative w-full max-w-full md:mx-0">
            {/* Mobile */}
            <div className="relative mx-auto h-[200px] w-full max-w-[350px] aspect-[3.5/2] md:hidden">
              {/* Yellow Background Circles - tuned for mobile proportion */}
              <div
                className="absolute inset-0 bg-[#FBBC04]"
                style={{
                  WebkitMaskImage:
                    'radial-gradient(circle 64px at 22% 52%, black 100%, transparent 100%), radial-gradient(circle 72px at 50% 51%, black 100%, transparent 100%), radial-gradient(circle 66px at 78% 52%, black 100%, transparent 100%)',
                  maskImage:
                    'radial-gradient(circle 64px at 22% 52%, black 100%, transparent 100%), radial-gradient(circle 72px at 50% 51%, black 100%, transparent 100%), radial-gradient(circle 66px at 78% 52%, black 100%, transparent 100%)',
                  WebkitMaskComposite: 'source-over',
                  maskComposite: 'add',
                }}
              />
              {/* Image (slightly smaller mask = yellow border shows) */}
              <div
                className="absolute inset-0"
                style={{
                  WebkitMaskImage:
                    'radial-gradient(circle 60px at 22% 52%, black 100%, transparent 100%), radial-gradient(circle 68px at 50% 51%, black 100%, transparent 100%), radial-gradient(circle 62px at 78% 52%, black 100%, transparent 100%)',
                  maskImage:
                    'radial-gradient(circle 60px at 22% 52%, black 100%, transparent 100%), radial-gradient(circle 68px at 50% 51%, black 100%, transparent 100%), radial-gradient(circle 62px at 78% 52%, black 100%, transparent 100%)',
                  WebkitMaskComposite: 'source-over',
                  maskComposite: 'add',
                }}
              >
                <Image
                  src={groupImage}
                  alt="GDG UNN Community"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 350px) 100vw, 350px"
                  priority
                />
                {/* Yellow tint overlay */}
                <div className="absolute inset-0 bg-[#FBBC04]/20 mix-blend-multiply" />
              </div>
            </div>

            {/* Desktop: Left Bracket */}
            <div className="hidden shrink-0 md:block md:absolute md:-left-20 md:top-1/2 md:-translate-y-1/2">
              <LeftBracket />
            </div>

            {/* Tablet */}
            <div className="relative mx-auto hidden h-64 w-[650px] max-w-full md:block lg:hidden">
              {/* Yellow Background Circles */}
              <div
                className="absolute inset-0 bg-[#FBBC04]"
                style={{
                  WebkitMaskImage:
                    'radial-gradient(circle 128px at 25% 50%, black 100%, transparent 100%), radial-gradient(circle 128px at 50% 50%, black 100%, transparent 100%), radial-gradient(circle 128px at 75% 50%, black 100%, transparent 100%)',
                  maskImage:
                    'radial-gradient(circle 128px at 25% 50%, black 100%, transparent 100%), radial-gradient(circle 128px at 50% 50%, black 100%, transparent 100%), radial-gradient(circle 128px at 75% 50%, black 100%, transparent 100%)',
                  WebkitMaskComposite: 'source-over',
                  maskComposite: 'add',
                }}
              />
              {/* Image (slightly smaller mask) */}
              <div
                className="absolute inset-0"
                style={{
                  WebkitMaskImage:
                    'radial-gradient(circle 125px at 25% 50%, black 100%, transparent 100%), radial-gradient(circle 125px at 50% 50%, black 100%, transparent 100%), radial-gradient(circle 125px at 75% 50%, black 100%, transparent 100%)',
                  maskImage:
                    'radial-gradient(circle 125px at 25% 50%, black 100%, transparent 100%), radial-gradient(circle 125px at 50% 50%, black 100%, transparent 100%), radial-gradient(circle 125px at 75% 50%, black 100%, transparent 100%)',
                  WebkitMaskComposite: 'source-over',
                  maskComposite: 'add',
                }}
              >
                <Image
                  src={groupImage}
                  alt="GDG UNN Community"
                  fill
                  className="object-cover object-top"
                />
                {/* Yellow tint overlay */}
                <div className="absolute inset-0 bg-[#FBBC04]/20 mix-blend-multiply" />
              </div>
            </div>

            {/* Desktop */}
            <div className="relative mx-auto hidden h-72 w-[750px] max-w-full lg:block">
              {/* Yellow Background Circles */}
              <div
                className="absolute inset-0 bg-[#FBBC04]"
                style={{
                  WebkitMaskImage:
                    'radial-gradient(circle 144px at 25% 50%, black 100%, transparent 100%), radial-gradient(circle 144px at 50% 50%, black 100%, transparent 100%), radial-gradient(circle 144px at 75% 50%, black 100%, transparent 100%)',
                  maskImage:
                    'radial-gradient(circle 144px at 25% 50%, black 100%, transparent 100%), radial-gradient(circle 144px at 50% 50%, black 100%, transparent 100%), radial-gradient(circle 144px at 75% 50%, black 100%, transparent 100%)',
                  WebkitMaskComposite: 'source-over',
                  maskComposite: 'add',
                }}
              />
              {/* Image (slightly smaller mask) */}
              <div
                className="absolute inset-0"
                style={{
                  WebkitMaskImage:
                    'radial-gradient(circle 141px at 25% 50%, black 100%, transparent 100%), radial-gradient(circle 141px at 50% 50%, black 100%, transparent 100%), radial-gradient(circle 141px at 75% 50%, black 100%, transparent 100%)',
                  maskImage:
                    'radial-gradient(circle 141px at 25% 50%, black 100%, transparent 100%), radial-gradient(circle 141px at 50% 50%, black 100%, transparent 100%), radial-gradient(circle 141px at 75% 50%, black 100%, transparent 100%)',
                  WebkitMaskComposite: 'source-over',
                  maskComposite: 'add',
                }}
              >
                <Image
                  src={groupImage}
                  alt="GDG UNN Community"
                  fill
                  className="object-cover object-top"
                />
                {/* Yellow tint overlay */}
                <div className="absolute inset-0 bg-[#FBBC04]/20 mix-blend-multiply" />
              </div>
            </div>

            {/* Desktop: Right Bracket */}
            <div className="hidden shrink-0 md:block md:absolute md:-right-20 md:top-1/2 md:-translate-y-1/2">
              <RightBracket />
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-16 flex items-center justify-center gap-1 w-full md:flex-row flex-col">
          <Image
            src={gdgLogo}
            alt="GDG Logo"
            width={24}
            height={24}
            className="h-4 w-auto"
          />
          <p className="text-center text-xs text-solid-matte-gray md:text-sm">
            We&apos;re part of Google Developer Groups, a global network of 1,000+ communities across 140+ countries.
            Access to Google tech, expert speakers, resources for every role, and yes, cool swag.
          </p>
        </div>
      </div>
    </section>
  );
};

