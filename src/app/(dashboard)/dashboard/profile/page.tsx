'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError } from '@/lib/api';
import type { Project, EventRegistration, Event } from '@/lib/api';
import {
  useEvents,
  useMyBlogposts,
  useMyEventRegistrations,
  useProjects
} from '@/lib/queries';
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
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUploadLoading, setAvatarUploadLoading] = useState(false);
  useEffect(() => {
    if (user) {
      setFullName(user.profile?.full_name ?? '');
      setEmail(user.email ?? '');
      setPhone(user.profile?.phone ?? '');
      setBio(user.profile?.bio ?? '');
    }
  }, [user]);

  // Four cached queries instead of one aggregate fetch, so revisiting the page
  // (or hitting these lists elsewhere) reuses what's already loaded.
  const myPostsQuery = useMyBlogposts({ limit: 10 });
  const allProjectsQuery = useProjects({ limit: 100 });
  const myRegistrationsQuery = useMyEventRegistrations();
  const allEventsQuery = useEvents({ limit: 200 });

  const myPosts = myPostsQuery.data ?? [];
  const myRegistrations = useMemo<RegistrationWithEvent[]>(
    () => (myRegistrationsQuery.data ?? []) as RegistrationWithEvent[],
    [myRegistrationsQuery.data]
  );

  const myProjects = useMemo<ProjectWithContributors[]>(() => {
    const list = (allProjectsQuery.data ?? []) as ProjectWithContributors[];
    return list.filter(
      (proj) =>
        proj.creator_id === user?.id ||
        (proj.contributors?.some((c) => c.user_id === user?.id) ?? false)
    );
  }, [allProjectsQuery.data, user?.id]);

  const registeredEvents = useMemo<Event[]>(() => {
    const regEventIds = new Set(myRegistrations.map((r) => r.event_id));
    return (allEventsQuery.data ?? []).filter((ev) => regEventIds.has(ev.id));
  }, [allEventsQuery.data, myRegistrations]);

  const activityLoading =
    myPostsQuery.isPending ||
    allProjectsQuery.isPending ||
    myRegistrationsQuery.isPending ||
    allEventsQuery.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await api.updateMe({
        full_name: fullName || null,
        phone: phone || null,
        bio: bio || null
      });
      setUser(updated);
      setSuccess(true);
      toast.success('Profile updated');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl =
    user?.profile?.avatar_url ||
    (user?.id
      ? `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(user.id)}`
      : null);

  const handleAvatarUpload = async (file?: File | null) => {
    if (!user || !file) return;
    setAvatarUploadLoading(true);
    setError(null);
    try {
      const { url } = await api.uploadImage(file);
      const updated = await api.updateMe({ avatar_url: url });
      setUser(updated);
      toast.success('Avatar updated');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to upload avatar');
    } finally {
      setAvatarUploadLoading(false);
    }
  };

  return (
    <div className={cls('space-y-8')}>
      <h1 className={cls('text-blackout text-2xl font-medium md:text-3xl')}>
        My profile
      </h1>

      {/* Avatar + Profile details card */}
      <section
        className={cls(
          'rounded-2xl border border-[#DADCE0] bg-white p-6 shadow-sm',
          'text-blackout'
        )}
      >
        <div className={cls('flex flex-col gap-6 sm:flex-row')}>
          {avatarUrl && (
            <div className={cls('shrink-0')}>
              <div
                className={cls(
                  'relative h-24 w-24 overflow-hidden rounded-full border-2 border-[#E0E0E0] bg-[#F8F8F8]'
                )}
              >
                <Image
                  src={avatarUrl}
                  alt="Profile avatar"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              {isEditing && (
                <label
                  htmlFor="avatar-upload"
                  className={cls(
                    'mt-3 inline-flex cursor-pointer rounded-lg border border-(--color-border) px-3 py-1.5 text-xs font-medium',
                    'text-blackout hover:border-alexandra hover:text-alexandra transition-colors'
                  )}
                >
                  {avatarUploadLoading ? 'Uploading...' : 'Change avatar'}
                </label>
              )}
              {isEditing && (
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => void handleAvatarUpload(e.target.files?.[0])}
                />
              )}
            </div>
          )}
          <div className={cls('min-w-0 flex-1')}>
            {isEditing ? (
              <form onSubmit={handleSubmit} className={cls('space-y-4')}>
                <div>
                  <label
                    className={cls(
                      'text-blackout mb-1 block text-sm font-medium'
                    )}
                  >
                    Full name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={cls(
                      'w-full rounded-lg border border-[#DADCE0] px-4 py-2',
                      'focus:ring-alexandra focus:border-transparent focus:ring-2 focus:outline-none',
                      'text-blackout'
                    )}
                  />
                </div>
                <div>
                  <label
                    className={cls(
                      'text-blackout mb-1 block text-sm font-medium'
                    )}
                  >
                    Email (Primary)
                  </label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className={cls(
                      'w-full cursor-not-allowed rounded-lg border border-[#DADCE0] bg-gray-50 px-4 py-2',
                      'focus:ring-1 focus:ring-gray-200 focus:outline-none',
                      'text-solid-matte-gray'
                    )}
                  />
                  <p className="text-solid-matte-gray mt-1 text-xs italic">
                    Linked to your Google account.
                  </p>
                </div>
                <div>
                  <label
                    className={cls(
                      'text-blackout mb-1 block text-sm font-medium'
                    )}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={cls(
                      'w-full rounded-lg border border-[#DADCE0] px-4 py-2',
                      'focus:ring-alexandra focus:border-transparent focus:ring-2 focus:outline-none',
                      'text-blackout'
                    )}
                  />
                </div>
                <div>
                  <label
                    className={cls(
                      'text-blackout mb-1 block text-sm font-medium'
                    )}
                  >
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className={cls(
                      'w-full rounded-lg border border-[#DADCE0] px-4 py-2',
                      'focus:ring-alexandra focus:border-transparent focus:ring-2 focus:outline-none',
                      'text-blackout resize-none'
                    )}
                  />
                </div>
                {error && (
                  <p className={cls('text-sm text-red-600')}>{error}</p>
                )}
                {success && (
                  <p className={cls('text-sm text-green-600')}>
                    Profile updated successfully.
                  </p>
                )}
                <div className={cls('flex gap-3')}>
                  <button
                    type="submit"
                    disabled={saving}
                    className={cls(
                      'bg-alexandra rounded-lg px-4 py-2 font-medium text-white',
                      'transition-colors hover:bg-[#357AE8] disabled:opacity-60'
                    )}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setError(null);
                      setSuccess(false);
                      setFullName(user?.profile?.full_name ?? '');
                      setPhone(user?.profile?.phone ?? '');
                      setBio(user?.profile?.bio ?? '');
                    }}
                    className={cls(
                      'rounded-lg border border-[#DADCE0] px-4 py-2 font-medium',
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
                  <p className={cls('text-solid-matte-gray text-sm')}>
                    Full name
                  </p>
                  <p className={cls('text-blackout font-medium')}>
                    {user?.profile?.full_name ?? '—'}
                  </p>
                </div>
                <div className={cls('mt-4 space-y-2')}>
                  <p className={cls('text-solid-matte-gray text-sm')}>Email</p>
                  <p className={cls('text-blackout font-medium')}>
                    {user?.email ?? '—'}
                  </p>
                </div>
                <div className={cls('mt-4 space-y-2')}>
                  <p className={cls('text-solid-matte-gray text-sm')}>Phone</p>
                  <p className={cls('text-blackout font-medium')}>
                    {user?.profile?.phone ?? '—'}
                  </p>
                </div>
                <div className={cls('mt-4 space-y-2')}>
                  <p className={cls('text-solid-matte-gray text-sm')}>Bio</p>
                  <p
                    className={cls(
                      'text-blackout font-medium whitespace-pre-wrap'
                    )}
                  >
                    {user?.profile?.bio ?? 'No bio yet.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className={cls(
                    'border-alexandra text-alexandra mt-4 rounded-lg border px-4 py-2 font-medium',
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
        <h2 className={cls('text-blackout mb-4 text-lg font-semibold')}>
          Blog posts I wrote
        </h2>
        {activityLoading ? (
          <p className={cls('text-solid-matte-gray text-sm')}>Loading...</p>
        ) : myPosts.length === 0 ? (
          <p className={cls('text-solid-matte-gray mb-4 text-sm')}>
            No posts yet.
          </p>
        ) : (
          <ul className={cls('space-y-3')}>
            {myPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/dashboard/blog/${post.id}`}
                  className={cls(
                    'block rounded-lg border border-[#DADCE0] px-3 py-2',
                    'hover:border-alexandra/50 hover:bg-alexandra/5 transition-colors'
                  )}
                >
                  <span className={cls('text-blackout font-medium')}>
                    {post.title}
                  </span>
                  <span
                    className={cls(
                      'ml-2 rounded-sm px-2 py-0.5 text-xs uppercase',
                      post.status === 'approved' &&
                        'bg-green-100 text-green-800',
                      post.status === 'pending' &&
                        'bg-amber-100 text-amber-800',
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
            'text-alexandra mt-4 inline-block text-sm font-medium hover:underline'
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
        <h2 className={cls('text-blackout mb-4 text-lg font-semibold')}>
          Projects I&apos;ve contributed to
        </h2>
        {activityLoading ? (
          <p className={cls('text-solid-matte-gray text-sm')}>Loading...</p>
        ) : myProjects.length === 0 ? (
          <p className={cls('text-solid-matte-gray mb-4 text-sm')}>
            No projects yet.
          </p>
        ) : (
          <ul className={cls('space-y-3')}>
            {myProjects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/dashboard/projects/${p.id}`}
                  className={cls(
                    'block rounded-lg border border-[#DADCE0] px-3 py-2',
                    'hover:border-alexandra/50 hover:bg-alexandra/5 transition-colors'
                  )}
                >
                  <span className={cls('text-blackout font-medium')}>
                    {p.title}
                  </span>
                  <span
                    className={cls(
                      'ml-2 rounded-sm px-2 py-0.5 text-xs uppercase',
                      p.status === 'ongoing' &&
                        'bg-alexandra/20 text-alexandra',
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
            'text-alexandra mt-4 inline-block text-sm font-medium hover:underline'
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
        <h2 className={cls('text-blackout mb-4 text-lg font-semibold')}>
          Events I&apos;ve registered for
        </h2>
        {activityLoading ? (
          <p className={cls('text-solid-matte-gray text-sm')}>Loading...</p>
        ) : registeredEvents.length === 0 ? (
          <p className={cls('text-solid-matte-gray mb-4 text-sm')}>
            No events registered yet.
          </p>
        ) : (
          <ul className={cls('space-y-3')}>
            {registeredEvents.map((ev) => (
              <li key={ev.id}>
                <Link
                  href={`/dashboard/events/${ev.id}`}
                  className={cls(
                    'block rounded-lg border border-[#DADCE0] px-3 py-2',
                    'hover:border-alexandra/50 hover:bg-alexandra/5 transition-colors'
                  )}
                >
                  <span className={cls('text-blackout font-medium')}>
                    {ev.title}
                  </span>
                  <span className={cls('text-solid-matte-gray ml-2 text-xs')}>
                    {new Date(ev.date).toLocaleDateString('en-NG', {
                      dateStyle: 'medium'
                    })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/dashboard/events"
          className={cls(
            'text-alexandra mt-4 inline-block text-sm font-medium hover:underline'
          )}
        >
          Browse events
        </Link>
      </section>
    </div>
  );
}
