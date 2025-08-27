import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

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
 refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider
export function AuthProvider({ children }: { children: ReactNode }) {
 const [user, setUser] = useState<any>(null);
 const [profile, setProfile] = useState<UserProfile | null>(null);
 const [loading, setLoading] = useState(false);
 const [initializing, setInitializing] = useState(true);
 const [profileFetched, setProfileFetched] = useState(false);

 const fetchProfile = async (userId: string): Promise<boolean> => {
   try {
     console.log('🔍 Fetching profile for user:', userId);
     setLoading(true);
     
     const { data, error } = await Promise.race([
       supabase.from('user_profiles').select('*').eq('user_id', userId).single(),
       new Promise((_, reject) => 
         setTimeout(() => reject(new Error('Profile fetch timeout')), 8000)
       )
     ]) as any;

     if (error) {
       console.error('❌ Profile fetch error:', error);
       if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
         console.warn('⚠️ Database tables not set up yet, continuing without profile');
       } else {
         console.warn('⚠️ Profile fetch failed:', error.message);
       }
       setProfile(null);
       return false;
     }
     
     console.log('✅ Profile loaded:', data);
     setProfile(data);
     return true;
   } catch (error: any) {
     console.error('💥 Profile fetch error or timeout:', error);
     setProfile(null);
     return false;
   } finally {
     setLoading(false);
     setProfileFetched(true);
     console.log('🏁 Profile fetch completed');
   }
 };

 const refreshProfile = async () => {
   if (user?.id) {
     await fetchProfile(user.id);
   }
 };

 useEffect(() => {
   let mounted = true;
   let authHandled = false;

   // Single initialization function
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
        setProfileFetched(true);
      }
      return;
    }

    if (mounted) {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('✅ User session found:', session.user.email);
        await fetchProfile(session.user.id);
        // CRITICAL FIX: Set initializing to false after profile fetch
        setInitializing(false);
        authHandled = true;
      } else {
        console.log('ℹ️ No user session found');
        setProfile(null);
        setLoading(false);
        setProfileFetched(true);
        setInitializing(false);
      }
    }
  } catch (error: any) {
    console.error('❌ Auth initialization failed:', error);
    if (mounted) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      setInitializing(false);
      setProfileFetched(true);
    }
  }
};

   // Auth state change listener
const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
  if (!mounted) return;

  console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user');
  
  // Skip token refresh but ALWAYS handle sign out
  if (event === 'TOKEN_REFRESHED') {
    return;
  }
  
  // Handle sign out immediately (don't check authHandled)
  if (event === 'SIGNED_OUT') {
    console.log('ℹ️ User signed out, clearing profile');
    setUser(null);
    setProfile(null);
    setLoading(false);
    setInitializing(false);
    setProfileFetched(true);
    authHandled = false; // Reset for next session
    return;
  }
  
  // For other events, check if already handled
  if (authHandled) return;
  
  setUser(session?.user ?? null);
  
  if (session?.user) {
    console.log('✅ User authenticated via auth change:', session.user.email);
    setProfileFetched(false);
    await fetchProfile(session.user.id);
    setInitializing(false);
    authHandled = true;
  }
});

   // Start initialization
   initializeAuth();

   // Safety timeout
   const safetyTimeout = setTimeout(() => {
     if (mounted && initializing) {
       console.warn('⚠️ Auth initialization timeout, forcing completion');
       setInitializing(false);
       setLoading(false);
       setProfileFetched(true);
     }
   }, 15000);

   return () => {
     mounted = false;
     clearTimeout(safetyTimeout);
     subscription.unsubscribe();
   };
 }, []);

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

 // Computed loading state - true if initializing OR if authenticated but profile not fetched
 const isLoading = initializing || (!!user && !profileFetched);

 const value: AuthContextType = {
   user,
   profile,
   loading: isLoading,
   isAuthenticated: !!user,
   initializing: isLoading, // Use computed loading for initializing
   isAdmin: profile?.role === 'Admin',
   signIn,
   signUp,
   signOut,
   refreshProfile,
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













// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//     flowType: 'pkce'
//   },
//   global: {
//     headers: {
//       'X-Client-Info': 'glitch-engine@1.0.0'
//     }
//   }
// });

// // Connection health check
// supabase.auth.getSession().then(({ data, error }) => {
//   if (error) {
//     console.error('❌ Supabase connection failed:', error.message);
//   } else {
//     console.log('✅ Supabase connected successfully');
//   }
// });

// // Types for the application
// export type UserRole = 'Client' | 'Admin';
// export type HiringStatus = 'Not Started' | 'Job Posting' | 'Interviewing' | 'Videos Ready' | 'Picked';
// export type JobStatus = 'draft' | 'active' | 'interviewing' | 'completed';
// export type CandidateStatus = 'pending' | 'ready' | 'selected' | 'rejected';
// export type MeetingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

// export interface UserProfile {
//   id: string;
//   user_id: string;
//   email: string;
//   full_name: string;
//   role: UserRole;
//   hiring_status: HiringStatus;
//   avatar_url?: string;
//   company?: string;
//   created_at: string;
//   updated_at: string;
// }

// export interface JobPosting {
//   id: string;
//   user_id: string;
//   title: string;
//   description: string;
//   requirements: string[];
//   salary_range?: string;
//   location?: string;
//   employment_type: string;
//   status: JobStatus;
//   created_at: string;
//   updated_at: string;
// }

// export interface Candidate {
//   id: string;
//   job_id: string;
//   name: string;
//   email?: string;
//   role: string;
//   score: number;
//   video_url?: string;
//   thumbnail_url?: string;
//   status: CandidateStatus;
//   created_at: string;
//   updated_at: string;
// }

// export interface Meeting {
//   id: string;
//   user_id: string;
//   user_name: string;
//   user_email: string;
//   meeting_date: string;
//   meeting_time: string;
//   timezone: string;
//   status: MeetingStatus;
//   meeting_link?: string;
//   notes?: string;
//   admin_notes?: string;
//   created_at: string;
//   updated_at: string;
// }

// // Auth Context
// interface AuthContextType {
//   user: any;
//   profile: UserProfile | null;
//   loading: boolean;
//   isAuthenticated: boolean;
//   initializing: boolean;
//   isAdmin: boolean;
//   signIn: (email: string, password: string) => Promise<{ error?: any }>;
//   signUp: (email: string, password: string, fullName: string) => Promise<{ error?: any }>;
//   signOut: () => Promise<void>;
//   refreshProfile: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Auth Provider
// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<any>(null);
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [initializing, setInitializing] = useState(true);

//   const fetchProfile = async (userId: string) => {
//     try {
//       console.log('🔍 Fetching profile for user:', userId);
//       setLoading(true);
      
//       // Add timeout to prevent hanging
//       const timeoutPromise = new Promise((_, reject) => 
//         setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
//       );
      
//       const fetchPromise = supabase
//         .from('user_profiles')
//         .select('*')
//         .eq('user_id', userId)
//         .single();

//       const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

//       if (error) {
//         console.error('❌ Profile fetch error:', error);
        
//         // Handle specific error cases
//         if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
//           console.warn('⚠️ Database tables not set up yet, continuing without profile');
//           setProfile(null);
//           setLoading(false);
//           return;
//         }
        
//         // For other errors, still continue but log them
//         console.warn('⚠️ Profile fetch failed:', error.message);
//         setProfile(null);
//         setLoading(false);
//         return;
//       }
      
//       console.log('✅ Profile loaded:', data);
//       setProfile(data);
//     } catch (error: any) {
//       console.error('💥 Profile fetch error or timeout:', error);
//       setProfile(null);
//     } finally {
//       setLoading(false);
//       console.log('🏁 Profile fetch completed, setting loading to false');
//     }
//   };

//   const refreshProfile = async () => {
//     if (user?.id) {
//       await fetchProfile(user.id);
//     }
//   };

//   useEffect(() => {
//     let mounted = true;

//     // Safety timeout to ensure initialization completes
//     const initTimeout = setTimeout(() => {
//       if (mounted && initializing) {
//         console.warn('⚠️ Auth initialization timeout, forcing completion');
//         setInitializing(false);
//         setLoading(false);
//       }
//     }, 10000);

//     // Get initial session
//     const initializeAuth = async () => {
//       try {
//         console.log('🔄 Initializing authentication...');
//         const { data: { session }, error } = await supabase.auth.getSession();
        
//         if (error) {
//           console.error('❌ Session error:', error);
//           if (mounted) {
//             setUser(null);
//             setProfile(null);
//             setLoading(false);
//             setInitializing(false);
//           }
//           return;
//         }

//         if (mounted) {
//           setUser(session?.user ?? null);
          
//           if (session?.user) {
//             console.log('✅ User session found:', session.user.email);
//             await fetchProfile(session.user.id);
//           } else {
//             console.log('ℹ️ No user session found');
//             setProfile(null);
//             setLoading(false);
//           }
          
//           console.log('🏁 Setting initializing to false');
//           setInitializing(false);
//         }
//       } catch (error: any) {
//         console.error('❌ Auth initialization failed:', error);
//         if (mounted) {
//           setUser(null);
//           setProfile(null);
//           setLoading(false);
//           setInitializing(false);
//         }
//       }
//     };

//     initializeAuth();

//     // Listen for auth changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
//       if (!mounted) return;

//       console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user');
      
//       setUser(session?.user ?? null);
      
//       if (session?.user && event !== 'TOKEN_REFRESHED') {
//         console.log('✅ User authenticated:', session.user.email);
//         await fetchProfile(session.user.id);
//         console.log('🏁 Auth change: setting initializing to false');
//         setInitializing(false);
//       } else if (!session?.user) {
//         console.log('ℹ️ User signed out, clearing profile');
//         setProfile(null);
//         setLoading(false);
//         setInitializing(false);
//       }
//     });

//     return () => {
//       mounted = false;
//       clearTimeout(initTimeout);
//       subscription.unsubscribe();
//     };
//   }, []);

//   const signIn = async (email: string, password: string) => {
//     try {
//       console.log('🔐 Attempting sign in for:', email);
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });
      
//       if (error) {
//         console.error('❌ Sign in error:', error);
//         return { error };
//       }
      
//       console.log('✅ Sign in successful:', data.user?.email);
//       return { error: null };
//     } catch (error) {
//       console.error('💥 Sign in exception:', error);
//       return { error };
//     }
//   };

//   const signUp = async (email: string, password: string, fullName: string) => {
//     try {
//       console.log('📝 Attempting sign up for:', email);
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: {
//             full_name: fullName,
//             role: 'Client'
//           }
//         }
//       });
      
//       if (error) {
//         console.error('❌ Sign up error:', error);
//         return { error };
//       }
      
//       console.log('✅ Sign up successful:', data.user?.email);
//       return { error: null };
//     } catch (error) {
//       console.error('💥 Sign up exception:', error);
//       return { error };
//     }
//   };

//   const signOut = async () => {
//     await supabase.auth.signOut();
//   };

//   const value: AuthContextType = {
//     user,
//     profile,
//     loading,
//     isAuthenticated: !!user,
//     initializing,
//     isAdmin: profile?.role === 'Admin',
//     signIn,
//     signUp,
//     signOut,
//     refreshProfile,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// // useAuth hook
// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }











// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//     flowType: 'pkce'
//   },
//   global: {
//     headers: {
//       'X-Client-Info': 'glitch-engine@1.0.0'
//     }
//   }
// });

// // Connection health check
// supabase.auth.getSession().then(({ data, error }) => {
//   if (error) {
//     console.error('❌ Supabase connection failed:', error.message);
//   } else {
//     console.log('✅ Supabase connected successfully');
//   }
// });

// // Types for the application
// export type UserRole = 'Client' | 'Admin';
// export type HiringStatus = 'Not Started' | 'Job Posting' | 'Interviewing' | 'Videos Ready' | 'Picked';
// export type JobStatus = 'draft' | 'active' | 'interviewing' | 'completed';
// export type CandidateStatus = 'pending' | 'ready' | 'selected' | 'rejected';
// export type MeetingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

// export interface UserProfile {
//   id: string;
//   user_id: string;
//   email: string;
//   full_name: string;
//   role: UserRole;
//   hiring_status: HiringStatus;
//   avatar_url?: string;
//   company?: string;
//   created_at: string;
//   updated_at: string;
// }

// export interface JobPosting {
//   id: string;
//   user_id: string;
//   title: string;
//   description: string;
//   requirements: string[];
//   salary_range?: string;
//   location?: string;
//   employment_type: string;
//   status: JobStatus;
//   created_at: string;
//   updated_at: string;
// }

// export interface Candidate {
//   id: string;
//   job_id: string;
//   name: string;
//   email?: string;
//   role: string;
//   score: number;
//   video_url?: string;
//   thumbnail_url?: string;
//   status: CandidateStatus;
//   created_at: string;
//   updated_at: string;
// }

// export interface Meeting {
//   id: string;
//   user_id: string;
//   user_name: string;
//   user_email: string;
//   meeting_date: string;
//   meeting_time: string;
//   timezone: string;
//   status: MeetingStatus;
//   meeting_link?: string;
//   notes?: string;
//   admin_notes?: string;
//   created_at: string;
//   updated_at: string;
// }

// // Auth Context
// interface AuthContextType {
//   user: any;
//   profile: UserProfile | null;
//   loading: boolean;
//   isAuthenticated: boolean;
//   initializing: boolean;
//   isAdmin: boolean;
//   signIn: (email: string, password: string) => Promise<{ error?: any }>;
//   signUp: (email: string, password: string, fullName: string) => Promise<{ error?: any }>;
//   signOut: () => Promise<void>;
//   refreshProfile: () => Promise<void>; // ✅ Added function
// }


// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Auth Provider
// export function AuthProvider({ children }: { children: ReactNode }) {
//   console.log("🧠 Using Supabase client instance:", supabase);
//   const [user, setUser] = useState<any>(null);
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [initializing, setInitializing] = useState(true);

//   useEffect(() => {
//   let mounted = true;

//   const initializeAuth = async () => {
//     try {
//       console.log('🔄 Initializing authentication...');
//       const { data: { session }, error } = await supabase.auth.getSession();

//       if (error || !session?.user) {
//         console.warn('⚠️ No session or user found:', error?.message || 'No session');
//         if (mounted) {
//           setUser(null);
//           setProfile(null);
//         }
//         return;
//       }

//       if (mounted) {
//         console.log('✅ Session found:', session.user.email);
//         setUser(session.user);

//         try {
//           await fetchProfile(session.user.id);
//         } catch (fetchErr) {
//           console.warn('⚠️ Profile fetch failed:', fetchErr);
//           setProfile(null); // prevent hanging if profile fails
//         }
//       }
//     } catch (err) {
//       console.error('💥 Auth initialization failed:', err);
//       if (mounted) {
//         setUser(null);
//         setProfile(null);
//       }
//     } finally {
//       if (mounted) {
//         setLoading(false);
//         setInitializing(false); // ✅ Always end initializing
//       }
//     }
//   };

//   initializeAuth();

//   // 🔁 Listen for auth state changes (login, logout, refresh)
//   const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
//     if (!mounted) return;

//     console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user');
//     setUser(session?.user ?? null);

//     if (session?.user) {
//       try {
//         await fetchProfile(session.user.id);
//       } catch (fetchErr) {
//         console.warn('⚠️ Profile fetch failed during auth change:', fetchErr);
//         setProfile(null);
//       }
//     } else {
//       setProfile(null);
//     }

//     setInitializing(false); // ✅ Set always
//     setLoading(false);
//   });

//   return () => {
//     mounted = false;
//     subscription.unsubscribe();
//   };
// }, []);

//   const fetchProfile = async (userId: string) => {
//     try {
//       console.log('🔍 Fetching profile for user:', userId);
//       setLoading(true);
      
//       const { data, error } = await supabase
//         .from('user_profiles')
//         .select('*')
//         .eq('user_id', userId)
//         .single();

//       if (error) {
//         console.error('❌ Profile fetch error:', error);
        
//         // Handle specific error cases
//         if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
//           console.warn('⚠️ Database tables not set up yet, continuing without profile');
//           setProfile(null);
//           setLoading(false);
//           return;
//         }
//         const refreshProfile = async () => {
//           if (user?.id) {
//             await fetchProfile(user.id);
//           }
//         };
        
//         // For other errors, still continue but log them
//         console.warn('⚠️ Profile fetch failed:', error.message);
//         setProfile(null);
//         setLoading(false);
//         return;
//       }
      
//       console.log('✅ Profile loaded:', data);
//       setProfile(data);
//     } catch (error) {
//       console.error('💥 Critical profile error:', error);
//       setProfile(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signIn = async (email: string, password: string) => {
//     try {
//       console.log('🔐 Attempting sign in for:', email);
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });
      
//       if (error) {
//         console.error('❌ Sign in error:', error);
//         return { error };
//       }
      
//       console.log('✅ Sign in successful:', data.user?.email);
//       return { error: null };
//     } catch (error) {
//       console.error('💥 Sign in exception:', error);
//       return { error };
//     }
//   };

//   const signUp = async (email: string, password: string, fullName: string) => {
//     try {
//       console.log('📝 Attempting sign up for:', email);
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: {
//             full_name: fullName,
//             role: 'Client'
//           }
//         }
//       });
      
//       if (error) {
//         console.error('❌ Sign up error:', error);
//         return { error };
//       }
      
//       console.log('✅ Sign up successful:', data.user?.email);
//       return { error: null };
//     } catch (error) {
//       console.error('💥 Sign up exception:', error);
//       return { error };
//     }
//   };

//   const signOut = async () => {
//     await supabase.auth.signOut();
//   };

//   const refreshProfile = async () => {
//     if (user?.id) {
//       await fetchProfile(user.id);
//     }
//   };

//   const value: AuthContextType = {
//     user,
//     profile,
//     loading,
//     isAuthenticated: !!user,
//     initializing,
//     isAdmin: profile?.role === 'Admin',
//     signIn,
//     signUp,
//     signOut,
//     refreshProfile, // ✅ Exposed for global use
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// // useAuth hook
// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }

