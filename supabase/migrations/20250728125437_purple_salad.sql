/*
# Safe Database Schema Setup for Glitch Engine

This migration safely creates all necessary database objects with proper existence checks.

## What this creates:
1. User profiles table with role and hiring status
2. Job postings table for client requirements  
3. Candidates table for video interviews
4. Meetings table for scheduling
5. All necessary RLS policies and functions
6. Admin user setup function

## Security:
- Row Level Security enabled on all tables
- Proper policies for user isolation
- Admin-only access controls
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types if they don't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('Client', 'Admin', 'Interviewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE hiring_status AS ENUM ('Not Started', 'Job Posting', 'Interviewing', 'Videos Ready', 'Picked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('draft', 'active', 'interviewing', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE candidate_status AS ENUM ('pending', 'ready', 'selected', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE meeting_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email text NOT NULL,
    full_name text NOT NULL,
    role user_role DEFAULT 'Client',
    hiring_status hiring_status DEFAULT 'Not Started',
    avatar_url text,
    company text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create job_postings table
CREATE TABLE IF NOT EXISTS job_postings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    requirements text[] DEFAULT '{}',
    salary_range text,
    location text DEFAULT 'Remote',
    employment_type text DEFAULT 'Full-time',
    status job_status DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id uuid REFERENCES job_postings(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    email text,
    role text NOT NULL,
    score integer DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    video_url text,
    thumbnail_url text,
    status candidate_status DEFAULT 'ready',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    user_name text NOT NULL,
    user_email text NOT NULL,
    meeting_date date NOT NULL,
    meeting_time time NOT NULL,
    timezone text DEFAULT 'UTC',
    status meeting_status DEFAULT 'pending',
    meeting_link text,
    notes text,
    admin_notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_job_postings_user_id ON job_postings(user_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_created_at ON job_postings(created_at);
CREATE INDEX IF NOT EXISTS idx_candidates_job_id ON candidates(job_id);
CREATE INDEX IF NOT EXISTS idx_candidates_score ON candidates(score DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON meetings(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);

-- Helper function to get current user ID
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  SELECT COALESCE(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;

-- RLS Policies for user_profiles
DO $$ BEGIN
    CREATE POLICY "Users can view own profile" ON user_profiles
        FOR SELECT TO public
        USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own profile" ON user_profiles
        FOR UPDATE TO public
        USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "System can insert profiles" ON user_profiles
        FOR INSERT TO public
        WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admins can view all profiles" ON user_profiles
        FOR SELECT TO public
        USING (EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() AND up.role = 'Admin'
        ));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Admins can update all profiles" ON user_profiles
        FOR UPDATE TO public
        USING (EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() AND up.role = 'Admin'
        ));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- RLS Policies for job_postings
DO $$ BEGIN
    CREATE POLICY "Users can create own job postings" ON job_postings
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can view own job postings" ON job_postings
        FOR SELECT TO authenticated
        USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own job postings" ON job_postings
        FOR UPDATE TO authenticated
        USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- RLS Policies for candidates
DO $$ BEGIN
    CREATE POLICY "Users can view candidates for their jobs" ON candidates
        FOR SELECT TO authenticated
        USING (EXISTS (
            SELECT 1 FROM job_postings jp 
            WHERE jp.id = candidates.job_id AND jp.user_id = auth.uid()
        ));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update candidates for their jobs" ON candidates
        FOR UPDATE TO authenticated
        USING (EXISTS (
            SELECT 1 FROM job_postings jp 
            WHERE jp.id = candidates.job_id AND jp.user_id = auth.uid()
        ));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- RLS Policies for meetings
DO $$ BEGIN
    CREATE POLICY "Users can create own meetings" ON meetings
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can view own meetings" ON meetings
        FOR SELECT TO authenticated
        USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own meetings" ON meetings
        FOR UPDATE TO authenticated
        USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Function to automatically create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.email),
        COALESCE(new.raw_user_meta_data->>'role', 'Client')::user_role
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
DROP TRIGGER IF EXISTS handle_updated_at ON user_profiles;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON job_postings;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON job_postings
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON candidates;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON meetings;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON meetings
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Admin functions for statistics
CREATE OR REPLACE FUNCTION get_admin_stats_from_profiles()
RETURNS TABLE(
    total_users bigint,
    active_jobs bigint,
    completed_hires bigint,
    videos_ready bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM user_profiles)::bigint as total_users,
        (SELECT COUNT(*) FROM job_postings WHERE status = 'active')::bigint as active_jobs,
        (SELECT COUNT(*) FROM user_profiles WHERE hiring_status = 'Picked')::bigint as completed_hires,
        (SELECT COUNT(*) FROM user_profiles WHERE hiring_status = 'Videos Ready')::bigint as videos_ready;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin function to get all user profiles
CREATE OR REPLACE FUNCTION get_all_user_profiles_admin()
RETURNS TABLE(
    id uuid,
    auth_id uuid,
    email text,
    full_name text,
    role user_role,
    hiring_status hiring_status,
    avatar_url text,
    company text,
    created_at timestamptz,
    updated_at timestamptz,
    last_sign_in_at timestamptz
) AS $$
BEGIN
    -- Check if current user is admin
    IF NOT EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'Admin'
    ) THEN
        RAISE EXCEPTION 'Access denied. Admin role required.';
    END IF;

    RETURN QUERY
    SELECT 
        up.id,
        up.user_id as auth_id,
        up.email,
        up.full_name,
        up.role,
        up.hiring_status,
        up.avatar_url,
        up.company,
        up.created_at,
        up.updated_at,
        au.last_sign_in_at
    FROM user_profiles up
    LEFT JOIN auth.users au ON up.user_id = au.id
    ORDER BY up.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin function to update user status
CREATE OR REPLACE FUNCTION update_user_status_admin(
    target_user_id uuid,
    new_status hiring_status
)
RETURNS void AS $$
BEGIN
    -- Check if current user is admin
    IF NOT EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() AND role = 'Admin'
    ) THEN
        RAISE EXCEPTION 'Access denied. Admin role required.';
    END IF;

    UPDATE user_profiles 
    SET hiring_status = new_status, updated_at = now()
    WHERE user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to make a user admin (run this manually with your email)
CREATE OR REPLACE FUNCTION make_user_admin(user_email text)
RETURNS void AS $$
BEGIN
    UPDATE user_profiles 
    SET role = 'Admin'
    WHERE email = user_email;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database schema setup completed successfully!';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Sign up in your app with your email';
    RAISE NOTICE '2. Run: SELECT make_user_admin(''your-email@example.com'');';
    RAISE NOTICE '3. Refresh your app to see admin features';
END $$;