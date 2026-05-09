-- Update services table to support custom briefing questions
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS briefing_questions JSONB DEFAULT '[]'::jsonb;

-- Update bookings table to store client responses
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS briefing_answers JSONB DEFAULT '{}'::jsonb;
