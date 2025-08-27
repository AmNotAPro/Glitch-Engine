import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  Play, 
  ArrowRight,
  Briefcase,
  Star,
  MessageSquare,
  Settings,
  LogOut,
  Zap,
  History,
  FileText,
  Home,
  User,
  Plus,
  Video,
  Award,
  Eye,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useResponsive } from '../providers/ResponsiveProvider';
import { useTransition } from '../providers/AnimationProvider';
import { supabase } from '../lib/supabase';
import { responsiveTokens } from '../tokens/responsiveTokens';
import LoadingSpinner from './LoadingSpinner';
import SkeletonLoader from './SkeletonLoader';
import AdminContent from './AdminContent';
import IntakeForm from './IntakeForm';
import MobileHeader from './ui/MobileHeader';
import MobileNavigation from './ui/MobileNavigation';
import UnifiedButton from './ui/UnifiedButton';
import UnifiedCard from './ui/UnifiedCard';
import toast from 'react-hot-toast';

interface Candidate {
  id: string;
  name: string;
  role: string;
  score: number;
  video_url?: string;
  email?: string;
  status: string;
}

interface JobWithCandidates {
  id: string;
  title: string;
  status: string;
  created_at: string;
  candidates: Candidate[];
  selected_candidate?: Candidate;
}

const Dashboard = () => {
  const { user, profile, signOut, isAdmin, updateProfile } = useAuth();
  const { isMobile, mobileMenuOpen, setMobileMenuOpen } = useResponsive();
  const transition = useTransition('normal');
  
  // Create a simple refresh function since refreshProfile isn't available
  const refreshProfile = async () => {
    // This will be handled by the useAuth hook's internal logic
    // The profile will update automatically when the user data changes
  };
  
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'intake' | 'candidates' | 'history'>('overview');
  const [jobHistory, setJobHistory] = useState<JobWithCandidates[]>([]);
  const [watchingVideo, setWatchingVideo] = useState<Candidate | null>(null);
  
  // Add effect to watch for profile changes and update UI accordingly
  useEffect(() => {
    if (profile?.hiring_status) {
      console.log('📊 Profile status changed to:', profile.hiring_status);
      
      // If status changed to Videos Ready, switch to candidates tab
      if (profile.hiring_status === 'Videos Ready' && activeTab === 'overview') {
        setActiveTab('candidates');
      }
      
      // If status changed to Picked, switch to history tab
      if (profile.hiring_status === 'Picked' && activeTab === 'candidates') {
        setActiveTab('history');
      }
    }
  }, [profile?.hiring_status]);

  useEffect(() => {
    if (user && profile) {
      loadUserData();
    }
  }, [user, profile]);

  const loadUserData = async () => {
    if (!user || !profile) return;
    
    try {
      setLoading(true);
      
      // Only load candidates if user has videos ready
      if (profile?.hiring_status === 'Videos Ready' || profile?.hiring_status === 'Picked') {
        await loadCandidates();
      }
      
      // Load job history
      await loadJobHistory();
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCandidates = async () => {
    if (!user) return;

    try {
      // Get user's job posting
      const { data: jobs, error: jobError } = await supabase
        .from('job_postings')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (jobError) throw jobError;
      
      if (jobs && jobs.length > 0) {
        // Get candidates for the job
        const { data: candidatesData, error: candidatesError } = await supabase
          .from('candidates')
          .select('*')
          .eq('job_id', jobs[0].id)
          .eq('status', 'ready')
          .order('score', { ascending: false });

        if (candidatesError) throw candidatesError;
        
        setCandidates(candidatesData || []);
      }
    } catch (error) {
      console.error('Error loading candidates:', error);
      toast.error('Failed to load candidates');
    }
  };

  const loadJobHistory = async () => {
    if (!user) return;

    try {
      const { data: jobs, error } = await supabase
        .from('job_postings')
        .select(`
          *,
          candidates (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const jobsWithCandidates: JobWithCandidates[] = (jobs || []).map(job => ({
        ...job,
        candidates: job.candidates || [],
        selected_candidate: job.candidates?.find((c: any) => c.status === 'selected')
      }));

      setJobHistory(jobsWithCandidates);
    } catch (error) {
      console.error('Error loading job history:', error);
      toast.error('Failed to load job history');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const canCreateNewJob = () => {
    return !profile?.hiring_status || 
           profile.hiring_status === 'Not Started' || 
           profile.hiring_status === 'Picked';
  };

  const selectCandidate = async (candidate: Candidate) => {
    if (!user) return;

    try {
      // Update candidate status to selected
      const { error: candidateError } = await supabase
        .from('candidates')
        .update({ status: 'selected' })
        .eq('id', candidate.id);

      if (candidateError) throw candidateError;

      // Update user's hiring status to Picked
      await updateProfile({ hiring_status: 'Picked' });

      setSelectedCandidate(candidate);
      toast.success(`${candidate.name} has been selected!`);
      
      // Refresh data
      await loadUserData();
    } catch (error) {
      console.error('Error selecting candidate:', error);
      toast.error('Failed to select candidate');
    }
  };

  // Redirect admin users to AdminContent
  if (isAdmin) {
    return <AdminContent />;
  }

  if (loading && !profile) {
    return <LoadingSpinner fullScreen text="Loading your dashboard..." />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background-beige flex items-center justify-center">
        <div className="text-center">
          <h2 className={`${responsiveTokens.typography['heading-1']} text-text-primary mb-4`}>
            Profile Not Found
          </h2>
          <p className={`${responsiveTokens.typography['body']} text-text-secondary mb-6`}>
            There was an issue loading your profile.
          </p>
          <UnifiedButton onClick={handleSignOut} variant="primary">
            Sign Out
          </UnifiedButton>
        </div>
      </div>
    );
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background-beige">
        {/* Mobile Header */}
        <MobileHeader 
          profile={profile}
          title="Dashboard"
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
          type="dashboard"
        />

        {/* Mobile Content */}
        <main className={responsiveTokens.spacing['section-x']}>
          <div className="py-4">
            {/* Page Title */}
            <div className="mb-6">
              <h1 className={`${responsiveTokens.typography['heading-1']} text-text-primary mb-2`}>
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'intake' && 'Job Intake Form'}
                {activeTab === 'candidates' && 'Your Candidates'}
                {activeTab === 'history' && 'Hiring History'}
              </h1>
              <p className={`${responsiveTokens.typography['body']} text-text-secondary`}>
                {activeTab === 'overview' && 'Track your hiring progress'}
                {activeTab === 'intake' && 'Tell us about the role you want to fill'}
                {activeTab === 'candidates' && 'Review and select your top candidates'}
                {activeTab === 'history' && 'View all your previous job postings'}
              </p>
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
                {activeTab === 'overview' && <OverviewContent profile={profile} candidates={candidates} />}
                {activeTab === 'intake' && <IntakeContent profile={profile} canCreateNewJob={canCreateNewJob} />}
                {activeTab === 'candidates' && <CandidatesContent candidates={candidates} onSelectCandidate={selectCandidate} />}
                {activeTab === 'history' && <HistoryContent jobHistory={jobHistory} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-background-beige flex">
      {/* Desktop Sidebar */}
      <div className="w-64 bg-background-white border-r border-border-light flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border-light">
          <div className="flex items-center gap-3">
            <img 
              src="https://stackblitz.com/storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCRFRwZkFFPSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--06ccbac649e5c26a8fdc4496fc70391dbfe7b9d7//Screenshot%202025-05-20%20033058.png" 
              alt="Glitch Engine Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className={`${responsiveTokens.typography['heading-3']} text-text-primary`}>
              Glitch Engine
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-button text-left transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-primary-violet text-white shadow-card'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background-beige'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className={responsiveTokens.typography['body']}>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('intake')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-button text-left transition-all duration-200 ${
                activeTab === 'intake'
                  ? 'bg-primary-violet text-white shadow-card'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background-beige'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className={responsiveTokens.typography['body']}>Job Intake</span>
              {canCreateNewJob() && (
                <div className="w-2 h-2 bg-accent-yellow rounded-full ml-auto"></div>
              )}
            </button>

            {/* Candidates Tab - Only show if user has videos ready or picked */}
            {(profile?.hiring_status === 'Videos Ready' || profile?.hiring_status === 'Picked') && (
              <button
                onClick={() => setActiveTab('candidates')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-button text-left transition-all duration-200 ${
                  activeTab === 'candidates'
                    ? 'bg-primary-violet text-white shadow-card'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-beige'
                }`}
              >
                <Video className="w-5 h-5" />
                <span className={responsiveTokens.typography['body']}>Candidates</span>
                {candidates.length > 0 && (
                  <span className="ml-auto text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                    {candidates.length}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-button text-left transition-all duration-200 ${
                activeTab === 'history'
                  ? 'bg-primary-violet text-white shadow-card'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background-beige'
              }`}
            >
              <History className="w-5 h-5" />
              <span className={responsiveTokens.typography['body']}>History</span>
              {jobHistory.length > 0 && (
                <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  {jobHistory.length}
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-6 border-t border-border-light">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-violet rounded-full flex items-center justify-center text-white font-bold">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`${responsiveTokens.typography['body']} font-medium text-text-primary truncate`}>
                {profile.full_name}
              </p>
              <p className={`${responsiveTokens.typography['caption']} text-text-secondary truncate`}>
                {profile.email}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleSignOut}
            className={`
              w-full flex items-center gap-3 px-4 py-2 text-text-secondary 
              hover:text-text-primary hover:bg-background-beige rounded-button transition-colors
              ${responsiveTokens.interactions['touch-target']}
            `}
          >
            <LogOut className="w-4 h-4" />
            <span className={responsiveTokens.typography['body']}>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Desktop Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-background-white border-b border-border-light p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`${responsiveTokens.typography['heading-1']} text-text-primary`}>
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'intake' && 'Job Intake Form'}
                {activeTab === 'candidates' && 'Your Candidates'}
                {activeTab === 'history' && 'Hiring History'}
              </h1>
              <p className={`${responsiveTokens.typography['body']} text-text-secondary mt-1`}>
                {activeTab === 'overview' && 'Track your hiring progress'}
                {activeTab === 'intake' && 'Tell us about the role you want to fill'}
                {activeTab === 'candidates' && 'Review and select your top candidates'}
                {activeTab === 'history' && 'View all your previous job postings'}
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={transition}
            >
              {activeTab === 'overview' && <OverviewContent profile={profile} candidates={candidates} />}
              {activeTab === 'intake' && <IntakeContent profile={profile} canCreateNewJob={canCreateNewJob} />}
              {activeTab === 'candidates' && <CandidatesContent candidates={candidates} onSelectCandidate={selectCandidate} />}
              {activeTab === 'history' && <HistoryContent jobHistory={jobHistory} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// Content Components (these would be the existing content from the original Dashboard)
const OverviewContent: React.FC<{ profile: any; candidates: Candidate[] }> = ({ profile, candidates }) => {
  const getStatusStep = (status: string) => {
    const steps = ['Not Started', 'Job Posting', 'Interviewing', 'Videos Ready', 'Picked'];
    return steps.indexOf(status) + 1;
  };

  return (
    <div className={`${responsiveTokens.spacing['element-gap']} space-y-6`}>
      {/* Enhanced Progress Bar */}
      <UnifiedCard padding="lg">
        <h3 className={`${responsiveTokens.typography['heading-2']} text-text-primary mb-6`}>
          Hiring Progress
        </h3>
        
        {/* Progress Steps - Responsive Design */}
        <div className="relative mb-8 px-2 sm:px-4">
          {/* Progress Line Background - Hidden on mobile for cleaner look */}
          <div className="hidden md:block absolute top-8 left-16 right-16 h-1 bg-gray-300 rounded-full"></div>
          
          {/* Steps */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0 items-center relative">
            {/* Not Started */}
            <div className="flex flex-col items-center">
              <motion.div 
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  getStatusStep(profile?.hiring_status || 'Not Started') > 1
                    ? 'bg-green-500 text-white border-green-500' 
                    : getStatusStep(profile?.hiring_status || 'Not Started') === 1
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-gray-200 text-gray-500 border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FileText className="w-4 h-4 sm:w-6 sm:h-6" />
              </motion.div>
              <span className={`text-xs sm:text-sm mt-2 sm:mt-4 font-medium text-center ${
                getStatusStep(profile?.hiring_status || 'Not Started') > 1
                  ? 'text-green-600' 
                  : getStatusStep(profile?.hiring_status || 'Not Started') === 1
                  ? 'text-orange-600'
                  : 'text-gray-500'
              }`}>
                Not Started
              </span>
            </div>
            
            {/* Job Posting */}
            <div className="flex flex-col items-center">
              <motion.div 
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  getStatusStep(profile?.hiring_status || 'Not Started') > 2
                    ? 'bg-green-500 text-white border-green-500' 
                    : getStatusStep(profile?.hiring_status || 'Not Started') === 2
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-gray-200 text-gray-500 border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Briefcase className="w-4 h-4 sm:w-6 sm:h-6" />
              </motion.div>
              <span className={`text-xs sm:text-sm mt-2 sm:mt-4 font-medium text-center ${
                getStatusStep(profile?.hiring_status || 'Not Started') > 2
                  ? 'text-green-600' 
                  : getStatusStep(profile?.hiring_status || 'Not Started') === 2
                  ? 'text-orange-600'
                  : 'text-gray-500'
              }`}>
                Job Posting
              </span>
            </div>
            
            {/* Interviewing */}
            <div className="flex flex-col items-center">
              <motion.div 
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  getStatusStep(profile?.hiring_status || 'Not Started') > 3
                    ? 'bg-green-500 text-white border-green-500' 
                    : getStatusStep(profile?.hiring_status || 'Not Started') === 3
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-gray-200 text-gray-500 border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="w-4 h-4 sm:w-6 sm:h-6" />
              </motion.div>
              <span className={`text-xs sm:text-sm mt-2 sm:mt-4 font-medium text-center ${
                getStatusStep(profile?.hiring_status || 'Not Started') > 3
                  ? 'text-green-600' 
                  : getStatusStep(profile?.hiring_status || 'Not Started') === 3
                  ? 'text-orange-600'
                  : 'text-gray-500'
              }`}>
                Interviewing
              </span>
            </div>
            
            {/* Videos Ready */}
            <div className="flex flex-col items-center">
              <motion.div 
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  getStatusStep(profile?.hiring_status || 'Not Started') > 4
                    ? 'bg-green-500 text-white border-green-500' 
                    : getStatusStep(profile?.hiring_status || 'Not Started') === 4
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-gray-200 text-gray-500 border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-4 h-4 sm:w-6 sm:h-6" />
              </motion.div>
              <span className={`text-xs sm:text-sm mt-2 sm:mt-4 font-medium text-center ${
                getStatusStep(profile?.hiring_status || 'Not Started') > 4
                  ? 'text-green-600' 
                  : getStatusStep(profile?.hiring_status || 'Not Started') === 4
                  ? 'text-orange-600'
                  : 'text-gray-500'
              }`}>
                Videos Ready
              </span>
            </div>
            
            {/* Picked */}
            <div className="flex flex-col items-center">
              <motion.div 
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  getStatusStep(profile?.hiring_status || 'Not Started') === 5
                    ? 'bg-green-500 text-white border-green-500' 
                    : 'bg-gray-200 text-gray-500 border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
              </motion.div>
              <span className={`text-xs sm:text-sm mt-2 sm:mt-4 font-medium text-center ${
                getStatusStep(profile?.hiring_status || 'Not Started') === 5
                  ? 'text-green-600' 
                  : 'text-gray-500'
              }`}>
                Picked
              </span>
            </div>
          </div>
        </div>

        {/* Current Status Description - Enhanced with Responsive Design */}
        <div className="bg-background-beige rounded-lg p-4 sm:p-6">
          {profile?.hiring_status === 'Not Started' && (
            <div className="text-center">
              <motion.div
                className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </motion.div>
              <h4 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-2`}>
                Ready to get started?
              </h4>
              <p className={`${responsiveTokens.typography['body']} text-text-secondary mb-4`}>
                Fill out the job intake form to begin your hiring process.
              </p>
              <UnifiedButton 
                onClick={() => {/* Navigate to intake tab */}}
                variant="primary"
                size="md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start Job Intake
              </UnifiedButton>
            </div>
          )}

          {profile?.hiring_status === 'Job Posting' && (
            <div className="text-center">
              <motion.div
                className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
              >
                <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </motion.div>
              <h4 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-2`}>
                Processing Your Job
              </h4>
              <p className={`${responsiveTokens.typography['body']} text-text-secondary`}>
                Our team is reviewing your requirements and preparing to source candidates.
              </p>
            </div>
          )}

          {profile?.hiring_status === 'Interviewing' && (
            <div className="text-center">
              <motion.div
                className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
              </motion.div>
              <h4 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-2`}>
                Interviews in Progress
              </h4>
              <p className={`${responsiveTokens.typography['body']} text-text-secondary`}>
                We're conducting interviews with qualified candidates for your position.
              </p>
            </div>
          )}

          {profile?.hiring_status === 'Videos Ready' && (
            <div className="text-center">
              <motion.div
                className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{ 
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity
                }}
              >
                <Play className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </motion.div>
              <h4 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-2`}>
                Candidate Videos Ready!
              </h4>
              <p className={`${responsiveTokens.typography['body']} text-text-secondary mb-4`}>
                Your candidate videos are ready for review. Check the Candidates tab to see them.
              </p>
              <UnifiedButton 
                onClick={() => {/* Navigate to candidates tab */}}
                variant="primary"
                size="md"
              >
                <Video className="w-4 h-4 mr-2" />
                Review Candidates
              </UnifiedButton>
            </div>
          )}

          {profile?.hiring_status === 'Picked' && (
            <div className="text-center">
              <motion.div
                className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity },
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" }
                }}
              >
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </motion.div>
              <h4 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-2`}>
                Hiring Complete! 🎉
              </h4>
              <p className={`${responsiveTokens.typography['body']} text-text-secondary mb-4`}>
                Congratulations! You've successfully completed your hiring process.
              </p>
              <UnifiedButton 
                onClick={() => {/* Navigate to intake tab */}}
                variant="primary"
                size="md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start New Job
              </UnifiedButton>
            </div>
          )}
        </div>
      </UnifiedCard>
      
      {candidates.length > 0 && (
        <UnifiedCard padding="md">
          <h3 className={`${responsiveTokens.typography['heading-2']} text-text-primary mb-4`}>
            Available Candidates
          </h3>
          <p className={`${responsiveTokens.typography['body']} text-text-secondary`}>
            You have {candidates.length} candidates ready for review.
          </p>
        </UnifiedCard>
      )}
    </div>
  );
};

const IntakeContent: React.FC<{ profile: any; canCreateNewJob: () => boolean }> = ({ profile, canCreateNewJob }) => {
  if (!canCreateNewJob()) {
    return (
      <UnifiedCard padding="md">
        <h3 className={`${responsiveTokens.typography['heading-2']} text-text-primary mb-4`}>
          Job Intake Not Available
        </h3>
        <p className={`${responsiveTokens.typography['body']} text-text-secondary`}>
          You already have an active job posting. Please complete your current hiring process before creating a new job.
        </p>
      </UnifiedCard>
    );
  }

  return <IntakeForm />;
};

const CandidatesContent: React.FC<{ candidates: Candidate[]; onSelectCandidate: (candidate: Candidate) => void }> = ({ 
  candidates, 
  onSelectCandidate 
}) => {
  if (candidates.length === 0) {
    return (
      <UnifiedCard padding="md">
        <h3 className={`${responsiveTokens.typography['heading-2']} text-text-primary mb-4`}>
          No Candidates Available
        </h3>
        <p className={`${responsiveTokens.typography['body']} text-text-secondary`}>
          Your candidates are still being prepared. You'll be notified when they're ready for review.
        </p>
      </UnifiedCard>
    );
  }

  return (
    <div className={`${responsiveTokens.layout['grid-auto']} ${responsiveTokens.spacing['grid-gap']}`}>
  {candidates.map((candidate) => (
    <UnifiedCard key={candidate.id} padding="md" hover>
      <div className="text-center">
        <h4 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-2`}>
          {candidate.name}
        </h4>
        <p className={`${responsiveTokens.typography['body']} text-text-secondary mb-2`}>
          {candidate.role}
        </p>
        <p className={`${responsiveTokens.typography['body']} text-primary-violet font-semibold mb-2`}>
          Score: {candidate.score}/100
        </p>

        {candidate.video_url && (
          <a
            href={candidate.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${responsiveTokens.typography['body-sm']} text-blue-600 hover:underline mb-4 block`}
          >
            🎥 Watch Video Interview
          </a>
        )}

        <UnifiedButton 
          onClick={() => onSelectCandidate(candidate)}
          variant="primary"
          size="sm"
        >
          Select Candidate
        </UnifiedButton>
      </div>
    </UnifiedCard>
  ))}
</div>

    // <div className={`${responsiveTokens.layout['grid-auto']} ${responsiveTokens.spacing['grid-gap']}`}>
    //   {candidates.map((candidate) => (
    //     <UnifiedCard key={candidate.id} padding="md" hover>
    //       <div className="text-center">
    //         <h4 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-2`}>
    //           {candidate.name}
    //         </h4>
    //         <p className={`${responsiveTokens.typography['body']} text-text-secondary mb-2`}>
    //           {candidate.role}
    //         </p>
    //         <p className={`${responsiveTokens.typography['body']} text-primary-violet font-semibold mb-4`}>
    //           Score: {candidate.score}/100
    //         </p>
    //         <UnifiedButton 
    //           onClick={() => onSelectCandidate(candidate)}
    //           variant="primary"
    //           size="sm"
    //         >
    //           Select Candidate
    //         </UnifiedButton>
    //       </div>
    //     </UnifiedCard>
    //   ))}
    // </div>
  );
};

const HistoryContent: React.FC<{ jobHistory: JobWithCandidates[] }> = ({ jobHistory }) => {
  if (jobHistory.length === 0) {
    return (
      <UnifiedCard padding="md">
        <h3 className={`${responsiveTokens.typography['heading-2']} text-text-primary mb-4`}>
          No Hiring History
        </h3>
        <p className={`${responsiveTokens.typography['body']} text-text-secondary`}>
          You haven't completed any job postings yet. Your hiring history will appear here once you complete your first hire.
        </p>
      </UnifiedCard>
    );
  }

  return (
    <div className={`${responsiveTokens.spacing['element-gap']} space-y-4`}>
      {jobHistory.map((job) => (
        <UnifiedCard key={job.id} padding="md">
          <h4 className={`${responsiveTokens.typography['heading-3']} text-text-primary mb-2`}>
            {job.title}
          </h4>
          <p className={`${responsiveTokens.typography['body']} text-text-secondary mb-2`}>
            Status: {job.status}
          </p>
          <p className={`${responsiveTokens.typography['caption']} text-text-secondary`}>
            Created: {new Date(job.created_at).toLocaleDateString()}
          </p>
          {job.selected_candidate && (
            <p className={`${responsiveTokens.typography['body']} text-green-600 mt-2`}>
              Selected: {job.selected_candidate.name}
            </p>
          )}
        </UnifiedCard>
      ))}
    </div>
  );
};

export default Dashboard;

