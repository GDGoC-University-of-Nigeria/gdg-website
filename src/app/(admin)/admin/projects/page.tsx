'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiError } from '@/lib/api';
import type { Project, ProjectContributor, ProjectApplication, User } from '@/lib/api';
import { cls } from '@/utils';

export default function AdminProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [managingProject, setManagingProject] = useState<Project | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await api.getProjects({
        limit: 100,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setProjects(list);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [statusFilter]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!confirm('Are you sure you want to delete this project?')) return;
    setDeleteLoading(id);
    try {
      await api.deleteProject(id);
      loadProjects();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to delete');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-NG', { dateStyle: 'medium' }) : '—';

  return (
    <div className={cls('space-y-6')}>
      <div className={cls('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4')}>
        <h1 className={cls('text-2xl font-semibold text-blackout')}>Projects management</h1>
        <div className={cls('flex gap-2 flex-wrap')}>
          {(['all', 'ongoing', 'completed'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={cls(
                'px-3 py-1.5 rounded-lg text-sm font-medium',
                statusFilter === s
                  ? 'bg-alexandra text-white'
                  : 'border border-[#DADCE0] text-blackout hover:bg-tech-white'
              )}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className={cls(
              'px-4 py-2 rounded-lg text-sm font-medium',
              'bg-alexandra text-white hover:bg-[#357AE8] transition-colors'
            )}
          >
            Create community project
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
        ) : projects.length === 0 ? (
          <div className={cls('p-8 text-center text-solid-matte-gray')}>No projects found.</div>
        ) : (
          <ul className={cls('divide-y divide-[#DADCE0]')}>
            {projects.map((p) => (
              <li key={p.id} className={cls('p-4 sm:p-5')}>
                <div
                  className={cls(
                    'rounded-xl border border-[#DADCE0] bg-white p-5 shadow-sm',
                    'transition-shadow hover:shadow-md hover:border-alexandra/50'
                  )}
                >
                  <div className={cls('flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between')}>
                    <div className={cls('min-w-0')}>
                      <div className={cls('flex flex-wrap items-center gap-2 mb-2')}>
                        <span
                          className={cls(
                            'text-xs px-2 py-0.5 rounded-sm uppercase',
                            p.project_type === 'community' && 'bg-[#34A853]/20 text-[#34A853]',
                            p.project_type === 'personal' && 'bg-alexandra/20 text-alexandra'
                          )}
                        >
                          {p.project_type}
                        </span>
                        <span
                          className={cls(
                            'text-xs px-2 py-0.5 rounded-sm uppercase',
                            p.status === 'ongoing' && 'bg-alexandra/20 text-alexandra',
                            p.status === 'completed' && 'bg-green-100 text-green-800'
                          )}
                        >
                          {p.status}
                        </span>
                        <span className={cls('text-xs text-solid-matte-gray')}>
                          Created {formatDate(p.created_at)}
                        </span>
                      </div>

                      <Link
                        href={`/dashboard/projects/${p.id}`}
                        className={cls('text-lg font-medium text-blackout hover:text-alexandra transition-colors')}
                      >
                        {p.title}
                      </Link>
                      {p.description && (
                        <p className={cls('mt-3 text-sm text-solid-matte-gray line-clamp-2')}>
                          {p.description}
                        </p>
                      )}
                    </div>

                    <div className={cls('flex flex-wrap items-center gap-2 sm:justify-end sm:shrink-0')}>
                      <Link
                        href={`/dashboard/projects/${p.id}`}
                        className={cls(
                          'px-3 py-2 rounded-lg text-sm font-medium',
                          'border border-[#DADCE0] text-blackout hover:border-alexandra hover:text-alexandra transition-colors'
                        )}
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => setEditingProject(p)}
                        disabled={!!deleteLoading}
                        className={cls(
                          'px-3 py-2 rounded-lg text-sm font-medium',
                          'border border-[#DADCE0] text-blackout hover:border-alexandra hover:text-alexandra transition-colors',
                          'disabled:opacity-60'
                        )}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setManagingProject(p)}
                        disabled={!!deleteLoading}
                        className={cls(
                          'px-3 py-2 rounded-lg text-sm font-medium',
                          'border border-[#DADCE0] text-blackout hover:border-[#34A853] hover:text-[#34A853] transition-colors',
                          'disabled:opacity-60'
                        )}
                      >
                        Team
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        disabled={!!deleteLoading}
                        className={cls(
                          'px-3 py-2 rounded-lg text-sm font-medium',
                          'border border-red-200 text-red-600 hover:bg-red-50 transition-colors',
                          'disabled:opacity-60'
                        )}
                      >
                        {deleteLoading === p.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {showCreateModal && user && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => { setShowCreateModal(false); loadProjects(); }}
          onError={(msg) => setError(msg)}
        />
      )}
      {editingProject && user && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSuccess={() => { setEditingProject(null); loadProjects(); }}
          onError={(msg) => setError(msg)}
        />
      )}
      {managingProject && user && (
        <TeamManagementModal
          project={managingProject}
          onClose={() => { setManagingProject(null); loadProjects(); }}
        />
      )}
    </div>
  );
}

/* ─── Create Project Modal ─── */
function CreateProjectModal({
  onClose, onSuccess, onError,
}: {
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [demoVideoUrl, setDemoVideoUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    onError('');
    try {
      await api.createProject({
        project_type: 'community',
        title: title.trim(),
        description: description.trim(),
        duration: duration.trim() || null,
        start_date: startDate || null,
        end_date: endDate || null,
        github_repo: githubRepo.trim() || null,
        demo_video_url: demoVideoUrl.trim() || null,
      });
      onSuccess();
    } catch (e) {
      onError(e instanceof ApiError ? e.message : 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-alexandra');

  return (
    <div className={cls('fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4')} onClick={onClose}>
      <div className={cls('bg-white rounded-xl shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto border border-[#DADCE0]')} onClick={(e) => e.stopPropagation()}>
        <h2 className={cls('text-xl font-semibold text-blackout mb-4')}>Create community project</h2>
        <form onSubmit={handleSubmit} className={cls('space-y-4')}>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>Title *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} />
          </div>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className={inputCls} />
          </div>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>Duration</label>
            <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 3 months" className={inputCls} />
          </div>
          <div className={cls('grid grid-cols-2 gap-4')}>
            <div>
              <label className={cls('block text-sm font-medium text-blackout mb-1')}>Start date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={cls('block text-sm font-medium text-blackout mb-1')}>End date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>GitHub repo URL</label>
            <input type="url" value={githubRepo} onChange={(e) => setGithubRepo(e.target.value)} placeholder="https://github.com/..." className={inputCls} />
          </div>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>Demo video URL</label>
            <input type="url" value={demoVideoUrl} onChange={(e) => setDemoVideoUrl(e.target.value)} placeholder="https://..." className={inputCls} />
          </div>
          <div className={cls('flex gap-2 pt-2')}>
            <button type="submit" disabled={submitting} className={cls('px-4 py-2 bg-alexandra text-white font-medium rounded-lg hover:bg-[#357AE8] disabled:opacity-60')}>
              {submitting ? 'Creating...' : 'Create'}
            </button>
            <button type="button" onClick={onClose} className={cls('px-4 py-2 border border-[#DADCE0] rounded-lg font-medium hover:bg-tech-white')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Edit Project Modal ─── */
function EditProjectModal({
  project, onClose, onSuccess, onError,
}: {
  project: Project; onClose: () => void; onSuccess: () => void; onError: (msg: string) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [duration, setDuration] = useState(project.duration ?? '');
  const [startDate, setStartDate] = useState(project.start_date ?? '');
  const [endDate, setEndDate] = useState(project.end_date ?? '');
  const [githubRepo, setGithubRepo] = useState(project.github_repo ?? '');
  const [demoVideoUrl, setDemoVideoUrl] = useState(project.demo_video_url ?? '');
  const [status, setStatus] = useState<'ongoing' | 'completed'>(project.status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    onError('');
    try {
      await api.updateProject(project.id, {
        title: title.trim(),
        description: description.trim(),
        duration: duration.trim() || null,
        start_date: startDate || null,
        end_date: endDate || null,
        github_repo: githubRepo.trim() || null,
        demo_video_url: demoVideoUrl.trim() || null,
        status,
      });
      onSuccess();
    } catch (e) {
      onError(e instanceof ApiError ? e.message : 'Failed to update project');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-alexandra');

  return (
    <div className={cls('fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4')} onClick={onClose}>
      <div className={cls('bg-white rounded-xl shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto border border-[#DADCE0]')} onClick={(e) => e.stopPropagation()}>
        <h2 className={cls('text-xl font-semibold text-blackout mb-4')}>Edit project</h2>
        <form onSubmit={handleSubmit} className={cls('space-y-4')}>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>Title *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} />
          </div>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className={inputCls} />
          </div>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as 'ongoing' | 'completed')} className={inputCls}>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>Duration</label>
            <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 3 months" className={inputCls} />
          </div>
          <div className={cls('grid grid-cols-2 gap-4')}>
            <div>
              <label className={cls('block text-sm font-medium text-blackout mb-1')}>Start date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={cls('block text-sm font-medium text-blackout mb-1')}>End date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>GitHub repo URL</label>
            <input type="url" value={githubRepo} onChange={(e) => setGithubRepo(e.target.value)} placeholder="https://github.com/..." className={inputCls} />
          </div>
          <div>
            <label className={cls('block text-sm font-medium text-blackout mb-1')}>Demo video URL</label>
            <input type="url" value={demoVideoUrl} onChange={(e) => setDemoVideoUrl(e.target.value)} placeholder="https://..." className={inputCls} />
          </div>
          <div className={cls('flex gap-2 pt-2')}>
            <button type="submit" disabled={submitting} className={cls('px-4 py-2 bg-alexandra text-white font-medium rounded-lg hover:bg-[#357AE8] disabled:opacity-60')}>
              {submitting ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className={cls('px-4 py-2 border border-[#DADCE0] rounded-lg font-medium hover:bg-tech-white')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Team (Contributors + Applications) Management Modal ─── */
function TeamManagementModal({
  project, onClose,
}: {
  project: Project; onClose: () => void;
}) {
  const [contributors, setContributors] = useState<ProjectContributor[]>([]);
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Add contributor form
  const [showAddForm, setShowAddForm] = useState(false);
  const [addUserId, setAddUserId] = useState('');
  const [addRole, setAddRole] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [contribs, apps, userList] = await Promise.all([
        api.getProjectContributors(project.id).catch(() => []),
        api.getProjectApplications(project.id).catch(() => []),
        api.getUsers().catch(() => []),
      ]);
      setContributors(contribs);
      setApplications(apps.filter((a: ProjectApplication) => !a.is_contributor));
      setUsers(userList);
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRemoveContributor = async (userId: string) => {
    if (!confirm('Remove this contributor?')) return;
    setActionLoading(userId);
    try {
      await api.removeContributor(project.id, userId);
      setContributors((prev) => prev.filter((c) => c.user_id !== userId));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to remove');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async (appId: string) => {
    setActionLoading(appId);
    try {
      await api.approveApplication(project.id, appId);
      await loadData();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (appId: string) => {
    if (!confirm('Reject this application?')) return;
    setActionLoading(appId);
    try {
      await api.rejectApplication(project.id, appId);
      setApplications((prev) => prev.filter((a) => a.id !== appId));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddContributor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addUserId || !addRole.trim()) return;
    setAddLoading(true);
    setError(null);
    try {
      const c = await api.addContributor(project.id, { user_id: addUserId, role: addRole.trim() });
      setContributors((prev) => [...prev, c]);
      setAddUserId('');
      setAddRole('');
      setShowAddForm(false);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to add contributor');
    } finally {
      setAddLoading(false);
    }
  };

  const getUserName = (userId: string) => {
    const u = users.find((u) => u.id === userId);
    return u?.full_name ?? u?.email ?? userId.slice(0, 8);
  };

  return (
    <div className={cls('fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4')} onClick={onClose}>
      <div
        className={cls('bg-white rounded-xl shadow-lg max-w-lg w-full p-6 border border-[#DADCE0] max-h-[90vh] overflow-y-auto')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cls('flex items-center justify-between mb-4')}>
          <h2 className={cls('text-xl font-semibold text-blackout')}>
            Team &mdash; {project.title}
          </h2>
          <button type="button" onClick={onClose} className={cls('text-solid-matte-gray hover:text-blackout text-xl leading-none')}>&times;</button>
        </div>

        {error && (
          <div className={cls('rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-red-700 text-sm mb-4')}>
            {error}
          </div>
        )}

        {loading ? (
          <p className={cls('text-sm text-solid-matte-gray')}>Loading...</p>
        ) : (
          <>
            {/* Contributors section */}
            <div className={cls('mb-6')}>
              <h3 className={cls('font-medium text-blackout mb-3')}>Contributors ({contributors.length})</h3>
              {contributors.length === 0 ? (
                <p className={cls('text-sm text-solid-matte-gray mb-3')}>No contributors yet.</p>
              ) : (
                <ul className={cls('space-y-2 mb-3')}>
                  {contributors.map((c) => (
                    <li key={c.id} className={cls('flex items-center justify-between p-3 rounded-lg border border-[#DADCE0] bg-tech-white')}>
                      <div>
                        <p className={cls('font-medium text-blackout text-sm')}>{c.user?.full_name ?? c.user?.email ?? 'Unknown'}</p>
                        <p className={cls('text-xs text-solid-matte-gray')}>{c.role}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveContributor(c.user_id)}
                        disabled={actionLoading === c.user_id}
                        className={cls('text-red-600 hover:underline text-sm font-medium disabled:opacity-60')}
                      >
                        {actionLoading === c.user_id ? '...' : 'Remove'}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {showAddForm ? (
                <form onSubmit={handleAddContributor} className={cls('space-y-3 p-3 rounded-lg border border-[#DADCE0]')}>
                  <select
                    value={addUserId}
                    onChange={(e) => setAddUserId(e.target.value)}
                    required
                    className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-alexandra')}
                  >
                    <option value="">Select user...</option>
                    {users
                      .filter((u) => !contributors.some((c) => c.user_id === u.id))
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.full_name ?? u.email}
                        </option>
                      ))}
                  </select>
                  <input
                    type="text"
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value)}
                    placeholder="Role (e.g. Frontend Developer)"
                    required
                    className={cls('w-full px-3 py-2 border border-[#DADCE0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-alexandra')}
                  />
                  <div className={cls('flex gap-2')}>
                    <button type="submit" disabled={addLoading} className={cls('px-4 py-2 bg-alexandra text-white font-medium rounded-lg text-sm hover:bg-[#357AE8] disabled:opacity-60')}>
                      {addLoading ? 'Adding...' : 'Add'}
                    </button>
                    <button type="button" onClick={() => setShowAddForm(false)} className={cls('px-4 py-2 border border-[#DADCE0] rounded-lg text-sm font-medium hover:bg-tech-white')}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className={cls('px-4 py-2 bg-[#34A853] text-white font-medium rounded-lg text-sm hover:bg-[#2d9249] transition-colors')}
                >
                  + Add contributor
                </button>
              )}
            </div>

            {/* Applications section */}
            <div className={cls('border-t border-[#DADCE0] pt-4')}>
              <h3 className={cls('font-medium text-blackout mb-3')}>Pending applications ({applications.length})</h3>
              {applications.length === 0 ? (
                <p className={cls('text-sm text-solid-matte-gray')}>No pending applications.</p>
              ) : (
                <ul className={cls('space-y-2')}>
                  {applications.map((app) => (
                    <li key={app.id} className={cls('flex items-center justify-between p-3 rounded-lg border border-[#DADCE0] bg-tech-white')}>
                      <div>
                        <p className={cls('font-medium text-blackout text-sm')}>{getUserName(app.user_id)}</p>
                        <p className={cls('text-xs text-solid-matte-gray')}>Wants to be: {app.role}</p>
                      </div>
                      <div className={cls('flex gap-2')}>
                        <button
                          type="button"
                          onClick={() => handleApprove(app.id)}
                          disabled={!!actionLoading}
                          className={cls('text-[#34A853] hover:underline text-sm font-medium disabled:opacity-60')}
                        >
                          {actionLoading === app.id ? '...' : 'Approve'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(app.id)}
                          disabled={!!actionLoading}
                          className={cls('text-red-600 hover:underline text-sm font-medium disabled:opacity-60')}
                        >
                          Reject
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
