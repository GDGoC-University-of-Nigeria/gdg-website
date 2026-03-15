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
          (u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  const handleDeactivate = async (id: string) => {
    if (!user) return;
    if (!confirm('Deactivate this user? They will no longer be able to log in.')) return;
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
      <h1 className={cls('text-2xl font-semibold text-blackout')}>Admin – User management</h1>

      {error && (
        <div className={cls('rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-red-700')}>
          {error}
        </div>
      )}

      {/* Filter - live as user types */}
      <section className={cls('rounded-xl border border-[#DADCE0] bg-white p-4')}>
        <h2 className={cls('text-lg font-semibold text-blackout mb-2')}>Filter users</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by name or email..."
          className={cls(
            'w-full px-3 py-2 border border-[#DADCE0] rounded-lg text-blackout',
            'focus:outline-none focus:ring-2 focus:ring-alexandra'
          )}
        />
      </section>

      {/* User list */}
      <section className={cls('rounded-xl border border-[#DADCE0] bg-white overflow-hidden')}>
        <h2 className={cls('text-lg font-semibold text-blackout p-4 border-b border-[#DADCE0]')}>
          {searchQuery.trim() ? `Filtered (${displayList.length})` : `All users (${displayList.length})`}
        </h2>
        {loading ? (
          <div className={cls('p-8 text-center text-solid-matte-gray')}>Loading...</div>
        ) : (
          <div className={cls('overflow-x-auto')}>
            <table className={cls('w-full text-left')}>
              <thead>
                <tr className={cls('bg-tech-white border-b border-[#DADCE0]')}>
                  <th className={cls('px-4 py-3 font-medium text-blackout')}>Name</th>
                  <th className={cls('px-4 py-3 font-medium text-blackout')}>Email</th>
                  <th className={cls('px-4 py-3 font-medium text-blackout')}>Admin</th>
                  <th className={cls('px-4 py-3 font-medium text-blackout')}>Status</th>
                  <th className={cls('px-4 py-3 font-medium text-blackout')}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayList.map((u) => (
                  <tr key={u.id} className={cls('border-b border-[#DADCE0] hover:bg-tech-white/50')}>
                    <td className={cls('px-4 py-3 text-blackout')}>{u.full_name ?? '—'}</td>
                    <td className={cls('px-4 py-3 text-solid-matte-gray')}>{u.email}</td>
                    <td className={cls('px-4 py-3')}>{u.is_admin ? 'Yes' : 'No'}</td>
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
                            'rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors',
                            'disabled:opacity-60'
                          )}
                        >
                          {actionUserId === u.id ? '...' : 'Deactivate'}
                        </button>
                      ) : (
                        <span className="text-xs text-solid-matte-gray">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && displayList.length === 0 && (
          <p className={cls('p-6 text-solid-matte-gray text-center')}>No users found.</p>
        )}
      </section>
    </div>
  );
}
