'use client';

import Image from 'next/image';
import ctaImage from '@/assets/cta.png';

const GlobeIcon = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute -top-4 right-4 opacity-30"
  >
    <circle cx="60" cy="60" r="58" stroke="#A8D4F0" strokeWidth="1" />
    <ellipse cx="60" cy="60" rx="30" ry="58" stroke="#A8D4F0" strokeWidth="1" />
    <ellipse cx="60" cy="60" rx="58" ry="30" stroke="#A8D4F0" strokeWidth="1" />
    <line x1="60" y1="2" x2="60" y2="118" stroke="#A8D4F0" strokeWidth="1" />
    <line x1="2" y1="60" x2="118" y2="60" stroke="#A8D4F0" strokeWidth="1" />
  </svg>
);

export const CTASection = () => {
  return (
    <section className="relative flex min-h-[400px] flex-col overflow-hidden md:flex-row">
      {/* Left Image - Full width on mobile, half on desktop */}
      <div className="relative h-72 w-full md:h-auto md:w-1/2">
        <Image
          src={ctaImage}
          alt="GDG Community"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Right Content - Padded container for mobile readability */}
      <div className="relative flex w-full flex-col justify-center bg-[#4285F4] px-6 py-12 md:w-1/2 md:px-16 md:py-16">
        <GlobeIcon />

        <h2 className="mb-4 text-3xl font-medium leading-tight text-white md:text-4xl">
          You&apos;re Missing the Good Stuff.
          <br />
          Let&apos;s Fix That.
        </h2>

        <p className="mb-8 max-w-md text-sm leading-relaxed text-white/90 md:text-base">
          The real GDG UNN action happens off-site. Join our inner circle to stay plugged in with 
          event updates and exclusive resources.
        </p>

        {/* Responsive Form */}
        <form className="w-full max-w-sm space-y-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-white">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Your Name"
              className="w-full rounded-md bg-white/20 px-4 py-3 text-sm text-white placeholder-white/60 outline-none ring-1 ring-white/30 transition-all focus:ring-2 focus:ring-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-sm font-medium text-white">
              Phone number
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="WhatsApp Number"
              className="w-full rounded-md bg-white/20 px-4 py-3 text-sm text-white placeholder-white/60 outline-none ring-1 ring-white/30 transition-all focus:ring-2 focus:ring-white"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-md border border-white bg-transparent py-3 text-sm font-semibold text-white transition-all hover:bg-white hover:text-[#4285F4] md:w-auto md:px-8"
          >
            Plug me in
          </button>
        </form>
      </div>
    </section>
  );
};