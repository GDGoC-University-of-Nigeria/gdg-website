'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, EmptyState, PageHeader, StatusBadge } from '@/components/ui';
import { api, ApiError } from '@/lib/api';
import type { Project } from '@/lib/api';
import { cls } from '@/utils';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getProjects({ limit: 50 })
      .then(setProjects)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={cls('space-y-6')}>
      <PageHeader
        title="Projects"
        description="Browse community and personal projects, or start one."
        actions={
          <>
            <Link href="/dashboard/projects/me/applications">
              <Button variant="outline" size="md">My applications</Button>
            </Link>
            <Link href="/admin/projects">
              <Button size="md">Create project</Button>
            </Link>
          </>
        }
      />
      <section
        className={cls(
          'rounded-2xl border border-[#DADCE0] bg-white p-6 shadow-sm',
          'text-blackout'
        )}
      >
        {loading && (
          <p className={cls('text-solid-matte-gray')}>Loading projects...</p>
        )}
        {error && (
          <p className={cls('text-red-600')}>{error}</p>
        )}
        {!loading && !error && projects.length === 0 && (
          <EmptyState
            title="No projects yet"
            description="There are no published projects right now."
          />
        )}
        {!loading && !error && projects.length > 0 && (
          <ul className={cls('space-y-4')}>
            {projects.map((p) => (
              <li key={p.id}>
                <article
                  className={cls(
                    'rounded-xl border border-[#DADCE0] bg-white p-5 shadow-sm',
                    'transition-shadow hover:shadow-md hover:border-alexandra/50'
                  )}
                >
                  <div className={cls('flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between')}>
                    <div className={cls('min-w-0')}>
                      <Link
                        href={`/dashboard/projects/${p.id}`}
                        className={cls('text-lg font-medium text-blackout hover:text-alexandra transition-colors')}
                      >
                        {p.title}
                      </Link>
                      <p className={cls('mt-2 text-sm text-solid-matte-gray line-clamp-2')}>
                        {p.description}
                      </p>
                      {p.github_repo && (
                        <a
                          href={p.github_repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={cls('text-sm text-alexandra hover:underline mt-3 inline-block')}
                        >
                          View on GitHub →
                        </a>
                      )}
                    </div>

                    <div className={cls('flex items-center gap-2 sm:shrink-0')}>
                      <StatusBadge status={p.project_type} />
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
