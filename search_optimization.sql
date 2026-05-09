-- Enable pg_trgm extension for fuzzy searching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1. Create a GIN index on title and description for fuzzy search performance
-- This allows ILIKE '%query%' to be significantly faster
CREATE INDEX IF NOT EXISTS idx_services_title_trgm ON public.services USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_services_description_trgm ON public.services USING gin (description gin_trgm_ops);

-- 2. Performance index for status filtering
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services (status);
CREATE INDEX IF NOT EXISTS idx_services_business_id ON public.services (business_id);

-- 3. Performance index for booking lookups
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON public.bookings (client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON public.bookings (service_id);
