'use client';

import { useState, useEffect } from 'react';
import { cls } from '@/utils';

type CommunityEvent = {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  image_url: string | null;
  location: string | null;
  external_url: string;
  source: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch('/api/events/gdg');
        const payload = (await response.json()) as { events?: CommunityEvent[] };
        setEvents(Array.isArray(payload.events) ? payload.events : []);
      } catch {
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const formatDate = (d: string | null) => {
    if (!d) return 'See details on GDG community';
    return new Date(d).toLocaleDateString('en-NG', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getEventCategory = (date: string | null) => {
    if (!date) return 'Community';
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today ? 'Upcoming' : 'Past';
  };

  return (
    <div className={cls('space-y-6')}>
      <h1 className={cls('text-2xl md:text-3xl font-medium text-blackout')}>
        Events
      </h1>
      <section
        className={cls(
          'rounded-2xl border border-[#DADCE0] bg-white p-6 shadow-sm',
          'text-blackout'
        )}
      >
        {loading && (
          <p className={cls('text-solid-matte-gray')}>Loading events...</p>
        )}
        {error && (
          <p className={cls('text-red-600')}>{error}</p>
        )}
        {!loading && !error && events.length === 0 && (
          <p className={cls('text-solid-matte-gray')}>No events scheduled yet.</p>
        )}
        {!loading && !error && events.length > 0 && (
          <ul className={cls('space-y-4')}>
            {events.map((ev) => {
              const category = getEventCategory(ev.date);
              const isUpcoming = category === 'Upcoming';

              return (
                <li key={ev.id}>
                  <a
                    href={ev.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cls(
                      'block rounded-lg border border-[#DADCE0] p-4',
                      'hover:border-alexandra/50 transition-colors'
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className={cls('font-semibold text-blackout mb-1')}>{ev.title}</h2>
                      <span className={cls(
                        'rounded-full px-2.5 py-1 text-xs font-semibold',
                        isUpcoming ? 'bg-[#E8F5EB] text-[#137333]' : 'bg-[#F3F4F6] text-[#5F6368]'
                      )}>
                        {category}
                      </span>
                    </div>
                    <p className={cls('text-sm text-solid-matte-gray mb-2')}>
                      {formatDate(ev.date)}
                      {ev.location && ` · ${ev.location}`}
                    </p>
                    {ev.description && (
                      <p className={cls('text-sm text-solid-matte-gray line-clamp-2')}>
                        {ev.description}
                      </p>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
