// Application Types for Glitch Engine

export type UserRole = 'Client' | 'Admin';
export type HiringStatus = 'Not Started' | 'Job Posting' | 'Interviewing' | 'Videos Ready' | 'Picked';
export type JobStatus = 'draft' | 'active' | 'interviewing' | 'completed';
export type CandidateStatus = 'pending' | 'ready' | 'selected' | 'rejected';
export type MeetingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  hiring_status: HiringStatus;
  avatar_url?: string;
  company?: string;
  created_at: string;
  updated_at: string;
}

export interface JobPosting {
  id: string;
  user_id: string;
  title: string;
  description: string;
  requirements: string[];
  salary_range?: string;
  location?: string;
  employment_type: string;
  status: JobStatus;
  created_at: string;
  updated_at: string;
}

export interface Candidate {
  id: string;
  job_id: string;
  name: string;
  email?: string;
  role: string;
  score: number;
  video_url?: string;
  thumbnail_url?: string;
  status: CandidateStatus;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  meeting_date: string;
  meeting_time: string;
  timezone: string;
  status: MeetingStatus;
  meeting_link?: string;
  notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

