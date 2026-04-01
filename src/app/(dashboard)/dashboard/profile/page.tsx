'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError } from '@/lib/api';
import type { BlogPostAdmin, Project, EventRegistration, Event } from '@/lib/api';
import { cls } from '@/utils';

type ProjectWithContributors = Project & {
  contributors?: Array<{ user_id: string }>;
};

type RegistrationWithEvent = EventRegistration & {
  event?: Event;
};

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [myPosts, setMyPosts] = useState<BlogPostAdmin[]>([]);
  const [myProjects, setMyProjects] = useState<ProjectWithContributors[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<RegistrationWithEvent[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name ?? '');
      setEmail(user.email ?? '');
      setPhone(user.phone ?? '');
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setActivityLoading(true);
    Promise.all([
      api.getMyBlogposts({ limit: 10 }).catch(() => []),
      api.getProjects({ limit: 100 }).then((list) => {
        const arr = Array.isArray(list) ? list : [];
        return arr.filter((p) => {
          const proj = p as ProjectWithContributors;
          if (proj.creator_id === user?.id) return true;
          return proj.contributors?.some((c) => c.user_id === user?.id) ?? false;
        });
      }),
      api.getMyRegistrations().catch(() => []),
      api.getEvents({ limit: 200 }).catch(() => []),
    ])
      .then(([posts, projects, regs, events]) => {
        setMyPosts(Array.isArray(posts) ? posts : []);
        setMyProjects(projects);
        const regList = Array.isArray(regs) ? regs : [];
        setMyRegistrations(regList);
        const eventList = Array.isArray(events) ? events : [];
        const regEventIds = new Set(regList.map((r: RegistrationWithEvent) => r.event_id));
        setRegisteredEvents(eventList.filter((ev: Event) => regEventIds.has(ev.id)));
      })
      .catch(() => {})
      .finally(() => setActivityLoading(false));
  }, [user, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await api.updateMe({
        full_name: fullName || null,
        email: email || null,
        phone: phone || null,
      });
      setUser(updated);
      setSuccess(true);
      setIsEditing(false);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl = user?.id
    ? `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(user.id)}`
    : null;

  return (
    <div className={cls('space-y-8')}>
      <h1 className={cls('text-2xl md:text-3xl font-medium text-blackout')}>
        My profile
      </h1>

      {/* Avatar + Profile details card */}
      <section
        className={cls(
          'rounded-2xl border border-[#DADCE0] bg-white p-6 shadow-sm',
          'text-blackout'
        )}
      >
        <div className={cls('flex flex-col sm:flex-row gap-6')}>
          {avatarUrl && (
            <div className={cls('shrink-0')}>
              <div className={cls('relative w-24 h-24 rounded-full overflow-hidden bg-[#F8F8F8] border-2 border-[#E0E0E0]')}>
                <Image
                  src={avatarUrl}
                  alt="Profile avatar"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          )}
          <div className={cls('flex-1 min-w-0')}>
            {isEditing ? (
              <form onSubmit={handleSubmit} className={cls('space-y-4')}>
                <div>
                  <label className={cls('block text-sm font-medium text-blackout mb-1')}>
                    Full name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={cls(
                      'w-full px-4 py-2 border border-[#DADCE0] rounded-lg',
                      'focus:outline-none focus:ring-2 focus:ring-alexandra focus:border-transparent',
                      'text-blackout'
                    )}
                  />
                </div>
                <div>
                  <label className={cls('block text-sm font-medium text-blackout mb-1')}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cls(
                      'w-full px-4 py-2 border border-[#DADCE0] rounded-lg',
                      'focus:outline-none focus:ring-2 focus:ring-alexandra focus:border-transparent',
                      'text-blackout'
                    )}
                  />
                </div>
                <div>
                  <label className={cls('block text-sm font-medium text-blackout mb-1')}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={cls(
                      'w-full px-4 py-2 border border-[#DADCE0] rounded-lg',
                      'focus:outline-none focus:ring-2 focus:ring-alexandra focus:border-transparent',
                      'text-blackout'
                    )}
                  />
                </div>
                {error && <p className={cls('text-sm text-red-600')}>{error}</p>}
                {success && (
                  <p className={cls('text-sm text-green-600')}>Profile updated successfully.</p>
                )}
                <div className={cls('flex gap-3')}>
                  <button
                    type="submit"
                    disabled={saving}
                    className={cls(
                      'px-4 py-2 bg-alexandra text-white font-medium rounded-lg',
                      'hover:bg-[#357AE8] disabled:opacity-60 transition-colors'
                    )}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className={cls(
                      'px-4 py-2 border border-[#DADCE0] rounded-lg font-medium',
                      'hover:bg-tech-white transition-colors'
                    )}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className={cls('space-y-2')}>
                  <p className={cls('text-sm text-solid-matte-gray')}>Full name</p>
                  <p className={cls('font-medium text-blackout')}>{user?.full_name ?? '—'}</p>
                </div>
                <div className={cls('space-y-2 mt-4')}>
                  <p className={cls('text-sm text-solid-matte-gray')}>Email</p>
                  <p className={cls('font-medium text-blackout')}>{user?.email ?? '—'}</p>
                </div>
                <div className={cls('space-y-2 mt-4')}>
                  <p className={cls('text-sm text-solid-matte-gray')}>Phone</p>
                  <p className={cls('font-medium text-blackout')}>{user?.phone ?? '—'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className={cls(
                    'mt-4 px-4 py-2 border border-alexandra text-alexandra font-medium rounded-lg',
                    'hover:bg-alexandra/10 transition-colors'
                  )}
                >
                  Edit profile
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Blog posts I wrote */}
      <section
        className={cls(
          'rounded-2xl border border-[#DADCE0] bg-white p-6 shadow-sm',
          'text-blackout'
        )}
      >
        <h2 className={cls('text-lg font-semibold text-blackout mb-4')}>
          Blog posts I wrote
        </h2>
        {activityLoading ? (
          <p className={cls('text-sm text-solid-matte-gray')}>Loading...</p>
        ) : myPosts.length === 0 ? (
          <p className={cls('text-sm text-solid-matte-gray mb-4')}>No posts yet.</p>
        ) : (
          <ul className={cls('space-y-3')}>
            {myPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/dashboard/blog/${post.id}`}
                  className={cls(
                    'block py-2 px-3 rounded-lg border border-[#DADCE0]',
                    'hover:border-alexandra/50 hover:bg-alexandra/5 transition-colors'
                  )}
                >
                  <span className={cls('font-medium text-blackout')}>{post.title}</span>
                  <span
                    className={cls(
                      'ml-2 text-xs px-2 py-0.5 rounded-sm uppercase',
                      post.status === 'approved' && 'bg-green-100 text-green-800',
                      post.status === 'pending' && 'bg-amber-100 text-amber-800',
                      post.status === 'rejected' && 'bg-red-100 text-red-800'
                    )}
                  >
                    {post.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/dashboard/blog/submit"
          className={cls(
            'mt-4 inline-block text-sm text-alexandra hover:underline font-medium'
          )}
        >
          Submit a post
        </Link>
      </section>

      {/* Projects I've contributed to */}
      <section
        className={cls(
          'rounded-2xl border border-[#DADCE0] bg-white p-6 shadow-sm',
          'text-blackout'
        )}
      >
        <h2 className={cls('text-lg font-semibold text-blackout mb-4')}>
          Projects I&apos;ve contributed to
        </h2>
        {activityLoading ? (
          <p className={cls('text-sm text-solid-matte-gray')}>Loading...</p>
        ) : myProjects.length === 0 ? (
          <p className={cls('text-sm text-solid-matte-gray mb-4')}>No projects yet.</p>
        ) : (
          <ul className={cls('space-y-3')}>
            {myProjects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/dashboard/projects/${p.id}`}
                  className={cls(
                    'block py-2 px-3 rounded-lg border border-[#DADCE0]',
                    'hover:border-alexandra/50 hover:bg-alexandra/5 transition-colors'
                  )}
                >
                  <span className={cls('font-medium text-blackout')}>{p.title}</span>
                  <span
                    className={cls(
                      'ml-2 text-xs px-2 py-0.5 rounded-sm uppercase',
                      p.status === 'ongoing' && 'bg-alexandra/20 text-alexandra',
                      p.status === 'completed' && 'bg-green-100 text-green-800'
                    )}
                  >
                    {p.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/dashboard/projects"
          className={cls(
            'mt-4 inline-block text-sm text-alexandra hover:underline font-medium'
          )}
        >
          View all projects
        </Link>
      </section>

      {/* Events I've registered for */}
      <section
        className={cls(
          'rounded-2xl border border-[#DADCE0] bg-white p-6 shadow-sm',
          'text-blackout'
        )}
      >
        <h2 className={cls('text-lg font-semibold text-blackout mb-4')}>
          Events I&apos;ve registered for
        </h2>
        {activityLoading ? (
          <p className={cls('text-sm text-solid-matte-gray')}>Loading...</p>
        ) : registeredEvents.length === 0 ? (
          <p className={cls('text-sm text-solid-matte-gray mb-4')}>No events registered yet.</p>
        ) : (
          <ul className={cls('space-y-3')}>
            {registeredEvents.map((ev) => (
              <li key={ev.id}>
                <Link
                  href={`/dashboard/events/${ev.id}`}
                  className={cls(
                    'block py-2 px-3 rounded-lg border border-[#DADCE0]',
                    'hover:border-alexandra/50 hover:bg-alexandra/5 transition-colors'
                  )}
                >
                  <span className={cls('font-medium text-blackout')}>{ev.title}</span>
                  <span className={cls('ml-2 text-xs text-solid-matte-gray')}>
                    {new Date(ev.date).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/dashboard/events"
          className={cls(
            'mt-4 inline-block text-sm text-alexandra hover:underline font-medium'
          )}
        >
          Browse events
        </Link>
      </section>
    </div>
  );
}
