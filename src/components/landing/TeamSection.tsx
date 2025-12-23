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
    roleColor: 'text-[#FBBC04]', // Google Yellow
  },
  {
    id: 2,
    name: 'Nzeribe Mmesoma',
    role: 'Non-Technical Lead',
    image: nonTechLeadImage,
    roleColor: 'text-[#EA4335]', // Google Blue
  },
  {
    id: 3,
    name: 'Ani Stephanie',
    role: 'Designer',
    image: designerImage,
    roleColor: 'text-[#34A853]', // Google Green
  },
  {
    id: 4,
    name: 'Perpetual Asogwa',
    role: 'Technical Lead',
    image: techLeadImage,
    roleColor: 'text-[#4285F4]', // Google Blue
  },
  {
    id: 5,
    name: 'Solomon Adzape',
    role: 'Technical Lead',
    image: techLeadImage2,
    roleColor: 'text-[#FBBC04]', // Google Yellow
  },
  {
    id: 6,
    name: 'Chidinma Ajima',
    role: 'Community Manager',
    image: communityImage,
    roleColor: 'text-[#EA4335]', // Google Red
  },
  {
    id: 8,
    name: 'Somto Ufodiama',
    role: 'Designer',
    image: designer2Image,
    roleColor: 'text-[#34A853]', // Google Green
  },
  {
    id: 7,
    name: 'Ihuoma Ajima',
    role: 'Technical Writer',
    image: techWriterImage,
    roleColor: 'text-[#4285F4]', // Google Blue
  },
];

export const TeamSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Define new item width, label, and font sizes
  const itemWidth = 220; // px (was 160)
  const labelWidth = Math.round(itemWidth * 0.40); // Proportion to image size
  const labelHeight = Math.round(itemWidth * 0.18);
  const labelPaddingX = 14; // px, equivalent to "px-3"
  const labelPaddingY = 5; // px, a bit bigger than "py-1"
  const nameTextSize = "text-lg"; // bigger than text-sm
  const roleTextSize = "text-base"; // bigger than text-xs

  // Scrollbar adjustments
  const scrollBarTrackWidth = 96; // px (was 64)
  const scrollBarThumbWidth = 36; // px (was 24)

  return (
    <section className="bg-white px-6 py-16 md:px-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
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

        {/* Team Grid - Scrollable */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="team-scroll flex gap-10 overflow-x-auto pb-8"
          >
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className={`group w-[${itemWidth}px] flex-shrink-0`}
              style={{
                width: `${itemWidth}px`,
                minWidth: `${itemWidth}px`
              }}
            >
              {/* Photo Box */}
              <div className="relative mb-6 flex aspect-square w-full items-end justify-end overflow-hidden rounded-xl bg-gray-100"
                   style={{ minHeight: `${itemWidth}px` }}>
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes={`${itemWidth}px`}
                />
                {/* Corner Label with Inverse Rounded Corners */}
                <div
                  className="relative z-10 rounded-tl-md bg-white"
                  style={{
                    position: "relative",
                    width: `${labelWidth}px`,
                    height: `${labelHeight}px`,
                    right: 0,
                    bottom: 0,
                    paddingLeft: `${labelPaddingX}px`,
                    paddingRight: `${labelPaddingX}px`,
                    paddingTop: `${labelPaddingY}px`,
                    paddingBottom: `${labelPaddingY}px`,
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
                      zIndex: 20,
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
                      zIndex: 20,
                      borderBottomRightRadius: "50%",
                      boxShadow: "7px 7px 0 0 white"
                    }}
                  />
                </div>
              </div>

              {/* Info */}
              <h3 className={`${nameTextSize} font-semibold text-blackout mt-2 mb-1`}>{member.name}</h3>
              <p className={`${roleTextSize} ${member.roleColor}`}>{member.role}</p>
            </div>
          ))}
          </div>

          {/* Custom scrollbar - bottom right */}
          <div className="mt-8 flex justify-end">
            <div
              className="relative h-[5px] rounded-full bg-gray-200"
              style={{ width: `${scrollBarTrackWidth}px` }}
            >
              {/* Scrollbar thumb */}
              <div
                className="absolute top-0 h-full rounded-full bg-gray-400 transition-all duration-150"
                style={{
                  width: `${scrollBarThumbWidth}px`,
                  left: `${(scrollProgress / 100) * (scrollBarTrackWidth - scrollBarThumbWidth)}px`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
