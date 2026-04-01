'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError } from '@/lib/api';
import { cls } from '@/utils';

export default function BlogSubmitPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [niche, setNiche] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.submitBlogpost({
        title,
        content,
        niche: niche.trim() || undefined,
        image_url: imageUrl.trim() || undefined,
      });
      router.push('/dashboard/blog?submitted=1');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to submit post');
    } finally {
      setSubmitting(false);
    }
  };

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
      <h1 className={cls('text-2xl md:text-3xl font-medium text-blackout')}>
        Submit a post
      </h1>
      <section
        className={cls(
          'rounded-2xl border border-[#DADCE0] bg-white p-6 shadow-sm',
          'text-blackout'
        )}
      >
        <form onSubmit={handleSubmit} className={cls('space-y-4 max-w-2xl')}>
          <div>
            <label htmlFor="title" className={cls('block text-sm font-medium text-blackout mb-1')}>
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={cls(
                'w-full px-4 py-2 border border-[#DADCE0] rounded-lg',
                'focus:outline-none focus:ring-2 focus:ring-alexandra focus:border-transparent',
                'text-blackout placeholder:text-[#9AA0A6]'
              )}
              placeholder="Post title"
            />
          </div>
          <div>
            <label htmlFor="content" className={cls('block text-sm font-medium text-blackout mb-1')}>
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={10}
              className={cls(
                'w-full px-4 py-2 border border-[#DADCE0] rounded-lg',
                'focus:outline-none focus:ring-2 focus:ring-alexandra focus:border-transparent',
                'text-blackout placeholder:text-[#9AA0A6]'
              )}
              placeholder="Write your post content (Markdown supported)"
            />
          </div>
          <div>
            <label htmlFor="niche" className={cls('block text-sm font-medium text-blackout mb-1')}>
              Niche (optional)
            </label>
            <input
              id="niche"
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className={cls(
                'w-full px-4 py-2 border border-[#DADCE0] rounded-lg',
                'focus:outline-none focus:ring-2 focus:ring-alexandra focus:border-transparent',
                'text-blackout placeholder:text-[#9AA0A6]'
              )}
              placeholder="e.g. Web Dev, AI/ML"
            />
          </div>
          <div>
            <label htmlFor="imageUrl" className={cls('block text-sm font-medium text-blackout mb-1')}>
              Image URL (optional)
            </label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={cls(
                'w-full px-4 py-2 border border-[#DADCE0] rounded-lg',
                'focus:outline-none focus:ring-2 focus:ring-alexandra focus:border-transparent',
                'text-blackout placeholder:text-[#9AA0A6]'
              )}
              placeholder="https://..."
            />
          </div>
          {error && (
            <p className={cls('text-sm text-red-600')}>{error}</p>
          )}
          <div className={cls('flex gap-3')}>
            <button
              type="submit"
              disabled={submitting}
              className={cls(
                'px-4 py-2 bg-alexandra text-white font-medium rounded-lg',
                'hover:bg-[#357AE8] disabled:opacity-60 transition-colors'
              )}
            >
              {submitting ? 'Submitting...' : 'Submit for review'}
            </button>
            <Link
              href="/dashboard/blog"
              className={cls(
                'px-4 py-2 border border-[#DADCE0] font-medium rounded-lg',
                'hover:bg-tech-white transition-colors'
              )}
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
