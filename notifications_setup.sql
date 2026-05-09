-- 1. Create a notifications table to queue external messages
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('sms', 'email', 'push')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Only users can see their own notifications
CREATE POLICY "Users can view own notifications" 
ON public.notifications FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Function to trigger notification on booking status change
CREATE OR REPLACE FUNCTION notify_booking_status_change()
RETURNS TRIGGER AS $$
DECLARE
    client_name TEXT;
    service_title TEXT;
BEGIN
    -- Get some info for the message
    SELECT full_name INTO client_name FROM public.profiles WHERE id = NEW.client_id;
    SELECT title INTO service_title FROM public.services WHERE id = NEW.service_id;

    -- If status advanced in the roadmap
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.notifications (user_id, title, message, type, metadata)
        VALUES (
            NEW.client_id,
            'Deployment Update',
            'Mission #' || substr(NEW.id::text, 1, 8) || ' for ' || service_title || ' has moved to phase: ' || NEW.status,
            'sms',
            jsonb_build_object('booking_id', NEW.id, 'status', NEW.status)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. The Trigger
DROP TRIGGER IF EXISTS tr_notify_booking_status ON public.bookings;
CREATE TRIGGER tr_notify_booking_status
AFTER UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION notify_booking_status_change();

-- 4. Notification for Service Approval (Admin action)
CREATE OR REPLACE FUNCTION notify_service_approval()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status = 'pending' AND NEW.status = 'active' THEN
        INSERT INTO public.notifications (user_id, title, message, type)
        VALUES (
            NEW.business_id,
            'Unit Authorized',
            'Your service "' || NEW.title || '" has been authorized and is now LIVE in the marketplace.',
            'sms'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_notify_service_approval ON public.services;
CREATE TRIGGER tr_notify_service_approval
AFTER UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION notify_service_approval();
