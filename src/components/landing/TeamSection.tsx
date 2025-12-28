'use client';

import { useRef, useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';

import leadImage from '@/assets/lead.png';
import nonTechLeadImage from '@/assets/non-tech-lead.png';
import designerImage from '@/assets/designer.png';
import techLeadImage from '@/assets/tech-lead-1.jpg';
import techLeadImage2 from '@/assets/tech-lead-2.jpeg';
import communityImage from '@/assets/community.png';
import techWriterImage from '@/assets/tech-writer.jpeg';
import designer2Image from '@/assets/designer-2.png';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: StaticImageData;
  roleColor: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Ndubuisi Mark',
    role: 'Lead',
    image: leadImage,
    roleColor: 'text-[#FBBC04]',
  },
  {
    id: 2,
    name: 'Nzeribe Mmesoma',
    role: 'Non-Technical Lead',
    image: nonTechLeadImage,
    roleColor: 'text-[#EA4335]',
  },
  {
    id: 3,
    name: 'Perpetual Asogwa',
    role: 'Technical Lead',
    image: techLeadImage,
    roleColor: 'text-[#4285F4]',
  },
  {
    id: 4,
    name: 'Solomon Adzape',
    role: 'Technical Lead',
    image: techLeadImage2,
    roleColor: 'text-[#FBBC04]',
  },
  {
    id: 5,
    name: 'Ihuoma Obasi',
    role: 'Social Media Manager',
    image: techWriterImage,
    roleColor: 'text-[#4285F4]',
  },
  {
    id: 6,
    name: 'Somto Ufodiama',
    role: 'Designer',
    image: designer2Image,
    roleColor: 'text-[#34A853]',
  },
  {
    id: 7,
    name: 'Chidinma Ajima',
    role: 'Community Manager',
    image: communityImage,
    roleColor: 'text-[#EA4335]',
  },
  {
    id: 8,
    name: 'Ani Stephanie',
    role: 'Designer',
    image: designerImage,
    roleColor: 'text-[#34A853]',
  },
];

export const TeamSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [itemWidth, setItemWidth] = useState(220);

  // Responsive logic to adjust card size based on viewport width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemWidth(180); // Smaller cards for phones
      } else {
        setItemWidth(220); // Original size for tablets and desktops
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Proportional calculations for labels based on the current itemWidth
  const labelWidth = Math.round(itemWidth * 0.40);
  const labelHeight = Math.round(itemWidth * 0.18);
  const labelPaddingX = isMobile() ? 10 : 14; 
  const labelPaddingY = isMobile() ? 3 : 5;

  function isMobile() {
    return itemWidth < 220;
  }

  return (
    <section className="bg-white px-6 py-16 md:px-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header - Stacks on mobile, side-by-side on desktop */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <h2 className="text-2xl font-normal text-blackout md:text-3xl">
            The Builders.
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-solid-matte-gray">
            <span className="font-medium text-blackout">
              Meet the dedicated students who organise every event, manage every project, and uphold
            </span>{' '}
            the GDG UNN standard. They are the core drivers of our community&apos;s growth and vision.
          </p>
        </div>

        {/* Team Grid - Responsive horizontal scroll */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 md:gap-10 overflow-x-auto pb-8 scrollbar-hide"
            style={{ scrollbarWidth: 'none' }}
          >
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group flex-shrink-0"
                style={{ width: `${itemWidth}px`, minWidth: `${itemWidth}px` }}
              >
                {/* Photo Box with specialized Corner Labels */}
                <div className="relative mb-6 flex aspect-square w-full items-end justify-end overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes={`${itemWidth}px`}
                  />
                  {/* Corner Label with Inverted Rounded Corners */}
                  <div
                    className="relative z-10 rounded-tl-md bg-white"
                    style={{
                      width: `${labelWidth}px`,
                      height: `${labelHeight}px`,
                      padding: `${labelPaddingY}px ${labelPaddingX}px`,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: -16,
                        width: "16px",
                        height: "16px",
                        background: "transparent",
                        borderBottomRightRadius: "50%",
                        boxShadow: "7px 7px 0 0 white"
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: -16,
                        right: 0,
                        width: "16px",
                        height: "16px",
                        background: "transparent",
                        borderBottomRightRadius: "50%",
                        boxShadow: "7px 7px 0 0 white"
                      }}
                    />
                  </div>
                </div>

                {/* Info - Font sizes adjust with itemWidth */}
                <h3 className={`${isMobile() ? 'text-base' : 'text-lg'} font-semibold text-blackout mt-2 mb-1`}>
                  {member.name}
                </h3>
                <p className={`${isMobile() ? 'text-sm' : 'text-base'} ${member.roleColor}`}>
                  {member.role}
                </p>
              </div>
            ))}
          </div>

          {/* Custom scrollbar - Only visible on desktop/tablets */}
          <div className="mt-8 hidden md:flex justify-end">
            <div className="relative h-[5px] w-24 rounded-full bg-gray-200">
              <div
                className="absolute top-0 h-full w-9 rounded-full bg-gray-400 transition-all duration-150"
                style={{
                  left: `${(scrollProgress / 100) * (96 - 36)}px`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};