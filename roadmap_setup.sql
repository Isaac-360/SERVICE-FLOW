-- Update bookings table with advanced deployment statuses
DO $$ 
BEGIN 
    -- 1. Create a custom type for deployment stages if it doesn't exist
    -- Or just use a check constraint on a text column (easier for migrations)
    
    -- Ensure status column is text
    ALTER TABLE public.bookings ALTER COLUMN status SET DATA TYPE TEXT;

    -- Add the check constraint
    ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
    ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check 
        CHECK (status IN (
            'pending', 
            'contract_signed', 
            'in_progress', 
            'draft_delivered', 
            'final_approval', 
            'deployed', 
            'cancelled'
        ));

    -- Set default to pending
    ALTER TABLE public.bookings ALTER COLUMN status SET DEFAULT 'pending';
END $$;

-- Enable RLS for bookings if not already enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Clients can see their own bookings
CREATE POLICY "Clients can view own bookings" 
ON public.bookings FOR SELECT 
USING (auth.uid() = client_id);

-- Providers can see bookings for their services
CREATE POLICY "Providers can view bookings for own services" 
ON public.bookings FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.services 
    WHERE public.services.id = public.bookings.service_id 
    AND public.services.business_id = auth.uid()
  )
);

-- Providers can update the status of bookings for their services
CREATE POLICY "Providers can update booking status" 
ON public.bookings FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.services 
    WHERE public.services.id = public.bookings.service_id 
    AND public.services.business_id = auth.uid()
  )
);
