'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

import {
  Button,
  ConfirmDialog,
  EmptyState,
  PageHeader,
  Pagination,
  SearchInput,
  Skeleton,
  StatusBadge
} from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError, type BlogPostAdmin } from '@/lib/api';
import { cls } from '@/utils';

export default function AdminBlogPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPostAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

  const PAGE_SIZE = 12;

  const loadPosts = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const skip = (page - 1) * PAGE_SIZE;
      const list = await api.getAdminBlogposts({
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(query.trim() && { q: query.trim() }),
        skip,
        limit: PAGE_SIZE + 1
      });
      setHasNext(list.length > PAGE_SIZE);
      setPosts(list.slice(0, PAGE_SIZE));
      setSelected([]);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [user, statusFilter, page, query]);

  const handleApprove = async (postId: string) => {
    if (!user) return;
    setActionLoading(postId);
    try {
      await api.approveBlogpost(postId);
      toast.success('Post approved');
      loadPosts();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (postId: string, reason = 'Does not meet content guidelines') => {
    if (!user) return;
    setActionLoading(postId);
    try {
      await api.rejectBlogpost(postId, { rejection_reason: reason });
      toast.success('Post rejected');
      loadPosts();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-NG', { dateStyle: 'medium' }) : '—';

  const allChecked = useMemo(
    () => posts.length > 0 && selected.length === posts.length,
    [posts.length, selected.length]
  );

  const toggleAll = () => {
    if (allChecked) setSelected([]);
    else setSelected(posts.map((p) => p.id));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const runBulkApprove = async () => {
    for (const id of selected) {
      // sequential to avoid server bursts/throttling
      await api.approveBlogpost(id);
    }
  };

  const runBulkReject = async () => {
    for (const id of selected) {
      await api.rejectBlogpost(id, { rejection_reason: 'Bulk rejection by moderator' });
    }
  };

  const runDelete = async (ids: string[]) => {
    setDeleting(true);
    try {
      for (const id of ids) {
        await api.deleteAdminBlogpost(id);
      }
      toast.success(ids.length === 1 ? 'Post removed' : `${ids.length} posts removed`);
      setPendingDeleteIds([]);
      setSelected([]);
      await loadPosts();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to remove selected posts');
    } finally {
      setDeleting(false);
    }
  };

  const runBulkAction = async (type: 'approve' | 'reject') => {
    if (!selected.length) return;
    setActionLoading(type);
    try {
      if (type === 'approve') await runBulkApprove();
      if (type === 'reject') await runBulkReject();
      toast.success(
        `${selected.length} post${selected.length > 1 ? 's' : ''} ${type === 'approve' ? 'approved' : 'rejected'}`
      );
      await loadPosts();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : `Failed to ${type} selected posts`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className={cls('space-y-6')}>
      <PageHeader
        title="Blog moderation"
        description="Approve, reject, search, and take down posts from the platform."
      />
      <div className="grid gap-3 rounded-xl border border-[var(--color-border)] bg-white p-4 md:grid-cols-[1fr_auto] md:items-end">
        <SearchInput
          id="admin-blog-search"
          label="Search by title/content"
          value={query}
          onChange={(value) => {
            setPage(1);
            setQuery(value);
          }}
          placeholder="Search posts..."
        />
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setPage(1);
                setStatusFilter(status);
              }}
            >
              {status[0].toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {error && (
        <div className={cls('rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-red-700')}>
          {error}
        </div>
      )}

      <section className={cls('overflow-hidden rounded-xl border border-[var(--color-border)] bg-white text-blackout')}>
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
          <Button
            variant="outline"
            size="sm"
            disabled={!selected.length || actionLoading !== null}
            onClick={() => void runBulkAction('approve')}
          >
            Approve selected
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!selected.length || actionLoading !== null}
            onClick={() => void runBulkAction('reject')}
          >
            Reject selected
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={!selected.length || actionLoading !== null}
            onClick={() => setPendingDeleteIds(selected)}
          >
            Delete selected
          </Button>
          {!!selected.length && (
            <span className="ml-auto text-xs text-solid-matte-gray">
              {selected.length} selected
            </span>
          )}
        </div>
        {loading ? (
          <div className="space-y-2 p-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="No posts found"
              description="Try changing your status filter or search query."
            />
          </div>
        ) : (
          <div className={cls('overflow-x-auto')}>
            <table className={cls('w-full text-left')}>
              <thead>
                <tr className={cls('bg-tech-white border-b border-[var(--color-border)]')}>
                  <th className={cls('px-4 py-3')}>
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={toggleAll}
                      aria-label="Select all posts"
                    />
                  </th>
                  <th className={cls('px-4 py-3 font-medium text-blackout')}>Title</th>
                  <th className={cls('px-4 py-3 font-medium text-blackout')}>Author</th>
                  <th className={cls('px-4 py-3 font-medium text-blackout')}>Status</th>
                  <th className={cls('px-4 py-3 font-medium text-blackout')}>Posted</th>
                  <th className={cls('px-4 py-3 font-medium text-blackout')}>Rejection reason</th>
                  <th className={cls('px-4 py-3 font-medium text-blackout')}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className={cls('border-b border-[var(--color-border)] hover:bg-tech-white/50')}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(post.id)}
                        onChange={() => toggleOne(post.id)}
                        aria-label={`Select ${post.title}`}
                      />
                    </td>
                    <td className={cls('px-4 py-3')}>
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className={cls('text-alexandra hover:underline font-medium')}
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className={cls('px-4 py-3 text-sm text-solid-matte-gray')}>
                      {post.author
                        ? post.author.full_name || post.author.email
                        : post.author_id}
                    </td>
                    <td className={cls('px-4 py-3')}>
                      <StatusBadge status={post.status} />
                    </td>
                    <td className={cls('px-4 py-3 text-sm text-solid-matte-gray')}>
                      {formatDate(post.posted_at)}
                    </td>
                    <td className="max-w-[220px] px-4 py-3 text-xs text-solid-matte-gray">
                      {post.rejection_reason || '—'}
                    </td>
                    <td className={cls('flex gap-2 px-4 py-3')}>
                      {post.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(post.id)}
                            disabled={!!actionLoading}
                          >
                            {actionLoading === post.id ? '...' : 'Approve'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(post.id)}
                            disabled={!!actionLoading}
                          >
                            {actionLoading === post.id ? '...' : 'Reject'}
                          </Button>
                        </>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={!!actionLoading}
                        onClick={() => setPendingDeleteIds([post.id])}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-[var(--color-border)] p-3">
          <Pagination
            page={page}
            hasNext={hasNext}
            hasPrev={page > 1}
            onNext={() => setPage((p) => p + 1)}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            loading={loading}
          />
        </div>
      </section>
      <ConfirmDialog
        open={pendingDeleteIds.length > 0}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteIds([]);
        }}
        title={
          pendingDeleteIds.length > 1
            ? `Delete ${pendingDeleteIds.length} posts?`
            : 'Delete this post?'
        }
        description="This action is destructive and will permanently remove the post from the platform."
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        onConfirm={() => void runDelete(pendingDeleteIds)}
      />
    </div>
  );
}
