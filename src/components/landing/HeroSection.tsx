import Image from 'next/image';
import Link from 'next/link';

import bgGrid from '@/assets/bg-grid.jpg';
import hero1 from '@/assets/hero-1.jpg';
import hero2 from '@/assets/hero-2.png';
import hero3 from '@/assets/hero-3.png';
import hero4 from '@/assets/hero-4.png';
import hero5 from '@/assets/hero-5.png';
import hero6 from '@/assets/hero-6.png';
import hero7 from '@/assets/hero-7.png';
import hero8 from '@/assets/hero-8.png';

const heroImages = [hero1, hero2, hero3, hero4, hero5, hero6, hero7, hero8];

export const HeroSection = () => {
  return (
    <section className="relative mx-auto flex w-full h-[1200px] flex-col items-center overflow-hidden text-center text-black gap-10 mb-10">
      <section className='relative w-full h-[80vh] flex flex-col items-center justify-center flex-1'>
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src={bgGrid}
          alt="Background grid"
          fill
          priority
          className="object-fill opacity-50 bg-top"
        />
        {/* Light vertical fade so text remains readable but grid stays visible */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/60" />
      </div>

      {/* Copy */}
      <div className="mx-auto mb-10 max-w-2xl px-4 md:mb-14 md:px-0">
        <h1 className="mb-4 text-3xl font-medium leading-tight text-blackout md:text-4xl lg:text-[2.75rem]">
          Empowering Developers &amp; Innovators at UNN Campus
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-solid-matte-gray md:text-[0.9rem]">
          Building a vibrant community of developers, designers, and tech enthusiasts at the
          University of Nigeria, Nsukka. Learn in public, ship real projects, and grow with people
          who get it.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link 
            href="/auth?mode=signup"
            className="bg-[#4285F4] px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_20px_rgba(66,133,244,0.35)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(66,133,244,0.4)] rounded"
          >
            Become a member
          </Link>
          <Link 
            href="/#events"
            className="flex items-center gap-1.5 border border-[#DADCE0] bg-white px-5 py-2.5 text-sm font-medium text-blackout transition-colors hover:border-[#4285F4] hover:text-[#4285F4] rounded"
          >
            Join our next event
            <span aria-hidden>↗</span>
          </Link>
        </div>
      </div>
      </section>
      {/* Photo strip */}
      <div className="hidden mx-auto w-full bg-white px-1.5 md:px-2 pt-1 pb-2 md:flex justify-center h-[60vh]">
        <div
          className="
            grid grid-cols-13 h-full gap-1 md:gap-2 w-full
          "
        >
          {/* 1st column: 2 stacked images */}
          <div className="flex flex-col gap-1 md:gap-2 col-span-2 h-full row-span-2">
            <div className="relative  overflow-hidden bg-[#E0E0E0] h-1/3">
              <Image src={hero1} alt="GDG UNN group" fill className="object-cover" />
            </div>
            <div className="relative  overflow-hidden bg-[#E0E0E0] h-2/3">
              <Image src={hero2} alt="GDG UNN group" fill className="object-cover" />
            </div>
          </div>
          
          {/* 2nd column: 2 stacked images */}
          <div className="flex flex-col gap-1 md:gap-2 col-span-3 row-span-2">
            <div className="relative aspect-[3/2] overflow-hidden bg-[#E0E0E0] h-1/2">
              <Image src={hero3} alt="GDG UNN audience" fill className="object-cover" />
            </div>
            <div className="relative aspect-[3/2] overflow-hidden bg-[#E0E0E0] h-1/2">
              <Image src={hero4} alt="GDG UNN crowd" fill className="object-cover" />
            </div>
          </div>

          {/* 3rd and 4th columns: Large center image spanning 2 columns and 2 rows */}
          <div className="relative col-span-3 row-span-2 overflow-hidden bg-[#E0E0E0]">
            <Image src={hero5} alt="GDG UNN central community" fill className="object-cover" />
          </div>
          {/* 3rd and 4th columns: Large center image spanning 2 columns and 2 rows */}
          <div className="relative col-span-3 row-span-2 overflow-hidden bg-[#E0E0E0]">
            <Image src={hero6} alt="GDG UNN central community" fill className="object-cover" />
          </div>

          {/* 5th column: 2 stacked images */}
          <div className="flex flex-col gap-1 md:gap-2 col-span-2 row-span-2">
            <div className="relative aspect-[3/2] overflow-hidden bg-[#E0E0E0] h-1/2">
              <Image src={hero7} alt="GDG UNN event focus" fill className="object-cover" />
            </div>
            <div className="relative aspect-[3/2] overflow-hidden bg-[#E0E0E0] h-1/2">
              <Image src={hero8} alt="GDG UNN audience scene" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>
        {/* Photo strip Mobile */}
        <div className="md:hidden mx-auto w-full bg-white px-1.5 pt-1 pb-2 flex justify-center">
          <div className="w-full max-w-[360px] flex flex-col gap-2 h-[60vh]">

            {/* Top row: two small horizontal images */}
            <div className="flex gap-2 h-[100px] min-h-[46px]">
              <div className="relative w-1/2 overflow-hidden bg-[#E0E0E0]">
                <Image src={hero1} alt="GDG UNN group" fill className="object-cover" />
              </div>
              <div className="relative w-1/2 overflow-hidden bg-[#E0E0E0]">
                <Image src={hero2} alt="GDG UNN audience" fill className="object-cover" />
              </div>
            </div>
  {/* Third row: two stacked images */}
  <div className="flex gap-2 h-[100px] min-h-[72px]">
              <div className="relative w-1/3 overflow-hidden bg-[#E0E0E0]">
                <Image src={hero6} alt="GDG UNN team action" fill className="object-cover" />
              </div>
              <div className="relative w-2/3 overflow-hidden bg-[#E0E0E0]">
                <Image src={hero7} alt="GDG UNN group photo" fill className="object-cover" />
              </div>
            </div>
            {/* Large vertical image */}
            <div className="relative w-full flex-1 min-h-[160px] max-h-[210px] rounded-[7px] overflow-hidden bg-[#E0E0E0]">
              <Image src={hero5} alt="GDG UNN hall audience" fill className="object-cover" />
            </div>

            {/* Second row: two stacked images */}
            <div className="flex gap-2 h-[190px] min-h-[72px]">
            <div className="relative w-1/2 h-full overflow-hidden bg-[#E0E0E0]">
                <Image src={hero8} alt="GDG UNN team lineup" fill className="object-cover" />
              </div>
              <div className="flex gap-2 h-full min-h-[72px] flex-col w-1/2">
              <div className="relative w-full h-1/2 overflow-hidden bg-[#E0E0E0]">
                <Image
                  src={hero3}
                  alt="GDG UNN event focus"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="relative w-full h-1/2 overflow-hidden bg-[#E0E0E0]">
                <Image src={hero4} alt="GDG UNN active audience" fill className="object-cover" />
              </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
};

