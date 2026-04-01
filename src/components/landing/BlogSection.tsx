'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import type { BlogPost } from '@/lib/api';

const QuoteIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="matrix(-1, 0, 0, 1, 32, 0)">
      <path
        d="M8 6L14 26M18 6L24 26"
        stroke="#34A853"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

const colors = ['bg-[#34A853]', 'bg-[#4285F4]', 'bg-[#EA4335]'];

export const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getBlogposts({ limit: 6 })
      .then((list) => setPosts(Array.isArray(list) ? list : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-[#F8F8F8] px-6 py-16 md:px-20 md:py-24" id="blog">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <QuoteIcon />
            <h2 className="text-2xl font-normal text-blackout md:text-3xl">
              By Students, For Students
            </h2>
          </div>
          <p className="text-sm font-medium text-blackout">
            Students like us sharing wins, lessons, and real project journeys.
          </p>
          <p className="text-sm text-solid-matte-gray">
            Got something to say? Write it, we&apos;ll review it, and you&apos;ll inspire
            someone who needs to hear it.
          </p>
        </div>

        {/* Article Cards */}
        <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="text-sm text-solid-matte-gray col-span-full">Loading articles...</p>
          ) : posts.length === 0 ? (
            <p className="text-sm text-solid-matte-gray col-span-full">No articles yet.</p>
          ) : (
            posts.map((post, i) => (
              <Link
                key={post.id}
                href={`/dashboard/blog/${post.id}`}
                className="group block"
              >
                <article className="cursor-pointer">
                  {/* Image */}
                  <div
                    className={`mb-4 h-40 w-full rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] ${
                      post.image_url ? 'relative bg-[#E0E0E0]' : colors[i % colors.length]
                    }`}
                  >
                    {post.image_url ? (
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : null}
                  </div>

                  {/* Category */}
                  {post.niche && (
                    <p className="mb-2 text-xs text-solid-matte-gray">{post.niche}</p>
                  )}

                  {/* Title */}
                  <h3 className="mb-3 text-base font-medium leading-snug text-blackout transition-colors group-hover:text-alexandra">
                    {post.title}
                  </h3>

                  {/* Date */}
                  <p className="text-xs text-solid-matte-gray">
                    {post.posted_at
                      ? new Date(post.posted_at).toLocaleDateString('en-NG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '—'}
                  </p>
                </article>
              </Link>
            ))
          )}
        </div>

        {/* View More Link */}
        <div className="text-center">
          <Link
            href="/dashboard/blog"
            className="inline-block border-b border-alexandra pb-0.5 text-sm text-alexandra transition-opacity hover:opacity-80"
          >
            View more
          </Link>
        </div>
      </div>
    </section>
  );
};
