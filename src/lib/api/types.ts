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

export type UpdateUserPayload = {
  email?: string | null;
  full_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
};

export type PublicFormPayload = {
  kind: 'apply_to_speak' | 'volunteer' | 'contact';
  payload: unknown;
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
  is_published?: boolean;
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

export type ProjectStatus = 'ongoing' | 'completed';

export type Project = {
  id: string;
  project_type: 'personal' | 'community';
  creator_id: string;
  title: string;
  description: string;
  duration: string | null;
  start_date: string | null;
  end_date: string | null;
  github_repo: string | null;
  demo_video_url: string | null;
  status: ProjectStatus;
  created_at: string;
  is_featured?: boolean;
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

export type BlogPostStatus = 'pending' | 'approved' | 'rejected' | string;

export type BlogPost = {
  id: string;
  author_id: string;
  title: string;
  image_url: string | null;
  content: string;
  niche: string | null;
  content_format?: string | null;
  status: BlogPostStatus;
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

export type AdminStats = {
  users: number;
  blog_approved: number;
  blog_pending: number;
  events_total: number;
  projects_total: number;
  upcoming_events: number;
  ongoing_projects: number;
};
