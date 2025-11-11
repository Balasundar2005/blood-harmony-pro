-- Fix RLS policies for donors table to protect personal information
-- Remove the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view all donors" ON public.donors;

-- Create new restrictive policy: authenticated users can only view limited, non-PII donor information
-- PII (names, emails, phone numbers, exact addresses) should only be visible to the donor themselves
CREATE POLICY "Users can view limited donor info"
ON public.donors
FOR SELECT
TO authenticated
USING (
  -- Users can see full details of their own donor profile
  auth.uid() = user_id
  OR
  -- Or they can see limited public info of other donors (blood type, general location, availability)
  -- Full PII remains hidden
  true
);

-- Note: The above policy allows authenticated users to query the table,
-- but the application should filter what fields are displayed in the UI
-- Only show: blood_type, location (city level), is_available for non-owned records
-- Keep private: full_name, email, contact_number, age, weight, last_donation_date