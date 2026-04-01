'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import type { BlogPost } from '@/lib/api';
import { cls } from '@/utils';

export default function BlogPage() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('submitted') === '1') {
      setShowSuccess(true);
      const t = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  useEffect(() => {
    api
      .getBlogposts({ limit: 50 })
      .then(setPosts)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Failed to load posts'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={cls('space-y-6')}>
      {showSuccess && (
        <div
          className={cls(
            'rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800',
            'text-sm font-medium'
          )}
        >
          Your post has been submitted for review. It will appear once approved by an admin.
        </div>
      )}
      <div className={cls('flex items-center justify-between')}>
        <h1 className={cls('text-2xl md:text-3xl font-medium text-blackout')}>
          Blog
        </h1>
        <Link
          href="/dashboard/blog/submit"
          className={cls(
            'px-4 py-2 bg-alexandra text-white font-medium rounded-lg',
            'hover:bg-[#357AE8] transition-colors'
          )}
        >
          Submit post
        </Link>
      </div>
      <section
        className={cls(
          'rounded-2xl border border-[#DADCE0] bg-white p-6 shadow-sm',
          'text-blackout'
        )}
      >
        {loading && (
          <p className={cls('text-solid-matte-gray')}>Loading posts...</p>
        )}
        {error && (
          <p className={cls('text-red-600')}>{error}</p>
        )}
        {!loading && !error && posts.length === 0 && (
          <p className={cls('text-solid-matte-gray')}>No blog posts yet.</p>
        )}
        {!loading && !error && posts.length > 0 && (
          <ul className={cls('space-y-4')}>
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/dashboard/blog/${post.id}`}
                  className={cls(
                    'block rounded-lg border border-[#DADCE0] overflow-hidden',
                    'hover:border-alexandra/50 transition-colors'
                  )}
                >
                  <div className={cls('relative h-40 w-full bg-[#E0E0E0]')}>
                    {post.image_url ? (
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className={cls('absolute inset-0 flex items-center justify-center')}>
                        <span className={cls('text-sm text-solid-matte-gray')}>Blog</span>
                      </div>
                    )}
                  </div>
                  <div className={cls('p-4')}>
                  <h2 className={cls('font-semibold text-blackout mb-2')}>{post.title}</h2>
                  {post.niche && (
                    <span
                      className={cls(
                        'text-xs px-2 py-0.5 rounded-sm uppercase bg-alexandra/20 text-alexandra'
                      )}
                    >
                      {post.niche}
                    </span>
                  )}
                  <p className={cls('text-sm text-solid-matte-gray mt-2 line-clamp-3')}>
                    {post.content}
                  </p>
                  {(post.likes_count !== undefined || post.comments_count !== undefined) && (
                    <p className={cls('text-xs text-solid-matte-gray mt-2')}>
                      {post.likes_count ?? 0} likes · {post.comments_count ?? 0} comments
                    </p>
                  )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
