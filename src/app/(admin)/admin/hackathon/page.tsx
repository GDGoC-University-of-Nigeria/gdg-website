'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import {
  EmptyState,
  PageHeader,
  SearchInput,
  Skeleton
} from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError } from '@/lib/api';
import type { HackathonRegistrationResponse } from '@/lib/api/types';
import { cls } from '@/utils';

export default function AdminHackathonPage() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<HackathonRegistrationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await api.hackathon.getRegistrations();
      setRegistrations(list);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load hackathon registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, [user]);

  const displayList = searchQuery.trim()
    ? registrations.filter(
        (r) =>
          r.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r.team_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      )
    : registrations;

  return (
    <div className={cls('space-y-6')}>
      <PageHeader title="Hackathon registrations" description="View participants registered for the hackathon." />

      {error && (
        <div
          className={cls(
            'rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-700'
          )}
        >
          {error}
        </div>
      )}

      <section className={cls('rounded-xl border border-[var(--color-border)] bg-white p-4')}>
        <SearchInput
          id="admin-hackathon-search"
          label="Filter registrations"
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Filter by name, email, or team name..."
        />
      </section>

      {/* Registrations list */}
      <section
        className={cls(
          'overflow-hidden rounded-xl border border-[var(--color-border)] bg-white'
        )}
      >
        <h2
          className={cls(
            'text-blackout border-b border-[var(--color-border)] p-4 text-lg font-semibold'
          )}
        >
          {searchQuery.trim()
            ? `Filtered (${displayList.length})`
            : `All registrations (${displayList.length})`}
        </h2>
        {loading ? (
          <div className="space-y-2 p-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className={cls('overflow-x-auto')}>
            <table className={cls('w-full text-left')}>
              <thead>
                <tr className={cls('bg-tech-white border-b border-[var(--color-border)]')}>
                  <th className={cls('text-blackout px-4 py-3 font-medium')}>
                    Name
                  </th>
                  <th className={cls('text-blackout px-4 py-3 font-medium')}>
                    Email
                  </th>
                  <th className={cls('text-blackout px-4 py-3 font-medium')}>
                    Team Name
                  </th>
                  <th className={cls('text-blackout px-4 py-3 font-medium')}>
                    GitHub
                  </th>
                  <th className={cls('text-blackout px-4 py-3 font-medium')}>
                    Registered At
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayList.map((r) => (
                  <tr
                    key={r.id}
                    className={cls(
                      'hover:bg-tech-white/50 border-b border-[var(--color-border)]'
                    )}
                  >
                    <td className={cls('text-blackout px-4 py-3')}>
                      {r.full_name}
                    </td>
                    <td className={cls('text-solid-matte-gray px-4 py-3')}>
                      {r.email}
                    </td>
                    <td className={cls('text-solid-matte-gray px-4 py-3')}>
                      {r.team_name ?? '—'}
                    </td>
                    <td className={cls('px-4 py-3')}>
                      {r.github_link ? (
                        <a href={r.github_link} target="_blank" rel="noopener noreferrer" className="text-alexandra hover:underline">
                          View
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className={cls('px-4 py-3 text-sm text-solid-matte-gray')}>
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && displayList.length === 0 && (
          <div className="p-4">
            <EmptyState title="No registrations found" description="Try another search keyword." />
          </div>
        )}
      </section>
    </div>
  );
}
