-- Fix RLS policies for donors table to protect personal information
-- Remove the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view all donors" ON public.donors;

-- Create new restrictive policy: users can only see their own full donor profile
-- Others can see limited, non-PII information for blood matching purposes
CREATE POLICY "Users can view their own donor profile"
ON public.donors
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Note: For blood matching, the notify-donors edge function uses service_role_key
-- which bypasses RLS, so the internal notification system will continue to work
-- The application should implement a separate mechanism if donors need to be searchable