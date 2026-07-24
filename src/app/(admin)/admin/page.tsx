'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { EMPTY_ADMIN_OVERVIEW, useAdminOverview } from '@/lib/queries';
import { cls } from '@/utils';

export default function AdminPage() {
  const { user, isHydrated } = useAuth();
  const { data: stats = EMPTY_ADMIN_OVERVIEW, isPending } = useAdminOverview();

  const loading = !isHydrated || (Boolean(user) && isPending);

  return (
    <div className={cls('space-y-0')}>
      {/* Hero */}
      <section className={cls('bg-[#F8F8F8] px-6 py-12 md:px-20 md:py-16 -mx-4 md:-mx-6 mb-8')}>
        <div className={cls('mx-auto max-w-6xl')}>
          <h1 className={cls('text-3xl font-medium leading-tight text-blackout md:text-4xl')}>
            Admin dashboard
          </h1>
          <p className={cls('mt-2 text-sm text-solid-matte-gray md:text-base')}>
            Overview of users, content, and activity.
          </p>
        </div>
      </section>

      {/* Quick stats */}
      <section className={cls('mb-12')}>
        <div className={cls('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6')}>
          <Link
            href="/admin/users"
            className={cls(
              'min-w-0 rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md',
              'border border-[#DADCE0] hover:border-alexandra/50',
              'text-blackout'
            )}
          >
            <p className={cls('text-sm font-medium text-solid-matte-gray mb-1')}>Total users</p>
            <p className={cls('text-2xl font-semibold text-blackout')}>
              {loading ? '—' : stats.users}
            </p>
          </Link>
          <Link
            href="/admin/blog"
            className={cls(
              'min-w-0 rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md',
              'border border-[#DADCE0] hover:border-alexandra/50',
              'text-blackout'
            )}
          >
            <p className={cls('text-sm font-medium text-solid-matte-gray mb-1')}>Blog posts</p>
            <p className={cls('text-2xl font-semibold text-blackout')}>
              {loading ? '—' : stats.blogApproved}
            </p>
          </Link>
          <Link
            href="/admin/events"
            className={cls(
              'min-w-0 rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md',
              'border border-[#DADCE0] hover:border-alexandra/50',
              'text-blackout'
            )}
          >
            <p className={cls('text-sm font-medium text-solid-matte-gray mb-1')}>Events</p>
            <p className={cls('text-2xl font-semibold text-blackout')}>
              {loading ? '—' : stats.events}
            </p>
          </Link>
          <Link
            href="/admin/projects"
            className={cls(
              'min-w-0 rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md',
              'border border-[#DADCE0] hover:border-alexandra/50',
              'text-blackout'
            )}
          >
            <p className={cls('text-sm font-medium text-solid-matte-gray mb-1')}>Projects</p>
            <p className={cls('text-2xl font-semibold text-blackout')}>
              {loading ? '—' : stats.projects}
            </p>
          </Link>
        </div>
      </section>

      {/* Secondary stats */}
      <section className={cls('bg-[#F8F8F8] px-6 py-12 md:px-20 md:py-16 -mx-4 md:-mx-6 mb-8')}>
        <div className={cls('mx-auto max-w-6xl space-y-6')}>
          <h2 className={cls('text-xl font-semibold text-blackout')}>Activity</h2>
          <div className={cls('grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6')}>
            <Link
              href="/admin/blog"
              className={cls(
                'rounded-xl border border-[#DADCE0] bg-white p-6 shadow-sm',
                'hover:border-alexandra/50 transition-colors text-blackout'
              )}
            >
              <p className={cls('text-sm font-medium text-solid-matte-gray mb-1')}>Pending blog posts</p>
              <p className={cls('text-2xl font-semibold text-blackout')}>
                {loading ? '—' : stats.pendingPosts}
              </p>
              <p className={cls('text-xs text-solid-matte-gray mt-2')}>Awaiting moderation</p>
            </Link>
            <Link
              href="/admin/events"
              className={cls(
                'rounded-xl border border-[#DADCE0] bg-white p-6 shadow-sm',
                'hover:border-alexandra/50 transition-colors text-blackout'
              )}
            >
              <p className={cls('text-sm font-medium text-solid-matte-gray mb-1')}>Upcoming events</p>
              <p className={cls('text-2xl font-semibold text-blackout')}>
                {loading ? '—' : stats.upcomingEvents}
              </p>
              <p className={cls('text-xs text-solid-matte-gray mt-2')}>From today onward</p>
            </Link>
            <Link
              href="/admin/projects"
              className={cls(
                'rounded-xl border border-[#DADCE0] bg-white p-6 shadow-sm',
                'hover:border-alexandra/50 transition-colors text-blackout'
              )}
            >
              <p className={cls('text-sm font-medium text-solid-matte-gray mb-1')}>Ongoing projects</p>
              <p className={cls('text-2xl font-semibold text-blackout')}>
                {loading ? '—' : stats.ongoingProjects}
              </p>
              <p className={cls('text-xs text-solid-matte-gray mt-2')}>Currently active</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
