'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError, type User } from '@/lib/api';
import { cls } from '@/utils';

const PAGE_SIZE = 20;

export default function CommunityPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalLoaded, setTotalLoaded] = useState(0);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    const skip = (page - 1) * PAGE_SIZE;
    api
      .getCommunityMembers({ skip, limit: PAGE_SIZE })
      .then((list) => {
        setMembers(list);
        setTotalLoaded(list.length);
      })
      .catch((e) => {
        setError(e instanceof ApiError ? e.message : 'Failed to load members');
        setMembers([]);
      })
      .finally(() => setLoading(false));
  }, [user, page]);

  const filteredMembers = searchQuery.trim()
    ? members.filter(
        (u) =>
          (u.profile?.full_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ??
            false) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : members;

  const hasNext = totalLoaded >= PAGE_SIZE;
  const hasPrev = page > 1;

  return (
    <div className={cls('space-y-6')}>
      <h1 className={cls('text-blackout text-2xl font-medium md:text-3xl')}>
        Community directory
      </h1>
      <section
        className={cls(
          'rounded-2xl border border-[#DADCE0] bg-white p-6 shadow-sm',
          'text-blackout'
        )}
      >
        <p className={cls('text-solid-matte-gray mb-4 text-sm')}>
          Search members by name or email.
        </p>
        <div className={cls('mb-6 flex gap-2')}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className={cls(
              'flex-1 rounded-lg border border-[#DADCE0] px-4 py-2',
              'focus:ring-alexandra focus:border-transparent focus:ring-2 focus:outline-none',
              'text-blackout placeholder:text-[#9AA0A6]'
            )}
          />
        </div>
        {error && <p className={cls('mb-4 text-sm text-red-600')}>{error}</p>}
        {loading ? (
          <p className={cls('text-solid-matte-gray')}>Loading...</p>
        ) : (
          <ul className={cls('space-y-2')}>
            {filteredMembers.map((u) => (
              <li
                key={u.id}
                className={cls(
                  'flex items-center justify-between rounded-lg px-4 py-3',
                  'bg-tech-white border border-[#DADCE0]'
                )}
              >
                <span className={cls('text-blackout font-medium')}>
                  {u.profile?.full_name ?? u.email}
                </span>
                <span className={cls('text-solid-matte-gray text-sm')}>
                  {u.email}
                </span>
              </li>
            ))}
          </ul>
        )}
        {!loading && filteredMembers.length === 0 && (
          <p className={cls('text-solid-matte-gray mt-4 text-sm')}>
            {searchQuery.trim() ? 'No results found.' : 'No members yet.'}
          </p>
        )}
        {!loading && members.length > 0 && (
          <div
            className={cls(
              'mt-6 flex items-center justify-between border-t border-[#DADCE0] pt-4'
            )}
          >
            <span className={cls('text-solid-matte-gray text-sm')}>
              Page {page}
            </span>
            <div className={cls('flex gap-2')}>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!hasPrev}
                className={cls(
                  'rounded-lg px-3 py-1.5 text-sm font-medium',
                  'text-blackout border border-[#DADCE0]',
                  hasPrev
                    ? 'hover:bg-tech-white'
                    : 'cursor-not-allowed opacity-50'
                )}
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext}
                className={cls(
                  'rounded-lg px-3 py-1.5 text-sm font-medium',
                  'text-blackout border border-[#DADCE0]',
                  hasNext
                    ? 'hover:bg-tech-white'
                    : 'cursor-not-allowed opacity-50'
                )}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
