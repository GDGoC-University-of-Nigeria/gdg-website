'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import eventImage from '@/assets/event.png';

const events = [
  {
    id: 1,
    title: "Landing Your First Internship: Students' Markup",
    date: 'Sunday, February 16th',
    location: 'Computer Science Lecture Hall',
  },
  {
    id: 2,
    title: 'Fundamentals of Deep Learning: The AI Toolkit Workshop',
    date: 'Saturday, March 29th',
    location: 'Roar Nigeria Hub, UNN',
  },
  {
    id: 3,
    title: 'Beyond the Pixels: UI/UX Masterclass for Beginners',
    date: 'Friday, April 11th',
    location: 'Engineering New Annex Hall',
  },
];

const AsteriskIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2V26M2 14H26M5.5 5.5L22.5 22.5M22.5 5.5L5.5 22.5" stroke="#34A853" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
    <path d="M7 12A5 5 0 107 2a5 5 0 000 10zM14 14l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EventsSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 300 : 360;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-[#F8F8F8] px-6 py-16 md:px-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header - Stacks on mobile */}
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <div className="shrink-0 scale-75 md:scale-100">
              <AsteriskIcon />
            </div>
            <h2 className="text-2xl font-normal leading-tight text-blackout md:text-3xl">
              Stop Scrolling, Start Learning:
              <br />
              The Next Event is Happening!
            </h2>
          </div>

          <div className="w-full md:max-w-sm">
            <p className="mb-6 text-sm text-solid-matte-gray">
              From zero to shipping code in one weekend. Learn new skills, meet your people, or just show up for the vibes.
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="search for events in the campus"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-blackout placeholder-gray-400 outline-none transition-all focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]"
              />
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Event Cards - Horizontal Scroll */}
        <div
          ref={scrollContainerRef}
          className="team-scroll mb-8 flex gap-5 overflow-x-auto pb-6 scrollbar-hide md:gap-8"
          style={{ scrollbarWidth: 'none' }}
        >
          {events.map((event) => (
            <article
              key={event.id}
              className="w-[280px] flex-shrink-0 overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md md:w-[340px]"
            >
              <div className="relative h-40 w-full md:h-44">
                <Image
                  src={eventImage}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 280px, 340px"
                />
              </div>

              <div className="p-5">
                <h3 className="mb-4 min-h-[3rem] text-sm font-medium leading-snug text-blackout md:text-base">
                  {event.title}
                </h3>

                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-blackout md:text-sm">{event.date}</p>
                    <p className="text-xs text-[#4285F4] md:text-sm font-medium">{event.location}</p>
                  </div>
                  <button className="w-full rounded-md bg-blackout px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-blackout/90 md:w-auto md:text-sm">
                    RSVP
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center gap-4 md:justify-end md:gap-2">
          <button
            onClick={() => scroll('left')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:border-[#4285F4] hover:text-[#4285F4] md:h-9 md:w-9"
            aria-label="Previous events"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => scroll('right')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:border-[#4285F4] hover:text-[#4285F4] md:h-9 md:w-9"
            aria-label="Next events"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};