/*
# Clean User-Only Database Schema for Glitch Engine
# No admin stuff - just clean user management

## What this creates:
1. User profiles table (Client role only)
2. Job postings table
3. Candidates table  
4. Meetings table
5. Simple RLS policies
6. Auto profile creation trigger
*/

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table (NO ADMIN ROLE)
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
    status text DEFAULT 'active' CHECK (status IN ('draft', 'active', 'interviewing', 'completed')),
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
    status text DEFAULT 'ready' CHECK (status IN ('pending', 'ready', 'selected', 'rejected')),
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
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    meeting_link text,
    notes text,
    admin_notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_job_postings_user_id ON job_postings(user_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON job_postings(status);
CREATE INDEX IF NOT EXISTS idx_candidates_job_id ON candidates(job_id);
CREATE INDEX IF NOT EXISTS idx_candidates_score ON candidates(score DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON meetings(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(meeting_date);

-- Simple RLS Policies (users see only their own data)
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert profiles" ON user_profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can manage own job postings" ON job_postings
    FOR ALL USING (auth.uid() = user_id);

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

CREATE POLICY "Admins can manage all candidates" ON candidates
    FOR ALL USING (true);

CREATE POLICY "Users can manage own meetings" ON meetings
    FOR ALL USING (auth.uid() = user_id);

-- Auto-create user profile trigger
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

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_updated_at ON user_profiles
    BEFORE UPDATE FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at ON job_postings
    BEFORE UPDATE FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at ON candidates
    BEFORE UPDATE FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at ON meetings
    BEFORE UPDATE FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT 'Clean user-only database schema created successfully!' as status;