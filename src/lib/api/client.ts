import type {
  AdminStats,
  BlogPost,
  BlogPostAdmin,
  Comment,
  Event,
  EventRegistration,
  Project,
  ProjectApplication,
  ProjectContributor,
  PublicFormPayload,
  Speaker,
  TeamMemberResponse,
  UpdateUserPayload,
  User,
  HackathonRegistrationPayload,
  HackathonRegistrationResponse
} from './types';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Every API route lives under this prefix — it belongs in code, not in config. */
const API_PREFIX = '/api/v1';

/**
 * The API origin, with any version prefix and trailing slashes stripped.
 *
 * NEXT_PUBLIC_API_URL is accepted either as a bare origin
 * (https://api.example.com) or with the prefix already on it
 * (https://api.example.com/api/v1). Both normalise to the same thing, so an
 * env var set without the prefix can't silently 404 every request.
 */
const getApiOrigin = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!url) return 'http://localhost:8000';
  return url.replace(/\/+$/, '').replace(/\/api\/v1$/, '');
};

/** Absolute API base, e.g. https://api-gdgunn.onrender.com/api/v1 */
const getExternalApiUrl = (): string => `${getApiOrigin()}${API_PREFIX}`;

const getApiUrl = (): string => {
  // In local dev, use Next.js rewrite proxy to avoid browser CORS preflights.
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_DEV_API_PROXY !== '0'
  ) {
    return '';
  }
  return getExternalApiUrl();
};

/**
 * Token storage.
 *
 * The API lives on a different origin than this app, so an auth cookie set by
 * the API is a third-party cookie — dropped by Safari/Firefox and being phased
 * out in Chrome. Sessions are bearer tokens instead, persisted in
 * localStorage so they survive a page reload, a new tab, and a direct visit to
 * a protected route. An in-memory copy avoids touching storage on every call.
 */
const ACCESS_TOKEN_KEY = 'gdg.access_token';
const REFRESH_TOKEN_KEY = 'gdg.refresh_token';

let _accessToken: string | null = null;
let _refreshToken: string | null = null;
let _loadedFromStorage = false;

function readStorage(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Private mode / storage disabled — fall back to memory-only for this tab.
    return null;
  }
}

function writeStorage(key: string, value: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  } catch {
    // Ignore — memory copy still serves this tab.
  }
}

function hydrateFromStorage(): void {
  if (_loadedFromStorage || typeof window === 'undefined') return;
  _loadedFromStorage = true;
  _accessToken = readStorage(ACCESS_TOKEN_KEY);
  _refreshToken = readStorage(REFRESH_TOKEN_KEY);
}

export function setAccessToken(token: string | null) {
  _loadedFromStorage = true;
  _accessToken = token;
  writeStorage(ACCESS_TOKEN_KEY, token);
}

export function setRefreshToken(token: string | null) {
  _loadedFromStorage = true;
  _refreshToken = token;
  writeStorage(REFRESH_TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  hydrateFromStorage();
  return _accessToken;
}

export function getRefreshToken(): string | null {
  hydrateFromStorage();
  return _refreshToken;
}

export function clearTokens(): void {
  setAccessToken(null);
  setRefreshToken(null);
}

/** True when we hold a token — lets callers skip a doomed /users/me call. */
export function hasStoredSession(): boolean {
  return Boolean(getAccessToken() || getRefreshToken());
}

type OAuthTokens = { accessToken: string | null; refreshToken: string | null };

/** Read the tokens the API put on the OAuth callback URL (query or hash). */
export function readOAuthTokensFromWindow(): OAuthTokens {
  if (typeof window === 'undefined')
    return { accessToken: null, refreshToken: null };

  const pick = (params: URLSearchParams): OAuthTokens => ({
    accessToken:
      params.get('access_token')?.trim() || params.get('token')?.trim() || null,
    refreshToken: params.get('refresh_token')?.trim() || null
  });

  const fromQuery = pick(new URLSearchParams(window.location.search));
  if (fromQuery.accessToken) return fromQuery;

  const rawHash = window.location.hash.replace(/^#/, '');
  if (!rawHash) return { accessToken: null, refreshToken: null };
  return pick(new URLSearchParams(rawHash));
}

export function readOAuthBearerFromWindow(): string | null {
  return readOAuthTokensFromWindow().accessToken;
}

const OAUTH_URL_KEYS = ['access_token', 'refresh_token', 'token'];

export function stripOAuthTokenFromBrowserUrl(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  let changed = false;
  for (const key of OAUTH_URL_KEYS) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  if (url.hash) {
    const hp = new URLSearchParams(url.hash.replace(/^#/, ''));
    if (OAUTH_URL_KEYS.some((key) => hp.has(key))) {
      for (const key of OAUTH_URL_KEYS) hp.delete(key);
      const rest = hp.toString();
      url.hash = rest ? `#${rest}` : '';
      changed = true;
    }
  }
  if (changed) {
    window.history.replaceState(
      null,
      '',
      `${url.pathname}${url.search}${url.hash}`
    );
  }
}

function resolveUrl(path: string): string {
  if (path.startsWith('http')) return path;
  const base = getApiUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${normalizedPath}` : `/api-proxy${normalizedPath}`;
}

function parseErrorMessage(data: unknown, res: Response): string {
  if (typeof data === 'object' && data !== null && 'detail' in data) {
    const detail = (data as { detail: unknown }).detail;
    if (Array.isArray(detail)) {
      return (detail as Array<{ msg?: string }>).map((d) => d.msg ?? '').join(', ');
    }
    return String(detail);
  }
  return res.statusText || `Request failed (${res.status})`;
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Exchange the refresh token for a new access token.
 *
 * Concurrent 401s share one in-flight call so a page that fires several
 * requests at once doesn't burn several refreshes. Resolves to the new token,
 * or null when there's nothing to refresh with (caller should treat as logged
 * out).
 */
let _refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  _refreshInFlight ??= (async () => {
    try {
      const res = await fetch(resolveUrl('/auth/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      if (!res.ok) {
        // Refresh token is expired or invalid — the session is over.
        clearTokens();
        return null;
      }
      const data = (await parseBody(res)) as { access_token?: string } | undefined;
      const token = data?.access_token ?? null;
      if (token) setAccessToken(token);
      else clearTokens();
      return token;
    } catch {
      // Network error — keep the tokens; this may just be a blip.
      return null;
    } finally {
      _refreshInFlight = null;
    }
  })();

  return _refreshInFlight;
}

export async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = resolveUrl(path);
  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  const send = (token: string | null) => {
    const headers: HeadersInit = {
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string>)
    };
    // No `credentials` — auth rides in the Authorization header, not cookies.
    return fetch(url, { ...options, headers });
  };

  let res = await send(getAccessToken());

  if (res.status === 401) {
    // Access tokens are short-lived; try one refresh and replay the call.
    // FormData bodies can't be replayed safely once consumed, so skip those.
    // (refreshAccessToken clears the tokens itself if the refresh is rejected;
    // a network blip leaves them alone so the session survives it.)
    const refreshed =
      !isFormData && getRefreshToken() ? await refreshAccessToken() : null;

    if (refreshed) res = await send(refreshed);
    else if (!getRefreshToken()) clearTokens(); // stale access token, nothing to renew with
  }

  const data = await parseBody(res);
  if (!res.ok) {
    throw new ApiError(parseErrorMessage(data, res), res.status, data);
  }
  return data as T;
}

export const api = {
  getApiUrl,

  getGoogleAuthUrl(): string {
    return `${getExternalApiUrl()}/auth/google`;
  },

  logout(): Promise<{ message: string }> {
    return request<{ message: string }>('/auth/logout', {
      method: 'POST'
    });
  },

  getMe(): Promise<User> {
    return request<User>('/users/me');
  },

  updateMe(payload: UpdateUserPayload): Promise<User> {
    return request<User>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  getUsers(): Promise<User[]> {
    return request<User[]>('/admin/users/');
  },

  deactivateUser(userId: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/admin/users/${userId}`, {
      method: 'DELETE'
    });
  },

  updateUserRole(
    userId: string,
    payload: { is_admin: boolean }
  ): Promise<User> {
    return request<User>(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  reactivateUser(userId: string): Promise<User> {
    return request<User>(`/admin/users/${userId}/reactivate`, {
      method: 'PATCH'
    });
  },

  getAdminStats(): Promise<AdminStats> {
    return request<AdminStats>('/admin/stats');
  },

  getCommunityMembers(params?: {
    skip?: number;
    limit?: number;
    q?: string;
  }): Promise<User[]> {
    const search = new URLSearchParams();
    if (params?.skip !== undefined) search.set('skip', String(params.skip));
    if (params?.limit !== undefined) search.set('limit', String(params.limit));
    if (params?.q?.trim()) search.set('q', params.q.trim());
    const qs = search.toString();
    return request<User[]>(`/community/members${qs ? `?${qs}` : ''}`);
  },

  getEvents(params?: { from_date?: string; limit?: number }): Promise<Event[]> {
    const search = new URLSearchParams();
    if (params?.from_date) search.set('from_date', params.from_date);
    if (params?.limit) search.set('limit', String(params.limit));
    const qs = search.toString();
    return request<Event[]>(`/events/${qs ? `?${qs}` : ''}`);
  },

  getEvent(id: string): Promise<Event> {
    return request<Event>(`/events/${id}`);
  },

  createEvent(payload: {
    title: string;
    description?: string | null;
    date: string;
    start_time: string;
    end_time: string;
    image_url?: string | null;
    location?: string | null;
  }): Promise<Event> {
    return request<Event>('/events/', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  updateEvent(
    id: string,
    payload: {
      title?: string;
      description?: string | null;
      date?: string;
      start_time?: string;
      end_time?: string;
      image_url?: string | null;
      location?: string | null;
      is_published?: boolean;
    }
  ): Promise<Event> {
    return request<Event>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },

  deleteEvent(id: string): Promise<void> {
    return request<void>(`/events/${id}`, { method: 'DELETE' });
  },

  addSpeaker(
    eventId: string,
    payload: {
      name: string;
      bio: string;
      image_url?: string | null;
      topic?: string | null;
      niche: string;
    }
  ): Promise<Speaker> {
    return request<Speaker>(`/events/${eventId}/speakers`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  updateSpeaker(
    eventId: string,
    speakerId: string,
    payload: {
      name?: string;
      bio?: string;
      image_url?: string | null;
      topic?: string | null;
      niche?: string;
    }
  ): Promise<Speaker> {
    return request<Speaker>(`/events/${eventId}/speakers/${speakerId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  removeSpeaker(eventId: string, speakerId: string): Promise<void> {
    return request<void>(`/events/${eventId}/speakers/${speakerId}`, {
      method: 'DELETE'
    });
  },

  registerForEvent(eventId: string): Promise<EventRegistration> {
    return request<EventRegistration>(`/events/${eventId}/register`, {
      method: 'POST'
    });
  },

  unregisterFromEvent(eventId: string): Promise<void> {
    return request<void>(`/events/${eventId}/register`, { method: 'DELETE' });
  },

  getRegistrationStatus(eventId: string): Promise<{ registered: boolean }> {
    return request<{ registered: boolean }>(`/events/${eventId}/registration`);
  },

  getMyRegistrations(): Promise<EventRegistration[]> {
    return request<EventRegistration[]>('/events/me/registrations');
  },

  getEventRegistrationsAdmin(eventId: string): Promise<EventRegistration[]> {
    return request<EventRegistration[]>(
      `/admin/events/${eventId}/registrations`
    );
  },

  removeEventRegistrationAdmin(eventId: string, userId: string): Promise<void> {
    return request<void>(`/admin/events/${eventId}/registrations/${userId}`, {
      method: 'DELETE'
    });
  },

  getProjects(params?: {
    status?: string;
    limit?: number;
  }): Promise<Project[]> {
    const search = new URLSearchParams();
    if (params?.status) search.set('status', params.status);
    if (params?.limit) search.set('limit', String(params.limit));
    const qs = search.toString();
    return request<Project[]>(`/projects/${qs ? `?${qs}` : ''}`);
  },

  getMyProjects(): Promise<Project[]> {
    return request<Project[]>('/users/me/projects');
  },

  getProject(id: string): Promise<Project> {
    return request<Project>(`/projects/${id}`);
  },

  createProject(payload: {
    project_type: 'personal' | 'community';
    title: string;
    description: string;
    duration?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    github_repo?: string | null;
    demo_video_url?: string | null;
  }): Promise<Project> {
    return request<Project>('/projects/', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  updateProject(
    id: string,
    payload: {
      title?: string;
      description?: string;
      duration?: string | null;
      start_date?: string | null;
      end_date?: string | null;
      github_repo?: string | null;
      demo_video_url?: string | null;
      status?: 'ongoing' | 'completed';
    }
  ): Promise<Project> {
    return request<Project>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  deleteProject(id: string): Promise<void> {
    return request<void>(`/projects/${id}`, { method: 'DELETE' });
  },

  approveProjectAdmin(id: string): Promise<Project> {
    return request<Project>(`/admin/projects/${id}/approve`, {
      method: 'POST'
    });
  },

  rejectProjectAdmin(
    id: string,
    payload?: { reason?: string }
  ): Promise<Project> {
    return request<Project>(`/admin/projects/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(payload ?? {})
    });
  },

  featureProjectAdmin(id: string, is_featured: boolean): Promise<Project> {
    return request<Project>(`/admin/projects/${id}/feature`, {
      method: 'PATCH',
      body: JSON.stringify({ is_featured })
    });
  },

  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return request<{ url: string }>('/media/upload', {
      method: 'POST',
      body: formData
    });
  },

  getProjectContributors(projectId: string): Promise<ProjectContributor[]> {
    return request<ProjectContributor[]>(`/projects/${projectId}/contributors`);
  },

  addContributor(
    projectId: string,
    payload: { user_id: string; role: string }
  ): Promise<ProjectContributor> {
    return request<ProjectContributor>(`/projects/${projectId}/contributors`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  removeContributor(projectId: string, userId: string): Promise<void> {
    return request<void>(`/projects/${projectId}/contributors/${userId}`, {
      method: 'DELETE'
    });
  },

  applyToProject(
    projectId: string,
    payload: { role: string }
  ): Promise<ProjectApplication> {
    return request<ProjectApplication>(`/projects/${projectId}/apply`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  withdrawApplication(applicationId: string): Promise<void> {
    return request<void>(`/projects/me/applications/${applicationId}`, {
      method: 'DELETE'
    });
  },

  getProjectApplications(projectId: string): Promise<ProjectApplication[]> {
    return request<ProjectApplication[]>(`/projects/${projectId}/applications`);
  },

  approveApplication(
    projectId: string,
    applicantId: string
  ): Promise<ProjectApplication> {
    return request<ProjectApplication>(
      `/projects/${projectId}/applications/${applicantId}/approve`,
      { method: 'PATCH' }
    );
  },

  rejectApplication(projectId: string, applicantId: string): Promise<void> {
    return request<void>(`/projects/${projectId}/applications/${applicantId}`, {
      method: 'DELETE'
    });
  },

  getMyApplications(): Promise<ProjectApplication[]> {
    return request<ProjectApplication[]>('/projects/me/applications');
  },

  getBlogNiches(): Promise<string[]> {
    return request<string[]>('/blogposts/niches');
  },

  getBlogposts(params?: {
    skip?: number;
    limit?: number;
  }): Promise<BlogPost[]> {
    const search = new URLSearchParams();
    if (params?.skip !== undefined) search.set('skip', String(params.skip));
    if (params?.limit !== undefined) search.set('limit', String(params.limit));
    const qs = search.toString();
    return request<BlogPost[]>(`/blogposts/${qs ? `?${qs}` : ''}`);
  },

  getTeam(): Promise<TeamMemberResponse[]> {
    return request<TeamMemberResponse[]>(`/team`);
  },

  submitPublicForm(body: PublicFormPayload): Promise<{ message: string }> {
    return request<{ message: string }>('/public/forms/submit', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  getMyBlogposts(params?: {
    skip?: number;
    limit?: number;
  }): Promise<BlogPostAdmin[]> {
    const search = new URLSearchParams();
    if (params?.skip !== undefined) search.set('skip', String(params.skip));
    if (params?.limit !== undefined) search.set('limit', String(params.limit));
    const qs = search.toString();
    return request<BlogPostAdmin[]>(`/blogposts/me${qs ? `?${qs}` : ''}`);
  },

  getBlogpost(id: string): Promise<BlogPost> {
    return request<BlogPost>(`/blogposts/${id}`);
  },

  submitBlogpost(payload: {
    title: string;
    content: string;
    image_url?: string | null;
    niche?: string | null;
  }): Promise<BlogPost> {
    return request<BlogPost>('/blogposts/', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  updateBlogpost(
    id: string,
    payload: {
      title?: string;
      content?: string;
      image_url?: string | null;
      niche?: string | null;
    }
  ): Promise<BlogPost> {
    return request<BlogPost>(`/blogposts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  deleteBlogpost(id: string): Promise<void> {
    return request<void>(`/blogposts/${id}`, { method: 'DELETE' });
  },

  likeBlogpost(postId: string): Promise<{ liked?: boolean }> {
    return request<{ liked?: boolean }>(`/blogposts/${postId}/like`, {
      method: 'POST'
    });
  },

  getComments(postId: string): Promise<Comment[]> {
    return request<Comment[]>(`/blogposts/${postId}/comments`);
  },

  postComment(postId: string, content: string): Promise<Comment> {
    return request<Comment>(`/blogposts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  },

  updateComment(commentId: string, content: string): Promise<Comment> {
    return request<Comment>(`/comments/${commentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content })
    });
  },

  deleteComment(commentId: string): Promise<void> {
    return request<void>(`/comments/${commentId}`, { method: 'DELETE' });
  },

  getAdminBlogposts(params?: {
    status?: string;
    skip?: number;
    limit?: number;
    q?: string;
    niche?: string;
  }): Promise<BlogPostAdmin[]> {
    const search = new URLSearchParams();
    if (params?.status && params.status !== 'all')
      search.set('status', params.status);
    if (params?.skip !== undefined) search.set('skip', String(params.skip));
    if (params?.limit !== undefined) search.set('limit', String(params.limit));
    if (params?.q?.trim()) search.set('q', params.q.trim());
    if (params?.niche?.trim()) search.set('niche', params.niche.trim());
    const qs = search.toString();
    return request<BlogPostAdmin[]>(`/admin/blogposts/${qs ? `?${qs}` : ''}`);
  },

  approveBlogpost(postId: string): Promise<BlogPostAdmin> {
    return request<BlogPostAdmin>(`/admin/blogposts/${postId}/approve`, {
      method: 'PATCH'
    });
  },

  rejectBlogpost(
    postId: string,
    payload: { rejection_reason?: string }
  ): Promise<BlogPostAdmin> {
    return request<BlogPostAdmin>(`/admin/blogposts/${postId}/reject`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  deleteAdminBlogpost(postId: string): Promise<void> {
    return request<void>(`/admin/blogposts/${postId}`, {
      method: 'DELETE'
    });
  },

  updateAdminBlogpost(
    postId: string,
    payload: {
      title?: string;
      content?: string;
      niche?: string | null;
      image_url?: string | null;
    }
  ): Promise<BlogPostAdmin> {
    return request<BlogPostAdmin>(`/admin/blogposts/${postId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  deleteAdminComment(commentId: string): Promise<void> {
    return request<void>(`/admin/comments/${commentId}`, {
      method: 'DELETE'
    });
  },

  hideAdminComment(commentId: string, hidden: boolean): Promise<Comment> {
    return request<Comment>(`/admin/comments/${commentId}/hide`, {
      method: 'PATCH',
      body: JSON.stringify({ hidden })
    });
  },

  hackathon: {
    register(payload: HackathonRegistrationPayload): Promise<HackathonRegistrationResponse> {
      return request<HackathonRegistrationResponse>('/hackathon/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },
    getRegistrations(params?: { skip?: number; limit?: number }): Promise<HackathonRegistrationResponse[]> {
      const search = new URLSearchParams();
      if (params?.skip !== undefined) search.set('skip', String(params.skip));
      if (params?.limit !== undefined) search.set('limit', String(params.limit));
      const qs = search.toString();
      // Trailing slash matters: without it FastAPI 307s to the canonical path.
      return request<HackathonRegistrationResponse[]>(`/hackathon/admin/${qs ? `?${qs}` : ''}`);
    }
  }
};
