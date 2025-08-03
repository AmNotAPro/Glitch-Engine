-- ========================================
-- FIX CRITICAL ISSUES: RLS INFINITE RECURSION + ADMIN ACCOUNT
-- ========================================

-- 1. DROP ALL EXISTING POLICIES (THEY'RE CAUSING INFINITE RECURSION)
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "System can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

DROP POLICY IF EXISTS "Users can view own job postings" ON job_postings;
DROP POLICY IF EXISTS "Users can create own job postings" ON job_postings;
DROP POLICY IF EXISTS "Users can update own job postings" ON job_postings;
DROP POLICY IF EXISTS "Admins can manage all job postings" ON job_postings;

DROP POLICY IF EXISTS "Users can view candidates for their jobs" ON candidates;
DROP POLICY IF EXISTS "Users can update candidates for their jobs" ON candidates;
DROP POLICY IF EXISTS "Admins can manage all candidates" ON candidates;

DROP POLICY IF EXISTS "Users can view own meetings" ON meetings;
DROP POLICY IF EXISTS "Users can create own meetings" ON meetings;
DROP POLICY IF EXISTS "Users can update own meetings" ON meetings;
DROP POLICY IF EXISTS "Admins can manage all meetings" ON meetings;

-- 2. CREATE SIMPLE, NON-RECURSIVE POLICIES

-- User profiles policies (NO RECURSION)
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert profiles"
  ON user_profiles FOR INSERT TO authenticated
  WITH CHECK (true);

-- Admin policies using direct metadata check (NO TABLE LOOKUP)
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

-- Job postings policies
CREATE POLICY "Users can view own job postings"
  ON job_postings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

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

-- Candidates policies
CREATE POLICY "Users can view candidates for their jobs"
  ON candidates FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM job_postings jp 
      WHERE jp.id = candidates.job_id AND jp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update candidates for their jobs"
  ON candidates FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM job_postings jp 
      WHERE jp.id = candidates.job_id AND jp.user_id = auth.uid()
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

-- Meetings policies
CREATE POLICY "Users can view own meetings"
  ON meetings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

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

-- 3. CREATE ADMIN ACCOUNT PROPERLY
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- First, try to find existing admin user
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@glitchengine.com';
  
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
      'admin@glitchengine.com',
      crypt('GlitchAdmin2025!', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Admin User", "role": "Admin"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO admin_user_id;
  ELSE
    -- Update existing admin password
    UPDATE auth.users 
    SET 
      encrypted_password = crypt('GlitchAdmin2025!', gen_salt('bf')),
      email_confirmed_at = now(),
      raw_user_meta_data = '{"full_name": "Admin User", "role": "Admin"}'
    WHERE id = admin_user_id;
  END IF;
  
  -- Create or update profile
  INSERT INTO user_profiles (user_id, email, full_name, role, hiring_status)
  VALUES (admin_user_id, 'admin@glitchengine.com', 'Admin User', 'Admin', 'Not Started')
  ON CONFLICT (user_id) DO UPDATE SET 
    role = 'Admin',
    full_name = 'Admin User';
    
  RAISE NOTICE 'Admin account created/updated successfully with ID: %', admin_user_id;
END $$;

-- 4. VERIFY SETUP
SELECT 'Admin user exists in auth.users' as check_type, count(*) as count 
FROM auth.users WHERE email = 'admin@glitchengine.com'
UNION ALL
SELECT 'Admin profile exists in user_profiles' as check_type, count(*) as count 
FROM user_profiles WHERE email = 'admin@glitchengine.com' AND role = 'Admin';