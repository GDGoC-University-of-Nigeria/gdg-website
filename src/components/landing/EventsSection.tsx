'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { AppModal } from '@/components/shared';
import { api, type Event as BackendEvent } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

type CommunityEvent = {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  image_url: string | null;
  location: string | null;
  external_url?: string;
  source: string;
};

function formatEventDate(d: string) {
  return new Date(d).toLocaleDateString('en-NG', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function getEventCategory(date: string | null) {
  if (!date) return 'Community';
  const eventDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  return eventDate >= today ? 'Upcoming' : 'Past';
}

const AsteriskIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 2V26M2 14H26M5.5 5.5L22.5 22.5M22.5 5.5L5.5 22.5"
      stroke="#34A853"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-gray-400"
  >
    <path
      d="M7 12A5 5 0 107 2a5 5 0 000 10zM14 14l-3-3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M12.5 15L7.5 10L12.5 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M7.5 15L12.5 10L7.5 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const EventsSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [registerStatus, setRegisterStatus] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const [scrapedRes, backendEvents] = await Promise.allSettled([
          fetch('/api/events/gdg').then(res => res.json()),
          api.getEvents()
        ]);

        const merged: CommunityEvent[] = [];

        if (backendEvents.status === 'fulfilled') {
          merged.push(...backendEvents.value.map(e => ({
            id: e.id,
            title: e.title,
            description: e.description,
            date: e.date,
            start_time: e.start_time,
            end_time: e.end_time,
            image_url: e.image_url,
            location: e.location,
            source: 'internal'
          })));
        }

        if (scrapedRes.status === 'fulfilled') {
          const payload = scrapedRes.value as { events?: CommunityEvent[] };
          if (Array.isArray(payload.events)) {
            merged.push(...payload.events);
          }
        }

        // Sort by date descending
        merged.sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        });

        setEvents(merged);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const openDetails = async (event: CommunityEvent) => {
    setRegisterStatus(null);
    setSelectedEvent(event);
    setIsDetailsLoading(false);
  };

  const handleRegister = async () => {
    if (!selectedEvent) return;
    
    if (selectedEvent.external_url) {
      setRegisterStatus('Opening the GDG community event page...');
      window.open(selectedEvent.external_url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (!user) {
      setRegisterStatus('Please log in to register for this event.');
      return;
    }

    try {
      setRegisterStatus('Registering...');
      await api.registerForEvent(selectedEvent.id);
      setRegisterStatus('Successfully registered for this event!');
    } catch (e: any) {
      setRegisterStatus(e.message || 'Failed to register for this event.');
    }
  };

  const filteredEvents = searchQuery.trim()
    ? events.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (e.location?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      )
    : events;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 360;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-[#F8F8F8] px-6 py-16 md:px-20 md:py-24" id="events">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <AsteriskIcon />
            <h2 className="text-xl font-normal leading-tight text-blackout md:text-3xl">
              Stop Scrolling, Start Learning:
              <br />
              The Next Event is Happening!
            </h2>
          </div>

          <div className="md:max-w-sm">
            <p className="mb-4 text-sm text-solid-matte-gray">
              From zero to shipping code in one weekend. Learn new skills, meet your people, or
              just show up for the vibes. No FOMO allowed.
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="search for events in the campus"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-blackout placeholder-gray-400 outline-none transition-all focus:border-alexandra focus:ring-1 focus:ring-alexandra"
                style={{ paddingLeft: '2.5rem' }}
              />
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Event Cards */}
        <div
          ref={scrollContainerRef}
          className="mb-8 flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading ? (
            <p className="text-sm text-solid-matte-gray py-8">Loading events...</p>
          ) : filteredEvents.length === 0 ? (
            <p className="text-sm text-solid-matte-gray py-8">No events found.</p>
          ) : (
            filteredEvents.map((event) => {
              const category = getEventCategory(event.date);
              const isUpcoming = category === 'Upcoming';

              return (
              <article
                key={event.id}
                className="min-w-[300px] flex-shrink-0 overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md md:min-w-[340px]"
              >
                <div className="relative h-44 w-full bg-[#E0E0E0]">
                  {event.image_url ? (
                    <Image
                      src={event.image_url}
                      alt={event.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm text-solid-matte-gray">Community event</span>
                    </div>
                  )}
                </div>

                <div className="absolute left-3 top-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isUpcoming ? 'bg-[#E8F5EB] text-[#137333]' : 'bg-[#F3F4F6] text-[#5F6368]'}`}>
                    {category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="mb-3 min-h-[3.5rem] text-base font-medium leading-snug text-blackout">
                    {event.title}
                  </h3>

                  <div className="space-y-2">
                    <p className="text-sm text-blackout">
                      {event.date ? formatEventDate(event.date) : 'See details on GDG community'}
                    </p>
                    {event.location && (
                      <p className="text-sm text-alexandra">{event.location}</p>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-xs uppercase tracking-[0.2em] text-solid-matte-gray">
                      {event.source === 'internal' ? 'GDG UNN' : 'GDG Community'}
                    </span>
                    <button
                      type="button"
                      onClick={() => openDetails(event)}
                      className="rounded-md bg-blackout px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blackout/90"
                    >
                      View details
                    </button>
                  </div>
                </div>
              </article>
              );
            })
          )}
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => scroll('left')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:border-alexandra hover:text-alexandra"
            aria-label="Previous events"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => scroll('right')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:border-alexandra hover:text-alexandra"
            aria-label="Next events"
          >
            <ChevronRight />
          </button>
        </div>

        {selectedEvent && (
          <AppModal
            open
            onClose={() => {
              setSelectedEvent(null);
              setRegisterStatus(null);
            }}
            title={selectedEvent.title}
            actions={
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEvent(null);
                    setRegisterStatus(null);
                  }}
                  className="rounded-md border border-[#DADCE0] px-4 py-2 text-sm font-medium text-solid-matte-gray hover:bg-tech-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleRegister}
                  className="rounded-md bg-alexandra px-4 py-2 text-sm font-medium text-white hover:bg-[#357AE8]"
                >
                  Open event page
                </button>
              </>
            }
          >
            {isDetailsLoading ? (
              <p className="text-sm text-solid-matte-gray">Loading event details...</p>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blackout">
                    {selectedEvent.date ? formatEventDate(selectedEvent.date) : 'Check the GDG community page for timing'}
                  </p>
                  {selectedEvent.start_time && selectedEvent.end_time && (
                    <p className="text-xs text-solid-matte-gray">
                      {selectedEvent.start_time} - {selectedEvent.end_time}
                    </p>
                  )}
                  {selectedEvent.location && (
                    <p className="text-sm text-alexandra">{selectedEvent.location}</p>
                  )}
                </div>

                {selectedEvent.image_url && (
                  <div className="relative h-40 w-full overflow-hidden rounded-lg bg-[#E0E0E0]">
                    <Image
                      src={selectedEvent.image_url}
                      alt={selectedEvent.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}

                {selectedEvent.description && (
                  <p className="text-sm leading-relaxed text-solid-matte-gray">
                    {selectedEvent.description}
                  </p>
                )}

                {registerStatus && (
                  <p className="text-xs text-alexandra">{registerStatus}</p>
                )}
              </div>
            )}
          </AppModal>
        )}
      </div>
    </section>
  );
};

