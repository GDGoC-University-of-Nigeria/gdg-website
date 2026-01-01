'use client';

import Image from 'next/image';

const GoogleLogo = () => (
  <Image
    src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
    alt="Google"
    width={136}
    height={46}
    className="h-8 w-auto object-contain md:h-12"
  />
);

export const SponsorsSection = () => {
  return (
    <section className="overflow-hidden bg-[#2D2D2D] py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-20 text-center">
        <h2 className="mb-12 text-xl font-normal text-white md:text-2xl">
          Partnerships and Sponsors
        </h2>
      </div>

      <div className="relative">
        {/* Gradient Overlays */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-[#2D2D2D] to-transparent md:w-20" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-[#2D2D2D] to-transparent md:w-20" />

        {/* Scrolling Container */}
        <div className="flex animate-scroll whitespace-nowrap">
          {/* Logo groups */}
          {[1, 2].map((group) => (
            <div key={group} className="flex shrink-0 items-center gap-10 px-4 md:gap-16 md:px-8">
              <GoogleLogo />
              <GoogleLogo />
              <GoogleLogo />
              <GoogleLogo />
              <GoogleLogo />
              <GoogleLogo />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};