'use client';

import { useRef, useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';

import leadImage from '@/assets/lead.png';
import nonTechLeadImage from '@/assets/non-tech-lead.png';
import techLeadImage from '@/assets/tech-lead-1.jpg';
import techLeadImage2 from '@/assets/tech-lead-2.jpeg';
import communityImage from '@/assets/community.png';
import designerImage from '@/assets/designer.jpeg';
import designer2Image from '@/assets/designer-2.png';
import techWriterImage from '@/assets/tech-writer.jpeg';

import { api, type TeamMemberResponse } from '@/lib/api';
import { cls } from '@/utils';

const IMAGE_BY_NAME: Record<string, StaticImageData> = {
  'Ndubuisi Mark': leadImage,
  'Nzeribe Mmesoma': nonTechLeadImage,
  'Perpetual Asogwa': techLeadImage,
  'Solomon Adzape': techLeadImage2,
  'Chidinma Ajima': communityImage,
  'Igwe Favour': designerImage,
  'Somto Ufodiama': designer2Image,
  'Ihuoma Obasi': techWriterImage,
};

const ROLE_COLORS: Record<string, string> = {
  'Lead': 'text-[#FBBC04]',
  'Operations Lead': 'text-[#EA4335]',
  'Technical Lead': 'text-[#4285F4]',
  'Community Manager': 'text-[#EA4335]',
  'Designer': 'text-[#34A853]',
  'Social Media Manager': 'text-[#4285F4]',
};

function getRoleColor(role: string): string {
  return ROLE_COLORS[role] ?? 'text-[#4285F4]';
}

export const TeamSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [members, setMembers] = useState<TeamMemberResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    api
      .getTeam()
      .then((list) => setMembers(Array.isArray(list) ? list : []))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

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
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [members.length]);

  const itemWidth = 220;
  const itemTotalWidth = itemWidth + 40; // include horizontal gap (~gap-10)
  const labelWidth = Math.round(itemWidth * 0.4);
  const labelHeight = Math.round(itemWidth * 0.18);
  const labelPaddingX = 14;
  const labelPaddingY = 5;
  const nameTextSize = 'text-lg';
  const roleTextSize = 'text-base';
  const scrollBarTrackWidth = 96;
  const scrollBarThumbWidth = 36;

  useEffect(() => {
    if (members.length === 0) return;
    if (typeof window === 'undefined') return;

    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (isPaused) return;
      setCurrentIndex((prev) => {
        const next = (prev + 1) % members.length;
        container.scrollTo({
          left: next * itemTotalWidth,
          behavior: 'smooth',
        });
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [members.length, isPaused, itemTotalWidth]);

  const handleTouchStart = () => {
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
  };

  return (
    <section className="bg-white px-6 py-16 md:px-20 md:py-24">
      <div className="mx-auto max-w-6xl">
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

        <div className="relative">
          {loading ? (
            <p className="py-12 text-center text-solid-matte-gray">Loading...</p>
          ) : members.length === 0 ? (
            <p className="py-12 text-center text-solid-matte-gray">No team members to display.</p>
          ) : (
            <>
              <div
                ref={scrollContainerRef}
                className="team-scroll flex gap-10 overflow-x-auto pb-8"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {members.map((member) => {
                  const fallbackImage = IMAGE_BY_NAME[member.name];
                  const imageUrl = member.image_url || null;
                  return (
                    <div
                      key={member.id}
                      className={cls('group shrink-0')}
                      style={{
                        width: `${itemWidth}px`,
                        minWidth: `${itemWidth}px`,
                      }}
                    >
                      <div
                        className="relative mb-6 flex aspect-square w-full items-end justify-end overflow-hidden rounded-xl bg-gray-100"
                        style={{ minHeight: `${itemWidth}px` }}
                      >
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={member.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes={`${itemWidth}px`}
                            unoptimized={imageUrl.startsWith('http')}
                          />
                        ) : fallbackImage ? (
                          <Image
                            src={fallbackImage}
                            alt={member.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes={`${itemWidth}px`}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-solid-matte-gray text-sm">
                            {member.name.slice(0, 2)}
                          </div>
                        )}
                        <div
                          className="relative z-10 rounded-tl-md bg-white"
                          style={{
                            position: 'relative',
                            width: `${labelWidth}px`,
                            height: `${labelHeight}px`,
                            right: 0,
                            bottom: 0,
                            paddingLeft: `${labelPaddingX}px`,
                            paddingRight: `${labelPaddingX}px`,
                            paddingTop: `${labelPaddingY}px`,
                            paddingBottom: `${labelPaddingY}px`,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              left: -16,
                              width: '16px',
                              height: '16px',
                              background: 'transparent',
                              borderBottomRightRadius: '50%',
                              zIndex: 20,
                              boxShadow: '7px 7px 0 0 white',
                            }}
                          />
                          <span
                            style={{
                              position: 'absolute',
                              top: -16,
                              right: 0,
                              width: '16px',
                              height: '16px',
                              background: 'transparent',
                              zIndex: 20,
                              borderBottomRightRadius: '50%',
                              boxShadow: '7px 7px 0 0 white',
                            }}
                          />
                        </div>
                      </div>
                      <h3 className={cls(nameTextSize, 'font-semibold text-blackout mt-2 mb-1')}>
                        {member.name}
                      </h3>
                      <p className={cls(roleTextSize, getRoleColor(member.role))}>{member.role}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 flex justify-end">
                <div
                  className="relative h-[5px] rounded-full bg-gray-200"
                  style={{ width: `${scrollBarTrackWidth}px` }}
                >
                  <div
                    className="absolute top-0 h-full rounded-full bg-gray-400 transition-all duration-150"
                    style={{
                      width: `${scrollBarThumbWidth}px`,
                      left: `${(scrollProgress / 100) * (scrollBarTrackWidth - scrollBarThumbWidth)}px`,
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
