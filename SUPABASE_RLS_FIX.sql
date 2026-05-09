-- ============================================================================
-- SUPABASE RLS POLICIES FOR SERVICES TABLE
-- Run these commands in your Supabase SQL Editor
-- ============================================================================

-- 1. Enable RLS on services table (if not already enabled)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- 2. DROP existing policies if they exist (optional, helps avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated users to create services" ON services;
DROP POLICY IF EXISTS "Allow users to view all services" ON services;
DROP POLICY IF EXISTS "Allow business owners to update their services" ON services;
DROP POLICY IF EXISTS "Allow business owners to delete their services" ON services;

-- 3. POLICY: INSERT - Allow authenticated users with business/admin role to create services
CREATE POLICY "Allow authenticated users to create services"
ON services
FOR INSERT
WITH CHECK (
  -- Must be authenticated
  auth.uid() IS NOT NULL
  AND
  -- business_id must match the current user's ID
  business_id = auth.uid()
);

-- 4. POLICY: SELECT - Allow anyone to view published services
CREATE POLICY "Allow users to view all services"
ON services
FOR SELECT
USING (true);

-- 5. POLICY: UPDATE - Allow business owners to update their own services
CREATE POLICY "Allow business owners to update their services"
ON services
FOR UPDATE
USING (
  -- Must be authenticated
  auth.uid() IS NOT NULL
  AND
  -- Must be the service owner
  business_id = auth.uid()
)
WITH CHECK (
  -- Keep the same business_id (can't change ownership)
  business_id = auth.uid()
);

-- 6. POLICY: DELETE - Allow business owners to delete their own services
CREATE POLICY "Allow business owners to delete their services"
ON services
FOR DELETE
USING (
  -- Must be authenticated
  auth.uid() IS NOT NULL
  AND
  -- Must be the service owner
  business_id = auth.uid()
);

-- 7. VERIFY: Check if RLS is enabled
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'services';

-- 8. VERIFY: Check all policies on services table
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename = 'services';
