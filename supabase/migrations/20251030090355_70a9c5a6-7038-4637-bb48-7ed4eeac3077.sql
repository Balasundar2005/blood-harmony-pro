-- Create notification preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for notification preferences
CREATE POLICY "Users can view their own notification preferences"
ON public.notification_preferences
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences"
ON public.notification_preferences
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences"
ON public.notification_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create donation records table for tracking donor history
CREATE TABLE IF NOT EXISTS public.donation_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES public.donors(id) ON DELETE CASCADE,
  donation_date DATE NOT NULL,
  blood_type blood_type NOT NULL,
  units_donated INTEGER NOT NULL DEFAULT 1,
  location TEXT NOT NULL,
  blood_bank_id UUID REFERENCES public.blood_banks(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.donation_records ENABLE ROW LEVEL SECURITY;

-- Create policies for donation records
CREATE POLICY "Donors can view their own donation records"
ON public.donation_records
FOR SELECT
USING (
  donor_id IN (
    SELECT id FROM public.donors WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Donors can insert their own donation records"
ON public.donation_records
FOR INSERT
WITH CHECK (
  donor_id IN (
    SELECT id FROM public.donors WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Blood banks can view donation records"
ON public.donation_records
FOR SELECT
USING (
  blood_bank_id IN (
    SELECT id FROM public.blood_banks WHERE user_id = auth.uid()
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_notification_preferences_updated_at
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_donation_records_updated_at
BEFORE UPDATE ON public.donation_records
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime for blood_requests and blood_inventory
ALTER PUBLICATION supabase_realtime ADD TABLE public.blood_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blood_inventory;