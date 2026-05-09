import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmattgptvjqdvikveqyk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYXR0Z3B0dmpxZHZpa3ZlcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMjE5NTksImV4cCI6MjA5MzY5Nzk1OX0.RfXzPnvdW5CymT7mg_fsZFaFUZUL9x4k7dS-jEDpvsU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function provideFixedRLSFix() {
  console.log('═'.repeat(90));
  console.log('🔐 CORRECTED RLS FIX - BOOKINGS TABLE ERROR FIXED');
  console.log('═'.repeat(90));
  console.log();

  try {
    console.log('📋 This fix corrects the column names:\n');
    console.log('  ❌ WRONG: service_provider_id');
    console.log('  ✅ RIGHT: Uses services table via service_id → business_id\n');

    console.log('═'.repeat(90));
    console.log('📄 CORRECTED SQL TO RUN:');
    console.log('═'.repeat(90));
    console.log();

    const correctFix = `
-- ============================================================================
-- CORRECTED RLS FIX: USING ACTUAL COLUMN NAMES
-- ============================================================================

-- ============================================================================
-- 1. FIX PROFILES TABLE
-- ============================================================================

DROP POLICY IF EXISTS "User view own profile" ON public.profiles;
DROP POLICY IF EXISTS "User update own profile" ON public.profiles;
DROP POLICY IF EXISTS "User insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "User view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "User update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "User insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admin view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin update all profiles" ON public.profiles FOR UPDATE USING (public.is_admin());

-- ============================================================================
-- 2. FIX SERVICES TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Public view active services" ON public.services;
DROP POLICY IF EXISTS "Authenticated insert services" ON public.services;
DROP POLICY IF EXISTS "User update own service" ON public.services;
DROP POLICY IF EXISTS "User delete own service" ON public.services;
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can insert services" ON public.services;
DROP POLICY IF EXISTS "Users can update own services" ON public.services;
DROP POLICY IF EXISTS "Users can delete own services" ON public.services;
DROP POLICY IF EXISTS "Admins can update any service" ON public.services;
DROP POLICY IF EXISTS "Admins can delete any service" ON public.services;

ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view active services" ON public.services FOR SELECT USING (is_active = true OR auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated insert services" ON public.services FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "User update own service" ON public.services FOR UPDATE USING (business_id = auth.uid() OR public.is_admin());
CREATE POLICY "User delete own service" ON public.services FOR DELETE USING (business_id = auth.uid() OR public.is_admin());

-- ============================================================================
-- 3. FIX BOOKINGS TABLE (CORRECTED COLUMN NAMES)
-- ============================================================================

DROP POLICY IF EXISTS "User view own booking" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated insert booking" ON public.bookings;
DROP POLICY IF EXISTS "User update own booking" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Clients can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Providers can view bookings for own services" ON public.bookings;
DROP POLICY IF EXISTS "Providers can update bookings for own services" ON public.bookings;

ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow clients to view their own bookings
CREATE POLICY "Client view own bookings" ON public.bookings FOR SELECT 
USING (client_id = auth.uid() OR public.is_admin());

-- Allow authenticated users to create bookings
CREATE POLICY "Authenticated create booking" ON public.bookings FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow clients and service owners to update bookings
CREATE POLICY "Booking owner update" ON public.bookings FOR UPDATE 
USING (
  client_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM public.services 
    WHERE id = service_id AND business_id = auth.uid()
  )
  OR public.is_admin()
);

-- ============================================================================
-- VERIFY THE FIX
-- ============================================================================

SELECT 'Profiles' as table_name, COUNT(*) as policy_count FROM information_schema.role_table_grants WHERE table_name = 'profiles'
UNION ALL
SELECT 'Services' as table_name, COUNT(*) as policy_count FROM information_schema.role_table_grants WHERE table_name = 'services'
UNION ALL
SELECT 'Bookings' as table_name, COUNT(*) as policy_count FROM information_schema.role_table_grants WHERE table_name = 'bookings';

-- Show admin user
SELECT email, role FROM public.profiles WHERE role = 'admin' LIMIT 1;
    `.trim();

    console.log(correctFix);
    console.log();
    console.log('═'.repeat(90));
    console.log('🔗 RUN AT: https://supabase.com/dashboard/project/qmattgptvjqdvikveqyk/sql/new');
    console.log('═'.repeat(90));
    console.log();
    console.log('✅ This fix uses the CORRECT column names:');
    console.log('   • client_id (not service_provider_id)');
    console.log('   • service_id');
    console.log('   • Looks up provider via services.business_id');
    console.log();
    console.log('═'.repeat(90));

  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

provideFixedRLSFix();
