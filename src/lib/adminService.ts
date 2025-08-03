import { supabase } from './supabase';
import { UserProfile } from '../hooks/useAuth.tsx';

export interface JobPosting {
  id: string;
  user_id: string;
  title: string;
  description: string;
  requirements: string[];
  salary_range?: string;
  location?: string;
  employment_type: string;
  status: 'draft' | 'active' | 'interviewing' | 'completed';
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
  status: 'pending' | 'ready' | 'selected' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  total_users: number;
  active_jobs: number;
  completed_hires: number;
  videos_ready: number;
}

export interface UserWithProfile extends UserProfile {
  auth_id: string;
  last_sign_in_at?: string;
}

class AdminService {
  private async checkAdminAccess(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Admin access check error:', error);
      throw new Error('Failed to verify admin access');
    }

    if (profile?.role !== 'Admin') {
      throw new Error('Admin access required');
    }
  }

  async getAdminStats(): Promise<AdminStats> {
    await this.checkAdminAccess();
    
    try {
      const { data, error } = await supabase.rpc('get_admin_stats_from_profiles');
      
      if (error) {
        console.error('Admin stats RPC error:', error);
        throw new Error(`Failed to fetch admin statistics: ${error.message}`);
      }
      
      return data as AdminStats;
    } catch (error: any) {
      console.error('Admin stats error:', error);
      throw new Error(error.message || 'Failed to fetch admin statistics');
    }
  }

  async getAllUsers(): Promise<UserWithProfile[]> {
    await this.checkAdminAccess();
    
    try {
      const { data, error } = await supabase.rpc('get_all_user_profiles_admin');
      
      if (error) {
        console.error('Get users RPC error:', error);
        throw new Error(`Failed to fetch users: ${error.message}`);
      }
      
      return data || [];
    } catch (error: any) {
      console.error('Get users error:', error);
      throw new Error(error.message || 'Failed to fetch users');
    }
  }

  async updateUserStatus(userId: string, status: UserProfile['hiring_status']): Promise<void> {
    await this.checkAdminAccess();
    
    try {
      const { error } = await supabase.rpc('update_user_status_admin', {
        target_user_id: userId,
        new_status: status
      });
      
      if (error) {
        console.error('Update status RPC error:', error);
        throw new Error(`Failed to update user status: ${error.message}`);
      }
    } catch (error: any) {
      console.error('Update status error:', error);
      throw new Error(error.message || 'Failed to update user status');
    }
  }

  async getAllJobPostings(): Promise<JobPosting[]> {
    await this.checkAdminAccess();
    
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Get jobs error:', error);
        throw new Error(`Failed to fetch job postings: ${error.message}`);
      }
      
      return data || [];
    } catch (error: any) {
      console.error('Get jobs error:', error);
      throw new Error(error.message || 'Failed to fetch job postings');
    }
  }

  async getUsersForVideoUpload(): Promise<{ user: UserWithProfile; job: JobPosting }[]> {
    await this.checkAdminAccess();
    
    try {
      const users = await this.getAllUsers();
      const interviewingUsers = users.filter(user => user.hiring_status === 'Interviewing');
      
      const results: { user: UserWithProfile; job: JobPosting }[] = [];
      
      for (const user of interviewingUsers) {
        const { data: jobs, error } = await supabase
          .from('job_postings')
          .select('*')
          .eq('user_id', user.auth_id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) {
          console.error('Error fetching job for user:', user.id, error);
          continue;
        }
        
        if (jobs && jobs.length > 0) {
          results.push({ user, job: jobs[0] });
        }
      }
      
      return results;
    } catch (error: any) {
      console.error('Get users for upload error:', error);
      throw new Error(error.message || 'Failed to fetch users for video upload');
    }
  }

  async uploadCandidateVideos(
    jobId: string, 
    candidates: Array<{
      name: string;
      role: string;
      score: number;
      video_url: string;
      email?: string;
    }>
  ): Promise<void> {
    await this.checkAdminAccess();
    
    try {
      // Delete existing candidates for this job
      const { error: deleteError } = await supabase
        .from('candidates')
        .delete()
        .eq('job_id', jobId);
      
      if (deleteError) {
        console.error('Delete candidates error:', deleteError);
        throw new Error(`Failed to clear existing candidates: ${deleteError.message}`);
      }
      
      // Insert new candidates
      const candidateRecords = candidates.map(candidate => ({
        job_id: jobId,
        name: candidate.name,
        email: candidate.email || null,
        role: candidate.role,
        score: candidate.score,
        video_url: candidate.video_url,
        status: 'ready' as const
      }));
      
      const { error: insertError } = await supabase
        .from('candidates')
        .insert(candidateRecords);
      
      if (insertError) {
        console.error('Insert candidates error:', insertError);
        throw new Error(`Failed to upload candidate videos: ${insertError.message}`);
      }
    } catch (error: any) {
      console.error('Upload videos error:', error);
      throw new Error(error.message || 'Failed to upload candidate videos');
    }
  }

  async getCandidatesForJob(jobId: string): Promise<Candidate[]> {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('job_id', jobId)
        .order('score', { ascending: false });
      
      if (error) {
        console.error('Get candidates error:', error);
        throw new Error(`Failed to fetch candidates: ${error.message}`);
      }
      
      return data || [];
    } catch (error: any) {
      console.error('Get candidates error:', error);
      throw new Error(error.message || 'Failed to fetch candidates');
    }
  }

  async createJobPosting(jobData: {
    user_id: string;
    title: string;
    description: string;
    requirements: string[];
    salary_range?: string;
    location?: string;
    employment_type?: string;
  }): Promise<JobPosting> {
    await this.checkAdminAccess();
    
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .insert({
          ...jobData,
          status: 'active'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Create job error:', error);
        throw new Error(`Failed to create job posting: ${error.message}`);
      }
      
      return data;
    } catch (error: any) {
      console.error('Create job error:', error);
      throw new Error(error.message || 'Failed to create job posting');
    }
  }
}

export const adminService = new AdminService();