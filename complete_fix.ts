import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmattgptvjqdvikveqyk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYXR0Z3B0dmpxZHZpa3ZlcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMjE5NTksImV4cCI6MjA5MzY5Nzk1OX0.RfXzPnvdW5CymT7mg_fsZFaFUZUL9x4k7dS-jEDpvsU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function completeAuthFix() {
  console.log('═'.repeat(80));
  console.log('🔧 COMPLETE AUTHENTICATION FIX');
  console.log('═'.repeat(80));
  console.log();

  const adminEmail = 'akuinaisaac710@gmail.com';
  const adminPassword = 'akuinaisaac2003';

  try {
    // Step 1: Get the user ID
    console.log('📋 STEP 1: Verifying your account...\n');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (authError) {
      console.log(`❌ Authentication failed: ${authError.message}`);
      console.log('\n⚠️  Make sure your credentials are correct.');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}\n`);
      return;
    }

    const userId = authData.user!.id;
    console.log(`✅ Account verified!`);
    console.log(`   User ID: ${userId}`);
    console.log(`   Email: ${adminEmail}\n`);

    // Step 2: Show what needs to be done
    console.log('📋 STEP 2: THE PROBLEM\n');
    console.log('❌ Your Supabase RLS policies have infinite recursion.');
    console.log('   This blocks ALL database queries, preventing login.\n');

    console.log('📋 STEP 3: THE SOLUTION - Run this SQL in Supabase\n');
    console.log('Go to: https://supabase.com/dashboard/project/qmattgptvjqdvikveqyk/sql/new');
    console.log('Then copy & paste this SQL and click RUN:\n');

    console.log('═'.repeat(80));

    const fixSQL = `
-- ============================================================
-- FIX AUTHENTICATION: RLS INFINITE RECURSION + CREATE ADMIN
-- ============================================================

-- 1. Drop the broken policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- 2. Drop broken functions
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- 3. Temporarily disable RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 4. Ensure your admin profile exists
INSERT INTO public.profiles (id, email, full_name, role)
VALUES ('${userId}', '${adminEmail}', 'Admin User', 'admin')
ON CONFLICT (id) DO UPDATE SET 
  role = 'admin',
  email = '${adminEmail}',
  full_name = 'Admin User';

-- 5. Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6. Create safe admin function (SECURITY DEFINER bypasses RLS)
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

-- 7. Create safe admin policies
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
USING (public.is_admin());

-- 8. Grant permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- 9. Verify (you should see your admin account here)
SELECT email, role, created_at FROM public.profiles WHERE role = 'admin' ORDER BY created_at DESC LIMIT 5;
    `.trim();

    console.log(fixSQL);
    console.log('═'.repeat(80));

    console.log('\n📋 STEP 4: AFTER THE SQL RUNS\n');
    console.log('✅ Login to admin dashboard with:\n');
    console.log(`   🌐 URL:      http://localhost:3001/admin/login`);
    console.log(`   📧 Email:    ${adminEmail}`);
    console.log(`   🔐 Password: ${adminPassword}\n`);

    console.log('═'.repeat(80));
    console.log('⏱️  The SQL should take less than 1 minute to run.');
    console.log('═'.repeat(80));

  } catch (error: any) {
    console.error('💥 Error:', error.message);
  }
}

completeAuthFix();
