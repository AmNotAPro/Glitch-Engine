import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'glitch-engine@1.0.0'
    }
  }
});

// Connection health check
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase connection failed:', error.message);
  } else {
    console.log('✅ Supabase connected successfully');
  }
});

// Types for the application
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

// Auth Context
interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  initializing: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing authentication...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session error:', error);
          if (mounted) {
            setUser(null);
            setProfile(null);
            setLoading(false);
            setInitializing(false);
          }
          return;
        }

        if (mounted) {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('✅ User session found:', session.user.email);
            await fetchProfile(session.user.id);
          } else {
            console.log('ℹ️ No user session found');
            setProfile(null);
            setLoading(false);
          }
          
          setInitializing(false);
        }
      } catch (error: any) {
        console.error('❌ Auth initialization failed:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          setInitializing(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user');
      
      setUser(session?.user ?? null);
      
      if (session?.user && event !== 'TOKEN_REFRESHED') {
        console.log('✅ User authenticated:', session.user.email);
        await fetchProfile(session.user.id);
        setInitializing(false); // ✅ FIX: Set initializing to false after profile fetch
      } else if (!session?.user) {
        console.log('ℹ️ User signed out, clearing profile');
        setProfile(null);
        setLoading(false);
        setInitializing(false); // ✅ FIX: Set initializing to false when signed out
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔍 Fetching profile for user:', userId);
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('❌ Profile fetch error:', error);
        
        // Handle specific error cases
        if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
          console.warn('⚠️ Database tables not set up yet, continuing without profile');
          setProfile(null);
          setLoading(false);
          return;
        }
        
        // For other errors, still continue but log them
        console.warn('⚠️ Profile fetch failed:', error.message);
        setProfile(null);
        setLoading(false);
        return;
      }
      
      console.log('✅ Profile loaded:', data);
      setProfile(data);
    } catch (error) {
      console.error('💥 Critical profile error:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Sign in error:', error);
        return { error };
      }
      
      console.log('✅ Sign in successful:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('💥 Sign in exception:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('📝 Attempting sign up for:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'Client'
          }
        }
      });
      
      if (error) {
        console.error('❌ Sign up error:', error);
        return { error };
      }
      
      console.log('✅ Sign up successful:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('💥 Sign up exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    initializing,
    isAdmin: profile?.role === 'Admin',
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// useAuth hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

