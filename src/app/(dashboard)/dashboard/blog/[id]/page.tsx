'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError } from '@/lib/api';
import type { BlogPost, Comment } from '@/lib/api';
import { cls } from '@/utils';

export default function BlogPostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liking, setLiking] = useState(false);

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

  const handleLike = async () => {
    if (!user || liking) return;
    setLiking(true);
    try {
      await api.likeBlogpost(id);
      loadPost();
    } finally {
      setLiking(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim() || submittingComment) return;
    setSubmittingComment(true);
    try {
      await api.postComment(id, commentText.trim());
      setCommentText('');
      const updated = await api.getComments(id);
      setComments(updated);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
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
          href="/dashboard/blog"
          className={cls(
            'inline-flex items-center gap-2 rounded-lg border border-[#DADCE0] px-4 py-2 text-sm font-medium text-blackout',
            'hover:border-alexandra hover:text-alexandra transition-colors'
          )}
        >
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className={cls('space-y-6')}>
      <Link
        href="/dashboard/blog"
        className={cls(
          'inline-flex items-center gap-2 rounded-lg border border-[#DADCE0] px-4 py-2 text-sm font-medium text-blackout',
          'hover:border-alexandra hover:text-alexandra transition-colors'
        )}
      >
        ← Back to blog
      </Link>
      <article
        className={cls(
          'rounded-2xl border border-[#DADCE0] bg-white p-6 shadow-sm',
          'text-blackout'
        )}
      >
        {post.image_url && (
          <div className={cls('relative h-48 w-full mb-4 rounded-lg overflow-hidden bg-[#E0E0E0]')}>
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        {post.niche && (
          <span
            className={cls(
              'inline-block text-xs px-2 py-0.5 rounded-sm uppercase bg-alexandra/20 text-alexandra mb-2'
            )}
          >
            {post.niche}
          </span>
        )}
        <h1 className={cls('text-2xl md:text-3xl font-semibold text-blackout mb-4')}>
          {post.title}
        </h1>
        <div className={cls('prose prose-sm max-w-none text-blackout')}>
          {post.content_format === 'html' ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <ReactMarkdown>{post.content}</ReactMarkdown>
          )}
        </div>
        <div className={cls('flex items-center gap-4 mt-6 pt-4 border-t border-[#DADCE0]')}>
          {user && (
            <button
              type="button"
              onClick={handleLike}
              disabled={liking}
              className={cls(
                'px-3 py-1.5 text-sm rounded-lg',
                post.is_liked_by_current_user
                  ? 'bg-alexandra text-white'
                  : 'border border-[#DADCE0] hover:border-alexandra hover:text-alexandra',
                'disabled:opacity-60'
              )}
            >
              {liking ? '...' : post.is_liked_by_current_user ? 'Liked' : 'Like'}
            </button>
          )}
          <span className={cls('text-sm text-solid-matte-gray')}>
            {post.likes_count ?? 0} likes · {post.comments_count ?? comments.length} comments
          </span>
        </div>
      </article>

      {/* Comments */}
      <section
        className={cls(
          'rounded-2xl border border-[#DADCE0] bg-white p-6 shadow-sm',
          'text-blackout'
        )}
      >
        <h2 className={cls('text-lg font-semibold mb-4')}>Comments</h2>
        {user && (
          <form onSubmit={handleSubmitComment} className={cls('mb-4')}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              rows={2}
              className={cls(
                'w-full px-4 py-2 border border-[#DADCE0] rounded-lg mb-2',
                'focus:outline-none focus:ring-2 focus:ring-alexandra',
                'text-blackout placeholder:text-[#9AA0A6]'
              )}
            />
            <button
              type="submit"
              disabled={submittingComment || !commentText.trim()}
              className={cls(
                'px-4 py-2 bg-alexandra text-white text-sm font-medium rounded-lg',
                'hover:bg-[#357AE8] disabled:opacity-60'
              )}
            >
              {submittingComment ? 'Posting...' : 'Post comment'}
            </button>
          </form>
        )}
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
    </div>
  );
}
