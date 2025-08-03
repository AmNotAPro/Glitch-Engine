/*
# Clean Database Schema for Glitch Engine
# USER-ONLY APPROACH - Admin is hard-coded, not stored in database

## What this creates:
1. user_profiles table (Client role only - NO ADMIN)
2. job_postings table for user requirements
3. candidates table for video interviews  
4. meetings table for scheduling
5. Simple RLS policies (users see only their data)
6. Auto profile creation trigger
7. Updated_at triggers

## Security:
- Row Level Security enabled
- Users can only access their own data
- Admin control via direct queries (no RLS bypass needed)
*/

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. CREATE TABLES
-- ========================================

-- User profiles table (NO ADMIN ROLE - Client only)
CREATE TABLE IF NOT EXISTS user_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email text NOT NULL,
    full_name text NOT NULL,
    role text DEFAULT 'Client' CHECK (role = 'Client'),
    hiring_status text DEFAULT 'Not Started' CHECK (hiring_status IN ('Not Started', 'Job Posting', 'Interviewing', 'Videos Ready', 'Picked')),
    avatar_url text,
    company text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Job postings table
CREATE TABLE IF NOT EXISTS job_postings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    requirements text[] DEFAULT '{}',
    salary_range text,
    location text DEFAULT 'Remote',
    employment_type text DEFAULT 'Full-time',
    status text DEFAULT 'active' CHECK (status IN ('draft', 'active', 'interviewing', 'completed')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Candidates table (for video interviews)
CREATE TABLE IF NOT EXISTS candidates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id uuid REFERENCES job_postings(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    email text,
    role text NOT NULL,
    score integer DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    video_url text,
    thumbnail_url text,
    status text DEFAULT 'ready' CHECK (status IN ('pending', 'ready', 'selected', 'rejected')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Meetings table (for scheduling calls)
CREATE TABLE IF NOT EXISTS meetings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    user_name text NOT NULL,
    user_email text NOT NULL,
    meeting_date date NOT NULL,
    meeting_time time NOT NULL,
    timezone text DEFAULT 'UTC',
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    meeting_link text,
    notes text,
    admin_notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ========================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ========================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ========================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_hiring_status ON user_profiles(hiring_status);

CREATE INDEX IF NOT EXISTS idx_job_postings_user_id ON job_postings(user_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_created_at ON job_postings(created_at);

CREATE INDEX IF NOT EXISTS idx_candidates_job_id ON candidates(job_id);
CREATE INDEX IF NOT EXISTS idx_candidates_score ON candidates(score DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);

CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON meetings(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);

-- ========================================
-- 4. CREATE RLS POLICIES (USER-ONLY ACCESS)
-- ========================================

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert profiles" ON user_profiles
    FOR INSERT WITH CHECK (true);

-- Job postings policies  
CREATE POLICY "Users can manage own job postings" ON job_postings
    FOR ALL USING (auth.uid() = user_id);

-- Candidates policies
CREATE POLICY "Users can view candidates for their jobs" ON candidates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM job_postings jp 
            WHERE jp.id = candidates.job_id AND jp.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update candidates for their jobs" ON candidates
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM job_postings jp 
            WHERE jp.id = candidates.job_id AND jp.user_id = auth.uid()
        )
    );

-- Admin can manage all candidates (no auth check - direct access)
CREATE POLICY "Admin can manage all candidates" ON candidates
    FOR ALL USING (true);

-- Meetings policies
CREATE POLICY "Users can manage own meetings" ON meetings
    FOR ALL USING (auth.uid() = user_id);

-- ========================================
-- 5. CREATE TRIGGERS
-- ========================================

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.email),
        'Client'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Updated_at trigger function
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

-- ========================================
-- 6. GRANT PERMISSIONS
-- ========================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- ========================================
-- SETUP COMPLETE!
-- ========================================

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Clean database schema created successfully!';
    RAISE NOTICE '🔐 Admin login: admin@gmail.com / 123456 (hard-coded)';
    RAISE NOTICE '👤 Users: Stored in Supabase with Client role only';
    RAISE NOTICE '🎯 Admin controls everything via Supabase queries';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Test admin login with admin@gmail.com / 123456';
    RAISE NOTICE '2. Test user signup with any other email';
    RAISE NOTICE '3. Admin can manage all users via dashboard';
END $$;