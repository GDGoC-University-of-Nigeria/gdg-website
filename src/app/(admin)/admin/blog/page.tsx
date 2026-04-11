'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError, type BlogPostAdmin } from '@/lib/api';
import { cls } from '@/utils';

export default function AdminBlogPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPostAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadPosts = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const list = await api.getAdminBlogposts({
        ...(statusFilter !== 'all' && { status: statusFilter }),
        limit: 50,
      });
      setPosts(list);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [user, statusFilter]);

  const handleApprove = async (postId: string) => {
    if (!user) return;
    setActionLoading(postId);
    try {
      await api.approveBlogpost(postId);
      loadPosts();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (postId: string, reason?: string) => {
    if (!user) return;
    setActionLoading(postId);
    try {
      await api.rejectBlogpost(postId, { rejection_reason: reason });
      loadPosts();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-NG', { dateStyle: 'medium' }) : '—';

  return (
    <div className={cls('space-y-6')}>
      <div className={cls('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4')}>
        <h1 className={cls('text-2xl font-semibold text-blackout')}>Blog moderation</h1>
        <div className={cls('flex gap-2')}>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={cls(
              'px-3 py-1.5 rounded-lg text-sm font-medium',
              statusFilter === 'all'
                ? 'bg-alexandra text-white'
                : 'border border-[#DADCE0] text-blackout hover:bg-tech-white'
            )}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={cls(
              'px-3 py-1.5 rounded-lg text-sm font-medium',
              statusFilter === 'pending'
                ? 'bg-alexandra text-white'
                : 'border border-[#DADCE0] text-blackout hover:bg-tech-white'
            )}
          >
            Pending
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('approved')}
            className={cls(
              'px-3 py-1.5 rounded-lg text-sm font-medium',
              statusFilter === 'approved'
                ? 'bg-alexandra text-white'
                : 'border border-[#DADCE0] text-blackout hover:bg-tech-white'
            )}
          >
            Approved
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('rejected')}
            className={cls(
              'px-3 py-1.5 rounded-lg text-sm font-medium',
              statusFilter === 'rejected'
                ? 'bg-alexandra text-white'
                : 'border border-[#DADCE0] text-blackout hover:bg-tech-white'
            )}
          >
            Rejected
          </button>
        </div>
      </div>

      {error && (
        <div className={cls('rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-red-700')}>
          {error}
        </div>
      )}

      <section
        className={cls(
          'rounded-xl border border-[#DADCE0] bg-white overflow-hidden',
          'text-blackout'
        )}
      >
        {loading ? (
          <div className={cls('p-8 text-center text-solid-matte-gray')}>Loading...</div>
        ) : posts.length === 0 ? (
          <div className={cls('p-8 text-center text-solid-matte-gray')}>
            No posts in this category.
          </div>
        ) : (
          <div className={cls('overflow-x-auto')}>
            <table className={cls('w-full text-left')}>
              <thead>
                <tr className={cls('bg-tech-white border-b border-[#DADCE0]')}>
                  <th className={cls('px-4 py-3 font-medium text-blackout')}>Title</th>
                  <th className={cls('px-4 py-3 font-medium text-blackout')}>Author</th>
                  <th className={cls('px-4 py-3 font-medium text-blackout')}>Status</th>
                  <th className={cls('px-4 py-3 font-medium text-blackout')}>Posted</th>
                  <th className={cls('px-4 py-3 font-medium text-blackout')}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className={cls('border-b border-[#DADCE0] hover:bg-tech-white/50')}>
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
                      <span
                        className={cls(
                          'text-xs px-2 py-0.5 rounded-sm uppercase',
                          post.status === 'approved' && 'bg-green-100 text-green-800',
                          post.status === 'pending' && 'bg-amber-100 text-amber-800',
                          post.status === 'rejected' && 'bg-red-100 text-red-800'
                        )}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className={cls('px-4 py-3 text-sm text-solid-matte-gray')}>
                      {formatDate(post.posted_at)}
                    </td>
                    <td className={cls('px-4 py-3 flex gap-2')}>
                      {post.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApprove(post.id)}
                            disabled={!!actionLoading}
                            className={cls(
                              'text-green-600 font-medium hover:underline disabled:opacity-60'
                            )}
                          >
                            {actionLoading === post.id ? '...' : 'Approve'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(post.id)}
                            disabled={!!actionLoading}
                            className={cls(
                              'text-red-600 font-medium hover:underline disabled:opacity-60'
                            )}
                          >
                            {actionLoading === post.id ? '...' : 'Reject'}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
