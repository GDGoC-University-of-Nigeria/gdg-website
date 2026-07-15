import Image from 'next/image';

const partnerLogos = [
  { name: 'Blockchain UNN', src: '/images/partners/blockchainunn.svg', className: 'h-64 w-auto' },
  { name: 'Ethenugu', src: '/images/partners/ethenugu.svg', className: 'h-20 w-auto max-w-56 sm:h-24 md:h-28' },
  { name: 'GIDA', src: '/images/partners/gida.svg', className: 'h-56 w-auto' },
  { name: 'Open Source Nest', src: '/images/partners/opensourcenest.svg', className: 'h-16 w-auto max-w-45 sm:h-20 md:h-24' },
  { name: 'The Block Hive', src: '/images/partners/logo-yellow.webp', className: 'h-16 w-auto ' },
];

export const SponsorsSection = () => {
  return (
    <section className="overflow-hidden bg-[#f7f7f5] py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-20">
        <h2 className="mb-12 text-center text-xl font-semibold tracking-wide text-[#1f2937] md:text-2xl">
          Partnerships and Sponsors
        </h2>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-linear-to-r from-[#f7f7f5] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-linear-to-l from-[#f7f7f5] to-transparent" />

        <div className="flex animate-scroll py-2">
          {[0, 1].map((groupIndex) => (
            <div key={groupIndex} className="flex shrink-0 items-center gap-8 px-6 sm:gap-12 sm:px-8 md:gap-16 md:px-10">
              {partnerLogos.map((partner) => (
                <div key={`${groupIndex}-${partner.name}`} className="flex items-center justify-center">
                  <Image
                    src={partner.src}
                    alt={partner.name}
                    width={220}
                    height={140}
                    className={partner.className}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

