'use client';

/**
 * Query keys and read hooks for the API.
 *
 * Keys live here rather than inline in components so a mutation in one page
 * can invalidate a list another page owns. Everything is keyed by resource
 * first, which means `invalidateQueries({ queryKey: qk.users.all })` clears
 * every user list and detail at once.
 */
import { useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';

import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export const qk = {
  users: {
    all: ['users'] as const,
    me: ['users', 'me'] as const,
    myProjects: ['users', 'me', 'projects'] as const,
    adminList: ['users', 'admin-list'] as const
  },
  community: {
    all: ['community'] as const,
    members: (params: { skip?: number; limit?: number; q?: string }) =>
      ['community', 'members', params] as const
  },
  events: {
    all: ['events'] as const,
    list: (params?: { from_date?: string; limit?: number }) =>
      ['events', 'list', params ?? {}] as const,
    detail: (id: string) => ['events', 'detail', id] as const,
    myRegistrations: ['events', 'my-registrations'] as const,
    registration: (id: string) => ['events', 'registration', id] as const,
    registrations: (id: string) => ['events', 'registrations', id] as const
  },
  blogposts: {
    all: ['blogposts'] as const,
    list: (params?: unknown) => ['blogposts', 'list', params ?? {}] as const,
    mine: (params?: unknown) => ['blogposts', 'mine', params ?? {}] as const,
    detail: (id: string) => ['blogposts', 'detail', id] as const,
    comments: (id: string) => ['blogposts', 'comments', id] as const,
    niches: ['blogposts', 'niches'] as const,
    adminList: (params?: unknown) => ['blogposts', 'admin-list', params ?? {}] as const
  },
  projects: {
    all: ['projects'] as const,
    list: (params?: unknown) => ['projects', 'list', params ?? {}] as const,
    detail: (id: string) => ['projects', 'detail', id] as const,
    applications: (id: string) => ['projects', 'applications', id] as const,
    contributors: (id: string) => ['projects', 'contributors', id] as const,
    myApplications: ['projects', 'my-applications'] as const
  },
  admin: {
    stats: ['admin', 'stats'] as const,
    hackathon: (params?: unknown) => ['admin', 'hackathon', params ?? {}] as const
  },
  team: ['team'] as const,
  /** Scraped GDG chapter feed, served by our own /api/events/gdg route. */
  gdgCommunityEvents: ['gdg-community-events'] as const
} as const;

/** Human-readable message from an unknown thrown value. */
export function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/**
 * Options shared by every hook here: callers can still pass `enabled`,
 * `staleTime`, etc. through.
 */
type Extra<T> = Omit<UseQueryOptions<T, Error, T>, 'queryKey' | 'queryFn'>;

/** Only run a query once the user is known — avoids a guaranteed 401. */
function useAuthed<T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>,
  extra?: Extra<T>
) {
  const { user, isHydrated } = useAuth();
  return useQuery<T, Error, T>({
    queryKey,
    queryFn,
    ...extra,
    enabled: isHydrated && Boolean(user) && (extra?.enabled ?? true)
  });
}

// ── Users ────────────────────────────────────────────────────────────────
export const useAdminUsers = (extra?: Extra<Awaited<ReturnType<typeof api.getUsers>>>) =>
  useAuthed(qk.users.adminList, () => api.getUsers(), extra);

export const useMyProjects = (
  extra?: Extra<Awaited<ReturnType<typeof api.getMyProjects>>>
) => useAuthed(qk.users.myProjects, () => api.getMyProjects(), extra);

// ── Community ────────────────────────────────────────────────────────────
export const useCommunityMembers = (
  params: { skip?: number; limit?: number; q?: string },
  extra?: Extra<Awaited<ReturnType<typeof api.getCommunityMembers>>>
) =>
  useAuthed(
    qk.community.members(params),
    () => api.getCommunityMembers(params),
    extra
  );

// ── Events ───────────────────────────────────────────────────────────────
export const useEvents = (
  params?: { from_date?: string; limit?: number },
  extra?: Extra<Awaited<ReturnType<typeof api.getEvents>>>
) => useAuthed(qk.events.list(params), () => api.getEvents(params), extra);

export const useMyEventRegistrations = (
  extra?: Extra<Awaited<ReturnType<typeof api.getMyRegistrations>>>
) => useAuthed(qk.events.myRegistrations, () => api.getMyRegistrations(), extra);

// ── Projects ─────────────────────────────────────────────────────────────
export const useProjects = (
  params?: Parameters<typeof api.getProjects>[0],
  extra?: Extra<Awaited<ReturnType<typeof api.getProjects>>>
) => useAuthed(qk.projects.list(params), () => api.getProjects(params), extra);

export const useMyApplications = (
  extra?: Extra<Awaited<ReturnType<typeof api.getMyApplications>>>
) => useAuthed(qk.projects.myApplications, () => api.getMyApplications(), extra);

// ── Blog posts ───────────────────────────────────────────────────────────
export const useBlogposts = (
  params?: Parameters<typeof api.getBlogposts>[0],
  extra?: Extra<Awaited<ReturnType<typeof api.getBlogposts>>>
) => useAuthed(qk.blogposts.list(params), () => api.getBlogposts(params), extra);

export const useMyBlogposts = (
  params?: Parameters<typeof api.getMyBlogposts>[0],
  extra?: Extra<Awaited<ReturnType<typeof api.getMyBlogposts>>>
) => useAuthed(qk.blogposts.mine(params), () => api.getMyBlogposts(params), extra);

export const useAdminBlogposts = (
  params: Parameters<typeof api.getAdminBlogposts>[0],
  extra?: Extra<Awaited<ReturnType<typeof api.getAdminBlogposts>>>
) =>
  useAuthed(
    qk.blogposts.adminList(params),
    () => api.getAdminBlogposts(params),
    extra
  );

export const useBlogNiches = (extra?: Extra<string[]>) =>
  useQuery<string[], Error, string[]>({
    queryKey: qk.blogposts.niches,
    queryFn: () => api.getBlogNiches(),
    // Niches barely change — cache them for the session.
    staleTime: 30 * 60_000,
    ...extra
  });

// ── Admin ────────────────────────────────────────────────────────────────
export type AdminOverview = {
  users: number;
  blogApproved: number;
  events: number;
  projects: number;
  pendingPosts: number;
  upcomingEvents: number;
  ongoingProjects: number;
};

export const EMPTY_ADMIN_OVERVIEW: AdminOverview = {
  users: 0,
  blogApproved: 0,
  events: 0,
  projects: 0,
  pendingPosts: 0,
  upcomingEvents: 0,
  ongoingProjects: 0
};

/**
 * Dashboard counters. Prefers the single /admin/stats call and falls back to
 * counting each collection if that endpoint fails, so the dashboard still
 * renders numbers on an older backend.
 */
async function fetchAdminOverview(): Promise<AdminOverview> {
  try {
    const s = await api.getAdminStats();
    return {
      users: s.users,
      blogApproved: s.blog_approved,
      events: s.events_total,
      projects: s.projects_total,
      pendingPosts: s.blog_pending,
      upcomingEvents: s.upcoming_events,
      ongoingProjects: s.ongoing_projects
    };
  } catch {
    const today = new Date().toISOString().slice(0, 10);
    const count = <T>(p: Promise<T[]>) => p.then((l) => l.length).catch(() => 0);
    const [
      users,
      blogApproved,
      events,
      projects,
      pendingPosts,
      upcomingEvents,
      ongoingProjects
    ] = await Promise.all([
      count(api.getUsers()),
      count(api.getAdminBlogposts({ status: 'approved', limit: 5000 })),
      count(api.getEvents({ limit: 5000 })),
      count(api.getProjects({ limit: 5000 })),
      count(api.getAdminBlogposts({ status: 'pending', limit: 500 })),
      count(api.getEvents({ from_date: today, limit: 500 })),
      count(api.getProjects({ status: 'ongoing', limit: 500 }))
    ]);
    return {
      users,
      blogApproved,
      events,
      projects,
      pendingPosts,
      upcomingEvents,
      ongoingProjects
    };
  }
}

export const useAdminOverview = (extra?: Extra<AdminOverview>) =>
  useAuthed(qk.admin.stats, fetchAdminOverview, extra);

export const useHackathonRegistrations = (
  params: Parameters<typeof api.hackathon.getRegistrations>[0],
  extra?: Extra<Awaited<ReturnType<typeof api.hackathon.getRegistrations>>>
) =>
  useAuthed(
    qk.admin.hackathon(params),
    () => api.hackathon.getRegistrations(params),
    extra
  );

/**
 * Invalidate whole resources by name after a mutation, e.g.
 * `invalidate('projects', 'admin')`.
 */
export function useInvalidate() {
  const queryClient = useQueryClient();
  return (...resources: Array<keyof typeof qk>) =>
    Promise.all(
      resources.map((resource) => {
        const entry = qk[resource];
        const queryKey = Array.isArray(entry)
          ? (entry as readonly unknown[])
          : ((entry as { all: readonly unknown[] }).all ?? [resource]);
        return queryClient.invalidateQueries({ queryKey });
      })
    );
}
