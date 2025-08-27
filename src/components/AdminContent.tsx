import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  CheckCircle, 
  Play, 
  Upload,
  Eye,
  Calendar,
  TrendingUp,
  Activity,
  ChevronDown,
  Save,
  Trash2,
  ExternalLink,
  LogOut,
  Clock,
  Video,
  Link,
  MessageSquare,
  Plus,
  X,
  Menu
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import { useResponsive } from '../providers/ResponsiveProvider';
import { useTransition } from '../providers/AnimationProvider';
import { responsiveTokens } from '../tokens/responsiveTokens';
import LoadingSpinner from './LoadingSpinner';
import MobileHeader from './ui/MobileHeader';
import MobileNavigation from './ui/MobileNavigation';
import UnifiedButton from './ui/UnifiedButton';
import UnifiedCard from './ui/UnifiedCard';
import { supabase } from '../lib/supabase';
import { UserProfile, JobPosting, Candidate, Meeting } from '../types';
import toast from 'react-hot-toast';

interface AdminStats {
  total_users: number;
  active_jobs: number;
  completed_hires: number;
  videos_ready: number;
}

interface UserForVideoUpload {
  user: UserProfile;
  job: JobPosting | null;
}

const AdminContent = () => {
  const { signOut, profile } = useAuth();
  const { isMobile, mobileMenuOpen, setMobileMenuOpen } = useResponsive();
  const transition = useTransition('normal');
  
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs' | 'videos' | 'meetings'>('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({ total_users: 0, active_jobs: 0, completed_hires: 0, videos_ready: 0 });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [usersForVideoUpload, setUsersForVideoUpload] = useState<UserForVideoUpload[]>([]);
  
  // Video upload state
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserForVideoUpload | null>(null);
  const [videoFormData, setVideoFormData] = useState({
    candidates: [
      { name: '', role: '', score: 95, video_url: '', email: '' },
      { name: '', role: '', score: 92, video_url: '', email: '' },
      { name: '', role: '', score: 89, video_url: '', email: '' },
      { name: '', role: '', score: 87, video_url: '', email: '' },
      { name: '', role: '', score: 84, video_url: '', email: '' }
    ]
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load users
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Load jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('job_postings')
        .select('*')
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      // Load meetings
      const { data: meetingsData, error: meetingsError } = await supabase
        .from('meetings')
        .select('*')
        .order('meeting_date', { ascending: false });

      if (meetingsError) throw meetingsError;

      // Load candidates
      const { data: candidatesData, error: candidatesError } = await supabase
        .from('candidates')
        .select('*')
        .order('score', { ascending: false });

      if (candidatesError) throw candidatesError;

      setUsers(usersData || []);
      setJobs(jobsData || []);
      setMeetings(meetingsData || []);
      setCandidates(candidatesData || []);

      // Calculate stats
      const totalUsers = usersData?.length || 0;
      const activeJobs = jobsData?.filter(job => job.status === 'active').length || 0;
      const completedHires = usersData?.filter(user => user.hiring_status === 'Picked').length || 0;
      const videosReady = usersData?.filter(user => user.hiring_status === 'Videos Ready').length || 0;

      setStats({
        total_users: totalUsers,
        active_jobs: activeJobs,
        completed_hires: completedHires,
        videos_ready: videosReady
      });

      // Find users ready for video upload
      const usersReadyForVideos = usersData?.filter(user => 
        user.hiring_status === 'Interviewing'
      ).map(user => {
        const userJob = jobsData?.find(job => job.user_id === user.user_id);
        return { user, job: userJob || null };
      }) || [];

      setUsersForVideoUpload(usersReadyForVideos);

    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          hiring_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('User status updated successfully');
      await loadAdminData();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const uploadVideos = async () => {
    if (!selectedUser?.job) {
      toast.error('No job found for this user');
      return;
    }

    try {
      setLoading(true);

      // Validate candidates
      const validCandidates = videoFormData.candidates.filter(candidate => 
        candidate.name.trim() && candidate.role.trim() && candidate.video_url.trim()
      );

      if (validCandidates.length === 0) {
        toast.error('Please add at least one candidate with name, role, and video URL');
        return;
      }

      // Delete existing candidates for this job
      const { error: deleteError } = await supabase
        .from('candidates')
        .delete()
        .eq('job_id', selectedUser.job.id);

      if (deleteError) throw deleteError;

      // Insert new candidates
      const candidateRecords = validCandidates.map(candidate => ({
        job_id: selectedUser.job!.id,
        name: candidate.name.trim(),
        email: candidate.email.trim() || null,
        role: candidate.role.trim(),
        score: candidate.score,
        video_url: candidate.video_url.trim(),
        status: 'ready' as const
      }));

      const { error: insertError } = await supabase
        .from('candidates')
        .insert(candidateRecords);

      if (insertError) throw insertError;

      // Update user status to Videos Ready
      const { error: statusError } = await supabase
        .from('user_profiles')
        .update({ 
          hiring_status: 'Videos Ready',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', selectedUser.user.user_id);

      if (statusError) throw statusError;

      toast.success('Videos uploaded successfully! 🎉');
      setShowVideoUpload(false);
      setSelectedUser(null);
      await loadAdminData();

    } catch (error) {
      console.error('Error uploading videos:', error);
      toast.error('Failed to upload videos');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'meetings', label: 'Meetings', icon: Calendar }
  ];

  const statusOptions = [
    'Not Started', 'Job Posting', 'Interviewing', 'Videos Ready', 'Picked'
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'Not Started': 'bg-gray-100 text-gray-800',
      'Job Posting': 'bg-blue-100 text-blue-800',
      'Interviewing': 'bg-yellow-100 text-yellow-800',
      'Videos Ready': 'bg-green-100 text-green-800',
      'Picked': 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading && !users.length) {
    return <LoadingSpinner fullScreen text="Loading admin dashboard..." />;
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background-beige">
        {/* Mobile Header */}
        <MobileHeader 
          profile={profile}
          title="Admin Dashboard"
          showNotifications={false}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        {/* Mobile Navigation */}
        <MobileNavigation
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          profile={profile}
          onSignOut={handleSignOut}
          type="admin"
        />

        {/* Mobile Content */}
        <main className={responsiveTokens.spacing['section-x']}>
          <div className="py-4">
            {/* Page Title */}
            <div className="mb-6">
              <h1 className={`${responsiveTokens.typography['heading-1']} text-text-primary mb-2`}>
                {activeTab === 'overview' && 'Admin Overview'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'jobs' && 'Job Management'}
                {activeTab === 'videos' && 'Video Management'}
                {activeTab === 'meetings' && 'Meeting Management'}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <UnifiedButton
                  onClick={loadAdminData}
                  variant="primary"
                  size="sm"
                  loading={loading}
                >
                  <Activity className="w-4 h-4" />
                  Refresh
                </UnifiedButton>
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={transition}
              >
                {activeTab === 'overview' && <OverviewContent stats={stats} />}
                {activeTab === 'users' && <UsersContent users={users} onUpdateStatus={updateUserStatus} />}
                {activeTab === 'jobs' && <JobsContent jobs={jobs} />}
                {activeTab === 'videos' && (
                  <VideosContent 
                    usersForVideoUpload={usersForVideoUpload}
                    onUploadVideos={(user) => {
                      setSelectedUser(user);
                      setShowVideoUpload(true);
                    }}
                  />
                )}
                {activeTab === 'meetings' && <MeetingsContent meetings={meetings} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-background-beige">
      {/* Admin Header */}
      <div className="bg-background-white border-b border-border-light shadow-sm">
        <div className={`${responsiveTokens.spacing['container']} mx-auto max-w-7xl`}>
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`${responsiveTokens.typography['display-2']} text-text-primary mb-2`}>
                  Admin Dashboard
                </h1>
                <p className={`${responsiveTokens.typography['body-lg']} text-text-secondary`}>
                  Welcome back, Glitch! 👑
                </p>
              </div>
              <div className="flex items-center gap-4">
                <UnifiedButton
                  onClick={loadAdminData}
                  variant="primary"
                  loading={loading}
                >
                  <Activity className="w-5 h-5" />
                  Refresh Data
                </UnifiedButton>
                <UnifiedButton
                  onClick={handleSignOut}
                  variant="secondary"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </UnifiedButton>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-border-light">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      flex items-center gap-3 py-4 px-2 border-b-2 font-semibold text-sm transition-colors whitespace-nowrap
                      ${responsiveTokens.interactions['touch-target']}
                      ${activeTab === tab.id
                        ? 'border-primary-violet text-primary-violet bg-primary-violet bg-opacity-5'
                        : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                    {tab.id === 'videos' && usersForVideoUpload.length > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {usersForVideoUpload.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${responsiveTokens.spacing['container']} mx-auto max-w-7xl py-8`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={transition}
          >
            {activeTab === 'overview' && <OverviewContent stats={stats} />}
            {activeTab === 'users' && <UsersContent users={users} onUpdateStatus={updateUserStatus} />}
            {activeTab === 'jobs' && <JobsContent jobs={jobs} />}
            {activeTab === 'videos' && (
              <VideosContent 
                usersForVideoUpload={usersForVideoUpload}
                onUploadVideos={(user) => {
                  setSelectedUser(user);
                  setShowVideoUpload(true);
                }}
              />
            )}
            {activeTab === 'meetings' && <MeetingsContent meetings={meetings} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Video Upload Modal */}
      {showVideoUpload && selectedUser && (
        <VideoUploadModal
          user={selectedUser}
          videoFormData={videoFormData}
          setVideoFormData={setVideoFormData}
          onUpload={uploadVideos}
          onClose={() => {
            setShowVideoUpload(false);
            setSelectedUser(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

// Content Components
const OverviewContent: React.FC<{ stats: AdminStats }> = ({ stats }) => {
  const { isMobile } = useResponsive();
  
  const statCards = [
    { label: 'Total Users', value: stats.total_users, icon: Users, color: 'primary-violet' },
    { label: 'Active Jobs', value: stats.active_jobs, icon: Briefcase, color: 'blue-500' },
    { label: 'Videos Ready', value: stats.videos_ready, icon: Play, color: 'green-500' },
    { label: 'Completed Hires', value: stats.completed_hires, icon: CheckCircle, color: 'purple-500' }
  ];

  return (
    <div className={`${responsiveTokens.spacing['element-gap']} space-y-8`}>
      {/* Stats Cards */}
      <div className={`${responsiveTokens.layout['grid-auto']} ${responsiveTokens.spacing['grid-gap']}`}>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <UnifiedCard key={index} padding={isMobile ? "sm" : "md"} hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${responsiveTokens.typography['caption']} text-text-secondary font-medium mb-2`}>
                    {stat.label}
                  </p>
                  <p className={`${responsiveTokens.typography['display-2']} text-text-primary`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${stat.color} bg-opacity-10 rounded-full flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}`} />
                </div>
              </div>
            </UnifiedCard>
          );
        })}
      </div>
    </div>
  );
};

const UsersContent: React.FC<{ users: UserProfile[]; onUpdateStatus: (userId: string, status: string) => void }> = ({ 
  users, 
  onUpdateStatus 
}) => {
  const { isMobile } = useResponsive();
  
  if (users.length === 0) {
    return (
      <UnifiedCard padding="md">
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <h3 className={`${responsiveTokens.typography['heading-2']} text-text-primary mb-2`}>
            No Users Found
          </h3>
          <p className={`${responsiveTokens.typography['body']} text-text-secondary`}>
            Users will appear here once they sign up.
          </p>
        </div>
      </UnifiedCard>
    );
  }

  return (
    <div className={`${responsiveTokens.spacing['element-gap']} space-y-4`}>
      {users.map((user) => (
        <UnifiedCard key={user.id} padding={isMobile ? "sm" : "md"}>
          <div className={`${isMobile ? 'space-y-3' : 'flex items-center justify-between'}`}>
            <div className={isMobile ? 'space-y-2' : 'flex items-center gap-4'}>
              <div className="w-10 h-10 bg-primary-violet rounded-full flex items-center justify-center text-white font-bold">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className={`${responsiveTokens.typography['body']} font-medium text-text-primary`}>
                  {user.full_name}
                </h4>
                <p className={`${responsiveTokens.typography['caption']} text-text-secondary`}>
                  {user.email}
                </p>
                {user.company && (
                  <p className={`${responsiveTokens.typography['caption']} text-text-secondary`}>
                    {user.company}
                  </p>
                )}
              </div>
            </div>
            <div className={isMobile ? 'flex items-center justify-between' : 'flex items-center gap-4'}>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.hiring_status)}`}>
                {user.hiring_status}
              </span>
              <select
                value={user.hiring_status}
                onChange={(e) => onUpdateStatus(user.user_id, e.target.value)}
                className={`
                  ${responsiveTokens.typography['caption']} border border-border-light rounded-button px-2 py-1
                  ${responsiveTokens.interactions['focus-ring']}
                `}
              >
                {['Not Started', 'Job Posting', 'Interviewing', 'Videos Ready', 'Picked'].map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </UnifiedCard>
      ))}
    </div>
  );
};

const JobsContent: React.FC<{ jobs: JobPosting[] }> = ({ jobs }) => {
  if (jobs.length === 0) {
    return (
      <UnifiedCard padding="md">
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <h3 className={`${responsiveTokens.typography['heading-2']} text-text-primary mb-2`}>
            No Jobs Found
          </h3>
          <p className={`${responsiveTokens.typography['body']} text-text-secondary`}>
            Job postings will appear here once users create them.
          </p>
        </div>
      </UnifiedCard>
    );
  }

  return (
    <div className={`${responsiveTokens.spacing['element-gap']} space-y-4`}>
      {jobs.map((job) => (
        <UnifiedCard key={job.id} padding="md">
          <div>
            <h4 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-2`}>
              {job.title}
            </h4>
          <p className="text-sm text-text-secondary">Languages: {job.requirements?.join(', ')}</p>
          <p className="text-sm text-text-secondary">Type: {job.employment_type}</p>
          <p className="text-sm text-text-secondary">Startup Stage: {job.startup_journey}</p>
          <p className="text-sm text-text-secondary">Skills: {job.skills_experience}</p>
          <p className="text-sm text-text-secondary">
            Hours/Week: {job.hours_per_week} | Start: {job.start_date} | Rate: ${job.hourly_rate}
          </p>
          <p className="text-sm text-text-secondary">Work Style: {job.work_style}</p>
          <p className="text-sm text-text-secondary">Challenges: {job.biggest_challenges}</p>
          <p className="text-sm text-text-secondary">
            Applicant: {job.applicant_name} ({job.applicant_email}) — {job.applicant_role}
          </p>
          <p className="text-sm text-text-secondary">
            Company: <a href={job.company_url} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
              {job.company_url}
            </a>
          </p>
          <p className="text-sm text-text-secondary">{job.company_description}</p>
          <p className="text-sm text-text-secondary italic">
            Notes: {job.notes}
          </p>
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <span>Status: {job.status}</span>
              <span>Created: {new Date(job.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </UnifiedCard>
      ))}
    </div>
  );
};

const VideosContent: React.FC<{ 
  usersForVideoUpload: UserForVideoUpload[]; 
  onUploadVideos: (user: UserForVideoUpload) => void;
}> = ({ usersForVideoUpload, onUploadVideos }) => {
  if (usersForVideoUpload.length === 0) {
    return (
      <UnifiedCard padding="md">
        <div className="text-center py-8">
          <Video className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <h3 className={`${responsiveTokens.typography['heading-2']} text-text-primary mb-2`}>
            No Videos to Upload
          </h3>
          <p className={`${responsiveTokens.typography['body']} text-text-secondary`}>
            Users ready for video upload will appear here.
          </p>
        </div>
      </UnifiedCard>
    );
  }

  return (
    <div className={`${responsiveTokens.spacing['element-gap']} space-y-4`}>
      {usersForVideoUpload.map((userForUpload) => (
        <UnifiedCard key={userForUpload.user.id} padding="md">
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-1`}>
                {userForUpload.user.full_name}
              </h4>
              <p className={`${responsiveTokens.typography['body']} text-text-secondary mb-1`}>
                {userForUpload.user.email}
              </p>
              {userForUpload.job && (
                <p className={`${responsiveTokens.typography['caption']} text-text-secondary`}>
                  Job: {userForUpload.job.title}
                </p>
              )}
            </div>
            <UnifiedButton
              onClick={() => onUploadVideos(userForUpload)}
              variant="primary"
              size="sm"
            >
              <Upload className="w-4 h-4" />
              Upload Videos
            </UnifiedButton>
          </div>
        </UnifiedCard>
      ))}
    </div>
  );
};

const MeetingsContent: React.FC<{ meetings: Meeting[] }> = ({ meetings }) => {
  if (meetings.length === 0) {
    return (
      <UnifiedCard padding="md">
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <h3 className={`${responsiveTokens.typography['heading-2']} text-text-primary mb-2`}>
            No Meetings Found
          </h3>
          <p className={`${responsiveTokens.typography['body']} text-text-secondary`}>
            Scheduled meetings will appear here.
          </p>
        </div>
      </UnifiedCard>
    );
  }

  return (
    <div className={`${responsiveTokens.spacing['element-gap']} space-y-4`}>
      {meetings.map((meeting) => (
        <UnifiedCard key={meeting.id} padding="md">
          <div>
            <h4 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-2`}>
              {meeting.user_name}
            </h4>
            <p className={`${responsiveTokens.typography['body']} text-text-secondary mb-2`}>
              {meeting.user_email}
            </p>
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <span>Date: {meeting.meeting_date}</span>
              <span>Time: {meeting.meeting_time}</span>
              <span>Status: {meeting.status}</span>
              <span>Meeting: {meeting.meeting_link}</span>
            </div>
          </div>
        </UnifiedCard>
      ))}
    </div>
  );
};

// Video Upload Modal Component
const VideoUploadModal: React.FC<{
  user: UserForVideoUpload;
  videoFormData: any;
  setVideoFormData: (data: any) => void;
  onUpload: () => void;
  onClose: () => void;
  loading: boolean;
}> = ({ user, videoFormData, setVideoFormData, onUpload, onClose, loading }) => {
  const { isMobile } = useResponsive();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`
        bg-background-white rounded-card shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto
        ${responsiveTokens.spacing['card-p']}
      `}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`${responsiveTokens.typography['heading-2']} text-text-primary`}>
            Upload Videos for {user.user.full_name}
          </h3>
          <button
            onClick={onClose}
            className={`
              p-2 rounded-button hover:bg-background-beige transition-colors
              ${responsiveTokens.interactions['touch-target']}
            `}
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <div className="space-y-6">
          {videoFormData.candidates.map((candidate: any, index: number) => (
            <UnifiedCard key={index} padding="sm">
              <h4 className={`${responsiveTokens.typography['heading-4']} text-text-primary mb-4`}>
                Candidate {index + 1} (Score: {candidate.score})
              </h4>
              <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-2 gap-4'}`}>
                <input
                  type="text"
                  placeholder="Candidate Name"
                  value={candidate.name}
                  onChange={(e) => {
                    const newCandidates = [...videoFormData.candidates];
                    newCandidates[index].name = e.target.value;
                    setVideoFormData({ ...videoFormData, candidates: newCandidates });
                  }}
                  className={`
                    w-full px-3 py-2 border border-border-light rounded-button
                    ${responsiveTokens.typography['body']}
                    ${responsiveTokens.interactions['focus-ring']}
                  `}
                />
                <input
                  type="text"
                  placeholder="Role/Position"
                  value={candidate.role}
                  onChange={(e) => {
                    const newCandidates = [...videoFormData.candidates];
                    newCandidates[index].role = e.target.value;
                    setVideoFormData({ ...videoFormData, candidates: newCandidates });
                  }}
                  className={`
                    w-full px-3 py-2 border border-border-light rounded-button
                    ${responsiveTokens.typography['body']}
                    ${responsiveTokens.interactions['focus-ring']}
                  `}
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={candidate.email}
                  onChange={(e) => {
                    const newCandidates = [...videoFormData.candidates];
                    newCandidates[index].email = e.target.value;
                    setVideoFormData({ ...videoFormData, candidates: newCandidates });
                  }}
                  className={`
                    w-full px-3 py-2 border border-border-light rounded-button
                    ${responsiveTokens.typography['body']}
                    ${responsiveTokens.interactions['focus-ring']}
                  `}
                />
                <input
                  type="url"
                  placeholder="Video URL"
                  value={candidate.video_url}
                  onChange={(e) => {
                    const newCandidates = [...videoFormData.candidates];
                    newCandidates[index].video_url = e.target.value;
                    setVideoFormData({ ...videoFormData, candidates: newCandidates });
                  }}
                  className={`
                    w-full px-3 py-2 border border-border-light rounded-button
                    ${responsiveTokens.typography['body']}
                    ${responsiveTokens.interactions['focus-ring']}
                  `}
                />
              </div>
            </UnifiedCard>
          ))}
        </div>

        <div className="flex items-center justify-end gap-4 mt-8">
          <UnifiedButton onClick={onClose} variant="secondary">
            Cancel
          </UnifiedButton>
          <UnifiedButton onClick={onUpload} variant="primary" loading={loading}>
            <Upload className="w-4 h-4" />
            Upload Videos
          </UnifiedButton>
        </div>
      </div>
    </div>
  );
};

// Helper function
const getStatusColor = (status: string) => {
  const colors = {
    'Not Started': 'bg-gray-100 text-gray-800',
    'Job Posting': 'bg-blue-100 text-blue-800',
    'Interviewing': 'bg-yellow-100 text-yellow-800',
    'Videos Ready': 'bg-green-100 text-green-800',
    'Picked': 'bg-purple-100 text-purple-800'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export default AdminContent;

