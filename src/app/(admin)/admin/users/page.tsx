'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError, type User } from '@/lib/api';
import { cls } from '@/utils';

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  const loadUsers = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const list = await api.getUsers();
      setUsers(list);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [user]);

  const displayList = searchQuery.trim()
    ? users.filter(
        (u) =>
          (u.profile?.full_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ??
            false) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  const handleDeactivate = async (id: string) => {
    if (!user) return;
    if (
      !confirm('Deactivate this user? They will no longer be able to log in.')
    )
      return;
    setActionUserId(id);
    setError(null);
    try {
      await api.deactivateUser(id);
      await loadUsers();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to deactivate user');
    } finally {
      setActionUserId(null);
    }
  };

  return (
    <div className={cls('space-y-6')}>
      <h1 className={cls('text-blackout text-2xl font-semibold')}>
        Admin – User management
      </h1>

      {error && (
        <div
          className={cls(
            'rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-700'
          )}
        >
          {error}
        </div>
      )}

      {/* Filter - live as user types */}
      <section
        className={cls('rounded-xl border border-[#DADCE0] bg-white p-4')}
      >
        <h2 className={cls('text-blackout mb-2 text-lg font-semibold')}>
          Filter users
        </h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by name or email..."
          className={cls(
            'text-blackout w-full rounded-lg border border-[#DADCE0] px-3 py-2',
            'focus:ring-alexandra focus:ring-2 focus:outline-none'
          )}
        />
      </section>

      {/* User list */}
      <section
        className={cls(
          'overflow-hidden rounded-xl border border-[#DADCE0] bg-white'
        )}
      >
        <h2
          className={cls(
            'text-blackout border-b border-[#DADCE0] p-4 text-lg font-semibold'
          )}
        >
          {searchQuery.trim()
            ? `Filtered (${displayList.length})`
            : `All users (${displayList.length})`}
        </h2>
        {loading ? (
          <div className={cls('text-solid-matte-gray p-8 text-center')}>
            Loading...
          </div>
        ) : (
          <div className={cls('overflow-x-auto')}>
            <table className={cls('w-full text-left')}>
              <thead>
                <tr className={cls('bg-tech-white border-b border-[#DADCE0]')}>
                  <th className={cls('text-blackout px-4 py-3 font-medium')}>
                    Name
                  </th>
                  <th className={cls('text-blackout px-4 py-3 font-medium')}>
                    Email
                  </th>
                  <th className={cls('text-blackout px-4 py-3 font-medium')}>
                    Admin
                  </th>
                  <th className={cls('text-blackout px-4 py-3 font-medium')}>
                    Status
                  </th>
                  <th className={cls('text-blackout px-4 py-3 font-medium')}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayList.map((u) => (
                  <tr
                    key={u.id}
                    className={cls(
                      'hover:bg-tech-white/50 border-b border-[#DADCE0]'
                    )}
                  >
                    <td className={cls('text-blackout px-4 py-3')}>
                      {u.profile?.full_name ?? '—'}
                    </td>
                    <td className={cls('text-solid-matte-gray px-4 py-3')}>
                      {u.email}
                    </td>
                    <td className={cls('px-4 py-3')}>
                      {u.is_admin ? 'Yes' : 'No'}
                    </td>
                    <td className={cls('px-4 py-3 text-sm')}>
                      {u.is_active ? 'Active' : 'Deactivated'}
                    </td>
                    <td className={cls('px-4 py-3')}>
                      {u.is_active ? (
                        <button
                          type="button"
                          onClick={() => handleDeactivate(u.id)}
                          disabled={actionUserId === u.id}
                          className={cls(
                            'rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50',
                            'disabled:opacity-60'
                          )}
                        >
                          {actionUserId === u.id ? '...' : 'Deactivate'}
                        </button>
                      ) : (
                        <span className="text-solid-matte-gray text-xs">
                          No actions
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && displayList.length === 0 && (
          <p className={cls('text-solid-matte-gray p-6 text-center')}>
            No users found.
          </p>
        )}
      </section>
    </div>
  );
}
