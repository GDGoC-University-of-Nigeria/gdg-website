'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError } from '@/lib/api';
import type { Project, ProjectApplication } from '@/lib/api';
import { cls } from '@/utils';

export default function ProjectDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const id = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyRole, setApplyRole] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [myApplication, setMyApplication] = useState<ProjectApplication | null>(null);

  useEffect(() => {
    api
      .getProject(id)
      .then(setProject)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Failed to load project'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user) return;
    api
      .getMyApplications()
      .then((apps) => {
        const match = apps.find((a) => a.project_id === id);
        if (match) {
          setMyApplication(match);
          setApplied(true);
        }
      })
      .catch(() => {});
  }, [id, user]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !applyRole.trim()) return;
    setApplyLoading(true);
    setError(null);
    try {
      const app = await api.applyToProject(id, { role: applyRole.trim() });
      setMyApplication(app);
      setApplied(true);
      setShowApplyForm(false);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Application failed');
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={cls('space-y-6')}>
        <p className={cls('text-solid-matte-gray')}>Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={cls('space-y-6')}>
        <p className={cls('text-red-600')}>{error ?? 'Project not found'}</p>
        <Link
          href="/dashboard/projects"
          className={cls(
            'inline-flex items-center gap-2 rounded-lg border border-[#DADCE0] px-4 py-2 text-sm font-medium text-blackout',
            'hover:border-alexandra hover:text-alexandra transition-colors'
          )}
        >
          ← Back to projects
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === project.creator_id;
  const isContributor = project.contributors?.some((c) => c.user_id === user?.id) ?? false;
  const canApply = !!user && !isOwner && !isContributor && !applied && project.status === 'ongoing';

  return (
    <div className={cls('space-y-6')}>
      <Link
        href="/dashboard/projects"
        className={cls(
          'inline-flex items-center gap-2 rounded-lg border border-[#DADCE0] px-4 py-2 text-sm font-medium text-blackout',
          'hover:border-alexandra hover:text-alexandra transition-colors'
        )}
      >
        ← Back to projects
      </Link>
      <section
        className={cls(
          'rounded-2xl border border-[#DADCE0] bg-white p-6 shadow-sm',
          'text-blackout'
        )}
      >
        <div className={cls('flex items-start justify-between gap-4 mb-4 flex-wrap')}>
          <h1 className={cls('text-2xl md:text-3xl font-medium text-blackout')}>
            {project.title}
          </h1>
          <div className={cls('flex items-center gap-2 shrink-0')}>
            {project.project_type && (
              <span
                className={cls(
                  'text-xs px-2 py-1 rounded-sm uppercase',
                  project.project_type === 'community' && 'bg-[#34A853]/20 text-[#34A853]',
                  project.project_type === 'personal' && 'bg-alexandra/20 text-alexandra'
                )}
              >
                {project.project_type}
              </span>
            )}
            <span
              className={cls(
                'text-xs px-2 py-1 rounded-sm uppercase',
                project.status === 'ongoing'
                  ? 'bg-alexandra/20 text-alexandra'
                  : 'bg-[#DADCE0] text-solid-matte-gray'
              )}
            >
              {project.status}
            </span>
          </div>
        </div>
        {project.creator && (
          <p className={cls('text-sm text-solid-matte-gray mb-4')}>
            By {project.creator.full_name ?? 'Unknown'}
          </p>
        )}
        <p className={cls('text-solid-matte-gray whitespace-pre-wrap mb-6')}>
          {project.description}
        </p>
        <div className={cls('flex flex-wrap gap-4 text-sm')}>
          {project.duration && (
            <span className={cls('text-blackout')}>
              <span className={cls('font-medium')}>Duration:</span> {project.duration}
            </span>
          )}
          {project.start_date && (
            <span className={cls('text-blackout')}>
              <span className={cls('font-medium')}>Start:</span> {project.start_date}
            </span>
          )}
          {project.end_date && (
            <span className={cls('text-blackout')}>
              <span className={cls('font-medium')}>End:</span> {project.end_date}
            </span>
          )}
        </div>
        <div className={cls('flex flex-wrap gap-4 mt-4')}>
          {project.github_repo && (
            <a
              href={project.github_repo}
              target="_blank"
              rel="noopener noreferrer"
              className={cls('text-alexandra hover:underline font-medium')}
            >
              View on GitHub &rarr;
            </a>
          )}
          {project.demo_video_url && (
            <a
              href={project.demo_video_url}
              target="_blank"
              rel="noopener noreferrer"
              className={cls('text-alexandra hover:underline font-medium')}
            >
              Watch demo &rarr;
            </a>
          )}
        </div>

        {/* Apply section */}
        {canApply && !showApplyForm && (
          <div className={cls('mt-6 pt-6 border-t border-[#DADCE0]')}>
            <button
              type="button"
              onClick={() => setShowApplyForm(true)}
              className={cls(
                'px-5 py-2.5 bg-alexandra text-white font-medium rounded-lg text-sm',
                'hover:bg-[#357AE8] transition-colors'
              )}
            >
              Apply to contribute
            </button>
          </div>
        )}

        {showApplyForm && (
          <form onSubmit={handleApply} className={cls('mt-6 pt-6 border-t border-[#DADCE0] space-y-3')}>
            <h3 className={cls('font-medium text-blackout')}>Apply to contribute</h3>
            <input
              type="text"
              value={applyRole}
              onChange={(e) => setApplyRole(e.target.value)}
              placeholder="Your desired role (e.g. Frontend Developer)"
              required
              className={cls(
                'w-full px-3 py-2 border border-[#DADCE0] rounded-lg text-sm',
                'focus:outline-none focus:ring-2 focus:ring-alexandra'
              )}
            />
            <div className={cls('flex gap-2')}>
              <button
                type="submit"
                disabled={applyLoading}
                className={cls(
                  'px-4 py-2 bg-alexandra text-white font-medium rounded-lg text-sm',
                  'hover:bg-[#357AE8] disabled:opacity-60'
                )}
              >
                {applyLoading ? 'Applying...' : 'Submit application'}
              </button>
              <button
                type="button"
                onClick={() => setShowApplyForm(false)}
                className={cls(
                  'px-4 py-2 border border-[#DADCE0] rounded-lg text-sm font-medium',
                  'hover:bg-tech-white'
                )}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {applied && myApplication && (
          <div className={cls('mt-6 pt-6 border-t border-[#DADCE0]')}>
            <p className={cls('text-sm text-solid-matte-gray')}>
              You applied as <span className={cls('font-medium text-blackout')}>{myApplication.role}</span>
              {' — '}
              <span className={cls(
                myApplication.is_contributor ? 'text-green-600' : 'text-amber-600'
              )}>
                {myApplication.is_contributor ? 'Approved' : 'Pending review'}
              </span>
            </p>
          </div>
        )}

        {/* Contributors */}
        {project.contributors && project.contributors.length > 0 && (
          <div className={cls('mt-6 pt-6 border-t border-[#DADCE0]')}>
            <h2 className={cls('font-semibold text-blackout mb-2')}>Contributors</h2>
            <ul className={cls('space-y-1')}>
              {project.contributors.map((c) => (
                <li key={c.id} className={cls('text-sm text-solid-matte-gray')}>
                  {c.user?.full_name ?? 'Unknown'} &mdash; {c.role ?? 'Contributor'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {error && (
        <div className={cls('rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-red-700')}>
          {error}
        </div>
      )}
    </div>
  );
}
