-- FINAL WORKING FIX - Copy and paste this into Supabase SQL Editor

-- 1. Drop everything with CASCADE to remove dependencies
DROP TRIGGER IF EXISTS trigger_create_user_profile ON auth.users CASCADE;
DROP FUNCTION IF EXISTS create_user_profile() CASCADE;
DROP FUNCTION IF EXISTS get_admin_stats_from_profiles() CASCADE;
DROP FUNCTION IF EXISTS get_all_user_profiles_admin() CASCADE;
DROP FUNCTION IF EXISTS update_user_status_admin(uuid, text) CASCADE;

-- 2. Drop and recreate user_profiles table
DROP TABLE IF EXISTS user_profiles CASCADE;

CREATE TABLE user_profiles (
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

-- 3. Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Simple RLS policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert profiles" ON user_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'Admin'
    )
  );

CREATE POLICY "Admins can update all profiles" ON user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'Admin'
    )
  );

-- 5. Create simple trigger function
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'Client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create trigger
CREATE TRIGGER trigger_create_user_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- 7. Create admin user
DO $$
BEGIN
  -- Insert admin into auth.users if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'support@glitchengine.com') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      role,
      aud
    ) VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'support@glitchengine.com',
      crypt('support@glitchengine.com', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"full_name": "Admin User", "role": "Admin"}'::jsonb,
      'authenticated',
      'authenticated'
    );
  END IF;
END $$;

-- 8. Ensure admin profile exists
INSERT INTO user_profiles (user_id, email, full_name, role)
SELECT 
  id,
  'support@glitchengine.com',
  'Admin User',
  'Admin'
FROM auth.users 
WHERE email = 'support@glitchengine.com'
ON CONFLICT (user_id) DO UPDATE SET
  role = 'Admin',
  full_name = 'Admin User';

-- Done!
SELECT 'Database setup complete! Admin: support@glitchengine.com / support@glitchengine.com' as status;