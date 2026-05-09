-- FIX: Drop recursive RLS policies and replace with non-recursive versions

-- Drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Create a non-recursive admin check using a helper function
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

-- Re-add admin policies using the helper function
-- Note: SECURITY DEFINER allows this to bypass RLS for the subquery
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (is_admin());

CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
USING (is_admin());

-- Alternative: If the above still has issues, use this simpler approach
-- Allow public read for now (you can restrict later once admin is working)
-- CREATE POLICY "Anyone can view profiles" 
-- ON public.profiles FOR SELECT 
-- USING (true);

-- Grant execute permission on the helper function
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated, anon;
