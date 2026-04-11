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
          (u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : members;

  const hasNext = totalLoaded >= PAGE_SIZE;
  const hasPrev = page > 1;

  return (
    <div className={cls('space-y-6')}>
      <h1 className={cls('text-2xl md:text-3xl font-medium text-blackout')}>
        Community directory
      </h1>
      <section
        className={cls(
          'rounded-2xl border border-[#DADCE0] bg-white p-6 shadow-sm',
          'text-blackout'
        )}
      >
        <p className={cls('text-sm text-solid-matte-gray mb-4')}>
          Search members by name or email.
        </p>
        <div className={cls('flex gap-2 mb-6')}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className={cls(
              'flex-1 px-4 py-2 border border-[#DADCE0] rounded-lg',
              'focus:outline-none focus:ring-2 focus:ring-alexandra focus:border-transparent',
              'text-blackout placeholder:text-[#9AA0A6]'
            )}
          />
        </div>
        {error && <p className={cls('text-sm text-red-600 mb-4')}>{error}</p>}
        {loading ? (
          <p className={cls('text-solid-matte-gray')}>Loading...</p>
        ) : (
          <ul className={cls('space-y-2')}>
            {filteredMembers.map((u) => (
              <li
                key={u.id}
                className={cls(
                  'flex items-center justify-between py-3 px-4 rounded-lg',
                  'bg-tech-white border border-[#DADCE0]'
                )}
              >
                <span className={cls('font-medium text-blackout')}>
                  {u.full_name ?? u.email}
                </span>
                <span className={cls('text-sm text-solid-matte-gray')}>{u.email}</span>
              </li>
            ))}
          </ul>
        )}
        {!loading && filteredMembers.length === 0 && (
          <p className={cls('text-sm text-solid-matte-gray mt-4')}>
            {searchQuery.trim() ? 'No results found.' : 'No members yet.'}
          </p>
        )}
        {!loading && members.length > 0 && (
          <div className={cls('flex items-center justify-between mt-6 pt-4 border-t border-[#DADCE0]')}>
            <span className={cls('text-sm text-solid-matte-gray')}>
              Page {page}
            </span>
            <div className={cls('flex gap-2')}>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!hasPrev}
                className={cls(
                  'px-3 py-1.5 rounded-lg text-sm font-medium',
                  'border border-[#DADCE0] text-blackout',
                  hasPrev ? 'hover:bg-tech-white' : 'opacity-50 cursor-not-allowed'
                )}
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext}
                className={cls(
                  'px-3 py-1.5 rounded-lg text-sm font-medium',
                  'border border-[#DADCE0] text-blackout',
                  hasNext ? 'hover:bg-tech-white' : 'opacity-50 cursor-not-allowed'
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
