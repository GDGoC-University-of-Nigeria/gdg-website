/**
 * API client and types for the GDG backend.
 * Uses NEXT_PUBLIC_API_URL for the base URL.
 */

const getApiUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) return 'http://localhost:8000';
  return url.replace(/\/$/, '');
};

export type User = {
  id: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  profile: {
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    bio: string | null;
    is_complete: boolean;
  } | null;
};


export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = {
  email: string;
  full_name: string;
  password: string;
  confirm_password?: string;
  phone?: string | null;
};
export type UpdateUserPayload = {
  email?: string | null;
  full_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
};


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

export type PublicFormKind = 'apply_to_speak' | 'volunteer' | 'contact';

export type PublicFormPayload = {
  kind: PublicFormKind;
  payload: unknown;
};

// ── In-memory access token (set after OAuth callback) ──────────────────────
let _accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

export function getAccessToken(): string | null {
  return _accessToken;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const base = getApiUrl();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
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
    return request<{ message: string }>('/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  },



  getMe(): Promise<User> {
    return request<User>('/users/me', { credentials: 'include' });
  },

  updateMe(payload: UpdateUserPayload): Promise<User> {
    return request<User>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(payload),
      credentials: 'include',
    });
  },

  getUsers(): Promise<User[]> {
    return request<User[]>('/admin/users/', { credentials: 'include' });
  },

  deactivateUser(userId: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/admin/users/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  },

  getCommunityMembers(params?: { skip?: number; limit?: number }): Promise<User[]> {
    const search = new URLSearchParams();
    if (params?.skip !== undefined) search.set('skip', String(params.skip));
    if (params?.limit !== undefined) search.set('limit', String(params.limit));
    const qs = search.toString();
    return request<User[]>(`/api/v1/community/members${qs ? `?${qs}` : ''}`, { credentials: 'include' });
  },

  getEvents(params?: { from_date?: string; limit?: number }): Promise<Event[]> {
    const search = new URLSearchParams();
    if (params?.from_date) search.set('from_date', params.from_date);
    if (params?.limit) search.set('limit', String(params.limit));
    const qs = search.toString();
    return request<Event[]>(`/events/${qs ? `?${qs}` : ''}`, { credentials: 'include' });
  },

  getEvent(id: string): Promise<Event> {
    return request<Event>(`/events/${id}`, { credentials: 'include' });
  },

  createEvent(
    payload: {
      title: string;
      description?: string | null;
      date: string;
      start_time: string;
      end_time: string;
      image_url?: string | null;
      location?: string | null;
    }
  ): Promise<Event> {
    return request<Event>('/events/', {
      method: 'POST',
      body: JSON.stringify(payload),
      credentials: 'include',
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
    }
  ): Promise<Event> {
    return request<Event>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      credentials: 'include',
    });
  },

  deleteEvent(id: string): Promise<void> {
    return request<void>(`/events/${id}`, { method: 'DELETE', credentials: 'include' });
  },

  addSpeaker(
    eventId: string,
    payload: { name: string; bio: string; image_url?: string | null; topic?: string | null; niche: string }
  ): Promise<Speaker> {
    return request<Speaker>(`/events/${eventId}/speakers`, {
      method: 'POST',
      body: JSON.stringify(payload),
      credentials: 'include',
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
      credentials: 'include',
    });
  },

  removeSpeaker(eventId: string, speakerId: string): Promise<void> {
    return request<void>(`/events/${eventId}/speakers/${speakerId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  },

  registerForEvent(eventId: string): Promise<EventRegistration> {
    return request<EventRegistration>(`/events/${eventId}/register`, {
      method: 'POST',
      credentials: 'include',
    });
  },

  unregisterFromEvent(eventId: string): Promise<void> {
    return request<void>(`/events/${eventId}/register`, {
      method: 'DELETE',
      credentials: 'include',
    });
  },

  getRegistrationStatus(eventId: string): Promise<{ registered: boolean }> {
    return request<{ registered: boolean }>(`/events/${eventId}/registration`, { credentials: 'include' });
  },

  getMyRegistrations(): Promise<EventRegistration[]> {
    return request<EventRegistration[]>('/events/me/registrations', { credentials: 'include' });
  },

  getProjects(params?: { status?: string; limit?: number }): Promise<Project[]> {
    const search = new URLSearchParams();
    if (params?.status) search.set('status', params.status);
    if (params?.limit) search.set('limit', String(params.limit));
    const qs = search.toString();
    return request<Project[]>(`/api/v1/projects/${qs ? `?${qs}` : ''}`, { credentials: 'include' });
  },

  getProject(id: string): Promise<Project> {
    return request<Project>(`/api/v1/projects/${id}`, { credentials: 'include' });
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
      credentials: 'include',
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
      credentials: 'include',
    });
  },

  deleteProject(id: string): Promise<void> {
    return request<void>(`/api/v1/projects/${id}`, { method: 'DELETE', credentials: 'include' });
  },

  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return request<{ url: string }>('/api/v1/media/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
  },

  getProjectContributors(projectId: string): Promise<ProjectContributor[]> {
    return request<ProjectContributor[]>(`/api/v1/projects/${projectId}/contributors`, { credentials: 'include' });
  },

  addContributor(
    projectId: string,
    payload: { user_id: string; role: string }
  ): Promise<ProjectContributor> {
    return request<ProjectContributor>(`/api/v1/projects/${projectId}/contributors`, {
      method: 'POST',
      body: JSON.stringify(payload),
      credentials: 'include',
    });
  },

  removeContributor(projectId: string, userId: string): Promise<void> {
    return request<void>(`/api/v1/projects/${projectId}/contributors/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  },

  applyToProject(projectId: string, payload: { role: string }): Promise<ProjectApplication> {
    return request<ProjectApplication>(`/api/v1/projects/${projectId}/apply`, {
      method: 'POST',
      body: JSON.stringify(payload),
      credentials: 'include',
    });
  },

  getProjectApplications(projectId: string): Promise<ProjectApplication[]> {
    return request<ProjectApplication[]>(`/api/v1/projects/${projectId}/applications`, { credentials: 'include' });
  },

  approveApplication(projectId: string, applicantId: string): Promise<ProjectApplication> {
    return request<ProjectApplication>(
      `/api/v1/projects/${projectId}/applications/${applicantId}/approve`,
      { method: 'PATCH', credentials: 'include' }
    );
  },

  rejectApplication(projectId: string, applicantId: string): Promise<void> {
    return request<void>(
      `/api/v1/projects/${projectId}/applications/${applicantId}`,
      { method: 'DELETE', credentials: 'include' }
    );
  },

  getMyApplications(): Promise<ProjectApplication[]> {
    return request<ProjectApplication[]>('/api/v1/projects/me/applications', { credentials: 'include' });
  },

  getBlogposts(params?: { skip?: number; limit?: number }): Promise<BlogPost[]> {
    const search = new URLSearchParams();
    if (params?.skip !== undefined) search.set('skip', String(params.skip));
    if (params?.limit !== undefined) search.set('limit', String(params.limit));
    const qs = search.toString();
    return request<BlogPost[]>(`/api/v1/blogposts/${qs ? `?${qs}` : ''}`, { credentials: 'include' });
  },

  getTeam(): Promise<TeamMemberResponse[]> {
    return request<TeamMemberResponse[]>(`/api/v1/team`, { credentials: 'include' });
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
    return request<BlogPostAdmin[]>(`/api/v1/blogposts/me${qs ? `?${qs}` : ''}`, { credentials: 'include' });
  },

  getBlogpost(id: string): Promise<BlogPost> {
    return request<BlogPost>(`/api/v1/blogposts/${id}`, { credentials: 'include' });
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
      credentials: 'include',
    });
  },

  likeBlogpost(postId: string): Promise<unknown> {
    return request(`/api/v1/blogposts/${postId}/like`, { method: 'POST', credentials: 'include' });
  },

  getComments(postId: string): Promise<Comment[]> {
    return request<Comment[]>(`/api/v1/blogposts/${postId}/comments`, { credentials: 'include' });
  },

  postComment(postId: string, content: string): Promise<Comment> {
    return request<Comment>(`/api/v1/blogposts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
      credentials: 'include',
    });
  },

  getAdminBlogposts(params?: {
    status?: string;
    skip?: number;
    limit?: number;
  }): Promise<BlogPostAdmin[]> {
    const search = new URLSearchParams();
    if (params?.status && params.status !== 'all') search.set('status', params.status);
    if (params?.skip !== undefined) search.set('skip', String(params.skip));
    if (params?.limit !== undefined) search.set('limit', String(params.limit));
    const qs = search.toString();
    return request<BlogPostAdmin[]>(`/api/v1/admin/blogposts/${qs ? `?${qs}` : ''}`, { credentials: 'include' });
  },

  approveBlogpost(postId: string): Promise<BlogPostAdmin> {
    return request<BlogPostAdmin>(`/api/v1/admin/blogposts/${postId}/approve`, {
      method: 'PATCH',
      credentials: 'include',
    });
  },

  rejectBlogpost(postId: string, payload: { rejection_reason?: string }): Promise<BlogPostAdmin> {
    return request<BlogPostAdmin>(`/api/v1/admin/blogposts/${postId}/reject`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
      credentials: 'include',
    });
  },
};

export type Speaker = {
  id: string;
  event_id: string;
  name: string;
  bio: string;
  image_url: string | null;
  topic: string | null;
  niche: string;
  added_at: string;
};

export type Event = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  image_url: string | null;
  location: string | null;
  attendees?: number;
  speakers?: Speaker[];
  created_at: string;
};

export type EventRegistration = {
  id: string;
  event_id: string;
  user_id: string;
  registered_at: string;
};

export type ProjectContributor = {
  id: string;
  user_id: string;
  role: string;
  added_at: string;
  user: { id: string; full_name: string | null; email: string };
};

export type Project = {
  id: string;
  project_type: string;
  creator_id: string;
  title: string;
  description: string;
  duration: string | null;
  start_date: string | null;
  end_date: string | null;
  github_repo: string | null;
  demo_video_url: string | null;
  status: 'ongoing' | 'completed';
  created_at: string;
  creator?: { id: string; full_name: string | null; email: string };
  contributors?: ProjectContributor[];
};

export type ProjectApplication = {
  id: string;
  user_id: string;
  project_id: string;
  role: string;
  is_contributor: boolean;
};

export type BlogPost = {
  id: string;
  author_id: string;
  title: string;
  image_url: string | null;
  content: string;
  niche: string | null;
  content_format?: string | null;
  status: string;
  posted_at: string | null;
  updated_at: string | null;
  approved_at: string | null;
  likes_count?: number;
  comments_count?: number;
  is_liked_by_current_user?: boolean;
};

export type BlogPostAdmin = BlogPost & {
  approved_by?: string | null;
  rejection_reason?: string | null;
  author?: { id: string; full_name: string | null; email: string } | null;
};

export type Comment = {
  id: string;
  content: string;
  user_id: string;
  blogpost_id: string;
  created_at: string;
  updated_at?: string;
  author?: { id: string; full_name: string | null; email: string } | null;
};

export type TeamMemberResponse = {
  id: string;
  name: string;
  role: string;
  image_url: string | null;
};
