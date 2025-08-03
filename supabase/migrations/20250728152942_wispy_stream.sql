/*
# FINAL WORKING SCHEMA - Glitch Engine
# Admin + User System with Role-Based Authentication
# 
# This creates:
# 1. Clean user_profiles table (supports both Client and Admin roles)
# 2. Job postings, candidates, meetings tables
# 3. Admin account creation
# 4. Proper RLS policies
# 5. Auto profile creation trigger
*/

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. DROP EXISTING TABLES (CLEAN SLATE)
-- ========================================

DROP TABLE IF EXISTS meetings CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;
DROP TABLE IF EXISTS job_postings CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- ========================================
-- 2. CREATE TABLES
-- ========================================

-- User profiles table (supports both Client and Admin roles)
CREATE TABLE user_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email text NOT NULL,
    full_name text NOT NULL,
    role text DEFAULT 'Client' CHECK (role IN ('Client', 'Admin')),
    hiring_status text DEFAULT 'Not Started' CHECK (hiring_status IN ('Not Started', 'Job Posting', 'Interviewing', 'Videos Ready', 'Picked')),
    avatar_url text,
    company text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Job postings table
CREATE TABLE job_postings (
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
CREATE TABLE candidates (
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
CREATE TABLE meetings (
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
-- 3. ENABLE ROW LEVEL SECURITY
-- ========================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 4. CREATE INDEXES
-- ========================================

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_hiring_status ON user_profiles(hiring_status);

CREATE INDEX idx_job_postings_user_id ON job_postings(user_id);
CREATE INDEX idx_job_postings_status ON job_postings(status);
CREATE INDEX idx_job_postings_created_at ON job_postings(created_at);

CREATE INDEX idx_candidates_job_id ON candidates(job_id);
CREATE INDEX idx_candidates_score ON candidates(score DESC);
CREATE INDEX idx_candidates_status ON candidates(status);

CREATE INDEX idx_meetings_user_id ON meetings(user_id);
CREATE INDEX idx_meetings_date ON meetings(meeting_date);
CREATE INDEX idx_meetings_status ON meetings(status);

-- ========================================
-- 5. CREATE RLS POLICIES
-- ========================================

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert profiles" ON user_profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() AND up.role = 'Admin'
        )
    );

CREATE POLICY "Admins can update all profiles" ON user_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() AND up.role = 'Admin'
        )
    );

-- Job postings policies
CREATE POLICY "Users can manage own job postings" ON job_postings
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all job postings" ON job_postings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() AND up.role = 'Admin'
        )
    );

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

CREATE POLICY "Admins can manage all candidates" ON candidates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() AND up.role = 'Admin'
        )
    );

-- Meetings policies
CREATE POLICY "Users can manage own meetings" ON meetings
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all meetings" ON meetings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() AND up.role = 'Admin'
        )
    );

CREATE POLICY "Admins can update all meetings" ON meetings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() AND up.role = 'Admin'
        )
    );

-- ========================================
-- 6. CREATE TRIGGERS
-- ========================================

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, email, full_name, role, hiring_status)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'Client'),
        'Not Started'
    );
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Failed to create profile for %: %', NEW.email, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_updated_at_user_profiles
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_job_postings
    BEFORE UPDATE ON job_postings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_candidates
    BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_meetings
    BEFORE UPDATE ON meetings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ========================================
-- 7. CREATE ADMIN ACCOUNT
-- ========================================

DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Check if admin already exists
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@gmail.com';
    
    -- If admin doesn't exist, create them
    IF admin_user_id IS NULL THEN
        -- Insert into auth.users
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'admin@gmail.com',
            crypt('123456', gen_salt('bf')),
            now(),
            now(),
            now(),
            '{"provider": "email", "providers": ["email"]}',
            '{"full_name": "Glitch Admin", "role": "Admin"}',
            now(),
            now(),
            '',
            '',
            '',
            ''
        ) RETURNING id INTO admin_user_id;
        
        RAISE NOTICE 'Admin user created with ID: %', admin_user_id;
    ELSE
        -- Update existing admin
        UPDATE auth.users 
        SET 
            encrypted_password = crypt('123456', gen_salt('bf')),
            email_confirmed_at = now(),
            raw_user_meta_data = '{"full_name": "Glitch Admin", "role": "Admin"}'
        WHERE id = admin_user_id;
        
        RAISE NOTICE 'Admin user updated with ID: %', admin_user_id;
    END IF;
    
    -- Create or update admin profile
    INSERT INTO user_profiles (user_id, email, full_name, role, hiring_status)
    VALUES (admin_user_id, 'admin@gmail.com', 'Glitch Admin', 'Admin', 'Not Started')
    ON CONFLICT (user_id) DO UPDATE SET 
        role = 'Admin',
        full_name = 'Glitch Admin',
        updated_at = now();
        
    RAISE NOTICE 'Admin profile created/updated successfully';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Admin setup failed: %', SQLERRM;
END $$;

-- ========================================
-- 8. GRANT PERMISSIONS
-- ========================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- ========================================
-- 9. VERIFICATION
-- ========================================

-- Verify setup
DO $$
DECLARE
    table_count integer;
    admin_count integer;
    user_count integer;
BEGIN
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('user_profiles', 'job_postings', 'candidates', 'meetings');
    
    SELECT COUNT(*) INTO admin_count 
    FROM user_profiles 
    WHERE role = 'Admin';
    
    SELECT COUNT(*) INTO user_count 
    FROM auth.users;
    
    RAISE NOTICE '✅ SETUP COMPLETE!';
    RAISE NOTICE '📊 Tables created: %', table_count;
    RAISE NOTICE '👑 Admin accounts: %', admin_count;
    RAISE NOTICE '👤 Total users: %', user_count;
    RAISE NOTICE '🔐 Admin login: admin@gmail.com / 123456';
    RAISE NOTICE '';
    RAISE NOTICE 'Ready to use! 🚀';
END $$;