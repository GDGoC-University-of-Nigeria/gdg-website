'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError } from '@/lib/api';
import type { Event, BlogPost, Project } from '@/lib/api';
import { cls } from '@/utils';

type QuickStats = {
  events: number;
  projects: number;
  blogPosts: number;
};

function formatEventDate(d: string) {
  return new Date(d).toLocaleDateString('en-NG', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

const AsteriskIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 2V26M2 14H26M5.5 5.5L22.5 22.5M22.5 5.5L5.5 22.5"
      stroke="#34A853"
      strokeWidth="3"
      strokeLinecap="round"
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

const QuoteIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(-1, 0, 0, 1, 32, 0)">
      <path
        d="M8 6L14 26M18 6L24 26"
        stroke="#34A853"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

const RocketIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L2 12l3 3 7-7 7 7 3-3L12 2z"
      stroke="#4285F4"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<QuickStats>({ events: 0, projects: 0, blogPosts: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [featuredArticle, setFeaturedArticle] = useState<BlogPost | null>(null);
  const [featuredProject, setFeaturedProject] = useState<Project | null>(null);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  const displayName = user?.full_name || user?.email || 'Builder';

  const scrollEvents = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -360 : 360,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    setStatsLoading(true);
    Promise.all([
      api.getEvents({ limit: 100 }).catch(() => []),
      api.getProjects({ limit: 100 }).catch(() => []),
      api.getBlogposts({ limit: 100 }).catch(() => []),
    ])
      .then(([events, projects, posts]) => {
        setStats({
          events: Array.isArray(events) ? events.length : 0,
          projects: Array.isArray(projects) ? projects.length : 0,
          blogPosts: Array.isArray(posts) ? posts.length : 0,
        });
      })
      .finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
    setEventsLoading(true);
    const today = new Date().toISOString().slice(0, 10);
    api
      .getEvents({ from_date: today, limit: 20 })
      .then((events) => {
        const list = Array.isArray(events) ? events : [];
        const upcoming = list.filter((e) => e.date >= today).slice(0, 5);
        setUpcomingEvents(upcoming);
      })
      .catch(() => setUpcomingEvents([]))
      .finally(() => setEventsLoading(false));
  }, []);

  useEffect(() => {
    setFeaturedLoading(true);
    Promise.all([
      api.getBlogposts({ limit: 1 }).then((posts) => (Array.isArray(posts) && posts.length > 0 ? posts[0] : null)),
      api.getProjects({ status: 'ongoing', limit: 1 }).then((projs) => (Array.isArray(projs) && projs.length > 0 ? projs[0] : null)),
    ])
      .then(([article, project]) => {
        setFeaturedArticle(article);
        setFeaturedProject(project);
      })
      .catch(() => {})
      .finally(() => setFeaturedLoading(false));
  }, []);

  return (
    <div className={cls('space-y-0')}>
      {/* 1. Welcome hero - first thing user sees */}
      <section className={cls('bg-[#F8F8F8] px-6 py-12 md:px-20 md:py-16 -mx-4 md:-mx-6 mb-8')}>
        <div className={cls('mx-auto max-w-6xl')}>
          <h1 className={cls('text-3xl font-medium leading-tight text-blackout md:text-4xl')}>
            Welcome back, {displayName}!
          </h1>
          <p className={cls('mt-2 text-sm text-solid-matte-gray md:text-base')}>
            Here&apos;s what&apos;s happening in your community.
          </p>
        </div>
      </section>

      {/* 2. Quick stats - compact cards */}
      <section className={cls('mb-12')}>
        <div className={cls('grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6')}>
          <Link
            href="/dashboard/events"
            className={cls(
              'min-w-0 rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md',
              'border border-[#DADCE0] hover:border-alexandra/50',
              'text-blackout'
            )}
          >
            <p className={cls('text-sm font-medium text-solid-matte-gray mb-1')}>Upcoming events</p>
            <p className={cls('text-2xl font-semibold text-blackout')}>
              {statsLoading ? '—' : stats.events}
            </p>
          </Link>
          <Link
            href="/dashboard/projects"
            className={cls(
              'min-w-0 rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md',
              'border border-[#DADCE0] hover:border-alexandra/50',
              'text-blackout'
            )}
          >
            <p className={cls('text-sm font-medium text-solid-matte-gray mb-1')}>Active projects</p>
            <p className={cls('text-2xl font-semibold text-blackout')}>
              {statsLoading ? '—' : stats.projects}
            </p>
          </Link>
          <Link
            href="/dashboard/blog"
            className={cls(
              'min-w-0 rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md',
              'border border-[#DADCE0] hover:border-alexandra/50',
              'text-blackout'
            )}
          >
            <p className={cls('text-sm font-medium text-solid-matte-gray mb-1')}>Blog posts</p>
            <p className={cls('text-2xl font-semibold text-blackout')}>
              {statsLoading ? '—' : stats.blogPosts}
            </p>
          </Link>
        </div>
      </section>

      {/* 3. Upcoming events carousel - EventsSection style */}
      <section className={cls('bg-[#F8F8F8] px-6 py-12 md:px-20 md:py-16 -mx-4 md:-mx-6 mb-8')}>
        <div className={cls('mx-auto max-w-6xl')}>
          <div className={cls('mb-8 flex items-start gap-3')}>
            <AsteriskIcon />
            <div>
              <h2 className={cls('text-xl font-normal leading-tight text-blackout md:text-3xl')}>
                Upcoming events
              </h2>
              <p className={cls('mt-2 text-sm text-solid-matte-gray')}>
                Stop scrolling, start learning. The next event is happening.
              </p>
            </div>
          </div>
          {eventsLoading ? (
            <p className={cls('text-sm text-solid-matte-gray')}>Loading...</p>
          ) : upcomingEvents.length === 0 ? (
            <p className={cls('text-sm text-solid-matte-gray')}>No upcoming events.</p>
          ) : (
            <>
              <div
                ref={scrollContainerRef}
                className={cls(
                  'mb-6 flex gap-6 overflow-x-auto pb-4',
                  'scrollbar-hide'
                )}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {upcomingEvents.map((ev) => (
                  <Link
                    key={ev.id}
                    href={`/dashboard/events/${ev.id}`}
                    className={cls(
                      'min-w-[300px] shrink-0 overflow-hidden rounded-xl bg-white shadow-sm',
                      'transition-shadow hover:shadow-md md:min-w-[340px]',
                      'text-blackout'
                    )}
                  >
                    <div className={cls('relative h-44 w-full bg-[#E0E0E0]')}>
                      {ev.image_url ? (
                        <Image
                          src={ev.image_url}
                          alt={ev.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className={cls('absolute inset-0 flex items-center justify-center')}>
                          <span className={cls('text-sm text-solid-matte-gray')}>Event</span>
                        </div>
                      )}
                    </div>
                    <div className={cls('p-5')}>
                      <h3 className={cls('mb-4 min-h-14 text-base font-medium leading-snug text-blackout')}>
                        {ev.title}
                      </h3>
                      <div className={cls('flex flex-col gap-1')}>
                        <p className={cls('text-sm text-blackout')}>{formatEventDate(ev.date)}</p>
                        {ev.location && (
                          <p className={cls('text-sm text-alexandra')}>{ev.location}</p>
                        )}
                      </div>
                      <span
                        className={cls(
                          'mt-4 inline-block rounded-md bg-blackout px-5 py-2 text-sm font-medium text-white',
                          'transition-colors group-hover:bg-blackout/90'
                        )}
                      >
                        View details
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className={cls('flex items-center justify-between')}>
                <Link
                  href="/dashboard/events"
                  className={cls('border-b border-alexandra pb-0.5 text-sm text-alexandra hover:opacity-80')}
                >
                  View all events
                </Link>
                <div className={cls('flex gap-2')}>
                  <button
                    type="button"
                    onClick={() => scrollEvents('left')}
                    className={cls(
                      'flex h-9 w-9 items-center justify-center rounded-full',
                      'border border-gray-300 text-gray-500',
                      'transition-colors hover:border-alexandra hover:text-alexandra'
                    )}
                    aria-label="Previous events"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollEvents('right')}
                    className={cls(
                      'flex h-9 w-9 items-center justify-center rounded-full',
                      'border border-gray-300 text-gray-500',
                      'transition-colors hover:border-alexandra hover:text-alexandra'
                    )}
                    aria-label="Next events"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 4. Complete your profile CTA */}
      {!user?.full_name && (
        <section
          className={cls(
            'rounded-xl border border-alexandra/30 bg-alexandra/10 p-6 mb-8',
            'text-blackout'
          )}
        >
          <h2 className={cls('text-xl font-semibold mb-2')}>Complete your profile</h2>
          <p className={cls('text-sm text-solid-matte-gray mb-4')}>
            Add your name and other details so the community can get to know you better.
          </p>
          <Link
            href="/dashboard/profile"
            className={cls(
              'inline-block rounded-md bg-alexandra px-5 py-2.5 text-sm font-medium text-white',
              'shadow-[0_8px_20px_rgba(66,133,244,0.35)] transition-transform hover:-translate-y-0.5',
              'hover:shadow-[0_12px_28px_rgba(66,133,244,0.4)]'
            )}
          >
            Edit profile
          </Link>
        </section>
      )}

      {/* 5. Explore article - featured blog post */}
      <section className={cls('bg-[#F8F8F8] px-6 py-12 md:px-20 md:py-16 -mx-4 md:-mx-6 mb-8')}>
        <div className={cls('mx-auto max-w-6xl')}>
          <div className={cls('mb-6 flex items-center gap-3')}>
            <QuoteIcon />
            <div>
              <h2 className={cls('text-xl font-normal leading-tight text-blackout md:text-3xl')}>
                Explore article
              </h2>
              <p className={cls('mt-1 text-sm text-solid-matte-gray')}>
                Latest from the community blog.
              </p>
            </div>
          </div>
          {featuredLoading ? (
            <p className={cls('text-sm text-solid-matte-gray')}>Loading...</p>
          ) : featuredArticle ? (
            <div className={cls('rounded-xl border border-[#DADCE0] bg-white p-6 shadow-sm')}>
              <div className={cls('relative mb-4 h-40 w-full rounded-lg overflow-hidden bg-alexandra/20')}>
                {featuredArticle.image_url ? (
                  <Image
                    src={featuredArticle.image_url}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : null}
              </div>
              {featuredArticle.niche && (
                <span className={cls('inline-block text-xs px-2 py-0.5 rounded-sm uppercase bg-alexandra/20 text-alexandra mb-2')}>
                  {featuredArticle.niche}
                </span>
              )}
              <h3 className={cls('text-lg font-medium text-blackout mb-2')}>{featuredArticle.title}</h3>
              <p className={cls('text-sm text-solid-matte-gray mb-4 line-clamp-2')}>
                {featuredArticle.content?.slice(0, 120)}
                {featuredArticle.content && featuredArticle.content.length > 120 ? '...' : ''}
              </p>
              <p className={cls('text-xs text-solid-matte-gray mb-4')}>
                {featuredArticle.posted_at
                  ? new Date(featuredArticle.posted_at).toLocaleDateString('en-NG', { dateStyle: 'medium' })
                  : '—'}
              </p>
              <div className={cls('flex gap-3')}>
                <Link
                  href={`/dashboard/blog/${featuredArticle.id}`}
                  className={cls(
                    'inline-block rounded-md bg-alexandra px-5 py-2.5 text-sm font-medium text-white',
                    'hover:bg-[#357AE8] transition-colors'
                  )}
                >
                  Read article
                </Link>
                <Link
                  href="/dashboard/blog"
                  className={cls(
                    'inline-block rounded-md border border-[#DADCE0] px-5 py-2.5 text-sm font-medium',
                    'text-blackout hover:border-alexandra hover:text-alexandra transition-colors'
                  )}
                >
                  View all articles
                </Link>
              </div>
            </div>
          ) : (
            <div className={cls('rounded-xl border border-[#DADCE0] bg-white p-6')}>
              <p className={cls('text-sm text-solid-matte-gray mb-4')}>No articles yet.</p>
              <Link
                href="/dashboard/blog/submit"
                className={cls(
                  'inline-block rounded-md bg-alexandra px-5 py-2.5 text-sm font-medium text-white',
                  'hover:bg-[#357AE8] transition-colors'
                )}
              >
                Submit a post
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 6. Project of the week */}
      <section className={cls('bg-[#F8F8F8] px-6 py-12 md:px-20 md:py-16 -mx-4 md:-mx-6 mb-8')}>
        <div className={cls('mx-auto max-w-6xl')}>
          <div className={cls('mb-6 flex items-center gap-3')}>
            <RocketIcon />
            <div>
              <h2 className={cls('text-xl font-normal leading-tight text-blackout md:text-3xl')}>
                Project spotlight
              </h2>
              <p className={cls('mt-1 text-sm text-solid-matte-gray')}>
                This week we&apos;re building...
              </p>
            </div>
          </div>
          {featuredLoading ? (
            <p className={cls('text-sm text-solid-matte-gray')}>Loading...</p>
          ) : featuredProject ? (
            <div className={cls('rounded-xl border border-[#DADCE0] bg-white p-6 shadow-sm')}>
              <div className={cls('mb-4 h-32 w-full rounded-lg bg-[#34A853]/20')} />
              <span
                className={cls(
                  'inline-block text-xs px-2 py-0.5 rounded-sm uppercase mb-2',
                  featuredProject.status === 'ongoing' && 'bg-alexandra/20 text-alexandra',
                  featuredProject.status === 'completed' && 'bg-green-100 text-green-800'
                )}
              >
                {featuredProject.status}
              </span>
              <h3 className={cls('text-lg font-medium text-blackout mb-2')}>{featuredProject.title}</h3>
              <p className={cls('text-sm text-solid-matte-gray mb-4 line-clamp-2')}>
                {featuredProject.description}
              </p>
              <div className={cls('flex gap-3')}>
                <Link
                  href={`/dashboard/projects/${featuredProject.id}`}
                  className={cls(
                    'inline-block rounded-md bg-alexandra px-5 py-2.5 text-sm font-medium text-white',
                    'hover:bg-[#357AE8] transition-colors'
                  )}
                >
                  View project
                </Link>
                <Link
                  href="/dashboard/projects"
                  className={cls(
                    'inline-block rounded-md border border-[#DADCE0] px-5 py-2.5 text-sm font-medium',
                    'text-blackout hover:border-alexandra hover:text-alexandra transition-colors'
                  )}
                >
                  View all projects
                </Link>
              </div>
            </div>
          ) : (
            <div className={cls('rounded-xl border border-[#DADCE0] bg-white p-6')}>
              <p className={cls('text-sm text-solid-matte-gray')}>No ongoing projects yet.</p>
              <Link
                href="/dashboard/projects"
                className={cls(
                  'inline-block rounded-md bg-alexandra px-5 py-2.5 text-sm font-medium text-white mt-2',
                  'hover:bg-[#357AE8] transition-colors'
                )}
              >
                View projects
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
