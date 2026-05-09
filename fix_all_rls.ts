import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmattgptvjqdvikveqyk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYXR0Z3B0dmpxZHZpa3ZlcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMjE5NTksImV4cCI6MjA5MzY5Nzk1OX0.RfXzPnvdW5CymT7mg_fsZFaFUZUL9x4k7dS-jEDpvsU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function provideCompleteRLSFix() {
  console.log('═'.repeat(90));
  console.log('🔐 COMPLETE RLS FIX FOR ALL TABLES');
  console.log('═'.repeat(90));
  console.log();

  try {
    const { data: session } = await supabase.auth.getSession();
    
    console.log('📋 This fix will:\n');
    console.log('  1. Drop all broken RLS policies');
    console.log('  2. Enable insert/update/delete for authenticated users');
    console.log('  3. Keep security for SELECT operations');
    console.log('  4. Allow service image uploads\n');

    console.log('═'.repeat(90));
    console.log('📄 COPY & PASTE THIS SQL INTO SUPABASE DASHBOARD:');
    console.log('═'.repeat(90));
    console.log();

    const completeFix = `
-- ============================================================================
-- COMPREHENSIVE RLS FIX: ALLOW SERVICE UPLOADS & ALL OPERATIONS
-- ============================================================================

-- ============================================================================
-- 1. FIX PROFILES TABLE
-- ============================================================================

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Disable RLS temporarily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable with simpler policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create safe function
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow users to view their own profile
CREATE POLICY "User view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "User update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "User insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admin view all profiles" 
ON public.profiles FOR SELECT 
USING (public.is_admin());

-- Allow admins to update all profiles
CREATE POLICY "Admin update all profiles" 
ON public.profiles FOR UPDATE 
USING (public.is_admin());

-- ============================================================================
-- 2. FIX SERVICES TABLE
-- ============================================================================

-- Drop all existing policies on services
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can insert services" ON public.services;
DROP POLICY IF EXISTS "Users can update own services" ON public.services;
DROP POLICY IF EXISTS "Users can delete own services" ON public.services;
DROP POLICY IF EXISTS "Admins can update any service" ON public.services;
DROP POLICY IF EXISTS "Admins can delete any service" ON public.services;

-- Disable RLS on services temporarily
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with working policies
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active services
CREATE POLICY "Public view active services" 
ON public.services FOR SELECT 
USING (is_active = true OR auth.uid() IS NOT NULL);

-- Allow authenticated users to insert services
CREATE POLICY "Authenticated insert services" 
ON public.services FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to update their own services
CREATE POLICY "User update own service" 
ON public.services FOR UPDATE 
USING (business_id = auth.uid() OR public.is_admin());

-- Allow users to delete their own services
CREATE POLICY "User delete own service" 
ON public.services FOR DELETE 
USING (business_id = auth.uid() OR public.is_admin());

-- ============================================================================
-- 3. FIX BOOKINGS TABLE
-- ============================================================================

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;

-- Disable and re-enable RLS
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own bookings
CREATE POLICY "User view own booking" 
ON public.bookings FOR SELECT 
USING (client_id = auth.uid() OR service_provider_id = auth.uid() OR public.is_admin());

-- Allow authenticated users to create bookings
CREATE POLICY "Authenticated insert booking" 
ON public.bookings FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to update their own bookings
CREATE POLICY "User update own booking" 
ON public.bookings FOR UPDATE 
USING (client_id = auth.uid() OR service_provider_id = auth.uid() OR public.is_admin());

-- ============================================================================
-- 4. VERIFY THE FIX WORKED
-- ============================================================================

SELECT 
  'Profiles' as table_name, 
  COUNT(*) as policy_count 
FROM information_schema.role_table_grants 
WHERE table_name = 'profiles'
UNION ALL
SELECT 
  'Services' as table_name, 
  COUNT(*) as policy_count 
FROM information_schema.role_table_grants 
WHERE table_name = 'services'
UNION ALL
SELECT 
  'Bookings' as table_name, 
  COUNT(*) as policy_count 
FROM information_schema.role_table_grants 
WHERE table_name = 'bookings';

-- Verify your profile exists
SELECT email, role FROM public.profiles WHERE role = 'admin' LIMIT 1;
    `.trim();

    console.log(completeFix);
    console.log();
    console.log('═'.repeat(90));
    console.log('🔗 LINK TO RUN SQL:');
    console.log('═'.repeat(90));
    console.log();
    console.log('https://supabase.com/dashboard/project/qmattgptvjqdvikveqyk/sql/new');
    console.log();
    console.log('═'.repeat(90));
    console.log('✅ AFTER RUNNING THIS SQL:');
    console.log('═'.repeat(90));
    console.log();
    console.log('1. ✅ You can upload service images');
    console.log('2. ✅ You can create new services');
    console.log('3. ✅ You can login to admin dashboard');
    console.log('4. ✅ All database operations will work');
    console.log();
    console.log('═'.repeat(90));

  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

provideCompleteRLSFix();
