import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmattgptvjqdvikveqyk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYXR0Z3B0dmpxZHZpa3ZlcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMjE5NTksImV4cCI6MjA5MzY5Nzk1OX0.RfXzPnvdW5CymT7mg_fsZFaFUZUL9x4k7dS-jEDpvsU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getAdminSetupSQL() {
  console.log('🔑 ADMIN ACCOUNT SETUP - GETTING YOUR SQL FIX\n');
  
  const adminEmail = 'akuinaisaac710@gmail.com';
  const adminPassword = 'akuinaisaac2003';

  try {
    // Get the user ID from auth (this will work even if profile query fails)
    console.log('Step 1️⃣  : Attempting to sign in with existing account...\n');
    
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (signInError) {
      console.log(`❌ Could not verify account: ${signInError.message}\n`);
      console.log(`⚠️  The account exists but password may be wrong.\n`);
      console.log(`To set a new password, use password reset:\n`);
      console.log(`https://supabase.com/auth/signin → "Forgot password?"\n`);
      return;
    }

    const userId = authData.user!.id;
    console.log(`✅ Account verified! User ID: ${userId}\n`);

    console.log('Step 2️⃣  : RLS FIX REQUIRED\n');
    console.log('⚠️  The profiles table has infinite recursion in its RLS policies.\n');
    console.log('📋 Copy & paste this SQL into Supabase Dashboard:\n');
    console.log('https://supabase.com/dashboard/project/qmattgptvjqdvikveqyk/sql/new\n');
    console.log('='.repeat(80));

    const fixSQL = `
-- ============================================
-- COMPLETE RLS FIX + ADMIN SETUP
-- ============================================

-- 1. Drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- 2. Drop broken function if it exists
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- 3. Disable RLS temporarily to create admin
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 4. Ensure admin profile exists
INSERT INTO public.profiles (id, email, full_name, role)
VALUES ('${userId}', '${adminEmail}', 'Admin User', 'admin')
ON CONFLICT (id) DO UPDATE SET 
  role = 'admin',
  email = '${adminEmail}',
  full_name = 'Admin User';

-- 5. Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6. Create the SAFE admin check function (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Recreate admin policies using the safe function
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
USING (public.is_admin());

-- 8. Grant permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- 9. Test - verify admin was created
SELECT id, email, role FROM public.profiles WHERE role = 'admin';
    `.trim();

    console.log(fixSQL);
    console.log('='.repeat(80));

    console.log('\n✅ AFTER RUNNING THE SQL ABOVE:\n');
    console.log('You can login to the admin dashboard with:\n');
    console.log(`📧 Email:    ${adminEmail}`);
    console.log(`🔐 Password: ${adminPassword}`);
    console.log(`🌐 URL:      http://localhost:3001/admin/login\n`);

    console.log('⏱️  The SQL should take less than 1 minute to run.\n');

  } catch (error: any) {
    console.error('💥 Error:', error.message);
  }
}

getAdminSetupSQL();
