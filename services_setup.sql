-- Create the services table with approval status
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    base_price NUMERIC NOT NULL,
    business_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name TEXT,
    image TEXT,
    gallery TEXT[],
    rating NUMERIC DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected')),
    contact JSONB,
    locations JSONB DEFAULT '[]'::jsonb,
    tags TEXT[] DEFAULT '{}',
    service_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Policies

-- Public can view ONLY active services
CREATE POLICY "Public can view active services" 
ON public.services FOR SELECT 
USING (status = 'active');

-- Providers can view their own services (even if pending)
CREATE POLICY "Providers can view own services" 
ON public.services FOR SELECT 
USING (auth.uid() = business_id);

-- Providers can create services (defaulting to pending)
CREATE POLICY "Providers can create services" 
ON public.services FOR INSERT 
WITH CHECK (auth.uid() = business_id);

-- Providers can update their own services (reverts to pending for re-approval)
CREATE POLICY "Providers can update own services" 
ON public.services FOR UPDATE 
USING (auth.uid() = business_id)
WITH CHECK (auth.uid() = business_id);

-- Admins can view/update ALL services
CREATE POLICY "Admins can manage all services" 
ON public.services FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
