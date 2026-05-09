-- Update services table to support a professional media gallery
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Index for better performance if needed
CREATE INDEX IF NOT EXISTS idx_services_gallery ON public.services USING gin (gallery);
