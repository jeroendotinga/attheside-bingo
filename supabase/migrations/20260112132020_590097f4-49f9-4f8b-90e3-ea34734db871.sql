-- Add payment status column
ALTER TABLE public.registrations 
ADD COLUMN betaald BOOLEAN NOT NULL DEFAULT false;

-- Create admin_users table for proper role-based access
CREATE TABLE public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can see admin_users table
CREATE POLICY "Admins can view admin_users"
ON public.admin_users
FOR SELECT
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Drop existing policies on registrations
DROP POLICY IF EXISTS "Only authenticated users can view registrations" ON public.registrations;
DROP POLICY IF EXISTS "Authenticated users can delete registrations" ON public.registrations;

-- Create proper admin-only policies for registrations
CREATE POLICY "Only admins can view registrations"
ON public.registrations
FOR SELECT
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can delete registrations"
ON public.registrations
FOR DELETE
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can update registrations"
ON public.registrations
FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));