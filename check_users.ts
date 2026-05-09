import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmattgptvjqdvikveqyk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYXR0Z3B0dmpxZHZpa3ZlcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMjE5NTksImV4cCI6MjA5MzY5Nzk1OX0.RfXzPnvdW5CymT7mg_fsZFaFUZUL9x4k7dS-jEDpvsU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnoseCurrentState() {
  console.log('🔍 CHECKING CURRENT AUTHENTICATION STATE\n');

  try {
    // 1. Check if RLS is fixed by querying profiles
    console.log('Step 1️⃣  : Checking if RLS is working (not blocked)...\n');
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*');

    if (profileError) {
      console.log(`❌ PROFILES QUERY FAILED: ${profileError.message}`);
      console.log(`   The RLS infinite recursion is still there!\n`);
      return;
    }

    console.log(`✅ RLS is FIXED! Found ${profiles?.length || 0} profiles:`);
    profiles?.forEach((p: any) => {
      console.log(`   📌 ${p.email} | Role: ${p.role} | ID: ${p.id.substring(0, 8)}...`);
    });
    console.log();

    // 2. Check for admin users
    console.log('Step 2️⃣  : Looking for admin users...\n');
    const admins = profiles?.filter((p: any) => p.role === 'admin');
    if (admins && admins.length > 0) {
      console.log(`✅ Found ${admins.length} admin(s):`);
      admins.forEach((a: any) => {
        console.log(`   🔑 ${a.email}`);
      });
      console.log();
    } else {
      console.log(`⚠️  No admin users found! You need to create one.\n`);
    }

    // 3. Check each user's status
    console.log('Step 3️⃣  : Testing user login attempts...\n');
    
    for (const profile of (profiles || [])) {
      console.log(`Testing: ${profile.email}`);
      
      // Try to sign in (we won't have the password, so this will fail)
      // But we're just checking if the user exists
      const { data: testData, error: testError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: 'test123', // dummy password
      });

      if (testError?.message?.includes('Invalid login credentials')) {
        console.log(`   ⚠️  User exists but password is unknown (expected)`);
      } else if (testError) {
        console.log(`   ❌ Error: ${testError.message}`);
      } else {
        console.log(`   ✅ Logged in successfully (unexpected!)`);
      }
    }
    console.log();

    // 4. Suggest what to do
    console.log('📋 NEXT STEPS:\n');
    if (admins && admins.length > 0) {
      console.log('✅ You have admin users! Try logging in at http://localhost:3001/admin/login with:');
      admins.forEach((a: any) => {
        console.log(`   Email: ${a.email}`);
        console.log(`   Password: (you should know this from signup)`);
      });
    } else {
      console.log('❌ You need to create an admin user. Go to Supabase Dashboard:');
      console.log('   1. Create a new user in Authentication > Users');
      console.log('   2. Then update their profile to role="admin" in the profiles table');
      console.log('   3. Or use signup at http://localhost:3001/signup with role="business"');
      console.log('   4. Then manually change their role in Supabase to "admin"');
    }
    console.log();

  } catch (error: any) {
    console.error('💥 Error:', error.message);
  }
}

diagnoseCurrentState();
