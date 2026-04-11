import Image from 'next/image';

const GoogleLogo = () => (
  <Image
    src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
    alt="Google"
    width={136}
    height={46}
    className="h-10 w-auto object-contain md:h-12"
  />
);

export const SponsorsSection = () => {
  return (
    <section className="overflow-hidden bg-[#2D2D2D] py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-20">
        <h2 className="mb-12 text-center text-xl font-normal text-white md:text-2xl">
          Partnerships and Sponsors
        </h2>
      </div>

      {/* Infinite Scrolling Logos */}
      <div className="relative">
        {/* Gradient Overlays for smooth edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#2D2D2D] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#2D2D2D] to-transparent" />

        {/* Scrolling Container */}
        <div className="flex animate-scroll">
          {/* First set of logos */}
          <div className="flex shrink-0 items-center gap-16 px-8">
            <GoogleLogo />
            <GoogleLogo />
            <GoogleLogo />
            <GoogleLogo />
            <GoogleLogo />
            <GoogleLogo />
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex shrink-0 items-center gap-16 px-8">
            <GoogleLogo />
            <GoogleLogo />
            <GoogleLogo />
            <GoogleLogo />
            <GoogleLogo />
            <GoogleLogo />
          </div>
        </div>
      </div>
    </section>
  );
};

