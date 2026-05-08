'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

import { Button, ConfirmDialog, StatusBadge } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError } from '@/lib/api';
import type { BlogPost, Comment } from '@/lib/api';
import { cls } from '@/utils';
import { sanitizeBlogHtml } from '@/utils/sanitizeHtml';

export default function AdminBlogPostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const loadPost = () => {
    setLoading(true);
    setError(null);
    api
      .getBlogpost(id)
      .then((p) => {
        setPost(p);
        return api.getComments(id);
      })
      .then(setComments)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Failed to load post'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id) loadPost();
  }, [id, user]);

  const handleApprove = async () => {
    if (!user || actionLoading) return;
    setActionLoading(true);
    try {
      await api.approveBlogpost(id);
      toast.success('Post approved');
      loadPost();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to approve');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!user || actionLoading) return;
    setActionLoading(true);
    try {
      await api.rejectBlogpost(id, { rejection_reason: rejectionReason.trim() || undefined });
      setShowRejectModal(false);
      setRejectionReason('');
      toast.success('Post rejected');
      loadPost();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to reject');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || actionLoading) return;
    setActionLoading(true);
    try {
      await api.deleteAdminBlogpost(id);
      toast.success('Post removed from platform');
      router.replace('/admin/blog');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to remove post');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={cls('space-y-6')}>
        <p className={cls('text-solid-matte-gray')}>Loading...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={cls('space-y-6')}>
        <p className={cls('text-red-600')}>{error ?? 'Post not found'}</p>
        <Link
          href="/admin/blog"
          className={cls(
            'inline-flex items-center gap-2 rounded-lg border border-[#DADCE0] px-4 py-2 text-sm font-medium text-blackout',
            'hover:border-alexandra hover:text-alexandra transition-colors'
          )}
        >
          ← Back to moderation
        </Link>
      </div>
    );
  }

  return (
    <div className={cls('space-y-6')}>
      <Link
        href="/admin/blog"
        className={cls(
          'inline-flex items-center gap-2 rounded-lg border border-[#DADCE0] px-4 py-2 text-sm font-medium text-blackout',
          'hover:border-alexandra hover:text-alexandra transition-colors'
        )}
      >
        ← Back to moderation
      </Link>
      <article
        className={cls(
          'rounded-2xl border border-[#DADCE0] bg-white p-6 shadow-sm',
          'text-blackout'
        )}
      >
        <div className={cls('flex flex-wrap items-center justify-between gap-4 mb-4')}>
          {post.niche && (
            <span
              className={cls(
                'inline-block text-xs px-2 py-0.5 rounded-sm uppercase bg-alexandra/20 text-alexandra'
              )}
            >
              {post.niche}
            </span>
          )}
          <StatusBadge status={post.status} />
        </div>
        <h1 className={cls('text-2xl md:text-3xl font-semibold text-blackout mb-4')}>
          {post.title}
        </h1>
        <div className={cls('prose prose-sm max-w-none text-blackout')}>
          {post.content_format === 'html' ? (
            <div dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.content) }} />
          ) : (
            <ReactMarkdown>{post.content}</ReactMarkdown>
          )}
        </div>
        <div className={cls('flex items-center gap-4 mt-6 pt-4 border-t border-[#DADCE0]')}>
          <span className={cls('text-sm text-solid-matte-gray')}>
            {post.likes_count ?? 0} likes · {post.comments_count ?? comments.length} comments
          </span>
          {user && (
            <div className={cls('ml-auto flex gap-2')}>
              {post.status === 'pending' && (
                <>
                  <Button
                    type="button"
                    onClick={handleApprove}
                    disabled={actionLoading}
                    variant="outline"
                    size="md"
                  >
                    {actionLoading ? '...' : 'Approve'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowRejectModal(true)}
                    disabled={actionLoading}
                    variant="danger"
                    size="md"
                  >
                    Reject
                  </Button>
                </>
              )}
              <Button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={actionLoading}
                variant="danger"
                size="md"
              >
                Delete post
              </Button>
            </div>
          )}
        </div>
      </article>

      <section
        className={cls(
          'rounded-2xl border border-[#DADCE0] bg-white p-6 shadow-sm',
          'text-blackout'
        )}
      >
        <h2 className={cls('text-lg font-semibold mb-4')}>Comments</h2>
        <ul className={cls('space-y-3')}>
          {comments.map((c) => (
            <li
              key={c.id}
              className={cls('py-2 px-3 rounded-lg bg-tech-white border border-[#DADCE0]')}
            >
              <p className={cls('text-sm text-blackout')}>{c.content}</p>
              <p className={cls('text-xs text-solid-matte-gray mt-1')}>
                {c.author?.full_name ?? c.author?.email ?? 'Unknown'} ·{' '}
                {c.created_at ? new Date(c.created_at).toLocaleString() : ''}
              </p>
            </li>
          ))}
        </ul>
        {comments.length === 0 && (
          <p className={cls('text-sm text-solid-matte-gray')}>No comments yet.</p>
        )}
      </section>

      {showRejectModal && (
        <div
          className={cls(
            'fixed inset-0 z-50 flex items-center justify-center',
            'bg-black/50 p-4'
          )}
          onClick={() => setShowRejectModal(false)}
        >
          <div
            className={cls(
              'bg-white rounded-xl shadow-lg max-w-md w-full p-6',
              'border border-[#DADCE0]'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={cls('text-xl font-semibold text-blackout mb-4')}>Reject post</h2>
            <p className={cls('text-sm text-solid-matte-gray mb-4')}>
              Optionally provide a reason for the author (they will see this if you add it).
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Content needs more depth, or doesn't fit our guidelines..."
              rows={4}
              className={cls(
                'w-full px-3 py-2 border border-[#DADCE0] rounded-lg mb-4',
                'focus:outline-none focus:ring-2 focus:ring-alexandra',
                'text-blackout placeholder:text-[#9AA0A6]'
              )}
            />
            <div className={cls('flex gap-2')}>
              <button
                type="button"
                onClick={() => handleReject()}
                disabled={actionLoading}
                className={cls(
                  'px-4 py-2 bg-red-600 text-white font-medium rounded-lg',
                  'hover:bg-red-700 disabled:opacity-60'
                )}
              >
                {actionLoading ? 'Rejecting...' : 'Confirm reject'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className={cls(
                  'px-4 py-2 border border-[#DADCE0] rounded-lg font-medium',
                  'hover:bg-tech-white'
                )}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete this post?"
        description="This action permanently removes the post from the platform."
        confirmLabel="Delete"
        variant="danger"
        loading={actionLoading}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
