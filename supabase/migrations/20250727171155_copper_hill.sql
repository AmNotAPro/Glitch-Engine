/*
  # GLITCH ENGINE - COMPLETE DATABASE SETUP
  # Run this ONCE in your Supabase SQL Editor
  # This sets up everything needed for the application
*/

-- ========================================
-- 1. CREATE ALL TABLES WITH PROPER STRUCTURE
-- ========================================

-- User profiles table (extends auth.users with app-specific data)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email text NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'Client' CHECK (role IN ('Client', 'Admin', 'Interviewer')),
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

-- Candidates table (stores video interview candidates)
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

-- Meetings table (for scheduling calls with users)
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
-- 3. DROP ALL EXISTING POLICIES (CLEAN SLATE)
-- ========================================

-- User profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "System can insert profiles" ON user_profiles;

-- Job postings policies
DROP POLICY IF EXISTS "Users can view own job postings" ON job_postings;
DROP POLICY IF EXISTS "Users can create own job postings" ON job_postings;
DROP POLICY IF EXISTS "Users can update own job postings" ON job_postings;
DROP POLICY IF EXISTS "Admins can manage all job postings" ON job_postings;

-- Candidates policies
DROP POLICY IF EXISTS "Users can view candidates for their jobs" ON candidates;
DROP POLICY IF EXISTS "Users can update candidates for their jobs" ON candidates;
DROP POLICY IF EXISTS "Admins can manage all candidates" ON candidates;

-- Meetings policies
DROP POLICY IF EXISTS "Users can view own meetings" ON meetings;
DROP POLICY IF EXISTS "Users can create own meetings" ON meetings;
DROP POLICY IF EXISTS "Users can update own meetings" ON meetings;
DROP POLICY IF EXISTS "Admins can manage all meetings" ON meetings;

-- ========================================
-- 4. CREATE COMPREHENSIVE SECURITY POLICIES
-- ========================================

-- USER PROFILES POLICIES
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.user_id = auth.uid() AND up.role = 'Admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON user_profiles FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.user_id = auth.uid() AND up.role = 'Admin'
    )
  );

CREATE POLICY "System can insert profiles"
  ON user_profiles FOR INSERT TO authenticated
  WITH CHECK (true);

-- JOB POSTINGS POLICIES
CREATE POLICY "Users can view own job postings"
  ON job_postings FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.user_id = auth.uid() AND up.role = 'Admin'
    )
  );

CREATE POLICY "Users can create own job postings"
  ON job_postings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job postings"
  ON job_postings FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all job postings"
  ON job_postings FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.user_id = auth.uid() AND up.role = 'Admin'
    )
  );

-- CANDIDATES POLICIES
CREATE POLICY "Users can view candidates for their jobs"
  ON candidates FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM job_postings jp 
      WHERE jp.id = candidates.job_id 
      AND (
        jp.user_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM user_profiles up 
          WHERE up.user_id = auth.uid() AND up.role = 'Admin'
        )
      )
    )
  );

CREATE POLICY "Users can update candidates for their jobs"
  ON candidates FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM job_postings jp 
      WHERE jp.id = candidates.job_id 
      AND jp.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all candidates"
  ON candidates FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.user_id = auth.uid() AND up.role = 'Admin'
    )
  );

-- MEETINGS POLICIES
CREATE POLICY "Users can view own meetings"
  ON meetings FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.user_id = auth.uid() AND up.role = 'Admin'
    )
  );

CREATE POLICY "Users can create own meetings"
  ON meetings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meetings"
  ON meetings FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all meetings"
  ON meetings FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.user_id = auth.uid() AND up.role = 'Admin'
    )
  );

-- ========================================
-- 5. CREATE PERFORMANCE INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_hiring_status ON user_profiles(hiring_status);

CREATE INDEX IF NOT EXISTS idx_job_postings_user_id ON job_postings(user_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_created_at ON job_postings(created_at);

CREATE INDEX IF NOT EXISTS idx_candidates_job_id ON candidates(job_id);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_score ON candidates(score DESC);

CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON meetings(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);

-- ========================================
-- 6. AUTO-CREATE USER PROFILES ON SIGNUP
-- ========================================

CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (
    user_id,
    email,
    full_name,
    role,
    hiring_status
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'Client'),
    'Not Started'
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the signup
    RAISE WARNING 'Failed to create user profile for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger and create new one
DROP TRIGGER IF EXISTS trigger_create_user_profile ON auth.users;
CREATE TRIGGER trigger_create_user_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- ========================================
-- 7. DROP ALL EXISTING FUNCTIONS (CLEAN SLATE)
-- ========================================

DROP FUNCTION IF EXISTS get_admin_stats();
DROP FUNCTION IF EXISTS get_admin_stats_from_profiles();
DROP FUNCTION IF EXISTS get_all_users_for_admin();
DROP FUNCTION IF EXISTS get_all_user_profiles_admin();
DROP FUNCTION IF EXISTS create_job_from_intake(text, text, text, text[]);
DROP FUNCTION IF EXISTS get_user_candidates(uuid);
DROP FUNCTION IF EXISTS update_user_status_admin(uuid, text);

-- ========================================
-- 8. CREATE ALL ADMIN FUNCTIONS
-- ========================================

-- Get admin dashboard statistics
CREATE OR REPLACE FUNCTION get_admin_stats_from_profiles()
RETURNS jsonb AS $$
DECLARE
  total_users integer;
  active_jobs integer;
  completed_hires integer;
  videos_ready integer;
  admin_user_id uuid;
BEGIN
  -- Check if current user is admin
  SELECT user_id INTO admin_user_id
  FROM user_profiles 
  WHERE user_id = auth.uid() AND role = 'Admin';
  
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;
  
  -- Get statistics
  SELECT COUNT(*) INTO total_users 
  FROM user_profiles 
  WHERE role != 'Admin';
  
  SELECT COUNT(*) INTO active_jobs 
  FROM job_postings 
  WHERE status IN ('active', 'interviewing');
  
  SELECT COUNT(*) INTO completed_hires 
  FROM user_profiles 
  WHERE hiring_status = 'Picked';
  
  SELECT COUNT(*) INTO videos_ready 
  FROM user_profiles 
  WHERE hiring_status = 'Videos Ready';
  
  RETURN jsonb_build_object(
    'total_users', total_users,
    'active_jobs', active_jobs,
    'completed_hires', completed_hires,
    'videos_ready', videos_ready
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get all user profiles for admin dashboard
CREATE OR REPLACE FUNCTION get_all_user_profiles_admin()
RETURNS jsonb AS $$
DECLARE
  result jsonb;
  admin_user_id uuid;
BEGIN
  -- Check if current user is admin
  SELECT user_id INTO admin_user_id
  FROM user_profiles 
  WHERE user_id = auth.uid() AND role = 'Admin';
  
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;
  
  -- Get all non-admin user profiles with auth data
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', up.id,
      'auth_id', up.user_id,
      'email', up.email,
      'full_name', up.full_name,
      'role', up.role,
      'status', up.hiring_status,
      'hiring_status', up.hiring_status,
      'company', up.company,
      'avatar_url', up.avatar_url,
      'created_at', up.created_at,
      'updated_at', up.updated_at,
      'last_sign_in_at', au.last_sign_in_at
    )
  ) INTO result
  FROM user_profiles up
  LEFT JOIN auth.users au ON up.user_id = au.id
  WHERE up.role != 'Admin'
  ORDER BY up.created_at DESC;
  
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update user status (admin only)
CREATE OR REPLACE FUNCTION update_user_status_admin(target_user_id uuid, new_status text)
RETURNS void AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if current user is admin
  SELECT user_id INTO admin_user_id
  FROM user_profiles 
  WHERE user_id = auth.uid() AND role = 'Admin';
  
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;
  
  -- Validate status
  IF new_status NOT IN ('Not Started', 'Job Posting', 'Interviewing', 'Videos Ready', 'Picked') THEN
    RAISE EXCEPTION 'Invalid status: %', new_status;
  END IF;
  
  -- Update user status
  UPDATE user_profiles 
  SET hiring_status = new_status, updated_at = now()
  WHERE user_id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found: %', target_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get candidates for a specific user (used in admin dashboard)
CREATE OR REPLACE FUNCTION get_user_candidates(target_user_id uuid)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', c.id,
      'name', c.name,
      'email', c.email,
      'role', c.role,
      'score', c.score,
      'video_url', c.video_url,
      'status', c.status,
      'created_at', c.created_at
    )
  ) INTO result
  FROM candidates c
  JOIN job_postings jp ON c.job_id = jp.id
  WHERE jp.user_id = target_user_id
  AND c.status = 'ready'
  ORDER BY c.score DESC;
  
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 9. CREATE ADMIN ACCOUNT
-- ========================================

-- Create admin user in auth.users (if not exists)
DO $$
BEGIN
  -- Insert admin user if not exists
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    is_super_admin,
    role
  )
  SELECT 
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admin@glitchengine.com',
    crypt('GlitchAdmin2025!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"full_name": "Admin User", "role": "Admin"}'::jsonb,
    false,
    'authenticated'
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@glitchengine.com'
  );
  
  -- Create admin profile (trigger will handle this, but let's be explicit)
  INSERT INTO user_profiles (user_id, email, full_name, role, hiring_status)
  SELECT 
    au.id,
    au.email,
    'Admin User',
    'Admin',
    'Not Started'
  FROM auth.users au
  WHERE au.email = 'admin@glitchengine.com'
  ON CONFLICT (user_id) DO UPDATE SET 
    role = 'Admin',
    updated_at = now();
    
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Admin setup warning: %', SQLERRM;
END $$;

-- ========================================
-- 10. GRANT NECESSARY PERMISSIONS
-- ========================================

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Grant permissions on tables
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON job_postings TO authenticated;
GRANT ALL ON candidates TO authenticated;
GRANT ALL ON meetings TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_admin_stats_from_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_user_profiles_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_status_admin(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_candidates(uuid) TO authenticated;

-- ========================================
-- SETUP COMPLETE!
-- ========================================

-- Verify setup
DO $$
DECLARE
  table_count integer;
  admin_count integer;
BEGIN
  SELECT COUNT(*) INTO table_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'job_postings', 'candidates', 'meetings');
  
  SELECT COUNT(*) INTO admin_count 
  FROM user_profiles 
  WHERE role = 'Admin';
  
  RAISE NOTICE '✅ Setup Complete!';
  RAISE NOTICE '📊 Tables created: %', table_count;
  RAISE NOTICE '👑 Admin accounts: %', admin_count;
  RAISE NOTICE '🔐 Admin login: admin@glitchengine.com / GlitchAdmin2025!';
END $$;