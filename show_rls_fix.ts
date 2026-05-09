import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmattgptvjqdvikveqyk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYXR0Z3B0dmpxZHZpa3ZlcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMjE5NTksImV4cCI6MjA5MzY5Nzk1OX0.RfXzPnvdW5CymT7mg_fsZFaFUZUL9x4k7dS-jEDpvsU';

// Use service role key for admin operations (you'll need to add this to .env)
// For now, we'll work with what we have
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixAuthenticationIssues() {
  console.log('🔧 FIXING AUTHENTICATION ISSUES\n');

  try {
    // Step 1: Check if we need to disable RLS temporarily to create a user
    console.log('Step 1️⃣  : Attempting to create a test admin user...\n');
    
    // Try to sign up a test admin
    const testAdminEmail = 'admin@serviceflow.io';
    const testAdminPassword = 'AdminTestPass123!';
    
    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email: testAdminEmail,
      password: testAdminPassword,
      options: {
        data: {
          full_name: 'Admin User',
          role: 'admin'
        }
      }
    });

    if (signupError) {
      console.log(`⚠️  Signup Error: ${signupError.message}`);
      console.log(`   This is expected - we'll fix RLS first.\n`);
    } else {
      console.log(`✅ Test user created: ${authData.user?.id}\n`);
    }

    console.log('Step 2️⃣  : RLS POLICIES HAVE INFINITE RECURSION!\n');
    console.log('🚨 THE ISSUE:');
    console.log('   The admin RLS policy queries the profiles table to check if a user is admin.');
    console.log('   This creates infinite recursion and blocks ALL queries.\n');

    console.log('📋 SOLUTION - Run this SQL in Supabase Dashboard:\n');
    
    const fixSQL = `
-- 1. Drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- 2. Create a helper function with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin' 
    FROM public.profiles 
    WHERE id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-add admin policies using the helper
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (is_admin());

CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
USING (is_admin());

-- 4. Grant execute permission
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated, anon;
    `.trim();

    console.log(fixSQL);
    
    console.log('\n\n📍 HOW TO APPLY THIS FIX:\n');
    console.log('1. Go to: https://supabase.com/dashboard/project/qmattgptvjqdvikveqyk/sql/new');
    console.log('2. Copy & paste the SQL above');
    console.log('3. Click "Run"');
    console.log('4. Once done, test login again\n');

    console.log('⚡ QUICK WORKAROUND (if you need it now):');
    console.log('   Temporarily disable RLS to test:');
    console.log('   ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;\n');

    console.log('✅ TEST CREDENTIALS once fixed:');
    console.log(`   Email: ${testAdminEmail}`);
    console.log(`   Password: ${testAdminPassword}\n`);

  } catch (error: any) {
    console.error('💥 Error:', error.message);
  }
}

fixAuthenticationIssues();
