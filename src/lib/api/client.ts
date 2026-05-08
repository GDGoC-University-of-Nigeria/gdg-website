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
  User
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

const getApiUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) return 'http://localhost:8000';
  return url.replace(/\/$/, '');
};

let _accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

export function readOAuthBearerFromWindow(): string | null {
  if (typeof window === 'undefined') return null;
  const qs = new URLSearchParams(window.location.search);
  const fromQuery =
    qs.get('access_token')?.trim() || qs.get('token')?.trim() || null;
  if (fromQuery) return fromQuery;

  const rawHash = window.location.hash.replace(/^#/, '');
  if (!rawHash) return null;
  const hp = new URLSearchParams(rawHash);
  return hp.get('access_token')?.trim() || hp.get('token')?.trim() || null;
}

export function stripOAuthTokenFromBrowserUrl(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  let changed = false;
  for (const key of ['access_token', 'token']) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  if (url.hash) {
    const hp = new URLSearchParams(url.hash.replace(/^#/, ''));
    if (hp.has('access_token') || hp.has('token')) {
      hp.delete('access_token');
      hp.delete('token');
      const rest = hp.toString();
      url.hash = rest ? `#${rest}` : '';
      changed = true;
    }
  }
  if (changed) {
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const base = getApiUrl();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: HeadersInit = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(_accessToken ? { Authorization: `Bearer ${_accessToken}` } : {}),
    ...(options.headers as Record<string, string>),
  };
  const res = await fetch(url, { ...options, headers, credentials: 'include' });
  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const message =
      typeof data === 'object' && data !== null && 'detail' in data
        ? (Array.isArray((data as { detail: unknown }).detail)
            ? (data as { detail: Array<{ msg?: string }> }).detail.map((d) => d.msg ?? '').join(', ')
            : String((data as { detail: string }).detail))
        : res.statusText || `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data);
  }
  return data as T;
}

export const api = {
  getApiUrl,

  getGoogleAuthUrl(): string {
    return `${getApiUrl()}/auth/google`;
  },

  logout(): Promise<{ message: string }> {
    return request<{ message: string }>('/auth/logout', { method: 'POST' });
  },

  getMe(): Promise<User> {
    return request<User>('/users/me');
  },

  updateMe(payload: UpdateUserPayload): Promise<User> {
    return request<User>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  getUsers(): Promise<User[]> {
    return request<User[]>('/admin/users/');
  },

  deactivateUser(userId: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/admin/users/${userId}`, { method: 'DELETE' });
  },

  updateUserRole(
    userId: string,
    payload: { is_admin: boolean }
  ): Promise<User> {
    return request<User>(`/api/v1/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  reactivateUser(userId: string): Promise<User> {
    return request<User>(`/api/v1/admin/users/${userId}/reactivate`, {
      method: 'PATCH',
    });
  },

  getAdminStats(): Promise<AdminStats> {
    return request<AdminStats>('/api/v1/admin/stats');
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
    return request<User[]>(`/api/v1/community/members${qs ? `?${qs}` : ''}`);
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
      body: JSON.stringify(payload),
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
      body: JSON.stringify(payload),
    });
  },

  deleteEvent(id: string): Promise<void> {
    return request<void>(`/events/${id}`, { method: 'DELETE' });
  },

  addSpeaker(
    eventId: string,
    payload: { name: string; bio: string; image_url?: string | null; topic?: string | null; niche: string }
  ): Promise<Speaker> {
    return request<Speaker>(`/events/${eventId}/speakers`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateSpeaker(
    eventId: string,
    speakerId: string,
    payload: { name?: string; bio?: string; image_url?: string | null; topic?: string | null; niche?: string }
  ): Promise<Speaker> {
    return request<Speaker>(`/events/${eventId}/speakers/${speakerId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  removeSpeaker(eventId: string, speakerId: string): Promise<void> {
    return request<void>(`/events/${eventId}/speakers/${speakerId}`, {
      method: 'DELETE',
    });
  },

  registerForEvent(eventId: string): Promise<EventRegistration> {
    return request<EventRegistration>(`/events/${eventId}/register`, {
      method: 'POST',
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
    return request<EventRegistration[]>(`/api/v1/admin/events/${eventId}/registrations`);
  },

  removeEventRegistrationAdmin(eventId: string, userId: string): Promise<void> {
    return request<void>(`/api/v1/admin/events/${eventId}/registrations/${userId}`, {
      method: 'DELETE',
    });
  },

  getProjects(params?: { status?: string; limit?: number }): Promise<Project[]> {
    const search = new URLSearchParams();
    if (params?.status) search.set('status', params.status);
    if (params?.limit) search.set('limit', String(params.limit));
    const qs = search.toString();
    return request<Project[]>(`/api/v1/projects/${qs ? `?${qs}` : ''}`);
  },

  getMyProjects(): Promise<Project[]> {
    return request<Project[]>('/api/v1/users/me/projects');
  },

  getProject(id: string): Promise<Project> {
    return request<Project>(`/api/v1/projects/${id}`);
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
    return request<Project>('/api/v1/projects/', {
      method: 'POST',
      body: JSON.stringify(payload),
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
    return request<Project>(`/api/v1/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  deleteProject(id: string): Promise<void> {
    return request<void>(`/api/v1/projects/${id}`, { method: 'DELETE' });
  },

  approveProjectAdmin(id: string): Promise<Project> {
    return request<Project>(`/api/v1/admin/projects/${id}/approve`, { method: 'POST' });
  },

  rejectProjectAdmin(id: string, payload?: { reason?: string }): Promise<Project> {
    return request<Project>(`/api/v1/admin/projects/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(payload ?? {}),
    });
  },

  featureProjectAdmin(id: string, is_featured: boolean): Promise<Project> {
    return request<Project>(`/api/v1/admin/projects/${id}/feature`, {
      method: 'PATCH',
      body: JSON.stringify({ is_featured }),
    });
  },

  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return request<{ url: string }>('/api/v1/media/upload', {
      method: 'POST',
      body: formData,
    });
  },

  getProjectContributors(projectId: string): Promise<ProjectContributor[]> {
    return request<ProjectContributor[]>(`/api/v1/projects/${projectId}/contributors`);
  },

  addContributor(
    projectId: string,
    payload: { user_id: string; role: string }
  ): Promise<ProjectContributor> {
    return request<ProjectContributor>(`/api/v1/projects/${projectId}/contributors`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  removeContributor(projectId: string, userId: string): Promise<void> {
    return request<void>(`/api/v1/projects/${projectId}/contributors/${userId}`, {
      method: 'DELETE',
    });
  },

  applyToProject(projectId: string, payload: { role: string }): Promise<ProjectApplication> {
    return request<ProjectApplication>(`/api/v1/projects/${projectId}/apply`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  withdrawApplication(applicationId: string): Promise<void> {
    return request<void>(`/api/v1/projects/me/applications/${applicationId}`, {
      method: 'DELETE',
    });
  },

  getProjectApplications(projectId: string): Promise<ProjectApplication[]> {
    return request<ProjectApplication[]>(`/api/v1/projects/${projectId}/applications`);
  },

  approveApplication(projectId: string, applicantId: string): Promise<ProjectApplication> {
    return request<ProjectApplication>(
      `/api/v1/projects/${projectId}/applications/${applicantId}/approve`,
      { method: 'PATCH' }
    );
  },

  rejectApplication(projectId: string, applicantId: string): Promise<void> {
    return request<void>(
      `/api/v1/projects/${projectId}/applications/${applicantId}`,
      { method: 'DELETE' }
    );
  },

  getMyApplications(): Promise<ProjectApplication[]> {
    return request<ProjectApplication[]>('/api/v1/projects/me/applications');
  },

  getBlogNiches(): Promise<string[]> {
    return request<string[]>('/api/v1/blog/niches');
  },

  getBlogposts(params?: { skip?: number; limit?: number }): Promise<BlogPost[]> {
    const search = new URLSearchParams();
    if (params?.skip !== undefined) search.set('skip', String(params.skip));
    if (params?.limit !== undefined) search.set('limit', String(params.limit));
    const qs = search.toString();
    return request<BlogPost[]>(`/api/v1/blogposts/${qs ? `?${qs}` : ''}`);
  },

  getTeam(): Promise<TeamMemberResponse[]> {
    return request<TeamMemberResponse[]>(`/api/v1/team`);
  },

  submitPublicForm(body: PublicFormPayload): Promise<{ message: string }> {
    return request<{ message: string }>('/api/v1/public/forms/submit', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  getMyBlogposts(params?: { skip?: number; limit?: number }): Promise<BlogPostAdmin[]> {
    const search = new URLSearchParams();
    if (params?.skip !== undefined) search.set('skip', String(params.skip));
    if (params?.limit !== undefined) search.set('limit', String(params.limit));
    const qs = search.toString();
    return request<BlogPostAdmin[]>(`/api/v1/blogposts/me${qs ? `?${qs}` : ''}`);
  },

  getBlogpost(id: string): Promise<BlogPost> {
    return request<BlogPost>(`/api/v1/blogposts/${id}`);
  },

  submitBlogpost(payload: {
    title: string;
    content: string;
    image_url?: string | null;
    niche?: string | null;
  }): Promise<BlogPost> {
    return request<BlogPost>('/api/v1/blogposts/', {
      method: 'POST',
      body: JSON.stringify(payload),
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
    return request<BlogPost>(`/api/v1/blogposts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  deleteBlogpost(id: string): Promise<void> {
    return request<void>(`/api/v1/blogposts/${id}`, { method: 'DELETE' });
  },

  likeBlogpost(postId: string): Promise<{ liked?: boolean }> {
    return request<{ liked?: boolean }>(`/api/v1/blogposts/${postId}/like`, { method: 'POST' });
  },

  getComments(postId: string): Promise<Comment[]> {
    return request<Comment[]>(`/api/v1/blogposts/${postId}/comments`);
  },

  postComment(postId: string, content: string): Promise<Comment> {
    return request<Comment>(`/api/v1/blogposts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  updateComment(commentId: string, content: string): Promise<Comment> {
    return request<Comment>(`/api/v1/comments/${commentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
  },

  deleteComment(commentId: string): Promise<void> {
    return request<void>(`/api/v1/comments/${commentId}`, { method: 'DELETE' });
  },

  getAdminBlogposts(params?: {
    status?: string;
    skip?: number;
    limit?: number;
    q?: string;
    niche?: string;
  }): Promise<BlogPostAdmin[]> {
    const search = new URLSearchParams();
    if (params?.status && params.status !== 'all') search.set('status', params.status);
    if (params?.skip !== undefined) search.set('skip', String(params.skip));
    if (params?.limit !== undefined) search.set('limit', String(params.limit));
    if (params?.q?.trim()) search.set('q', params.q.trim());
    if (params?.niche?.trim()) search.set('niche', params.niche.trim());
    const qs = search.toString();
    return request<BlogPostAdmin[]>(`/api/v1/admin/blogposts/${qs ? `?${qs}` : ''}`);
  },

  approveBlogpost(postId: string): Promise<BlogPostAdmin> {
    return request<BlogPostAdmin>(`/api/v1/admin/blogposts/${postId}/approve`, {
      method: 'PATCH',
    });
  },

  rejectBlogpost(postId: string, payload: { rejection_reason?: string }): Promise<BlogPostAdmin> {
    return request<BlogPostAdmin>(`/api/v1/admin/blogposts/${postId}/reject`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  deleteAdminBlogpost(postId: string): Promise<void> {
    return request<void>(`/api/v1/admin/blogposts/${postId}`, { method: 'DELETE' });
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
    return request<BlogPostAdmin>(`/api/v1/admin/blogposts/${postId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  deleteAdminComment(commentId: string): Promise<void> {
    return request<void>(`/api/v1/admin/comments/${commentId}`, { method: 'DELETE' });
  },

  hideAdminComment(commentId: string, hidden: boolean): Promise<Comment> {
    return request<Comment>(`/api/v1/admin/comments/${commentId}/hide`, {
      method: 'PATCH',
      body: JSON.stringify({ hidden }),
    });
  }
};
