'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import {
  Avatar,
  Button,
  ConfirmDialog,
  EmptyState,
  PageHeader,
  SearchInput,
  Skeleton
} from '@/components/ui';
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
  const [confirmDeactivateId, setConfirmDeactivateId] = useState<string | null>(null);
  const [confirmReactivateId, setConfirmReactivateId] = useState<string | null>(null);

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
    if (id === user.id) {
      setError('You cannot deactivate your own account.');
      return;
    }
    setActionUserId(id);
    setError(null);
    try {
      await api.deactivateUser(id);
      toast.success('User deactivated');
      await loadUsers();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to deactivate user');
    } finally {
      setActionUserId(null);
    }
  };

  const handleReactivate = async (id: string) => {
    if (!user) return;
    setActionUserId(id);
    setError(null);
    try {
      await api.reactivateUser(id);
      toast.success('User reactivated');
      await loadUsers();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to reactivate user');
    } finally {
      setActionUserId(null);
    }
  };

  const handleRoleToggle = async (target: User) => {
    if (!user) return;
    if (target.id === user.id) {
      setError('You cannot change your own admin role.');
      return;
    }
    setActionUserId(target.id);
    setError(null);
    try {
      await api.updateUserRole(target.id, { is_admin: !target.is_admin });
      toast.success(target.is_admin ? 'Admin role removed' : 'User promoted to admin');
      await loadUsers();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to update role');
    } finally {
      setActionUserId(null);
    }
  };

  return (
    <div className={cls('space-y-6')}>
      <PageHeader title="User management" description="Manage access, roles, and account states." />

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
          id="admin-user-search"
          label="Filter users"
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Filter by name or email..."
        />
      </section>

      {/* User list */}
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
            : `All users (${displayList.length})`}
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
                    Avatar
                  </th>
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
                      'hover:bg-tech-white/50 border-b border-[var(--color-border)]'
                    )}
                  >
                    <td className="px-4 py-3">
                      <Avatar
                        src={u.profile?.avatar_url}
                        alt={u.profile?.full_name ?? u.email}
                        size={32}
                      />
                    </td>
                    <td className={cls('text-blackout px-4 py-3')}>
                      {u.profile?.full_name ?? '—'}
                    </td>
                    <td className={cls('text-solid-matte-gray px-4 py-3')}>
                      {u.email}
                    </td>
                    <td className={cls('px-4 py-3')}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void handleRoleToggle(u)}
                        disabled={actionUserId === u.id}
                      >
                        {u.is_admin ? 'Demote' : 'Promote'}
                      </Button>
                    </td>
                    <td className={cls('px-4 py-3 text-sm')}>
                      {u.is_active ? 'Active' : 'Deactivated'}
                    </td>
                    <td className={cls('px-4 py-3')}>
                      {u.is_active ? (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setConfirmDeactivateId(u.id)}
                          disabled={actionUserId === u.id}
                        >
                          {actionUserId === u.id ? '...' : 'Deactivate'}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConfirmReactivateId(u.id)}
                          disabled={actionUserId === u.id}
                        >
                          Reactivate
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && displayList.length === 0 && (
          <div className="p-4">
            <EmptyState title="No users found" description="Try another search keyword." />
          </div>
        )}
      </section>
      <ConfirmDialog
        open={Boolean(confirmDeactivateId)}
        onOpenChange={(open) => !open && setConfirmDeactivateId(null)}
        title="Deactivate user?"
        description="This user will no longer be able to sign in."
        confirmLabel="Deactivate"
        variant="danger"
        loading={actionUserId !== null}
        onConfirm={async () => {
          if (!confirmDeactivateId) return;
          await handleDeactivate(confirmDeactivateId);
          setConfirmDeactivateId(null);
        }}
      />
      <ConfirmDialog
        open={Boolean(confirmReactivateId)}
        onOpenChange={(open) => !open && setConfirmReactivateId(null)}
        title="Reactivate user?"
        description="This user will regain platform access."
        confirmLabel="Reactivate"
        loading={actionUserId !== null}
        onConfirm={async () => {
          if (!confirmReactivateId) return;
          await handleReactivate(confirmReactivateId);
          setConfirmReactivateId(null);
        }}
      />
    </div>
  );
}
