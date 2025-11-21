-- Supabase Database Setup for Imensiah Authentication
-- Run this in Supabase SQL Editor

-- =============================================
-- 1. Create users table
-- =============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 2. Create RLS Policies
-- =============================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND (
      SELECT role FROM public.users WHERE id = auth.uid()
    ) = role -- Prevent role changes
  );

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update any user
CREATE POLICY "Admins can update any user"
  ON public.users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- 3. Create trigger function for new users
-- =============================================

-- Function to create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 4. Create updated_at trigger
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on user changes
DROP TRIGGER IF EXISTS on_user_updated ON public.users;
CREATE TRIGGER on_user_updated
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- 5. Create indexes for performance
-- =============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- =============================================
-- 6. Grant necessary permissions
-- =============================================

-- Allow authenticated users to read from users table
GRANT SELECT ON public.users TO authenticated;

-- Allow authenticated users to update their own profile
GRANT UPDATE ON public.users TO authenticated;

-- =============================================
-- 7. Create test admin user (OPTIONAL - for development)
-- =============================================

-- First, create the user in Supabase Auth UI or via signup
-- Then run this to make them an admin:
-- UPDATE public.users
-- SET role = 'admin'
-- WHERE email = 'your-admin@email.com';

-- =============================================
-- 8. Verify setup
-- =============================================

-- Check if tables exist
SELECT
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'users';

-- Check RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'users';

-- Check triggers
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users';

-- =============================================
-- NOTES:
-- =============================================
--
-- 1. Run this entire script in Supabase SQL Editor
-- 2. Make sure "Auto-confirm users" is DISABLED in Supabase Auth settings
--    (Settings > Authentication > Email Auth Settings)
-- 3. Configure email templates in Supabase dashboard
-- 4. Set up proper email provider (SMTP) for production
-- 5. For the first admin user, create via signup then manually update role
--
-- To create first admin:
-- 1. Sign up through the app
-- 2. Confirm email
-- 3. Run: UPDATE public.users SET role = 'admin' WHERE email = 'youremail@example.com';
--
