'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { EmptyState, PageHeader, Skeleton, StatusBadge } from '@/components/ui';
import { api, ApiError, type ProjectApplication } from '@/lib/api';
import { cls } from '@/utils';

type ApplicationRow = ProjectApplication & { project_title?: string };

export default function MyProjectApplicationsPage() {
  const [rows, setRows] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getMyApplications()
      .then((apps) => {
        setRows(Array.isArray(apps) ? apps : []);
      })
      .catch((e) =>
        setError(e instanceof ApiError ? e.message : 'Failed to load applications')
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My applications"
        description="Track your project applications and contribution status."
        actions={
          <Link href="/dashboard/projects" className="text-sm text-alexandra hover:underline">
            Back to projects
          </Link>
        }
      />
      <section className={cls('rounded-2xl border border-[#DADCE0] bg-white p-6 shadow-sm')}>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : rows.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Apply to a community project to see it here."
          />
        ) : (
          <ul className="space-y-3">
            {rows.map((app) => (
              <li
                key={app.id}
                className="flex flex-col gap-3 rounded-lg border border-[#DADCE0] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-blackout">
                    Project ID: {app.project_id}
                  </p>
                  <p className="text-xs text-solid-matte-gray">Applied role: {app.role}</p>
                </div>
                <StatusBadge status={app.is_contributor ? 'approved' : 'pending'} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
