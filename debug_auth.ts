import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmattgptvjqdvikveqyk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYXR0Z3B0dmpxZHZpa3ZlcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMjE5NTksImV4cCI6MjA5MzY5Nzk1OX0.RfXzPnvdW5CymT7mg_fsZFaFUZUL9x4k7dS-jEDpvsU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnoseAuth() {
  console.log('🔍 AUTHENTICATION DIAGNOSTIC REPORT\n');

  try {
    // 1. Try to list all profiles (this will be RLS-limited)
    console.log('📋 Checking Profiles Table:');
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*');

    if (profileError) {
      console.log(`❌ Error reading profiles: ${profileError.message}`);
      console.log(`   (This is likely RLS blocking - only admins can see all profiles)\n`);
    } else {
      console.log(`✅ Found ${profiles?.length || 0} accessible profiles:`);
      profiles?.forEach((p: any) => {
        console.log(`   - ${p.email} (ID: ${p.id.substring(0, 8)}..., Role: ${p.role})`);
      });
      console.log();
    }

    // 2. Check current session
    console.log('🔐 Checking Current Session:');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (session) {
      console.log(`✅ Active Session Found:`);
      console.log(`   Email: ${session.user.email}`);
      console.log(`   User ID: ${session.user.id}`);
      console.log(`   Role (metadata): ${session.user.user_metadata?.role || 'not set'}\n`);
    } else {
      console.log(`⚠️  No active session\n`);
    }

    // 3. Test login attempt
    console.log('🧪 Testing Login (credentials from your project):');
    const testEmail = 'akuinaisaac710@gmail.com';
    const testPassword = 'TestPassword123!'; // Change this to your actual test password

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (authError) {
      console.log(`❌ Login Failed: ${authError.message}`);
      console.log(`   Try creating a new test user via the Supabase Dashboard.\n`);
    } else {
      console.log(`✅ Login Successful!`);
      console.log(`   User ID: ${authData.user?.id}`);
      console.log(`   Email: ${authData.user?.email}`);
      console.log(`   Session Token: ${authData.session?.access_token?.substring(0, 20)}...\n`);

      // Check if profile exists
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user!.id)
        .single();

      if (pError) {
        console.log(`⚠️  Profile Not Found: ${pError.message}`);
        console.log(`   Creating profile now...\n`);

        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user!.id,
            email: authData.user!.email,
            full_name: 'Test Admin',
            role: 'admin',
          });

        if (upsertError) {
          console.log(`❌ Profile Creation Failed: ${upsertError.message}`);
        } else {
          console.log(`✅ Profile Created with role='admin'`);
        }
      } else {
        console.log(`✅ Profile Found:`);
        console.log(`   Name: ${profile.full_name}`);
        console.log(`   Role: ${profile.role}`);
        console.log(`   Created: ${profile.created_at}\n`);
      }
    }

  } catch (error: any) {
    console.error('💥 Fatal Error:', error.message);
  }
}

diagnoseAuth().then(() => console.log('✅ Diagnostic Complete')).catch(console.error);
