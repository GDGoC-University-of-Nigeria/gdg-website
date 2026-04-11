'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, ApiError } from '@/lib/api';
import type { Event } from '@/lib/api';
import { cls } from '@/utils';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getEvents({ limit: 50 })
      .then(setEvents)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Failed to load events'))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-NG', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

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
            {events.map((ev) => (
              <li key={ev.id}>
                <Link
                  href={`/dashboard/events/${ev.id}`}
                  className={cls(
                    'block rounded-lg border border-[#DADCE0] p-4',
                    'hover:border-alexandra/50 transition-colors'
                  )}
                >
                  <h2 className={cls('font-semibold text-blackout mb-1')}>{ev.title}</h2>
                  <p className={cls('text-sm text-solid-matte-gray mb-2')}>
                    {formatDate(ev.date)}
                    {ev.location && ` · ${ev.location}`}
                  </p>
                  {ev.description && (
                    <p className={cls('text-sm text-solid-matte-gray line-clamp-2')}>
                      {ev.description}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
