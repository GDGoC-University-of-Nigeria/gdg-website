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
      {/* Left Image */}
      <div className="relative h-64 w-full md:h-auto md:w-1/2">
        <Image
          src={ctaImage}
          alt="GDG Community"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Content */}
      <div className="relative flex w-full flex-col justify-center bg-alexandra px-8 py-12 md:w-1/2 md:px-16 md:py-16">
        <GlobeIcon />

        <h2 className="mb-4 text-2xl font-medium leading-tight text-white md:text-3xl">
          You&apos;re Missing the Good Stuff.
          <br />
          Let&apos;s Fix That.
        </h2>

        <p className="mb-8 max-w-md text-sm leading-relaxed text-white/90">
          The real GDG UNN action, like secret study sessions and pre-event registration
          links happens off-site. Join the WhatsApp group to stay plugged in.
        </p>

        <a
          href={process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || 'https://chat.whatsapp.com/PLACEHOLDER'}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block w-full max-w-sm rounded-md border border-white bg-transparent px-6 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-white hover:text-alexandra"
        >
          Join WhatsApp group
        </a>
      </div>
    </section>
  );
};

