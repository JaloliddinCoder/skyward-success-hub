
-- Add user_id column to leads table
ALTER TABLE public.leads ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop the old permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;

-- Create proper INSERT policy - users can only insert their own leads
CREATE POLICY "Users can insert own leads"
ON public.leads FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Drop old UPDATE policy
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;

-- Admins can update any lead
CREATE POLICY "Admins can update leads"
ON public.leads FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can update only their own leads
CREATE POLICY "Users can update own leads"
ON public.leads FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Drop old SELECT policy
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;

-- Admins can view all leads
CREATE POLICY "Admins can view all leads"
ON public.leads FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view own leads
CREATE POLICY "Users can view own leads"
ON public.leads FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
