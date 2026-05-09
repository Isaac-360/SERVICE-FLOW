-- Update services table to support multi-tier packages (Silver, Gold, Platinum)
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS packages JSONB DEFAULT '[]'::jsonb;

-- Update bookings table to track which package was selected
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS package_id TEXT,
ADD COLUMN IF NOT EXISTS package_details JSONB;
