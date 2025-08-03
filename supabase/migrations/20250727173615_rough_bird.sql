-- WORKING_FIX.sql - Copy and paste this into Supabase SQL Editor

-- 1. Drop everything that's causing problems
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "System can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;

DROP FUNCTION IF EXISTS create_user_profile();
DROP FUNCTION IF EXISTS get_admin_stats_from_profiles();
DROP FUNCTION IF EXISTS get_all_user_profiles_admin();
DROP FUNCTION IF EXISTS update_user_status_admin(uuid, text);

-- 2. Disable RLS temporarily
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 3. Clean up existing data
DELETE FROM user_profiles WHERE email = 'support@glitchengine.com';

-- 4. Create the admin user in auth.users (this is the key part)
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
  'support@glitchengine.com',
  crypt('support@glitchengine.com', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Support Admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- 5. Create admin profile
INSERT INTO user_profiles (
  user_id,
  email,
  full_name,
  role,
  hiring_status
) 
SELECT 
  id,
  'support@glitchengine.com',
  'Support Admin',
  'Admin',
  'Not Started'
FROM auth.users 
WHERE email = 'support@glitchengine.com';

-- 6. Create simple RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own profile
CREATE POLICY "own_profile_select" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update their own profile  
CREATE POLICY "own_profile_update" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow profile creation on signup
CREATE POLICY "profile_insert" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow admins to do everything
CREATE POLICY "admin_all_access" ON user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'Admin'
    )
  );

-- 7. Create simple trigger for profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, email, full_name, role, hiring_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'Client',
    'Not Started'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 8. Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;