-- Create notifications table for donor alerts
CREATE TABLE IF NOT EXISTS public.donor_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID NOT NULL REFERENCES public.donors(id) ON DELETE CASCADE,
  blood_request_id UUID NOT NULL REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.donor_notifications ENABLE ROW LEVEL SECURITY;

-- Donors can view their own notifications
CREATE POLICY "Donors can view their own notifications"
ON public.donor_notifications
FOR SELECT
USING (donor_id IN (
  SELECT id FROM public.donors WHERE user_id = auth.uid()
));

-- Donors can update their own notifications (mark as read)
CREATE POLICY "Donors can update their own notifications"
ON public.donor_notifications
FOR UPDATE
USING (donor_id IN (
  SELECT id FROM public.donors WHERE user_id = auth.uid()
));

-- System can insert notifications (via service role)
CREATE POLICY "System can insert notifications"
ON public.donor_notifications
FOR INSERT
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_donor_notifications_updated_at
BEFORE UPDATE ON public.donor_notifications
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime for instant notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.donor_notifications;