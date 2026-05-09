import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmattgptvjqdvikveqyk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYXR0Z3B0dmpxZHZpa3ZlcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMjE5NTksImV4cCI6MjA5MzY5Nzk1OX0.RfXzPnvdW5CymT7mg_fsZFaFUZUL9x4k7dS-jEDpvsU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupAdminAccount() {
  console.log('🚀 ADMIN ACCOUNT SETUP\n');
  
  const newAdminEmail = 'akuinaisaac710@gmail.com';
  const newAdminPassword = 'akuinaisaac2003';

  try {
    console.log('Step 1️⃣  : Attempting to sign up new admin account...\n');
    
    // Try to sign up
    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email: newAdminEmail,
      password: newAdminPassword,
      options: {
        data: {
          full_name: 'Admin User',
          role: 'admin'
        }
      }
    });

    if (signupError) {
      console.log(`❌ Signup failed: ${signupError.message}`);
      console.log('\n⚠️  Trying to sign in with existing account...\n');
      
      // Try to get existing user's ID
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: newAdminEmail,
        password: newAdminPassword,
      });

      if (loginError) {
        console.log(`❌ Login also failed: ${loginError.message}`);
        console.log('\nPlease create the account first via signup at:');
        console.log('http://localhost:3001/signup\n');
        return;
      }

      const userId = loginData.user!.id;
      
      console.log('📋 MANUAL FIX REQUIRED:\n');
      console.log('You need to run this SQL in Supabase Dashboard at:');
      console.log('https://supabase.com/dashboard/project/qmattgptvjqdvikveqyk/sql/new\n');
      
      const manualSql = `
-- STEP 1: Drop the problematic policies temporarily
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- STEP 2: Drop the broken function if it exists
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- STEP 3: Disable RLS temporarily to create admin
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- STEP 4: Create the new admin profile
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  '${userId}',
  '${newAdminEmail}',
  'Admin User',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- STEP 5: Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- STEP 6: Create the proper admin check function (SECURITY DEFINER)
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

-- STEP 7: Recreate admin policies using the safe function
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
USING (public.is_admin());

-- STEP 8: Grant permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- STEP 9: Verify
SELECT email, role FROM public.profiles WHERE role = 'admin';
      `.trim();

      console.log(manualSql);
      console.log('\n\n✅ After running the SQL above, you can login with:');
      console.log(`   Email: ${newAdminEmail}`);
      console.log(`   Password: ${newAdminPassword}`);
      console.log(`   URL: http://localhost:3001/admin/login\n`);
      
      return;
    }

    console.log(`✅ Signup successful! New user ID: ${authData.user?.id}\n`);

    // Now try to update their profile to admin
    console.log('Step 2️⃣  : Setting up admin profile...\n');
    
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user!.id,
        email: newAdminEmail,
        full_name: 'Admin User',
        role: 'admin'
      });

    if (updateError) {
      console.log(`⚠️  Profile update blocked by RLS: ${updateError.message}`);
      console.log('\nThis means RLS is still broken. Running the SQL fix is required.\n');
      return;
    }

    console.log(`✅ Admin profile created successfully!\n`);

    console.log('Step 3️⃣  : Verifying admin account...\n');
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user!.id)
      .single();

    if (verifyError) {
      console.log(`⚠️  Could not verify: ${verifyError.message}`);
    } else {
      console.log(`✅ Verified! Admin account is ready:`);
      console.log(`   Email: ${verifyData.email}`);
      console.log(`   Role: ${verifyData.role}`);
      console.log(`   ID: ${verifyData.id}\n`);
    }

    console.log('🎉 SUCCESS! You can now login to the admin dashboard:\n');
    console.log(`   URL: http://localhost:3001/admin/login`);
    console.log(`   Email: ${newAdminEmail}`);
    console.log(`   Password: ${newAdminPassword}\n`);

  } catch (error: any) {
    console.error('💥 Error:', error.message);
  }
}

setupAdminAccount();
